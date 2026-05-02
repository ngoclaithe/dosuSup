import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Blog sức khỏe',
  description: 'Chia sẻ kiến thức sức khỏe, dinh dưỡng và tips chăm sóc sức khỏe mỗi ngày từ DosuSupplements.',
}

export const revalidate = 300

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <div className="bg-white border-b border-gray-100">
        <div className="container-custom py-4">
          <nav className="flex items-center gap-2 text-sm text-muted">
            <Link href="/" className="hover:text-primary">Trang chủ</Link><span>/</span>
            <span className="text-primary font-medium">Blog</span>
          </nav>
        </div>
      </div>
      <div className="container-custom py-8">
        <h1 className="text-h1 text-primary font-bold mb-2">Blog sức khỏe</h1>
        <p className="text-muted mb-8">Chia sẻ kiến thức sức khỏe hữu ích mỗi ngày</p>
        {posts.length === 0 ? (
          <div className="text-center py-20"><div className="text-6xl mb-4">📝</div><p className="text-muted">Chưa có bài viết nào.</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                <article className="card h-full flex flex-col">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image src={post.thumbnail || '/placeholder.jpg'} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
                    <span className="absolute top-3 left-3 badge bg-primary/90 text-white text-[11px]">{post.category}</span>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <time className="text-[12px] text-muted mb-2">{new Date(post.createdAt).toLocaleDateString('vi-VN')}</time>
                    <h2 className="text-base font-semibold text-gray-800 group-hover:text-primary transition-colors mb-2 line-clamp-2 flex-1">{post.title}</h2>
                    <p className="text-sm text-muted line-clamp-2">{post.summary}</p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
