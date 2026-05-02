import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'

export default async function AdminDashboard() {
  const [ordersCount, productsCount, blogCount, recentOrders, revenue] = await Promise.all([
    prisma.order.count(),
    prisma.product.count({ where: { isDeleted: false } }),
    prisma.blogPost.count(),
    prisma.order.findMany({ take: 5, orderBy: { createdAt: 'desc' } }),
    prisma.order.aggregate({ where: { status: { in: ['PAID', 'PACKING', 'SHIPPING', 'DONE'] } }, _sum: { totalAmount: true } }),
  ])

  const stats = [
    { label: 'Đơn hàng', value: ordersCount, icon: '📦', color: 'bg-blue-50 text-blue-600', href: '/admin/don-hang' },
    { label: 'Doanh thu', value: formatPrice(revenue._sum.totalAmount || 0), icon: '💰', color: 'bg-green-50 text-green-600', href: '/admin/don-hang' },
    { label: 'Sản phẩm', value: productsCount, icon: '🏷️', color: 'bg-purple-50 text-purple-600', href: '/admin/san-pham' },
    { label: 'Bài viết', value: blogCount, icon: '📝', color: 'bg-orange-50 text-orange-600', href: '/admin/blog' },
  ]

  return (
    <div>
      <h1 className="text-h2 font-bold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <Link key={i} href={s.href} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-lg transition-all">
            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center text-lg mb-3`}>{s.icon}</div>
            <p className="text-2xl font-bold text-gray-800">{s.value}</p>
            <p className="text-sm text-muted">{s.label}</p>
          </Link>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Đơn hàng gần đây</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100">
              <th className="text-left py-3 px-2 font-medium text-muted">Mã đơn</th>
              <th className="text-left py-3 px-2 font-medium text-muted">Khách hàng</th>
              <th className="text-left py-3 px-2 font-medium text-muted">Tổng tiền</th>
              <th className="text-left py-3 px-2 font-medium text-muted">Trạng thái</th>
              <th className="text-left py-3 px-2 font-medium text-muted">Ngày</th>
            </tr></thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-2 font-medium text-primary">{order.orderCode}</td>
                  <td className="py-3 px-2">{order.customerName}</td>
                  <td className="py-3 px-2 font-medium">{formatPrice(order.totalAmount)}</td>
                  <td className="py-3 px-2"><span className="badge bg-primary-50 text-primary text-[11px]">{order.status}</span></td>
                  <td className="py-3 px-2 text-muted">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                </tr>
              ))}
              {recentOrders.length === 0 && <tr><td colSpan={5} className="py-8 text-center text-muted">Chưa có đơn hàng nào</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
