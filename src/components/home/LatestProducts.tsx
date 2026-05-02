'use client'
import Link from 'next/link'
import ProductCard from '@/components/product/ProductCard'
import { ProductType } from '@/types'

interface LatestProductsProps {
  products: ProductType[]
}

export default function LatestProducts({ products }: LatestProductsProps) {
  if (products.length === 0) return null

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container-custom">
        <div className="flex items-end justify-between mb-8 md:mb-10">
          <div>
            <h2 className="text-h2 text-primary font-bold mb-2">Sản phẩm mới nhất</h2>
            <p className="text-muted text-body">
              Cập nhật những sản phẩm mới về kho
            </p>
          </div>
          <Link
            href="/san-pham?sort=newest"
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
      </div>
    </section>
  )
}
