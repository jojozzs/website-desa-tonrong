'use client'

import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import { useProfilData } from '@/hooks/useProfilData'
import { useProdukData } from '@/hooks/useProdukData'
import { ProfilKategoriEnum } from '@/lib/enums'

export default function HeroBeranda() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [fade, setFade] = useState(true)
  
  // Counter states
  const [pendudukCounter, setPendudukCounter] = useState(0)
  const [produkCounter, setProdukCounter] = useState(0)
  const [idmCounter, setIdmCounter] = useState(0)
  const [showRealData, setShowRealData] = useState(false)
  const [counterStarted, setCounterStarted] = useState(false)

  // Fetch data penduduk dan produk UMKM
  const { data: pendudukData, loading: pendudukLoading } = useProfilData(ProfilKategoriEnum.JUMLAH_PENDUDUK_DAN_DATA_UMUM)
  const { data: produkData, loading: produkLoading } = useProdukData()

  const animatedTexts = [
    "Desa Tonrong Rijang",
    "Kabupaten Sidrap", 
    "Kecamatan Baranti"
  ]

  // Ambil data dari API
  const getJumlahPenduduk = () => {
    if (pendudukData && pendudukData.length > 0) {
      const mainData = pendudukData[0]
      if (mainData.data_tambahan?.demografi?.total_penduduk) {
        return mainData.data_tambahan.demografi.total_penduduk
      }
    }
    return 1458
  }

  const getJumlahProdukUMKM = () => {
    if (produkData && Array.isArray(produkData)) {
      return produkData.length
    }
    return 25
  }

  const getIDMData = () => {
    if (pendudukData && pendudukData.length > 0) {
      const mainData = pendudukData[0]
      if (mainData.data_tambahan?.idm) {
        return {
          nilai: mainData.data_tambahan.idm.nilai || '0,7206',
          status: mainData.data_tambahan.idm.status || 'Maju'
        }
      }
    }
    return {
      nilai: '0,7206',
      status: 'Maju'
    }
  }

  const pendudukCount = getJumlahPenduduk()
  const produkCount = getJumlahProdukUMKM()
  const idmData = getIDMData()
  const idmValue = parseFloat(idmData.nilai.replace(',', '.'))

  // Start counter animation after page load (tidak menunggu data loading)
  useEffect(() => {
    const startTimer = setTimeout(() => {
      if (!counterStarted) {
        setCounterStarted(true)
        
        // Start counter animation
        const duration = 2000 // 2 seconds
        const steps = 60 // 60 fps
        const stepTime = duration / steps
        
        let step = 0
        
        const timer = setInterval(() => {
          step++
          const progress = step / steps
          const easeProgress = 1 - Math.pow(1 - progress, 3) // easeOutCubic
          
          // Animate penduduk counter
          setPendudukCounter(Math.floor(pendudukCount * easeProgress))
          
          // Animate produk counter
          setProdukCounter(Math.floor(produkCount * easeProgress))
          
          // Animate IDM counter
          setIdmCounter(idmValue * easeProgress)
          
          if (step >= steps) {
            clearInterval(timer)
            // Show real data after animation
            setTimeout(() => {
              setShowRealData(true)
            }, 300)
          }
        }, stepTime)
      }
    }, 1400) // Start after hero animation

    return () => clearTimeout(startTimer)
  }, [pendudukCount, produkCount, idmValue, counterStarted])

  // Update counters when real data loads (if data changes)
  useEffect(() => {
    if (!pendudukLoading && !produkLoading && showRealData) {
      // If real data is different from fallback, update smoothly
      const newPendudukCount = getJumlahPenduduk()
      const newProdukCount = getJumlahProdukUMKM()
      const newIdmValue = parseFloat(getIDMData().nilai.replace(',', '.'))
      
      if (newPendudukCount !== pendudukCount || newProdukCount !== produkCount || newIdmValue !== idmValue) {
        // Animate to new values
        const duration = 1000
        const steps = 30
        const stepTime = duration / steps
        
        const startPenduduk = pendudukCounter
        const startProduk = produkCounter
        const startIdm = idmCounter
        
        let step = 0
        
        const updateTimer = setInterval(() => {
          step++
          const progress = step / steps
          const easeProgress = 1 - Math.pow(1 - progress, 3)
          
          setPendudukCounter(Math.floor(startPenduduk + (newPendudukCount - startPenduduk) * easeProgress))
          setProdukCounter(Math.floor(startProduk + (newProdukCount - startProduk) * easeProgress))
          setIdmCounter(startIdm + (newIdmValue - startIdm) * easeProgress)
          
          if (step >= steps) {
            clearInterval(updateTimer)
          }
        }, stepTime)
      }
    }
  }, [pendudukLoading, produkLoading, pendudukData, produkData])

  // Format numbers
  const formatNumber = (num: number) => {
    return num.toLocaleString('id-ID')
  }

  const formatIDM = (num: number) => {
    return num.toFixed(4).replace('.', ',')
  }

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
    <section className="relative h-[calc(100vh-100px)] flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/Beranda2.jpg" 
          alt="Pemandangan Desa Tonrong Rijang, Kecamatan Baranti, Kabupaten Sidenreng Rappang"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* Content - Centered */}
      <div className="relative z-10 text-center px-6 sm:px-6 lg:px-10 py-4 w-full max-w-6xl mx-auto">

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
        <div className={`min-h-10 mb-14 transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <p className="text-base sm:text-lg lg:text-2xl text-gray-200 leading-relaxed max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '1.2s' }}>
            Website resmi Desa Tonrong Rijang, Kecamatan Baranti, Kabupaten Sidrap
          </p>
        </div>

        {/* Statistik dengan tinggi yang sama */}
        <div className={`mb-14 transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
            
            {/* Jumlah Penduduk */}
            <div className="text-center group h-20 sm:h-24 lg:h-28 flex flex-col justify-center" style={{ animationDelay: '1.4s' }}>
              <div className="text-lg sm:text-xl lg:text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300 min-h-[1.5em] flex items-center justify-center">
                {showRealData ? (
                  formatNumber(pendudukCount)
                ) : (
                  formatNumber(pendudukCounter)
                )}
              </div>
              <div className="text-gray-300 font-bold text-xs sm:text-sm lg:text-base">Jiwa Penduduk</div>
            </div>

            {/* Produk UMKM */}
            <div className="text-center group h-20 sm:h-24 lg:h-28 flex flex-col justify-center" style={{ animationDelay: '1.6s' }}>
              <div className="text-lg sm:text-xl lg:text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300 min-h-[1.5em] flex items-center justify-center">
                {showRealData ? (
                  produkCount
                ) : (
                  produkCounter
                )}
              </div>
              <div className="text-gray-300 font-bold text-xs sm:text-sm lg:text-base">Produk UMKM</div>
            </div>

            {/* Nilai IDM */}
            <div className="text-center group h-20 sm:h-24 lg:h-28 flex flex-col justify-center" style={{ animationDelay: '1.8s' }}>
              <div className="text-lg sm:text-xl lg:text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300 min-h-[1.5em] flex items-center justify-center">
                {showRealData ? (
                  idmData.nilai
                ) : (
                  formatIDM(idmCounter)
                )}
              </div>
              <div className="text-gray-300 font-bold text-xs sm:text-sm lg:text-base">Nilai IDM</div>
            </div>

            {/* Status IDM */}
            <div className="text-center group h-20 sm:h-24 lg:h-28 flex flex-col justify-center" style={{ animationDelay: '2.0s' }}>
              <div className="text-lg sm:text-xl lg:text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300 min-h-[1.5em] flex items-center justify-center">
                <div 
                  className={`px-2 py-1 rounded-lg transition-all duration-500 ${
                    counterStarted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  }`}
                >
                  {idmData.status}
                </div>
              </div>
              <div className="text-gray-300 font-bold text-xs sm:text-sm lg:text-base">Status IDM</div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className={`flex flex-col sm:flex-row gap-4 max-w-xl mx-auto mt-8 transform transition-all duration-1000 delay-900 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <Link
            href="/profil"
            className="group flex-1 inline-flex items-center justify-center 
            px-4 py-2 text-xs sm:px-6 sm:py-3 sm:text-base lg:px-8 lg:py-4 lg:text-lg
            bg-primary-orange text-white font-semibold rounded-xl 
            hover:bg-button-orange-hover hover:shadow-xl hover:scale-105 
            transition-all duration-300"
            style={{ animationDelay: '2.2s' }}
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
            style={{ animationDelay: '2.4s' }}
          >
            Berita Terbaru
          </Link>
        </div>
      </div>
    </section>
  )
}