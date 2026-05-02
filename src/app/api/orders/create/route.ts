import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateOrderCode } from '@/lib/utils'
import { sendMail } from '@/lib/email'
import { orderConfirmTemplate } from '@/lib/email-templates'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { fullName, email, phone, address, province, district, ward, note, items, totalAmount, paymentMethod } = body

    if (!fullName || !email || !phone || !address || !province || !district || !ward || !items?.length || !totalAmount) {
      return NextResponse.json({ error: 'Thiếu thông tin bắt buộc' }, { status: 400 })
    }

    const orderCode = generateOrderCode()
    const initialStatus = paymentMethod === 'COD' ? 'PENDING_CONFIRM' : 'PENDING_PAYMENT'

    const order = await prisma.order.create({
      data: {
        orderCode,
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        address, province, district, ward,
        note: note || null,
        items,
        totalAmount,
        paymentMethod: paymentMethod || 'COD',
        status: initialStatus as any,
        statusHistory: {
          create: { status: initialStatus as any, note: 'Đơn hàng được tạo' },
        },
      },
    })

    // Send email
    try {
      const html = orderConfirmTemplate({
        orderCode, customerName: fullName, customerEmail: email,
        customerPhone: phone, address, province, district, ward,
        items, totalAmount, paymentMethod,
      })
      await sendMail(email, `[Mã đơn: ${orderCode}] Xác nhận đơn hàng của bạn`, html)
    } catch (emailErr) {
      console.error('[Order] Email failed:', emailErr)
    }

    return NextResponse.json({ orderCode, status: order.status })
  } catch (err: any) {
    console.error('[Order] Create failed:', err)
    return NextResponse.json({ error: 'Lỗi tạo đơn hàng' }, { status: 500 })
  }
}
