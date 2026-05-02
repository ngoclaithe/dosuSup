import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(' ')
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ'
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function generateOrderCode(): string {
  const now = new Date()
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
  const random = Math.floor(Math.random() * 999).toString().padStart(3, '0')
  return `ORD-${dateStr}-${random}`
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function getStatusLabel(status: string): { label: string; color: string; icon: string } {
  const map: Record<string, { label: string; color: string; icon: string }> = {
    PENDING_PAYMENT: { label: 'Chờ thanh toán', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
    PENDING_CONFIRM: { label: 'Chờ xác nhận', color: 'bg-blue-100 text-blue-800', icon: '📋' },
    PAID: { label: 'Đã thanh toán', color: 'bg-green-100 text-green-800', icon: '✅' },
    PACKING: { label: 'Đang đóng gói', color: 'bg-emerald-100 text-emerald-800', icon: '📦' },
    SHIPPING: { label: 'Đang giao hàng', color: 'bg-teal-100 text-teal-800', icon: '🚚' },
    DONE: { label: 'Giao thành công', color: 'bg-green-200 text-green-900', icon: '🎉' },
    CANCELLED: { label: 'Đã huỷ', color: 'bg-red-100 text-red-800', icon: '❌' },
  }
  return map[status] || { label: status, color: 'bg-gray-100 text-gray-800', icon: '?' }
}
