export interface CartItem {
  productId: number
  name: string
  slug: string
  image: string
  price: number
  salePrice?: number
  quantity: number
  stock: number
  unit: string
}

export interface OrderItem {
  productId: number
  name: string
  slug: string
  image: string
  price: number
  salePrice?: number
  quantity: number
}

export type OrderStatusType =
  | 'PENDING_PAYMENT'
  | 'PENDING_CONFIRM'
  | 'PAID'
  | 'PACKING'
  | 'SHIPPING'
  | 'DONE'
  | 'CANCELLED'

export type PaymentMethodType = 'COD' | 'BANK_TRANSFER'

export interface ProductType {
  id: number
  name: string
  slug: string
  categoryId: number
  category?: {
    id: number
    name: string
    slug: string
  }
  description?: string | null
  ingredients?: string | null
  usage?: string | null
  benefits?: string | null
  warning?: string | null
  price: number
  salePrice?: number | null
  stock: number
  unit: string
  brand?: string | null
  images: string[]
  isFeatured: boolean
  isNew: boolean
  isBestSeller: boolean
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface CategoryType {
  id: number
  name: string
  slug: string
  image?: string | null
  _count?: { products: number }
}

export interface OrderType {
  id: number
  orderCode: string
  customerName: string
  customerEmail: string
  customerPhone: string
  address: string
  province: string
  district: string
  ward: string
  note?: string | null
  items: OrderItem[]
  totalAmount: number
  paymentMethod: PaymentMethodType
  status: OrderStatusType
  sepayTransactionId?: string | null
  paidAt?: string | null
  statusHistory?: OrderHistoryType[]
  createdAt: string
  updatedAt: string
}

export interface OrderHistoryType {
  id: number
  status: OrderStatusType
  note?: string | null
  createdAt: string
}

export interface BlogPostType {
  id: number
  title: string
  slug: string
  category: string
  summary: string
  content: string
  thumbnail: string
  metaTitle?: string | null
  metaDescription?: string | null
  published: boolean
  createdAt: string
  updatedAt: string
}

export interface CheckoutFormData {
  fullName: string
  email: string
  phone: string
  address: string
  province: string
  district: string
  ward: string
  note?: string
  paymentMethod: PaymentMethodType
}
