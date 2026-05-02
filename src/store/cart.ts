'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem } from '@/types'

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>, qty?: number) => void
  removeItem: (productId: number) => void
  updateQty: (productId: number, qty: number) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item, qty = 1) => {
        const items = get().items
        const existing = items.find(i => i.productId === item.productId)
        
        if (existing) {
          const newQty = Math.min(existing.quantity + qty, existing.stock)
          set({
            items: items.map(i =>
              i.productId === item.productId ? { ...i, quantity: newQty } : i
            ),
          })
        } else {
          set({
            items: [...items, { ...item, quantity: Math.min(qty, item.stock) }],
          })
        }
      },
      
      removeItem: (productId) => {
        set({ items: get().items.filter(i => i.productId !== productId) })
      },
      
      updateQty: (productId, qty) => {
        if (qty <= 0) {
          set({ items: get().items.filter(i => i.productId !== productId) })
          return
        }
        set({
          items: get().items.map(i =>
            i.productId === productId ? { ...i, quantity: Math.min(qty, i.stock) } : i
          ),
        })
      },
      
      clearCart: () => set({ items: [] }),
      
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      
      totalPrice: () =>
        get().items.reduce((sum, i) => sum + (i.salePrice || i.price) * i.quantity, 0),
    }),
    {
      name: 'dosu-cart',
    }
  )
)
