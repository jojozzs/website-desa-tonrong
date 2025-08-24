'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useGaleriData } from '@/hooks/useGaleriData'
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  PlayIcon,
  ArrowRightIcon,
  CameraIcon
} from '@heroicons/react/24/outline'

export default function GaleriCarousel() {
  const { data: galeriData, loading, error } = useGaleriData()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoplay, setIsAutoplay] = useState(true)

  // Take only first 6 items for carousel
  const displayData = galeriData.slice(0, 6)

  // Auto-scroll carousel
  useEffect(() => {
    if (!isAutoplay || displayData.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === displayData.length - 1 ? 0 : prevIndex + 1
      )
    }, 4000) // Change every 4 seconds

    return () => clearInterval(interval)
  }, [isAutoplay, displayData.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoplay(false)
    // Resume autoplay after 5 seconds
    setTimeout(() => setIsAutoplay(true), 5000)
  }

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? displayData.length - 1 : currentIndex - 1)
    setIsAutoplay(false)
    setTimeout(() => setIsAutoplay(true), 5000)
  }

  const goToNext = () => {
    setCurrentIndex(currentIndex === displayData.length - 1 ? 0 : currentIndex + 1)
    setIsAutoplay(false)
    setTimeout(() => setIsAutoplay(true), 5000)
  }

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  // Loading state
  if (loading) {
    return (
      <section className="w-full py-16 bg-gradient-to-br from-gray-50 to-white px-6 md:px-8 lg:px-20 xl:px-40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="h-10 bg-gray-200 rounded animate-pulse w-64 mx-auto mb-4"></div>
            <div className="w-32 h-1 bg-gray-200 rounded animate-pulse mx-auto mb-6"></div>
            <div className="h-5 bg-gray-200 rounded animate-pulse w-96 mx-auto"></div>
          </div>
          
          <div className="relative mb-12">
            <div className="h-96 lg:h-[500px] bg-gray-200 rounded-3xl animate-pulse"></div>
          </div>
        </div>
      </section>
    )
  }

  // Error state
  if (error) {
    return (
      <section className="w-full py-16 bg-gradient-to-br from-gray-50 to-white px-6 md:px-8 lg:px-20 xl:px-40">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
            Galeri Kegiatan Desa
          </h2>
          <p className="text-gray-600">Gagal memuat galeri: {error}</p>
        </div>
      </section>
    )
  }

  // Empty state
  if (displayData.length === 0) {
    return (
      <section className="w-full py-16 bg-gradient-to-br from-gray-50 to-white px-6 md:px-8 lg:px-20 xl:px-40">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
            Galeri Kegiatan Desa
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-orange-500 to-green-500 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Galeri foto sedang dalam proses penambahan konten
          </p>
          <Link
            href="/galeri"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-green-500 text-white font-semibold rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <span>Lihat Galeri</span>
            <ArrowRightIcon className="ml-3 h-5 w-5" />
          </Link>
        </div>
      </section>
    )
  }

  const currentItem = displayData[currentIndex]

  return (
    <section className="w-full py-16 bg-gradient-to-br from-gray-50 to-white px-6 md:px-8 lg:px-20 xl:px-40">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
            Galeri Kegiatan Desa
          </h2>
          <div className="w-32 h-1 bg-black mx-auto mb-6"></div>
        </div>

        {/* Main Carousel */}
        <div className="relative mb-12">
          
          {/* Main Image Display */}
          <div className="relative h-96 lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl group">
            <Image
              src={currentItem.gambar_url}
              alt={currentItem.judul}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              priority
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            
            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
              <div className="max-w-2xl">
                
                {/* Title & Description */}
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3 leading-tight">
                  {currentItem.judul}
                </h3>
                <p className="text-gray-200 mb-4 leading-relaxed line-clamp-2">
                  {currentItem.deskripsi}
                </p>
                <div className="flex items-center text-gray-300 text-sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatDate(currentItem.created_at)}
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            {displayData.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 hover:scale-110 transition-all duration-300 group"
                >
                  <ChevronLeftIcon className="h-6 w-6 group-hover:-translate-x-0.5 transition-transform" />
                </button>
                
                <button
                  onClick={goToNext}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 hover:scale-110 transition-all duration-300 group"
                >
                  <ChevronRightIcon className="h-6 w-6 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </>
            )}
          </div>

          {/* Dots Indicator */}
          {displayData.length > 1 && (
            <div className="flex justify-center mt-8 space-x-3">
              {displayData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-orange-500 w-8' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Thumbnail Grid */}
        {displayData.length > 1 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {displayData.map((item, index) => (
              <button
                key={item.id}
                onClick={() => goToSlide(index)}
                className={`relative aspect-square rounded-xl overflow-hidden group transition-all duration-300 ${
                  index === currentIndex 
                    ? 'ring-4 ring-orange-500 shadow-lg scale-105' 
                    : 'hover:scale-105 hover:shadow-md'
                }`}
              >
                <Image
                  src={item.gambar_url}
                  alt={item.judul}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />
                <div className={`absolute inset-0 transition-opacity duration-300 ${
                  index === currentIndex 
                    ? 'bg-orange-500/20' 
                    : 'bg-black/20 group-hover:bg-black/10'
                }`}></div>
                
                {/* Play icon for current image */}
                {index === currentIndex && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                      <PlayIcon className="h-4 w-4 text-orange-500 ml-0.5" />
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Single CTA Button */}
        <div className="text-center">
          <Link
            href="/galeri"
            className="group inline-flex items-center px-10 py-4 bg-button-green hover:bg-button-green-hover text-white font-semibold rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <span>Lihat Galeri Lengkap</span>
            <ArrowRightIcon className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>

      </div>
    </section>
  )
}