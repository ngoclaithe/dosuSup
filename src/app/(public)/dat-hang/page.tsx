'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/store/cart'
import { useToast } from '@/components/ui/Toast'
import { formatPrice } from '@/lib/utils'

const steps = ['Thông tin', 'Xác nhận', 'Thanh toán']

export default function CheckoutPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [orderResult, setOrderResult] = useState<{ orderCode: string; paymentMethod: string } | null>(null)
  const items = useCartStore(s => s.items)
  const totalPrice = useCartStore(s => s.totalPrice)
  const clearCart = useCartStore(s => s.clearCart)
  const { addToast } = useToast()

  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', address: '',
    province: '', district: '', ward: '', note: '',
    paymentMethod: 'COD' as 'COD' | 'BANK_TRANSFER',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return <div className="container-custom py-12"><div className="h-96 skeleton rounded-xl" /></div>

  if (items.length === 0 && !orderResult) {
    return (
      <div className="container-custom py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-h2 font-bold mb-3">Giỏ hàng trống</h1>
        <p className="text-muted mb-6">Vui lòng thêm sản phẩm trước khi đặt hàng</p>
        <Link href="/san-pham" className="btn-primary">Khám phá sản phẩm</Link>
      </div>
    )
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.fullName || form.fullName.length < 2) e.fullName = 'Vui lòng nhập họ tên'
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email không hợp lệ'
    if (!form.phone || !/^(0[3-9][0-9]{8})$/.test(form.phone)) e.phone = 'Số điện thoại không hợp lệ'
    if (!form.address || form.address.length < 10) e.address = 'Vui lòng nhập địa chỉ chi tiết'
    if (!form.province) e.province = 'Vui lòng nhập Tỉnh/Thành'
    if (!form.district) e.district = 'Vui lòng nhập Quận/Huyện'
    if (!form.ward) e.ward = 'Vui lòng nhập Phường/Xã'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => {
    if (step === 0 && !validate()) return
    setStep(s => Math.min(2, s + 1))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: items.map(i => ({
            productId: i.productId, name: i.name, slug: i.slug,
            image: i.image, price: i.price, salePrice: i.salePrice, quantity: i.quantity,
          })),
          totalAmount: totalPrice(),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Lỗi tạo đơn hàng')
      setOrderResult({ orderCode: data.orderCode, paymentMethod: form.paymentMethod })
      clearCart()
      setStep(2)
      addToast('success', 'Đặt hàng thành công!')
    } catch (err: any) {
      addToast('error', err.message || 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  const InputField = ({ label, name, type = 'text', required = true, placeholder = '' }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label} {required && <span className="text-red-500">*</span>}</label>
      <input type={type} value={(form as any)[name]} onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))} placeholder={placeholder} className={`input-field ${errors[name] ? 'input-error' : ''}`} />
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  )

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <div className="bg-white border-b border-gray-100">
        <div className="container-custom py-4">
          <nav className="flex items-center gap-2 text-sm text-muted">
            <Link href="/" className="hover:text-primary">Trang chủ</Link><span>/</span>
            <Link href="/gio-hang" className="hover:text-primary">Giỏ hàng</Link><span>/</span>
            <span className="text-primary font-medium">Đặt hàng</span>
          </nav>
        </div>
      </div>
      <div className="container-custom py-8 max-w-4xl mx-auto">
        {/* Stepper */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${i <= step ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>{i + 1}</div>
              <span className={`ml-2 text-sm font-medium hidden sm:inline ${i <= step ? 'text-primary' : 'text-muted'}`}>{s}</span>
              {i < 2 && <div className={`w-12 md:w-20 h-0.5 mx-3 ${i < step ? 'bg-primary' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Info */}
        {step === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
            <h2 className="text-h3 font-bold text-gray-800 mb-6">Thông tin giao hàng</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Họ và tên" name="fullName" placeholder="Nguyễn Văn A" />
              <InputField label="Email" name="email" type="email" placeholder="email@example.com" />
              <InputField label="Số điện thoại" name="phone" placeholder="0912345678" />
              <InputField label="Tỉnh/Thành phố" name="province" placeholder="Hà Nội" />
              <InputField label="Quận/Huyện" name="district" placeholder="Cầu Giấy" />
              <InputField label="Phường/Xã" name="ward" placeholder="Dịch Vọng" />
              <div className="md:col-span-2">
                <InputField label="Địa chỉ chi tiết" name="address" placeholder="Số 1, Ngõ 2, Đường ABC..." />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Ghi chú</label>
                <textarea value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} className="input-field" rows={3} placeholder="Ghi chú cho đơn hàng (nếu có)" />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={handleNext} className="btn-primary">Tiếp tục →</button>
            </div>
          </div>
        )}

        {/* Step 2: Confirm */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
            <h2 className="text-h3 font-bold text-gray-800 mb-6">Xác nhận đơn hàng</h2>
            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={item.productId} className="flex items-center gap-3 py-3 border-b border-gray-50">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                    <p className="text-xs text-muted">×{item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-primary">{formatPrice((item.salePrice || item.price) * item.quantity)}</span>
                </div>
              ))}
              <div className="flex justify-between pt-2 font-bold text-lg">
                <span>Tổng cộng</span>
                <span className="text-primary">{formatPrice(totalPrice())}</span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-sm text-gray-700 space-y-1">
              <p><strong>Người nhận:</strong> {form.fullName}</p>
              <p><strong>Email:</strong> {form.email}</p>
              <p><strong>SĐT:</strong> {form.phone}</p>
              <p><strong>Địa chỉ:</strong> {form.address}, {form.ward}, {form.district}, {form.province}</p>
              {form.note && <p><strong>Ghi chú:</strong> {form.note}</p>}
            </div>
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Phương thức thanh toán</h3>
              <div className="space-y-3">
                <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${form.paymentMethod === 'COD' ? 'border-primary bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="payment" value="COD" checked={form.paymentMethod === 'COD'} onChange={() => setForm(f => ({ ...f, paymentMethod: 'COD' }))} className="accent-primary" />
                  <span className="text-2xl">💵</span>
                  <div><p className="font-medium text-sm">Thanh toán khi nhận hàng (COD)</p><p className="text-xs text-muted">Bạn sẽ thanh toán cho shipper khi nhận hàng</p></div>
                </label>
                <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${form.paymentMethod === 'BANK_TRANSFER' ? 'border-primary bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="payment" value="BANK_TRANSFER" checked={form.paymentMethod === 'BANK_TRANSFER'} onChange={() => setForm(f => ({ ...f, paymentMethod: 'BANK_TRANSFER' }))} className="accent-primary" />
                  <span className="text-2xl">📱</span>
                  <div><p className="font-medium text-sm">Chuyển khoản QR (SePay)</p><p className="text-xs text-muted">Xác nhận tự động, nhanh chóng</p></div>
                </label>
              </div>
            </div>
            <div className="flex justify-between">
              <button onClick={() => setStep(0)} className="btn-ghost">← Quay lại</button>
              <button onClick={handleSubmit} disabled={loading} className="btn-primary">
                {loading ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 2 && orderResult && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 text-center">
            {orderResult.paymentMethod === 'COD' ? (
              <>
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-h2 font-bold text-gray-800 mb-2">Đặt hàng thành công!</h2>
                <p className="text-muted mb-2">Mã đơn hàng: <strong className="text-primary">{orderResult.orderCode}</strong></p>
                <p className="text-sm text-muted mb-8">Bạn sẽ thanh toán khi nhận hàng. Chúng tôi sẽ liên hệ xác nhận trong vòng 2–4 giờ làm việc.</p>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">📱</div>
                <h2 className="text-h2 font-bold text-gray-800 mb-2">Quét mã QR để thanh toán</h2>
                <p className="text-muted mb-4">Mã đơn: <strong className="text-primary">{orderResult.orderCode}</strong></p>
                <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-2xl mb-4">
                  <Image src={`https://qr.sepay.vn/img?bank=${process.env.NEXT_PUBLIC_SEPAY_BANK_ID || 'MB'}&acc=${process.env.NEXT_PUBLIC_SEPAY_ACCOUNT_NUMBER || ''}&template=compact2&amount=${totalPrice()}&des=${orderResult.orderCode}`} alt="QR Code" width={240} height={240} className="mx-auto" />
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-sm text-left max-w-sm mx-auto mb-4 space-y-1.5">
                  <p><strong>Nội dung CK:</strong> {orderResult.orderCode}</p>
                  <p><strong>Số tiền:</strong> {formatPrice(totalPrice())}</p>
                </div>
                <p className="text-sm text-muted animate-pulse">⏳ Đang chờ xác nhận thanh toán...</p>
              </>
            )}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <Link href={`/dat-hang/xac-nhan/${orderResult.orderCode}`} className="btn-primary">Xem trạng thái đơn hàng</Link>
              <Link href="/san-pham" className="btn-secondary">Tiếp tục mua sắm</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
