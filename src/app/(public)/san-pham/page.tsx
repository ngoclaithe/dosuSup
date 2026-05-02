import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import ProductListClient from '@/components/product/ProductListClient'

export const metadata: Metadata = {
  title: 'Sản phẩm',
  description: 'Khám phá đa dạng thực phẩm chức năng chính hãng tại DosuSupplements. Vitamin, Collagen, hỗ trợ giảm cân và tăng cường sức khỏe.',
}

interface Props {
  searchParams: Promise<{
    category?: string
    minPrice?: string
    maxPrice?: string
    brand?: string
    sort?: string
    page?: string
    q?: string
  }>
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const perPage = 12

  // Build where clause
  const where: Record<string, unknown> = { isDeleted: false }

  if (params.category) {
    where.category = { slug: params.category }
  }

  if (params.minPrice || params.maxPrice) {
    where.price = {}
    if (params.minPrice) (where.price as Record<string, number>).gte = parseInt(params.minPrice)
    if (params.maxPrice) (where.price as Record<string, number>).lte = parseInt(params.maxPrice)
  }

  if (params.brand) {
    where.brand = params.brand
  }

  if (params.q) {
    where.name = { contains: params.q, mode: 'insensitive' }
  }

  // Sort
  let orderBy: Record<string, string> = { createdAt: 'desc' }
  switch (params.sort) {
    case 'price-asc': orderBy = { price: 'asc' }; break
    case 'price-desc': orderBy = { price: 'desc' }; break
    case 'newest': orderBy = { createdAt: 'desc' }; break
    case 'bestseller': orderBy = { isBestSeller: 'desc' }; break
  }

  const [products, total, categories, brands] = await Promise.all([
    prisma.product.findMany({
      where: where as any,
      include: { category: true },
      orderBy: orderBy as any,
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.product.count({ where: where as any }),
    prisma.category.findMany({
      include: { _count: { select: { products: { where: { isDeleted: false } } } } },
      orderBy: { name: 'asc' },
    }),
    prisma.product.findMany({
      where: { isDeleted: false, brand: { not: null } },
      select: { brand: true },
      distinct: ['brand'],
    }),
  ])

  const totalPages = Math.ceil(total / perPage)

  return (
    <ProductListClient
      products={JSON.parse(JSON.stringify(products))}
      categories={JSON.parse(JSON.stringify(categories))}
      brands={brands.map(b => b.brand).filter(Boolean) as string[]}
      currentPage={page}
      totalPages={totalPages}
      total={total}
      searchParams={params}
    />
  )
}
