'use client'
import { useState, useEffect } from 'react'
import { formatPrice, getStatusLabel } from '@/lib/utils'

const statuses = ['', 'PENDING_PAYMENT', 'PENDING_CONFIRM', 'PAID', 'PACKING', 'SHIPPING', 'DONE', 'CANCELLED']
const statusFlow = ['PENDING_CONFIRM', 'PAID', 'PACKING', 'SHIPPING', 'DONE', 'CANCELLED']

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (statusFilter) params.set('status', statusFilter)
    if (search) params.set('search', search)
    const res = await fetch(`/api/admin/orders?${params}`)
    const data = await res.json()
    setOrders(data.orders || [])
    setLoading(false)
  }

  useEffect(() => { fetchOrders() }, [statusFilter])

  const updateStatus = async (id: number, status: string) => {
    await fetch(`/api/admin/orders/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    fetchOrders()
    if (selectedOrder?.id === id) {
      const res = await fetch(`/api/admin/orders/${id}`)
      setSelectedOrder(await res.json())
    }
  }

  return (
    <div>
      <h1 className="text-h2 font-bold text-gray-800 mb-6">Quản lý đơn hàng</h1>
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex-1 min-w-[200px]">
          <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && fetchOrders()} placeholder="Tìm mã đơn, SĐT, email..." className="input-field" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-field !w-auto">
          <option value="">Tất cả trạng thái</option>
          {statuses.filter(Boolean).map(s => <option key={s} value={s}>{getStatusLabel(s).label}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left py-3 px-4 font-medium text-muted">Mã đơn</th>
              <th className="text-left py-3 px-4 font-medium text-muted">Khách hàng</th>
              <th className="text-left py-3 px-4 font-medium text-muted">SĐT</th>
              <th className="text-left py-3 px-4 font-medium text-muted">Tổng tiền</th>
              <th className="text-left py-3 px-4 font-medium text-muted">TT</th>
              <th className="text-left py-3 px-4 font-medium text-muted">Trạng thái</th>
              <th className="text-left py-3 px-4 font-medium text-muted">Ngày</th>
              <th className="text-left py-3 px-4 font-medium text-muted">Hành động</th>
            </tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={8} className="py-8 text-center text-muted">Đang tải...</td></tr> :
              orders.length === 0 ? <tr><td colSpan={8} className="py-8 text-center text-muted">Không có đơn hàng</td></tr> :
              orders.map(o => {
                const si = getStatusLabel(o.status)
                return (
                  <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-primary">{o.orderCode}</td>
                    <td className="py-3 px-4"><div>{o.customerName}</div><div className="text-[11px] text-muted">{o.customerEmail}</div></td>
                    <td className="py-3 px-4">{o.customerPhone}</td>
                    <td className="py-3 px-4 font-medium">{formatPrice(o.totalAmount)}</td>
                    <td className="py-3 px-4"><span className="badge bg-gray-100 text-gray-700 text-[10px]">{o.paymentMethod}</span></td>
                    <td className="py-3 px-4"><span className={`badge ${si.color} text-[11px]`}>{si.icon} {si.label}</span></td>
                    <td className="py-3 px-4 text-muted text-xs">{new Date(o.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        <button onClick={async () => { const r = await fetch(`/api/admin/orders/${o.id}`); setSelectedOrder(await r.json()) }} className="text-xs text-primary hover:text-accent font-medium">Xem</button>
                        <select onChange={e => { if (e.target.value) updateStatus(o.id, e.target.value); e.target.value = '' }} className="text-xs border rounded px-1 py-0.5" defaultValue="">
                          <option value="">Cập nhật</option>
                          {statusFlow.filter(s => s !== o.status).map(s => <option key={s} value={s}>{getStatusLabel(s).label}</option>)}
                        </select>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Đơn hàng #{selectedOrder.orderCode}</h3>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-lg">✕</button>
            </div>
            <div className="space-y-4 text-sm">
              <div className="bg-gray-50 rounded-xl p-4 space-y-1">
                <p><strong>Khách hàng:</strong> {selectedOrder.customerName}</p>
                <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                <p><strong>SĐT:</strong> {selectedOrder.customerPhone}</p>
                <p><strong>Địa chỉ:</strong> {selectedOrder.address}, {selectedOrder.ward}, {selectedOrder.district}, {selectedOrder.province}</p>
                {selectedOrder.note && <p><strong>Ghi chú:</strong> {selectedOrder.note}</p>}
              </div>
              <div>
                <h4 className="font-semibold mb-2">Sản phẩm</h4>
                {(selectedOrder.items as any[]).map((item: any, i: number) => (
                  <div key={i} className="flex justify-between py-2 border-b border-gray-50">
                    <span>{item.name} × {item.quantity}</span>
                    <span className="font-medium">{formatPrice((item.salePrice || item.price) * item.quantity)}</span>
                  </div>
                ))}
                <div className="flex justify-between py-2 font-bold"><span>Tổng</span><span className="text-primary">{formatPrice(selectedOrder.totalAmount)}</span></div>
              </div>
              {selectedOrder.statusHistory?.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Lịch sử trạng thái</h4>
                  {selectedOrder.statusHistory.map((h: any) => (
                    <div key={h.id} className="flex items-center gap-3 py-1.5">
                      <span className={`badge ${getStatusLabel(h.status).color} text-[10px]`}>{getStatusLabel(h.status).label}</span>
                      <span className="text-xs text-muted">{new Date(h.createdAt).toLocaleString('vi-VN')}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
