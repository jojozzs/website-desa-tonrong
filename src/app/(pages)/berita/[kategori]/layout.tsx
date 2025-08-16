'use client'

import { use } from 'react'
import { usePathname } from 'next/navigation'
import Breadcrumb from '@/components/Berita/Breadcrumb'
import { BeritaPengumumanKategoriEnum } from '@/lib/enums'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface KategoriLayoutProps {
  children: React.ReactNode
  params: Promise<{ kategori: string }>
}

export default function KategoriLayout({ children, params }: KategoriLayoutProps) {
  const resolvedParams = use(params)
  const pathname = usePathname()
  const kategori = resolvedParams.kategori

  // Validate kategori
  if (!Object.values(BeritaPengumumanKategoriEnum).includes(kategori as BeritaPengumumanKategoriEnum)) {
    notFound()
  }

  const isDetailPage = pathname.split('/').length > 3 // /berita/kategori/slug

  // Jika detail page, tidak perlu breadcrumb di layout (sudah ada di page)
  if (isDetailPage) {
    return <>{children}</>
  }

  // Untuk halaman kategori, tampilkan breadcrumb
  const getCategoryName = (kat: string) => {
    switch (kat) {
      case BeritaPengumumanKategoriEnum.BERITA:
        return 'Berita'
      case BeritaPengumumanKategoriEnum.PENGUMUMAN:
        return 'Pengumuman'
      default:
        return kat.charAt(0).toUpperCase() + kat.slice(1)
    }
  }

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 md:px-8 lg:px-20 xl:px-40 py-8">
        
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb
            items={[
              { label: "Beranda", href: "/" },
              { label: "Berita & Pengumuman", href: "/berita" },
              { label: getCategoryName(kategori) },
            ]}
          />
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
    <Footer />
    </>
  )
}