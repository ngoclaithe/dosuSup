import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.blogPost.findUnique({ where: { slug, published: true } })
  if (!post) return { title: 'Bài viết không tồn tại' }
  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.summary.slice(0, 155),
    openGraph: { title: post.metaTitle || post.title, description: post.metaDescription || post.summary, images: post.thumbnail ? [post.thumbnail] : [] },
  }
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params
  const post = await prisma.blogPost.findUnique({ where: { slug, published: true } })
  if (!post) notFound()

  const recentPosts = await prisma.blogPost.findMany({
    where: { published: true, id: { not: post.id } },
    take: 3, orderBy: { createdAt: 'desc' },
    select: { id: true, title: true, slug: true, thumbnail: true, createdAt: true },
  })

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <div className="bg-white border-b border-gray-100">
        <div className="container-custom py-4">
          <nav className="flex items-center gap-2 text-sm text-muted">
            <Link href="/" className="hover:text-primary">Trang chủ</Link><span>/</span>
            <Link href="/blog" className="hover:text-primary">Blog</Link><span>/</span>
            <span className="text-primary font-medium truncate">{post.title}</span>
          </nav>
        </div>
      </div>
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <article className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {post.thumbnail && (
              <div className="relative aspect-[2/1]">
                <Image src={post.thumbnail} alt={post.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 66vw" priority />
              </div>
            )}
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="badge bg-primary/10 text-primary text-xs">{post.category}</span>
                <time className="text-sm text-muted">{new Date(post.createdAt).toLocaleDateString('vi-VN')}</time>
              </div>
              <h1 className="text-h1 text-gray-900 mb-6">{post.title}</h1>
              <div className="prose prose-green max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
          </article>
          <aside className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-800 mb-4">Bài viết mới nhất</h3>
              <div className="space-y-4">
                {recentPosts.map(p => (
                  <Link key={p.id} href={`/blog/${p.slug}`} className="flex gap-3 group">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50">
                      <Image src={p.thumbnail || '/placeholder.jpg'} alt={p.title} fill className="object-cover" sizes="64px" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-800 group-hover:text-primary line-clamp-2">{p.title}</h4>
                      <time className="text-[11px] text-muted">{new Date(p.createdAt).toLocaleDateString('vi-VN')}</time>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
