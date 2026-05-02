import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendMail } from '@/lib/email'
import { orderPaidTemplate } from '@/lib/email-templates'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const signature = req.headers.get('x-api-key')
  if (signature !== process.env.SEPAY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { code, transferAmount, transferType } = body
  if (transferType !== 'in') return NextResponse.json({ status: 'ignored' })
  if (!code) return NextResponse.json({ status: 'no_code' })

  const order = await prisma.order.findUnique({ where: { orderCode: code } })
  if (!order) return NextResponse.json({ status: 'order_not_found' })

  if (transferAmount < order.totalAmount) {
    console.warn(`[SePay] Amount mismatch: ${transferAmount} < ${order.totalAmount}`)
    return NextResponse.json({ status: 'amount_mismatch' })
  }

  if (order.status === 'PENDING_PAYMENT') {
    await prisma.order.update({
      where: { orderCode: code },
      data: { status: 'PAID', paidAt: new Date(), sepayTransactionId: String(body.id) },
    })
    await prisma.orderHistory.create({
      data: { orderId: order.id, status: 'PAID', note: 'Thanh toán qua SePay' },
    })
    try {
      await sendMail(order.customerEmail, `[Mã đơn: ${code}] Thanh toán thành công`, orderPaidTemplate(code, order.customerName))
    } catch (e) { console.error('[SePay] Email failed:', e) }
  }

  return NextResponse.json({ status: 'ok' })
}
