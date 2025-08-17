'use client'

import { use } from 'react'
import { useBeritaBySlug, useBeritaData } from '@/hooks/useBeritaData'
import { LoadingState, ErrorState } from '@/components/Berita/Shared'
import BeritaCard from '@/components/Berita/BeritaCard'
import Breadcrumb from '@/components/Berita/Breadcrumb'
import EditorJSRenderer from '@/components/EditorJSRenderer'
import Link from 'next/link'
import { BeritaPengumumanKategoriEnum } from '@/lib/enums'
import Image from 'next/image'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import { ArrowLeft } from 'lucide-react'

export default function BeritaDetailPage({ 
  params 
}: { 
  params: Promise<{ kategori: string; slug: string }> 
}) {
  const resolvedParams = use(params)
  const { data: berita, loading, error } = useBeritaBySlug(resolvedParams.slug)
  
  // Fetch related articles dari kategori yang sama
  const { data: relatedArticles } = useBeritaData(resolvedParams.kategori as BeritaPengumumanKategoriEnum)

  if (loading) return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-6 md:px-8 lg:px-20 xl:px-40">
          <LoadingState />
        </div>
      </div>
      <Footer />
    </>
  )

  if (error) return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-6 md:px-8 lg:px-20 xl:px-40">
          <ErrorState error={error} />
        </div>
      </div>
      <Footer />
    </>
  )

  if (!berita) return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-6 md:px-8 lg:px-20 xl:px-40">
          <ErrorState error="Berita tidak ditemukan" />
        </div>
      </div>
      <Footer />
    </>
  )

  // Validate kategori matches
  if (berita.kategori !== resolvedParams.kategori) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="container mx-auto px-6 md:px-8 lg:px-20 xl:px-40">
            <ErrorState error="URL tidak sesuai dengan kategori berita" />
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isBerita = berita.kategori === BeritaPengumumanKategoriEnum.BERITA

  // Filter related articles (exclude current article)
  const filteredRelated = relatedArticles
    .filter(article => article.id !== berita.id)
    .slice(0, 3)

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        
        {/* Header Navigation */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="container mx-auto px-6 md:px-8 lg:px-20 xl:px-40 py-4">
            <Link
              href={`/berita/${berita.kategori}`}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Kembali ke {isBerita ? 'Berita' : 'Pengumuman'}</span>
            </Link>
          </div>
        </header>

        {/* Article Content */}
        <div className="container mx-auto px-6 md:px-8 lg:px-20 xl:px-40 py-8">
          <div className=" mx-auto">
            
            {/* Breadcrumb */}
            <div className="mb-8">
              <Breadcrumb
                items={[
                  { label: "Beranda", href: "/" },
                  { label: "Berita Desa", href: "/berita" },
                  { 
                    label: berita.kategori.charAt(0).toUpperCase() + berita.kategori.slice(1), 
                    href: `/berita/${berita.kategori}` 
                  },
                  { label: berita.judul },
                ]}
              />
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Article Content */}
              <div className="lg:col-span-2">
                <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  
                  {/* Article Header */}
                  <header className="px-6 lg:px-8 pt-6 lg:pt-8 pb-6 border-b border-gray-100">
                    {/* Title */}
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 leading-tight mb-4">
                      {berita.judul}
                    </h1>

                    {/* Category Tag */}
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                      isBerita 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      <span className="mr-2">{isBerita ? '📰' : '📢'}</span>
                      {isBerita ? 'Berita Desa' : 'Pengumuman Resmi'}
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(berita.tanggal)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatTime(berita.tanggal)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {berita.penulis}
                      </span>
                    </div>
                  </header>

                  {/* Featured Image */}
                  <div className="px-6 lg:px-8">
                    <div className="relative rounded-xl overflow-hidden mb-6">
                      <Image 
                        src={berita.gambar_url || '/placeholder-news.jpg'} 
                        alt={berita.judul}
                        width={800}
                        height={400}
                        className="w-full h-64 md:h-80 object-cover"
                        priority
                      />
                    </div>
                  </div>

                  {/* Article Body */}
                  <div className="px-6 lg:px-8 pb-6 lg:pb-8">
                    {/* Main Content dari EditorJS */}
                    {berita.konten && berita.konten.blocks && berita.konten.blocks.length > 0 ? (
                      <EditorJSRenderer 
                        data={berita.konten} 
                        className="mb-6"
                      />
                    ) : berita.deskripsi ? (
                      // Fallback jika tidak ada konten EditorJS, gunakan deskripsi
                      <div className="text-gray-700 leading-relaxed space-y-4 mb-6">
                        {berita.deskripsi.split('\n').map((paragraph, index) => (
                          paragraph.trim() && (
                            <p key={index} className="text-base leading-relaxed">
                              {paragraph.trim()}
                            </p>
                          )
                        ))}
                      </div>
                    ) : (
                      // Jika tidak ada konten sama sekali
                      <div className="text-gray-500 italic mb-6">
                        Konten tidak tersedia
                      </div>
                    )}

                    {/* Info Box berdasarkan kategori */}
                    {isBerita ? (
                      <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg mt-6">
                        <h3 className="font-semibold text-gray-800 mb-2 flex items-center text-sm">
                          <span className="mr-2">ℹ️</span>
                          Informasi Tambahan
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Untuk informasi lebih lanjut mengenai berita ini, Anda dapat menghubungi 
                          Kantor Desa Tonrong Rijang atau mengunjungi langsung balai desa.
                        </p>
                      </div>
                    ) : (
                      <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg mt-6">
                        <h3 className="font-semibold text-orange-800 mb-2 flex items-center text-sm">
                          <span className="mr-2">⚠️</span>
                          Pengumuman Penting
                        </h3>
                        <p className="text-orange-700 text-sm">
                          Pengumuman ini bersifat resmi dan berlaku untuk seluruh warga Desa Tonrong Rijang. 
                          Pastikan untuk mengikuti instruksi yang diberikan.
                        </p>
                      </div>
                    )}
                  </div>
                </article>
              </div>

              {/* Sidebar - Related Articles */}
              <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-6">
                  
                  {/* Related Articles */}
                  {filteredRelated.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                        <span className="mr-2">{isBerita ? '📰' : '📢'}</span>
                        {isBerita ? 'Berita Lainnya' : 'Pengumuman Lainnya'}
                      </h3>
                      <div className="space-y-4">
                        {filteredRelated.map((article) => (
                          <Link 
                            key={article.id} 
                            href={`/berita/${article.kategori}/${article.slug}`}
                            className="block group"
                          >
                            <div className="flex space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="relative w-16 h-16 flex-shrink-0">
                                <Image
                                  src={article.gambar_url}
                                  alt={article.judul}
                                  fill
                                  className="object-cover rounded-lg"
                                  sizes="64px"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-gray-800 group-hover:text-green-600 transition-colors line-clamp-2 mb-1">
                                  {article.judul}
                                </h4>
                                <p className="text-xs text-gray-500">
                                  {formatDate(typeof article.tanggal === 'string' ? new Date(article.tanggal) : article.tanggal)}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <Link 
                          href={`/berita/${berita.kategori}`}
                          className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center"
                        >
                          Lihat Semua {isBerita ? 'Berita' : 'Pengumuman'}
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  )}

                  
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <Link 
                    href={`/berita/${berita.kategori}`}
                    className="flex items-center text-green-600 hover:text-green-700 font-medium group"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Kembali ke {isBerita ? 'Berita' : 'Pengumuman'}
                  </Link>
                  
                  <div className="flex items-center space-x-4">
                    <Link 
                      href={isBerita ? '/berita/pengumuman' : '/berita/berita'}
                      className="text-gray-600 hover:text-gray-800 font-medium"
                    >
                      {isBerita ? '📢 Lihat Pengumuman' : '📰 Lihat Berita'}
                    </Link>
                    <span className="text-gray-300">|</span>
                    <Link 
                      href="/berita"
                      className="text-gray-600 hover:text-gray-800 font-medium"
                    >
                      📚 Semua Berita
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}