'use client'

import { useState } from 'react'
import { useGaleriData } from '@/components/hooks/useGaleriData'
import GaleriCard from '@/components/Galeri/GaleriCard'
import ImageModal from '@/components/Galeri/ImageModal'
import Pagination from '@/components/Berita/Pagination'
import { Images } from 'lucide-react'

interface SelectedImage {
  id: string
  judul: string
  deskripsi: string
  gambar_url: string
  created_at: Date | string
}

export default function GaleriPage() {
  const { data, loading, error, refetch } = useGaleriData()
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const itemsPerPage = 12

  // Pagination logic
  const totalPages = Math.ceil(data.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = data.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleImageClick = (image: SelectedImage) => {
    setSelectedImage(image)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedImage(null), 300) // Delay to allow animation
  }

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div className="relative bg-gradient-to-br from-gray-100 via-white to-gray-100 rounded-2xl p-8 mb-8 overflow-hidden animate-pulse">
          <div className="text-center max-w-4xl mx-auto">
            <div className="w-16 h-16 bg-gray-200 rounded-2xl mx-auto mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-5 bg-gray-200 rounded w-96 mx-auto mb-6"></div>
            <div className="flex justify-center">
              <div className="h-10 w-24 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="rounded-xl overflow-hidden border border-gray-200 bg-white">
              <div className="aspect-square bg-gray-200 animate-pulse"></div>
              <div className="p-4">
                <div className="h-5 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-red-500 mb-4">
          <Images className="h-16 w-16 mx-auto" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Gagal Memuat Galeri</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={refetch}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          🔄 Coba Lagi
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Redesigned Header */}
      <div className="relative bg-gradient-to-br from-green-50 via-white to-green-50 rounded-2xl p-8 mb-8 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 left-4 w-16 h-16 border-2 border-green-400 rounded-full"></div>
          <div className="absolute top-8 right-8 w-8 h-8 bg-green-300 rounded-full"></div>
          <div className="absolute bottom-6 left-12 w-12 h-12 border border-green-300 rotate-45"></div>
          <div className="absolute bottom-4 right-16 w-6 h-6 bg-green-400 rounded-full"></div>
        </div>

        {/* Content */}
        <div className="relative text-center max-w-4xl mx-auto">
          {/* Icon and Badge */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-2xl shadow-lg">
                <Images className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 bg-clip-text text-transparent mb-4">
            Galeri Foto Desa
          </h1>

          {/* Subtitle */}
          <p className="text-gray-600 text-lg lg:text-xl mb-6 max-w-2xl mx-auto leading-relaxed">
            Dokumentasi kegiatan dan momen penting 
            <span className="font-semibold text-green-700"> Desa Tonrong Rijang</span>
          </p>

          {/* Stats Cards */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <div className="bg-white/80 backdrop-blur-sm border border-green-100 rounded-xl px-6 py-3 shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-800 font-semibold text-sm">
                  {data.length} Foto Tersedia
                </span>
              </div>
            </div>
          </div>

          {/* Decorative Line */}
          <div className="flex items-center justify-center space-x-4">
            <div className="h-px bg-gradient-to-r from-transparent via-green-300 to-transparent flex-1 max-w-32"></div>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <div className="w-1 h-1 bg-green-300 rounded-full"></div>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <div className="h-px bg-gradient-to-r from-transparent via-green-300 to-transparent flex-1 max-w-32"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      {data.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-6">📸</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Belum Ada Foto
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Galeri foto akan muncul di sini setelah admin menambahkan dokumentasi kegiatan desa.
          </p>
          <button 
            onClick={refetch}
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            🔄 Muat Ulang
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentData.map((item) => (
              <GaleriCard
                key={item.id}
                item={item}
                onClick={() => handleImageClick(item)}
              />
            ))}
          </div>

          {/* Empty state untuk pagination */}
          {currentData.length === 0 && data.length > 0 && (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <Images className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Tidak ada foto di halaman ini
              </h3>
              <p className="text-gray-600 mb-4">
                Coba kembali ke halaman sebelumnya atau halaman pertama.
              </p>
              <button
                onClick={() => handlePageChange(1)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Kembali ke Halaman 1
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={data.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                showInfo={true}
              />
            </div>
          )}
        </div>
      )}

      {/* Image Modal */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        image={selectedImage}
      />
    </div>
  )
} 