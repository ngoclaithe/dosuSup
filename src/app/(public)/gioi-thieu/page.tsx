import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Giới thiệu',
  description: 'Tìm hiểu về DosuSupplements - đơn vị cung cấp thực phẩm chức năng chính hãng, uy tín hàng đầu.',
}

export default function AboutPage() {
  return (
    <div className="bg-gray-50/50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary via-primary-dark to-[#0a2e1a] py-16 md:py-24">
        <div className="container-custom text-center">
          <h1 className="text-3xl md:text-display font-bold text-white mb-4">Về DosuSupplements</h1>
          <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto">Đồng hành cùng sức khỏe của bạn với những sản phẩm chất lượng cao nhất</p>
        </div>
      </section>

      <div className="container-custom py-12 md:py-16 space-y-16">
        {/* Mission */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-h2 text-primary font-bold mb-4">Sứ mệnh của chúng tôi</h2>
            <p className="text-body text-gray-600 mb-4">DosuSupplements ra đời với sứ mệnh mang đến cho người Việt những sản phẩm thực phẩm chức năng chính hãng, chất lượng cao với giá cả hợp lý.</p>
            <p className="text-body text-gray-600">Chúng tôi tin rằng sức khỏe là nền tảng của cuộc sống hạnh phúc, và mọi người đều xứng đáng được tiếp cận với những sản phẩm bổ sung dinh dưỡng tốt nhất.</p>
          </div>
          <div className="bg-gradient-to-br from-primary-50 to-emerald-50 rounded-2xl p-8 text-center">
            <div className="text-7xl mb-4">🌿</div>
            <p className="text-primary font-semibold text-lg">"Sức khỏe là vàng, bổ sung đúng cách"</p>
          </div>
        </section>

        {/* Values */}
        <section>
          <h2 className="text-h2 text-primary font-bold text-center mb-10">Giá trị cốt lõi</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🛡️', title: 'Chính hãng', desc: '100% sản phẩm có nguồn gốc rõ ràng, giấy tờ đầy đủ' },
              { icon: '🔬', title: 'Chất lượng', desc: 'Chọn lọc kỹ lưỡng từ các thương hiệu uy tín thế giới' },
              { icon: '💰', title: 'Giá hợp lý', desc: 'Cam kết giá tốt nhất, cạnh tranh trên thị trường' },
              { icon: '❤️', title: 'Tận tâm', desc: 'Tư vấn chuyên nghiệp, hỗ trợ khách hàng 24/7' },
            ].map((v, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="text-4xl mb-3">{v.icon}</div>
                <h3 className="font-semibold text-gray-800 mb-2">{v.title}</h3>
                <p className="text-sm text-muted">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            {[
              { num: '1000+', label: 'Khách hàng' },
              { num: '500+', label: 'Sản phẩm' },
              { num: '50+', label: 'Thương hiệu' },
              { num: '99%', label: 'Hài lòng' },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-3xl md:text-4xl font-bold mb-1">{s.num}</div>
                <div className="text-white/80 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
