import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ProductDetailClient from '@/components/product/ProductDetailClient'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await prisma.product.findUnique({
    where: { slug, isDeleted: false },
  })
  if (!product) return { title: 'Sản phẩm không tồn tại' }

  return {
    title: product.name,
    description: product.description?.slice(0, 155) || `Mua ${product.name} chính hãng tại DosuSupplements`,
    openGraph: {
      title: `${product.name} | DosuSupplements`,
      description: product.description?.slice(0, 155) || '',
      images: product.images[0] ? [product.images[0]] : [],
    },
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  const product = await prisma.product.findUnique({
    where: { slug, isDeleted: false },
    include: { category: true },
  })

  if (!product) notFound()

  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isDeleted: false,
    },
    include: { category: true },
    take: 4,
  })

  return (
    <ProductDetailClient
      product={JSON.parse(JSON.stringify(product))}
      relatedProducts={JSON.parse(JSON.stringify(relatedProducts))}
    />
  )
}
