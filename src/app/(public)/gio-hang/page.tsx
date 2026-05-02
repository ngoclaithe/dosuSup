'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const [mounted, setMounted] = useState(false)
  const items = useCartStore(s => s.items)
  const updateQty = useCartStore(s => s.updateQty)
  const removeItem = useCartStore(s => s.removeItem)
  const totalPrice = useCartStore(s => s.totalPrice)

  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return <div className="container-custom py-12"><div className="animate-pulse space-y-4">{[1,2,3].map(i=><div key={i} className="h-24 bg-gray-100 rounded-xl"/>)}</div></div>

  if (items.length === 0) {
    return (
      <div className="container-custom py-20 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-8xl mb-6">🛒</div>
          <h1 className="text-h2 text-gray-800 font-bold mb-3">Giỏ hàng trống</h1>
          <p className="text-muted mb-8">Hãy khám phá và thêm sản phẩm yêu thích vào giỏ hàng nhé!</p>
          <Link href="/san-pham" className="btn-primary inline-flex items-center gap-2">Khám phá sản phẩm →</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <div className="bg-white border-b border-gray-100">
        <div className="container-custom py-4">
          <nav className="flex items-center gap-2 text-sm text-muted">
            <Link href="/" className="hover:text-primary">Trang chủ</Link>
            <span>/</span>
            <span className="text-primary font-medium">Giỏ hàng</span>
          </nav>
        </div>
      </div>
      <div className="container-custom py-8">
        <h1 className="text-h1 text-primary font-bold mb-6">Giỏ hàng ({items.length})</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.productId} className="bg-white rounded-xl border border-gray-100 p-4 flex gap-4">
                <Link href={`/san-pham/${item.slug}`} className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/san-pham/${item.slug}`} className="text-sm font-semibold text-gray-800 hover:text-primary line-clamp-2">{item.name}</Link>
                  <div className="mt-1">
                    {item.salePrice ? <><span className="text-red-600 font-bold text-sm">{formatPrice(item.salePrice)}</span> <span className="text-muted line-through text-xs">{formatPrice(item.price)}</span></> : <span className="text-primary font-bold text-sm">{formatPrice(item.price)}</span>}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button onClick={() => updateQty(item.productId, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-sm">−</button>
                      <span className="w-10 h-8 flex items-center justify-center text-sm font-medium border-x border-gray-200">{item.quantity}</span>
                      <button onClick={() => updateQty(item.productId, Math.min(item.stock, item.quantity + 1))} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-sm">+</button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm text-primary">{formatPrice((item.salePrice || item.price) * item.quantity)}</span>
                      <button onClick={() => removeItem(item.productId)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg" aria-label="Xóa">✕</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div>
            <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-24">
              <h3 className="font-semibold text-gray-800 mb-4">Tóm tắt đơn hàng</h3>
              <div className="flex justify-between text-sm mb-2"><span className="text-muted">Tạm tính</span><span className="font-medium">{formatPrice(totalPrice())}</span></div>
              <div className="flex justify-between text-sm mb-4"><span className="text-muted">Phí vận chuyển</span><span className="text-xs text-muted">Tính ở bước tiếp theo</span></div>
              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between"><span className="font-semibold">Tổng cộng</span><span className="font-bold text-lg text-primary">{formatPrice(totalPrice())}</span></div>
              </div>
              <Link href="/dat-hang" className="btn-primary w-full text-center block">Đặt hàng →</Link>
              <Link href="/san-pham" className="btn-ghost w-full text-center block mt-2 text-sm">← Tiếp tục mua sắm</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
