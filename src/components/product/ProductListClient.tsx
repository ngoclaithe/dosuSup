'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import ProductCard from '@/components/product/ProductCard'
import { ProductType, CategoryType } from '@/types'

interface ProductListClientProps {
  products: ProductType[]
  categories: (CategoryType & { _count: { products: number } })[]
  brands: string[]
  currentPage: number
  totalPages: number
  total: number
  searchParams: Record<string, string | undefined>
}

const sortOptions = [
  { value: '', label: 'Mặc định' },
  { value: 'price-asc', label: 'Giá tăng dần' },
  { value: 'price-desc', label: 'Giá giảm dần' },
  { value: 'newest', label: 'Mới nhất' },
  { value: 'bestseller', label: 'Bán chạy nhất' },
]

export default function ProductListClient({
  products,
  categories,
  brands,
  currentPage,
  totalPages,
  total,
  searchParams: initialParams,
}: ProductListClientProps) {
  const router = useRouter()
  const [showMobileFilter, setShowMobileFilter] = useState(false)

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams()
    Object.entries(initialParams).forEach(([k, v]) => {
      if (v && k !== 'page') params.set(k, v)
    })
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    if (key !== 'page') params.delete('page')
    router.push(`/san-pham?${params.toString()}`)
  }

  return (
    <div className="bg-gray-50/50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-custom py-4">
          <nav className="flex items-center gap-2 text-sm text-muted">
            <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" strokeWidth={1.5} /></svg>
            <span className="text-primary font-medium">Sản phẩm</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-6 md:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-h1 text-primary font-bold mb-1">Sản phẩm</h1>
            <p className="text-muted text-sm">{total} sản phẩm</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowMobileFilter(!showMobileFilter)}
              className="lg:hidden btn-secondary !px-4 !py-2.5 text-sm flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
              </svg>
              Bộ lọc
            </button>
            {/* Sort */}
            <select
              value={initialParams.sort || ''}
              onChange={(e) => updateParams('sort', e.target.value)}
              className="input-field !w-auto !py-2.5 text-sm bg-white"
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filter */}
          <aside className={`${showMobileFilter ? 'fixed inset-0 z-50 bg-white overflow-y-auto p-6 lg:static lg:p-0 lg:z-auto' : 'hidden'} lg:block lg:w-64 flex-shrink-0`}>
            {showMobileFilter && (
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <h2 className="text-lg font-bold text-primary">Bộ lọc</h2>
                <button onClick={() => setShowMobileFilter(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            <div className="space-y-6">
              {/* Category */}
              <div className="bg-white rounded-xl p-5 border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-3">Danh mục</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => updateParams('category', '')}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!initialParams.category ? 'bg-primary-50 text-primary font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    Tất cả
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => updateParams('category', cat.slug)}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${initialParams.category === cat.slug ? 'bg-primary-50 text-primary font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      {cat.name} ({cat._count.products})
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand */}
              {brands.length > 0 && (
                <div className="bg-white rounded-xl p-5 border border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-3">Thương hiệu</h3>
                  <div className="space-y-2">
                    {brands.map(brand => (
                      <button
                        key={brand}
                        onClick={() => updateParams('brand', initialParams.brand === brand ? '' : brand)}
                        className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${initialParams.brand === brand ? 'bg-primary-50 text-primary font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Range */}
              <div className="bg-white rounded-xl p-5 border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-3">Khoảng giá</h3>
                <div className="space-y-2">
                  {[
                    { label: 'Dưới 200.000đ', min: '', max: '200000' },
                    { label: '200.000đ - 500.000đ', min: '200000', max: '500000' },
                    { label: '500.000đ - 1.000.000đ', min: '500000', max: '1000000' },
                    { label: 'Trên 1.000.000đ', min: '1000000', max: '' },
                  ].map((range, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        const params = new URLSearchParams()
                        Object.entries(initialParams).forEach(([k, v]) => {
                          if (v && k !== 'page' && k !== 'minPrice' && k !== 'maxPrice') params.set(k, v)
                        })
                        if (range.min) params.set('minPrice', range.min)
                        if (range.max) params.set('maxPrice', range.max)
                        router.push(`/san-pham?${params.toString()}`)
                      }}
                      className="block w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {products.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Không tìm thấy sản phẩm</h3>
                <p className="text-muted text-sm mb-6">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                <Link href="/san-pham" className="btn-primary">Xem tất cả sản phẩm</Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    {currentPage > 1 && (
                      <button
                        onClick={() => updateParams('page', String(currentPage - 1))}
                        className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                      </button>
                    )}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        onClick={() => updateParams('page', String(p))}
                        className={`w-10 h-10 rounded-lg font-medium text-sm transition-all ${
                          p === currentPage
                            ? 'bg-primary text-white'
                            : 'border border-gray-200 hover:bg-primary hover:text-white hover:border-primary'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    {currentPage < totalPages && (
                      <button
                        onClick={() => updateParams('page', String(currentPage + 1))}
                        className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
