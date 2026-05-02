'use client'
import Image from 'next/image'
import Link from 'next/link'
import { ProductType } from '@/types'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cart'
import { useToast } from '@/components/ui/Toast'

interface ProductCardProps {
  product: ProductType
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore(s => s.addItem)
  const { addToast } = useToast()

  const discount = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0

  const isOutOfStock = product.stock <= 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
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
    })
    addToast('success', `Đã thêm "${product.name}" vào giỏ hàng ✓`)
  }

  return (
    <Link href={`/san-pham/${product.slug}`} className="group">
      <div className="card h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-square product-image-zoom bg-gray-50">
          <Image
            src={product.images[0] || '/placeholder.jpg'}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discount > 0 && (
              <span className="badge-sale text-[11px]">-{discount}%</span>
            )}
            {product.isNew && (
              <span className="badge-new text-[11px]">Mới</span>
            )}
            {product.isBestSeller && (
              <span className="badge-hot text-[11px]">🔥 Bán chạy</span>
            )}
          </div>
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white text-gray-700 px-4 py-2 rounded-lg font-semibold text-sm">
                Hết hàng
              </span>
            </div>
          )}
          {/* Quick add button */}
          {!isOutOfStock && (
            <button
              onClick={handleAddToCart}
              className="absolute bottom-3 right-3 w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-white transform translate-y-2 group-hover:translate-y-0"
              aria-label="Thêm vào giỏ hàng"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          )}
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col flex-1">
          {product.brand && (
            <span className="text-[11px] font-medium text-muted uppercase tracking-wider mb-1">
              {product.brand}
            </span>
          )}
          <h3 className="text-sm font-semibold text-gray-800 group-hover:text-primary transition-colors duration-200 line-clamp-2 mb-2 flex-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mt-auto">
            {product.salePrice ? (
              <>
                <span className="price-sale text-base">{formatPrice(product.salePrice)}</span>
                <span className="price-original">{formatPrice(product.price)}</span>
              </>
            ) : (
              <span className="price-normal text-base">{formatPrice(product.price)}</span>
            )}
          </div>
          {product.stock > 0 && product.stock <= 5 && (
            <p className="text-[11px] text-warning font-medium mt-1.5">
              Chỉ còn {product.stock} {product.unit}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
