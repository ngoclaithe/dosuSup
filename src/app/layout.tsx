import type { Metadata } from 'next'
import { Be_Vietnam_Pro } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/components/ui/Toast'

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-be-vietnam',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'DosuSupplements — Thực phẩm chức năng chính hãng',
    template: '%s | DosuSupplements',
  },
  description: 'Cung cấp thực phẩm chức năng chính hãng, nhập khẩu chất lượng cao. Vitamin, Collagen, hỗ trợ sức khỏe. Giao hàng toàn quốc.',
  keywords: ['thực phẩm chức năng', 'vitamin', 'collagen', 'sức khỏe', 'DosuSupplements'],
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: 'DosuSupplements',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className={beVietnamPro.variable}>
      <body className="antialiased font-sans">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}
