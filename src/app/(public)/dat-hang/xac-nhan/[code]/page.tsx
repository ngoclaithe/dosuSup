import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatPrice, getStatusLabel } from '@/lib/utils'

interface Props {
  params: Promise<{ code: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params
  return { title: `Đơn hàng ${code}` }
}

const statusOrder = ['PENDING_PAYMENT', 'PENDING_CONFIRM', 'PAID', 'PACKING', 'SHIPPING', 'DONE']

export default async function OrderConfirmPage({ params }: Props) {
  const { code } = await params
  const order = await prisma.order.findUnique({
    where: { orderCode: code },
    include: { statusHistory: { orderBy: { createdAt: 'asc' } } },
  })
  if (!order) notFound()

  const items = order.items as Array<{ name: string; price: number; salePrice?: number; quantity: number }>
  const statusInfo = getStatusLabel(order.status)
  const currentIdx = statusOrder.indexOf(order.status)

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <div className="container-custom py-8 max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{order.status === 'CANCELLED' ? '❌' : '🎉'}</div>
            <h1 className="text-h2 font-bold text-gray-800 mb-2">
              {order.status === 'CANCELLED' ? 'Đơn hàng đã bị huỷ' : 'Cảm ơn bạn đã đặt hàng!'}
            </h1>
            <p className="text-muted">Mã đơn hàng: <strong className="text-primary">{order.orderCode}</strong></p>
          </div>

          {/* Status Timeline */}
          {order.status !== 'CANCELLED' && (
            <div className="mb-8">
              <div className="flex items-center justify-between relative">
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200" />
                <div className="absolute top-5 left-0 h-0.5 bg-primary transition-all" style={{ width: `${Math.max(0, (currentIdx / (statusOrder.length - 1)) * 100)}%` }} />
                {statusOrder.filter(s => s !== 'PENDING_PAYMENT' || order.paymentMethod === 'BANK_TRANSFER').filter(s => s !== 'PENDING_CONFIRM' || order.paymentMethod === 'COD').map((s, i) => {
                  const info = getStatusLabel(s)
                  const isActive = statusOrder.indexOf(s) <= currentIdx
                  return (
                    <div key={s} className="relative flex flex-col items-center z-10">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${isActive ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'}`}>
                        {info.icon}
                      </div>
                      <span className={`text-[10px] mt-2 text-center max-w-[60px] ${isActive ? 'text-primary font-medium' : 'text-muted'}`}>{info.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Current Status */}
          <div className="text-center mb-8">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${statusInfo.color}`}>
              {statusInfo.icon} {statusInfo.label}
            </span>
          </div>

          {/* Order Items */}
          <div className="border border-gray-100 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Chi tiết đơn hàng</h3>
            {items.map((item, i) => (
              <div key={i} className="flex justify-between py-2 border-b border-gray-50 last:border-0 text-sm">
                <span className="text-gray-700">{item.name} × {item.quantity}</span>
                <span className="font-medium">{formatPrice((item.salePrice || item.price) * item.quantity)}</span>
              </div>
            ))}
            <div className="flex justify-between pt-3 mt-2 border-t border-gray-100 font-bold">
              <span>Tổng cộng</span>
              <span className="text-primary">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-sm space-y-1">
            <p><strong>Người nhận:</strong> {order.customerName}</p>
            <p><strong>SĐT:</strong> {order.customerPhone}</p>
            <p><strong>Email:</strong> {order.customerEmail}</p>
            <p><strong>Địa chỉ:</strong> {order.address}, {order.ward}, {order.district}, {order.province}</p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/san-pham" className="btn-primary">Tiếp tục mua sắm</Link>
            <a href="https://zalo.me/0346437915" target="_blank" className="btn-secondary">Liên hệ hỗ trợ</a>
          </div>
        </div>
      </div>
    </div>
  )
}
