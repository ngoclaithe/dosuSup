'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const slides = [
  {
    title: 'Sức khỏe là vàng, bổ sung đúng cách',
    subtitle: 'Thực phẩm chức năng chính hãng, nhập khẩu từ các thương hiệu uy tín hàng đầu thế giới.',
    cta: 'Mua ngay',
    ctaLink: '/san-pham',
    image: '/banner-1.png',
    accent: '🌿',
  },
  {
    title: 'Ưu đãi đặc biệt lên đến 30%',
    subtitle: 'Chương trình khuyến mãi đặc biệt dành cho khách hàng mới. Giao hàng nhanh toàn quốc.',
    cta: 'Xem ưu đãi',
    ctaLink: '/san-pham',
    image: '/banner-2.png',
    accent: '💊',
  },
  {
    title: 'Collagen & Vitamin cho làn da rạng rỡ',
    subtitle: 'Bổ sung dưỡng chất thiết yếu giúp da sáng mịn, tóc chắc khỏe từ bên trong.',
    cta: 'Khám phá',
    ctaLink: '/san-pham?category=collagen',
    image: '/banner-3.png',
    accent: '✨',
  },
]

export default function HeroSection() {
  const [current, setCurrent] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const nextSlide = useCallback(() => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrent(prev => (prev + 1) % slides.length)
      setIsAnimating(false)
    }, 300)
  }, [])

  const prevSlide = useCallback(() => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrent(prev => (prev - 1 + slides.length) % slides.length)
      setIsAnimating(false)
    }, 300)
  }, [])

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [nextSlide])

  const slide = slides[current]

  return (
    <section className="relative overflow-hidden">
      <div
        className={`relative transition-all duration-700 ease-in-out min-h-[400px] md:min-h-[500px] lg:min-h-[550px] flex items-center py-12 md:py-20`}
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src={slide.image} 
            alt={slide.title} 
            fill 
            className="object-cover object-center"
            priority 
          />
          {/* Dark Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="container-custom relative z-10 w-full">
          <div className="flex items-center">
            <div
              className={`max-w-2xl transition-all duration-500 ${
                isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
              }`}
            >
              <div className="text-5xl md:text-6xl mb-4">{slide.accent}</div>
              <h1 className="text-3xl md:text-4xl lg:text-display font-bold text-white mb-4 md:mb-6 leading-tight">
                {slide.title}
              </h1>
              <p className="text-base md:text-lg text-white/80 mb-6 md:mb-8 max-w-lg leading-relaxed">
                {slide.subtitle}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={slide.ctaLink}
                  className="inline-flex items-center gap-2 bg-white text-primary px-7 py-3.5 rounded-xl font-semibold hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-1 transition-all duration-300"
                >
                  {slide.cta}
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <Link
                  href="/lien-he"
                  className="inline-flex items-center gap-2 border-2 border-white/40 text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300"
                >
                  Tư vấn miễn phí
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 hidden md:flex"
          aria-label="Previous"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 hidden md:flex"
          aria-label="Next"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
