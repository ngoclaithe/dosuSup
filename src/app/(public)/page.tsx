import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import HeroSection from '@/components/home/HeroSection'
import CategoryGrid from '@/components/home/CategoryGrid'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import LatestProducts from '@/components/home/LatestProducts'
import BlogMini from '@/components/home/BlogMini'
import WhyChooseUs from '@/components/home/WhyChooseUs'

export const metadata: Metadata = {
  title: 'DosuSupplements — Thực phẩm chức năng chính hãng',
  description: 'Cung cấp thực phẩm chức năng chính hãng, nhập khẩu chất lượng cao. Vitamin, Collagen, hỗ trợ sức khỏe toàn diện. Giao hàng toàn quốc.',
}

export const revalidate = 3600

async function getData() {
  const [categories, featuredProducts, latestProducts, blogPosts] = await Promise.all([
    prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { id: 'asc' },
    }),
    prisma.product.findMany({
      where: { isFeatured: true, isDeleted: false },
      include: { category: true },
      take: 8,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.findMany({
      where: { isDeleted: false },
      include: { category: true },
      take: 4,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.blogPost.findMany({
      where: { published: true },
      take: 3,
      orderBy: { createdAt: 'desc' },
    }),
  ])

  return { categories, featuredProducts, latestProducts, blogPosts }
}

export default async function HomePage() {
  const { categories, featuredProducts, latestProducts, blogPosts } = await getData()

  return (
    <>
      <HeroSection />
      <CategoryGrid categories={categories} />
      <FeaturedProducts products={featuredProducts} />
      <WhyChooseUs />
      <LatestProducts products={latestProducts} />
      {blogPosts.length > 0 && <BlogMini posts={blogPosts} />}
      
      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-primary to-accent">
        <div className="container-custom text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Bắt đầu hành trình sức khỏe của bạn
          </h2>
          <p className="text-white/80 text-base md:text-lg mb-8 max-w-2xl mx-auto">
            Khám phá bộ sưu tập thực phẩm chức năng chính hãng, được tuyển chọn kỹ lưỡng cho sức khỏe của bạn.
          </p>
          <Link
            href="/san-pham"
            className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-semibold text-base hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-1 transition-all duration-300"
          >
            Khám phá ngay
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  )
}
