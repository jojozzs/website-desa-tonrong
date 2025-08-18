// app/(pages)/berita/[kategori]/layout.tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BeritaPengumumanKategoriEnum } from '@/lib/enums'
import { generateSiteMetadata } from '@/lib/seo'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Berita/Breadcrumb'

interface KategoriLayoutProps {
  children: React.ReactNode
  params: { kategori: string }
}

// Validate kategori di server component
function validateKategori(kategori: string): kategori is BeritaPengumumanKategoriEnum {
  return Object.values(BeritaPengumumanKategoriEnum).includes(kategori as BeritaPengumumanKategoriEnum)
}

function getCategoryInfo(kategori: BeritaPengumumanKategoriEnum) {
  switch (kategori) {
    case BeritaPengumumanKategoriEnum.BERITA:
      return {
        name: 'Berita Desa',
        description: 'Kumpulan berita terbaru dari Desa Tonrong Rijang, informasi kegiatan, program pembangunan, dan berbagai aktivitas masyarakat desa.',
        keywords: ['berita desa', 'informasi desa', 'kegiatan desa', 'program desa']
      }
    case BeritaPengumumanKategoriEnum.PENGUMUMAN:
      return {
        name: 'Pengumuman Resmi',
        description: 'Pengumuman resmi dari Pemerintah Desa Tonrong Rijang terkait kebijakan, program, dan informasi penting untuk warga.',
        keywords: ['pengumuman desa', 'pengumuman resmi', 'kebijakan desa', 'info penting']
      }
    default:
      return {
        name: 'Berita & Pengumuman',
        description: 'Informasi berita dan pengumuman Desa Tonrong Rijang',
        keywords: ['berita', 'pengumuman']
      }
  }
}

export async function generateMetadata(
  { params }: { params: { kategori: string } }
): Promise<Metadata> {
  const kategori = params.kategori
  
  if (!validateKategori(kategori)) {
    return generateSiteMetadata({
      title: 'Halaman Tidak Ditemukan',
      description: 'Halaman yang Anda cari tidak ditemukan.',
      noIndex: true
    })
  }
  
  const categoryInfo = getCategoryInfo(kategori)
  
  return generateSiteMetadata({
    title: categoryInfo.name,
    description: categoryInfo.description,
    url: `/berita/${kategori}`,
    keywords: categoryInfo.keywords,
    type: 'website'
  })
}

export default function KategoriLayout({ children, params }: KategoriLayoutProps) {
  const kategori = params.kategori
  
  // Validate kategori
  if (!validateKategori(kategori)) {
    notFound()
  }
  
  const categoryInfo = getCategoryInfo(kategori)

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="flex-1">
          {/* Content */}
          {children}
        </div>
      </div>
      <Footer />
    </>
  )
}