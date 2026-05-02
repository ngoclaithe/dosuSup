import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-16 md:pt-20">
        {children}
      </main>
      <Footer />
      
      {/* Zalo Chat Button */}
      <a
        href="https://zalo.me/0346437915"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center shadow-xl shadow-blue-500/30 hover:scale-110 transition-transform duration-300 animate-bounce-gentle"
        aria-label="Chat Zalo"
      >
        <svg className="w-7 h-7 text-white" viewBox="0 0 48 48" fill="currentColor">
          <path d="M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4zm8.776 13.656c-.416-.416-1.36-.552-2.344-.552h-8.12c-.296 0-.42.104-.42.312v4.632c0 .208.124.312.42.312h5.004c.208 0 .312.104.312.312v1.672c0 .208-.104.312-.312.312h-5.004c-.296 0-.42.104-.42.312v7.696c0 .208-.124.312-.42.312h-1.988c-.208 0-.312-.104-.312-.312V17.344c0-.208.104-.312.312-.312h13.292c.208 0 .312.104.312.312v1.672c0 .416-.104.624-.312.624h-2.372l2.372.016z"/>
        </svg>
      </a>
    </>
  )
}
