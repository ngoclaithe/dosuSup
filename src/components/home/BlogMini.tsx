import Link from 'next/link'
import Image from 'next/image'

interface BlogMiniProps {
  posts: Array<{
    id: number
    title: string
    slug: string
    summary: string
    thumbnail: string
    category: string
    createdAt: Date | string
  }>
}

export default function BlogMini({ posts }: BlogMiniProps) {
  return (
    <section className="py-12 md:py-16 bg-primary-50/30">
      <div className="container-custom">
        <div className="flex items-end justify-between mb-8 md:mb-10">
          <div>
            <h2 className="text-h2 text-primary font-bold mb-2">Blog sức khỏe</h2>
            <p className="text-muted text-body">
              Chia sẻ kiến thức sức khỏe hữu ích mỗi ngày
            </p>
          </div>
          <Link
            href="/blog"
            className="hidden md:inline-flex items-center gap-1.5 text-primary font-semibold text-sm hover:text-accent transition-colors"
          >
            Xem tất cả
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group">
              <article className="card h-full flex flex-col">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={post.thumbnail || '/placeholder.jpg'}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <span className="absolute top-3 left-3 badge bg-primary/90 text-white text-[11px]">
                    {post.category}
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <time className="text-[12px] text-muted mb-2">
                    {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                  </time>
                  <h3 className="text-base font-semibold text-gray-800 group-hover:text-primary transition-colors mb-2 line-clamp-2 flex-1">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted line-clamp-2">{post.summary}</p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
