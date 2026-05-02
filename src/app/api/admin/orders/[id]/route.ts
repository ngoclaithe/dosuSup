import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { sendMail } from '@/lib/email'
import { orderPaidTemplate, orderShippingTemplate, orderDoneTemplate } from '@/lib/email-templates'

function getAdmin(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value
  if (!token) return null
  return verifyToken(token)
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!getAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const order = await prisma.order.findUnique({
    where: { id: parseInt(id) },
    include: { statusHistory: { orderBy: { createdAt: 'asc' } } },
  })
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(order)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!getAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const { status, note } = await req.json()

  const order = await prisma.order.update({
    where: { id: parseInt(id) },
    data: {
      status,
      ...(status === 'PAID' ? { paidAt: new Date() } : {}),
      statusHistory: { create: { status, note: note || null } },
    },
  })

  // Send email notification
  try {
    let html = ''
    let subject = ''
    if (status === 'PAID') {
      html = orderPaidTemplate(order.orderCode, order.customerName)
      subject = `[Mã đơn: ${order.orderCode}] Thanh toán thành công`
    } else if (status === 'SHIPPING') {
      html = orderShippingTemplate(order.orderCode, order.customerName)
      subject = `[Mã đơn: ${order.orderCode}] Đơn hàng đang được giao 🚚`
    } else if (status === 'DONE') {
      html = orderDoneTemplate(order.orderCode, order.customerName)
      subject = `[Mã đơn: ${order.orderCode}] Giao hàng thành công 🎉`
    }
    if (html && subject) await sendMail(order.customerEmail, subject, html)
  } catch (e) { console.error('[Admin] Email failed:', e) }

  return NextResponse.json(order)
}
