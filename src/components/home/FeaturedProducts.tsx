'use client'
import Link from 'next/link'
import ProductCard from '@/components/product/ProductCard'
import { ProductType } from '@/types'

interface FeaturedProductsProps {
  products: ProductType[]
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (products.length === 0) return null

  return (
    <section className="py-12 md:py-16 bg-primary-50/30">
      <div className="container-custom">
        <div className="flex items-end justify-between mb-8 md:mb-10">
          <div>
            <h2 className="text-h2 text-primary font-bold mb-2">Sản phẩm nổi bật</h2>
            <p className="text-muted text-body">
              Những sản phẩm được khách hàng tin dùng nhất
            </p>
          </div>
          <Link
            href="/san-pham"
            className="hidden md:inline-flex items-center gap-1.5 text-primary font-semibold text-sm hover:text-accent transition-colors"
          >
            Xem tất cả
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product as ProductType} />
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link href="/san-pham" className="btn-primary inline-flex items-center gap-2">
            Xem tất cả sản phẩm
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
