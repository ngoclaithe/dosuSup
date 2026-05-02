export default function WhyChooseUs() {
  const features = [
    {
      icon: '🛡️',
      title: 'Hàng chính hãng 100%',
      description: 'Sản phẩm được nhập khẩu trực tiếp, có đầy đủ giấy tờ chứng nhận.',
      color: 'from-blue-400 to-indigo-500',
    },
    {
      icon: '🚚',
      title: 'Giao hàng toàn quốc',
      description: 'Giao hàng nhanh chóng tới mọi tỉnh thành trên cả nước.',
      color: 'from-emerald-400 to-green-500',
    },
    {
      icon: '🔄',
      title: 'Đổi trả 7 ngày',
      description: 'Cam kết đổi trả trong 7 ngày nếu sản phẩm có vấn đề.',
      color: 'from-orange-400 to-amber-500',
    },
    {
      icon: '💬',
      title: 'Tư vấn miễn phí',
      description: 'Đội ngũ tư vấn chuyên nghiệp, hỗ trợ 24/7 qua Zalo, Messenger.',
      color: 'from-purple-400 to-violet-500',
    },
  ]

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h2 className="text-h2 text-primary font-bold mb-3">Tại sao chọn chúng tôi?</h2>
          <p className="text-muted text-body max-w-xl mx-auto">
            DosuSupplements cam kết mang đến cho bạn sản phẩm chất lượng và dịch vụ tốt nhất
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group text-center p-6 rounded-2xl bg-primary-50/30 border border-primary-100/30 hover:bg-white hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-3xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-primary/10`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
