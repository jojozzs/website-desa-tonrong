'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useBeritaData } from '@/components/hooks/useBeritaData'
import { LoadingState, ErrorState } from '@/components/Berita/Shared'
import BeritaCard from '@/components/Berita/BeritaCard'
import BeritaListItem from '@/components/Berita/BeritaListItem'
import CategoryTabs from '@/components/Berita/CategoryTabs'
import Pagination from '@/components/Berita/Pagination'
import { BeritaPengumumanKategoriEnum } from '@/lib/enums'
import Link from 'next/link'
import { notFound } from 'next/navigation'

type ViewMode = 'cards' | 'list'

export default function KategoriPage({ params }: { params: Promise<{ kategori: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const kategori = resolvedParams.kategori as BeritaPengumumanKategoriEnum
  const [viewMode, setViewMode] = useState<ViewMode>('cards')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6
  
  // Validate kategori
  if (!Object.values(BeritaPengumumanKategoriEnum).includes(kategori)) {
    notFound()
  }

  // Fetch data berdasarkan kategori dari URL
  const { data, loading, error, refetch } = useBeritaData(kategori)
  
  // Fetch data untuk SEMUA kategori untuk mendapatkan count
  const { data: beritaData } = useBeritaData(BeritaPengumumanKategoriEnum.BERITA)
  const { data: pengumumanData } = useBeritaData(BeritaPengumumanKategoriEnum.PENGUMUMAN)

  const categories = [
    BeritaPengumumanKategoriEnum.BERITA,
    BeritaPengumumanKategoriEnum.PENGUMUMAN
  ]

  const isBerita = kategori === BeritaPengumumanKategoriEnum.BERITA

  // Buat category counts langsung dari data
  const categoryCounts = {
    [BeritaPengumumanKategoriEnum.BERITA]: beritaData?.length || 0,
    [BeritaPengumumanKategoriEnum.PENGUMUMAN]: pengumumanData?.length || 0,
  }

  // Handle kategori change dengan navigation
  const handleCategoryChange = (newCategory: BeritaPengumumanKategoriEnum) => {
    setCurrentPage(1) // Reset pagination
    router.push(`/berita/${newCategory}`)
  }

  // Pagination logic
  const totalPages = Math.ceil(data.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = data.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="space-y-6">
      {/* Header dengan Category Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* Header Info */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
              <span className="mr-3">{isBerita ? '📰' : '📢'}</span>
              {isBerita ? 'Berita Desa' : 'Pengumuman Resmi'}
            </h1>
            <p className="text-gray-600 flex items-center gap-2">
              {isBerita 
                ? 'Informasi kegiatan dan program terbaru dari desa'
                : 'Pengumuman resmi dari pemerintah desa'
              }
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex items-center space-x-2 mt-4 lg:mt-0">
            <span className="text-sm text-gray-500 mr-2">Tampilan:</span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('cards')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  viewMode === 'cards'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span>Cards</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                <span>List</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <CategoryTabs
          categories={categories}
          activeCategory={kategori}
          onChange={handleCategoryChange}
          categoryCounts={categoryCounts} // Pass the dynamic counts
        />
      </div>

      {/* Content Area */}
      <div className="min-h-[400px]">
        {loading ? (
          <LoadingCardsOnly viewMode={viewMode} />
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <ErrorStateInline error={error} onRetry={refetch} />
          </div>
        ) : data.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <EmptyStateCards kategori={kategori} categoryCounts={categoryCounts} />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Content Grid/List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {viewMode === 'cards' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentData.map((item) => (
                    <BeritaCard 
                      key={item.id} 
                      item={{
                        ...item,
                        kategori: item.kategori as BeritaPengumumanKategoriEnum,
                        tanggal: typeof item.tanggal === 'string' ? new Date(item.tanggal) : item.tanggal
                      }} 
                      compact={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {currentData.map((item) => (
                    <BeritaListItem 
                      key={item.id} 
                      item={{
                        ...item,
                        kategori: item.kategori as BeritaPengumumanKategoriEnum,
                        tanggal: typeof item.tanggal === 'string' ? new Date(item.tanggal) : item.tanggal
                      }} 
                    />
                  ))}
                </div>
              )}

              {/* Empty state dalam content area */}
              {currentData.length === 0 && data.length > 0 && (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <svg className="h-16 w-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    Tidak ada hasil di halaman ini
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
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={data.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                showInfo={true}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Loading components dengan design yang lebih compact
function LoadingCardsOnly({ viewMode }: { viewMode: ViewMode }) {
  return (
    <div className="space-y-6">

      {/* Content Loading */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-lg overflow-hidden border border-gray-200">
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-5 bg-gray-200 rounded-full animate-pulse w-16"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded animate-pulse mb-2 w-full"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded animate-pulse mb-2 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20"></div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination Loading */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
          <div className="flex items-center space-x-2">
            <div className="h-10 bg-gray-200 rounded animate-pulse w-20"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse w-10"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse w-10"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse w-10"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse w-20"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ErrorStateInline({ error, onRetry }: { error: string; onRetry?: () => void }) {
  return (
    <div className="text-center py-8">
      <div className="text-red-500 mb-4">
        <svg className="h-16 w-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Gagal Memuat Konten</h3>
      <p className="text-gray-600 mb-4">{error}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          🔄 Coba Lagi
        </button>
      )}
    </div>
  )
}

function EmptyStateCards({ 
  kategori, 
  categoryCounts 
}: { 
  kategori: BeritaPengumumanKategoriEnum;
  categoryCounts: { [key: string]: number };
}) {
  const isBerita = kategori === BeritaPengumumanKategoriEnum.BERITA
  const otherCategory = isBerita 
    ? BeritaPengumumanKategoriEnum.PENGUMUMAN 
    : BeritaPengumumanKategoriEnum.BERITA
  const otherCategoryCount = categoryCounts[otherCategory]
  
  return (
    <div className="text-center py-16">
      <div className="text-6xl mb-6">{isBerita ? '📰' : '📢'}</div>
      <h3 className="text-2xl font-bold text-gray-800 mb-4">
        Belum Ada {isBerita ? 'Berita' : 'Pengumuman'}
      </h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        {isBerita 
          ? 'Berita akan muncul di sini setelah admin menambahkan konten berita.'
          : 'Pengumuman akan muncul di sini setelah admin menambahkan konten pengumuman.'
        }
      </p>
      
      {/* Show info about other category if it has content */}
      {otherCategoryCount > 0 && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg inline-block">
          <p className="text-sm text-gray-600 mb-2">
            Sementara itu, tersedia {otherCategoryCount} {isBerita ? 'pengumuman' : 'berita'}
          </p>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {otherCategoryCount > 0 && (
          <Link 
            href={`/berita/${otherCategory}`}
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            {isBerita ? '📢 Lihat Pengumuman' : '📰 Lihat Berita'} ({otherCategoryCount})
          </Link>
        )}
        <Link 
          href="/"
          className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:border-gray-400 transition-colors"
        >
          🏠 Kembali ke Beranda
        </Link>
      </div>
      
    </div>
  )
}