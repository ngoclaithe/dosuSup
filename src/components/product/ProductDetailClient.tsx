'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ProductType } from '@/types'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cart'
import { useToast } from '@/components/ui/Toast'
import ProductCard from '@/components/product/ProductCard'

interface Props {
  product: ProductType
  relatedProducts: ProductType[]
}

export default function ProductDetailClient({ product, relatedProducts }: Props) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const addItem = useCartStore(s => s.addItem)
  const { addToast } = useToast()
  const router = useRouter()

  const isOutOfStock = product.stock <= 0
  const discount = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0

  const handleAddToCart = () => {
    if (isOutOfStock) return
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images[0] || '/placeholder.jpg',
      price: product.price,
      salePrice: product.salePrice || undefined,
      stock: product.stock,
      unit: product.unit,
    }, quantity)
    addToast('success', `Đã thêm "${product.name}" vào giỏ hàng ✓`)
  }

  const handleBuyNow = () => {
    handleAddToCart()
    router.push('/dat-hang')
  }

  const tabs = [
    { id: 'description', label: 'Mô tả' },
    { id: 'ingredients', label: 'Thành phần & Công dụng' },
    { id: 'usage', label: 'Hướng dẫn sử dụng' },
    { id: 'warning', label: 'Lưu ý' },
  ]

  const tabContent: Record<string, string | null | undefined> = {
    description: product.description,
    ingredients: product.ingredients,
    usage: product.usage,
    warning: product.warning,
  }

  return (
    <div className="bg-gray-50/50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-custom py-4">
          <nav className="flex items-center gap-2 text-sm text-muted flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" strokeWidth={1.5} /></svg>
            <Link href="/san-pham" className="hover:text-primary transition-colors">Sản phẩm</Link>
            {product.category && (
              <>
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" strokeWidth={1.5} /></svg>
                <Link href={`/san-pham?category=${product.category.slug}`} className="hover:text-primary transition-colors">{product.category.name}</Link>
              </>
            )}
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" strokeWidth={1.5} /></svg>
            <span className="text-primary font-medium truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Product Main */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Images */}
            <div className="p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-gray-100">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 mb-4">
                <Image
                  src={product.images[selectedImage] || '/placeholder.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {discount > 0 && (
                  <span className="absolute top-4 left-4 badge-sale">-{discount}%</span>
                )}
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                        i === selectedImage ? 'border-primary' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-6 md:p-8 flex flex-col">
              {product.brand && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary-50 text-primary text-xs font-semibold mb-3 w-fit">
                  {product.brand}
                </span>
              )}
              <h1 className="text-h1 text-gray-900 mb-4">{product.name}</h1>

              {/* Price */}
              <div className="flex items-center gap-3 mb-4">
                {product.salePrice ? (
                  <>
                    <span className="text-2xl font-bold text-red-600">{formatPrice(product.salePrice)}</span>
                    <span className="text-lg text-muted line-through">{formatPrice(product.price)}</span>
                    <span className="badge-sale">-{discount}%</span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-primary">{formatPrice(product.price)}</span>
                )}
              </div>

              {/* Stock status */}
              <div className="flex items-center gap-2 mb-6">
                {isOutOfStock ? (
                  <span className="text-sm text-red-600 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Hết hàng
                  </span>
                ) : product.stock <= 5 ? (
                  <span className="text-sm text-warning font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-warning rounded-full"></span>
                    Còn {product.stock} {product.unit}
                  </span>
                ) : (
                  <span className="text-sm text-success font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-success rounded-full"></span>
                    Còn hàng
                  </span>
                )}
              </div>

              {/* Quantity */}
              {!isOutOfStock && (
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-sm font-medium text-gray-700">Số lượng:</span>
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" /></svg>
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1)))}
                      className="w-14 h-10 text-center border-x border-gray-200 text-sm font-medium focus:outline-none"
                      min={1}
                      max={product.stock}
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="btn-secondary flex-1 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                  Thêm vào giỏ
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="btn-primary flex-1"
                >
                  Mua ngay
                </button>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100 pt-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { icon: '🛡️', text: 'Hàng chính hãng' },
                    { icon: '🚚', text: 'Giao toàn quốc' },
                    { icon: '🔄', text: 'Đổi trả 7 ngày' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-8">
          <div className="border-b border-gray-100 flex overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-all border-b-2 ${
                  activeTab === tab.id
                    ? 'text-primary border-primary bg-primary-50/30'
                    : 'text-muted border-transparent hover:text-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="p-6 md:p-8">
            {tabContent[activeTab] ? (
              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                {tabContent[activeTab]}
              </div>
            ) : (
              <p className="text-muted text-sm">Chưa có thông tin.</p>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-h2 text-primary font-bold mb-6">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
