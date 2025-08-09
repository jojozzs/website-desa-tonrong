'use client'

import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'

export default function HeroBeranda() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [fade, setFade] = useState(true)

  const animatedTexts = [
    "Desa Tonrong",
    "Kabupaten Sidrap",
    "Kecamatan Baranti"
  ]

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setCurrentTextIndex(prev => (prev + 1) % animatedTexts.length)
        setFade(true) 
      }, 500) 
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative h-[calc(100vh-100px)] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/landscape.jpg" 
          alt="Pemandangan Desa Tonrong"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center h-full">
        <div className="container px-6 sm:px-6 lg:px-10 py-4 w-full">

          {/* Selamat Datang */}
          <div className={`mb-4 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-2xl sm:text-4xl lg:text-6xl font-bold text-white">
              Selamat Datang di
            </h2>
          </div>

          {/* Animated Text */}
          <div className={`mb-8 overflow-hidden transform transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <h2
              className={`text-1xl sm:text-4xl lg:text-6xl font-bold leading-tight transform transition-all duration-500 ${
                fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <span className="block hero-text-animation">
                {animatedTexts[currentTextIndex]}
              </span>
            </h2>
          </div>

          {/* Deskripsi */}
          <div className={`min-h-10 mb-12 transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <p className="text-base sm:text-lg lg:text-2xl text-gray-200 leading-relaxed max-w-xl animate-fade-in" style={{ animationDelay: '1.2s' }}>
              Website resmi Desa Tonrong, Kabupaten Sidrap, Kecamatan Baranti
            </p>
          </div>

          {/* Statistik */}
          <div className={`mb-12 transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="grid grid-cols-3 gap-4 sm:gap-8 lg:gap-12 max-w-2xl">
              <div className="text-center group animate-scale-in" style={{ animationDelay: '1.4s' }}>
                <div className="text-lg sm:text-lg lg:text-2xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                  2,547
                </div>
                <div className="text-gray-300 font-bold text-xs sm:text-sm lg:text-base">Jiwa Penduduk</div>
              </div>
              <div className="text-center group animate-scale-in" style={{ animationDelay: '1.6s' }}>
                <div className="text-lg sm:text-lg lg:text-2xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                  8
                </div>
                <div className="text-gray-300 font-bold text-xs sm:text-sm lg:text-base">Dusun</div>
              </div>
              <div className="text-center group animate-scale-in" style={{ animationDelay: '1.8s' }}>
                <div className="text-lg sm:text-lg lg:text-2xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                  25
                </div>
                <div className="text-gray-300 font-bold text-xs sm:text-sm lg:text-base">UMKM Aktif</div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className={`flex flex-col md:mb-0 sm:flex-row gap-4 max-w-2xl mt-8 transform transition-all duration-1000 delay-900 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <Link
              href="/profil"
              className="group flex-1 inline-flex items-center justify-center 
              px-4 py-2 text-xs sm:px-6 sm:py-3 sm:text-base lg:px-8 lg:py-4 lg:text-lg
              bg-primary-orange text-white font-semibold rounded-xl 
              hover:bg-button-orange-hover hover:shadow-xl hover:scale-105 
              transition-all duration-300"
              style={{ animationDelay: '2s' }}
            >
              <span>Jelajahi Profil Desa</span>
              <ArrowRightIcon className="ml-2 h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            
            <Link
              href="/berita"
              className="flex-1 inline-flex items-center justify-center 
              px-4 py-2 text-xs sm:px-6 sm:py-3 sm:text-base lg:px-8 lg:py-4 lg:text-lg
              border-2 border-white text-white font-semibold rounded-xl 
              hover:bg-white hover:text-text-primary hover:scale-105 
              transition-all duration-300"
              style={{ animationDelay: '2.2s' }}
            >
              Berita Terbaru
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
