'use client'
import { useState } from 'react'
import { Metadata } from 'next'
import { useToast } from '@/components/ui/Toast'

export default function ContactPage() {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', message: '' })
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Có lỗi xảy ra')
      addToast('success', 'Gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm nhất.')
      setForm({ fullName: '', email: '', phone: '', message: '' })
    } catch {
      addToast('error', 'Không thể gửi liên hệ. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <section className="bg-gradient-to-br from-primary via-primary-dark to-[#0a2e1a] py-16">
        <div className="container-custom text-center">
          <h1 className="text-3xl md:text-display font-bold text-white mb-4">Liên hệ</h1>
          <p className="text-white/80 text-lg">Chúng tôi luôn sẵn sàng hỗ trợ bạn</p>
        </div>
      </section>
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
            <h2 className="text-h3 font-bold text-gray-800 mb-6">Gửi tin nhắn</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Họ và tên *</label>
                <input type="text" value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} required className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Số điện thoại</label>
                <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nội dung *</label>
                <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required rows={5} className="input-field" />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Đang gửi...' : 'Gửi liên hệ'}</button>
            </form>
          </div>
          {/* Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Thông tin liên hệ</h3>
              <div className="space-y-4 text-sm text-gray-600">
                <div className="flex items-start gap-3"><span className="text-xl">📍</span><div><p className="font-medium text-gray-800">Địa chỉ</p><p>Hà Nội, Việt Nam</p></div></div>
                <div className="flex items-start gap-3"><span className="text-xl">📞</span><div><p className="font-medium text-gray-800">Hotline</p><a href="tel:0346437915" className="text-primary hover:text-accent">0346 437 915</a></div></div>
                <div className="flex items-start gap-3"><span className="text-xl">✉️</span><div><p className="font-medium text-gray-800">Email</p><a href="mailto:support@dosusupplements.com" className="text-primary hover:text-accent">support@dosusupplements.com</a></div></div>
                <div className="flex items-start gap-3"><span className="text-xl">⏰</span><div><p className="font-medium text-gray-800">Giờ làm việc</p><p>Thứ 2 - Thứ 7: 8:00 - 18:00</p></div></div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Kênh hỗ trợ</h3>
              <div className="flex gap-3">
                <a href="https://zalo.me/0346437915" target="_blank" className="flex-1 bg-blue-50 text-blue-700 py-3 rounded-xl text-center text-sm font-semibold hover:bg-blue-100 transition-colors">💬 Zalo</a>
                <a href="#" target="_blank" className="flex-1 bg-indigo-50 text-indigo-700 py-3 rounded-xl text-center text-sm font-semibold hover:bg-indigo-100 transition-colors">💬 Messenger</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
