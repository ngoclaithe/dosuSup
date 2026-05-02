import Link from 'next/link'

interface CategoryGridProps {
  categories: Array<{
    id: number
    name: string
    slug: string
    image?: string | null
    _count: { products: number }
  }>
}

const categoryIcons: Record<string, string> = {
  'vitamin': '💊',
  'collagen': '✨',
  'giam-can': '🏃',
  'tang-cuong-suc-khoe': '💪',
  'bo-nao': '🧠',
  'tieu-hoa': '🌱',
  'xuong-khop': '🦴',
  'tim-mach': '❤️',
}

const categoryColors: Record<string, string> = {
  'vitamin': 'from-emerald-400 to-green-500',
  'collagen': 'from-pink-400 to-rose-500',
  'giam-can': 'from-orange-400 to-amber-500',
  'tang-cuong-suc-khoe': 'from-blue-400 to-indigo-500',
  'bo-nao': 'from-purple-400 to-violet-500',
  'tieu-hoa': 'from-lime-400 to-green-500',
  'xuong-khop': 'from-cyan-400 to-teal-500',
  'tim-mach': 'from-red-400 to-rose-500',
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  if (categories.length === 0) return null

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h2 className="text-h2 text-primary font-bold mb-3">Danh mục sản phẩm</h2>
          <p className="text-muted text-body max-w-xl mx-auto">
            Khám phá đa dạng sản phẩm chăm sóc sức khỏe được phân loại khoa học
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((cat, index) => (
            <Link
              key={cat.id}
              href={`/san-pham?category=${cat.slug}`}
              className="group animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-center p-5 rounded-2xl bg-primary-50/50 border border-primary-100/50 hover:bg-white hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300">
                <div className={`w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${categoryColors[cat.slug] || 'from-primary to-accent'} flex items-center justify-center text-2xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  {categoryIcons[cat.slug] || '🍃'}
                </div>
                <h3 className="text-sm font-semibold text-gray-800 mb-1">{cat.name}</h3>
                <span className="text-[11px] text-muted">{cat._count.products} sản phẩm</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
