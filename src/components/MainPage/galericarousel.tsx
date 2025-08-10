// components/MainPage/GaleriCarousel.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  PlayIcon,
  ArrowRightIcon,
  CameraIcon
} from '@heroicons/react/24/outline'

// Sample data - ganti dengan data real nanti
const galeriData = [
  {
    id: 1,
    image: '/images/galeri/kegiatan-gotong-royong.jpg',
    title: 'Gotong Royong Membersihkan Lingkungan',
    category: 'Kegiatan Masyarakat',
    date: '15 Januari 2024',
    description: 'Kegiatan rutin gotong royong membersihkan lingkungan desa yang diikuti seluruh warga'
  },
  {
    id: 2,
    image: '/images/galeri/musyawarah-desa.jpg',
    title: 'Musyawarah Desa 2024',
    category: 'Pemerintahan',
    date: '20 Januari 2024',
    description: 'Musyawarah desa membahas program kerja dan anggaran pembangunan tahun 2024'
  },
  {
    id: 3,
    image: '/images/galeri/festival-budaya.jpg',
    title: 'Festival Budaya Lokal',
    category: 'Budaya',
    date: '25 Januari 2024',
    description: 'Perayaan festival budaya lokal dengan berbagai pertunjukan seni tradisional'
  },
  {
    id: 4,
    image: '/images/galeri/pembangunan-jalan.jpg',
    title: 'Pembangunan Infrastruktur',
    category: 'Pembangunan',
    date: '30 Januari 2024',
    description: 'Proses pembangunan infrastruktur jalan untuk meningkatkan konektivitas desa'
  },
  {
    id: 5,
    image: '/images/galeri/pelatihan-umkm.jpg',
    title: 'Pelatihan UMKM',
    category: 'Ekonomi',
    date: '5 Februari 2024',
    description: 'Pelatihan pengembangan UMKM untuk meningkatkan ekonomi masyarakat desa'
  },
  {
    id: 6,
    image: '/images/galeri/posyandu.jpg',
    title: 'Posyandu Balita',
    category: 'Kesehatan',
    date: '10 Februari 2024',
    description: 'Kegiatan posyandu untuk memantau kesehatan balita dan ibu hamil'
  }
]

export default function GaleriCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoplay, setIsAutoplay] = useState(true)

  // Auto-scroll carousel
  useEffect(() => {
    if (!isAutoplay) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === galeriData.length - 1 ? 0 : prevIndex + 1
      )
    }, 4000) // Change every 4 seconds

    return () => clearInterval(interval)
  }, [isAutoplay])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoplay(false)
    // Resume autoplay after 5 seconds
    setTimeout(() => setIsAutoplay(true), 5000)
  }

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? galeriData.length - 1 : currentIndex - 1)
    setIsAutoplay(false)
    setTimeout(() => setIsAutoplay(true), 5000)
  }

  const goToNext = () => {
    setCurrentIndex(currentIndex === galeriData.length - 1 ? 0 : currentIndex + 1)
    setIsAutoplay(false)
    setTimeout(() => setIsAutoplay(true), 5000)
  }

  return (
    <section className="w-full py-16 bg-gradient-to-br from-bg-gray-light to-white px-6 md:px-8 lg:px-20 xl:px-40">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4">
            Galeri Kegiatan Desa
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-primary-orange to-primary-green mx-auto mb-6"></div>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Dokumentasi berbagai kegiatan dan momen berharga di Desa Tonrong
          </p>
        </div>

        {/* Main Carousel */}
        <div className="relative mb-12">
          
          {/* Main Image Display */}
          <div className="relative h-96 lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl group">
            <img
              src={galeriData[currentIndex].image}
              alt={galeriData[currentIndex].title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            
            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
              <div className="max-w-2xl">
                {/* Category Badge */}
                <div className="inline-flex items-center px-4 py-2 bg-primary-orange/90 backdrop-blur-sm text-white text-sm font-semibold rounded-full mb-4">
                  <CameraIcon className="h-4 w-4 mr-2" />
                  {galeriData[currentIndex].category}
                </div>
                
                {/* Title & Description */}
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3 leading-tight">
                  {galeriData[currentIndex].title}
                </h3>
                <p className="text-gray-200 mb-4 leading-relaxed">
                  {galeriData[currentIndex].description}
                </p>
                <div className="flex items-center text-gray-300 text-sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {galeriData[currentIndex].date}
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
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

            {/* Autoplay Indicator */}
            <div className="absolute top-6 right-6">
              <div className={`w-3 h-3 rounded-full ${isAutoplay ? 'bg-primary-green animate-pulse' : 'bg-gray-400'}`}></div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-3">
            {galeriData.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-primary-orange w-8' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Thumbnail Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {galeriData.map((item, index) => (
            <button
              key={item.id}
              onClick={() => goToSlide(index)}
              className={`relative aspect-square rounded-xl overflow-hidden group transition-all duration-300 ${
                index === currentIndex 
                  ? 'ring-4 ring-primary-orange shadow-lg scale-105' 
                  : 'hover:scale-105 hover:shadow-md'
              }`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className={`absolute inset-0 transition-opacity duration-300 ${
                index === currentIndex 
                  ? 'bg-primary-orange/20' 
                  : 'bg-black/20 group-hover:bg-black/10'
              }`}></div>
              
              {/* Play icon for current image */}
              {index === currentIndex && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                    <PlayIcon className="h-4 w-4 text-primary-orange ml-0.5" />
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Stats & CTA Section */}
        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl border border-gray-100">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            
            {/* Stats */}
            <div>
              <h3 className="text-2xl font-bold text-text-primary mb-6">Dokumentasi Lengkap</h3>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-orange mb-2">150+</div>
                  <div className="text-sm text-text-muted">Total Foto</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-green mb-2">12</div>
                  <div className="text-sm text-text-muted">Kategori</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-orange mb-2">2024</div>
                  <div className="text-sm text-text-muted">Tahun Aktif</div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center md:text-right">
              <h4 className="text-xl font-semibold text-text-primary mb-4">
                Lihat Koleksi Lengkap
              </h4>
              <p className="text-text-secondary mb-6">
                Jelajahi dokumentasi lengkap kegiatan dan momen berharga di Desa Tonrong
              </p>
              <Link
                href="/galeri"
                className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-orange to-primary-green text-white font-semibold rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                <span>Galeri Lengkap</span>
                <ArrowRightIcon className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}