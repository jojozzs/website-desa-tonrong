// app/(pages)/berita/[kategori]/[slug]/page.tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BeritaPengumumanKategoriEnum } from '@/lib/enums'
import { generateArticleMetadata } from '@/lib/seo'
import BeritaDetailClient from '@/components/Berita/BeritaDetailClient'

interface BeritaDetailPageProps {
  params: { kategori: string; slug: string }
}

// Fetch berita data untuk metadata
async function getBeritaBySlug(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000'
    
    console.log('Fetching berita with slug:', slug)
    
    const response = await fetch(`${baseUrl}/api/berita-pengumuman?slug=${encodeURIComponent(slug)}`, {
      next: { revalidate: 3600 },
      headers: {
        'User-Agent': 'NextJS-Server',
      }
    })
    
    console.log('Response status:', response.status)
    
    if (!response.ok) {
      console.error('Failed to fetch berita:', response.status, response.statusText)
      return null
    }
    
    const result = await response.json()
    console.log('API result:', { success: result.success, hasData: !!result.data })
    
    return result.success ? result.data : null
  } catch (error) {
    console.error('Error fetching berita for metadata:', error)
    return null
  }
}

export async function generateMetadata(
  { params }: BeritaDetailPageProps
): Promise<Metadata> {
  const { kategori, slug } = params
  
  console.log('generateMetadata called with:', { kategori, slug })
  
  // Validate kategori
  if (!Object.values(BeritaPengumumanKategoriEnum).includes(kategori as BeritaPengumumanKategoriEnum)) {
    console.log('Invalid kategori:', kategori)
    return {
      title: 'Halaman Tidak Ditemukan',
      robots: { index: false, follow: false }
    }
  }

  const berita = await getBeritaBySlug(slug)
  
  if (!berita) {
    console.log('Berita not found for slug:', slug)
    return {
      title: 'Berita Tidak Ditemukan',
      description: 'Berita yang Anda cari tidak ditemukan di Website Desa Tonrong Rijang.',
      robots: { index: false, follow: false }
    }
  }

  console.log('Berita found:', { id: berita.id, judul: berita.judul, kategori: berita.kategori })

  // Validate kategori matches
  if (berita.kategori !== kategori) {
    console.log('Kategori mismatch:', { expected: kategori, actual: berita.kategori })
    return {
      title: 'Halaman Tidak Ditemukan',
      robots: { index: false, follow: false }
    }
  }

  // Extract text from EditorJS content for description
  let description = berita.deskripsi
  if (berita.konten && berita.konten.blocks) {
    const textBlocks = berita.konten.blocks
      .filter((block: any) => ['paragraph', 'header'].includes(block.type))
      .map((block: any) => block.data.text)
      .join(' ')
    
    if (textBlocks.length > 0) {
      description = textBlocks.substring(0, 160) + (textBlocks.length > 160 ? '...' : '')
    }
  }

  const isBerita = berita.kategori === BeritaPengumumanKategoriEnum.BERITA

  return generateArticleMetadata({
    title: berita.judul,
    description,
    image: berita.gambar_url,
    url: `/berita/${kategori}/${slug}`,
    publishedTime: new Date(berita.tanggal).toISOString(),
    modifiedTime: berita.updated_at ? new Date(berita.updated_at).toISOString() : undefined,
    author: berita.penulis,
    category: isBerita ? 'Berita Desa' : 'Pengumuman Resmi',
    tags: [
      berita.kategori,
      'desa tonrong rijang',
      'baranti',
      'sidenreng rappang',
      ...(isBerita ? ['berita desa', 'informasi desa'] : ['pengumuman desa', 'pengumuman resmi'])
    ]
  })
}

// Generate static params untuk artikel yang sering diakses
export async function generateStaticParams() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000'
    
    console.log('Generating static params, fetching from:', `${baseUrl}/api/berita-pengumuman`)
    
    // Fetch semua berita untuk static generation
    const response = await fetch(`${baseUrl}/api/berita-pengumuman`, {
      next: { revalidate: 86400 },
      headers: {
        'User-Agent': 'NextJS-Server',
      }
    })
    
    if (!response.ok) {
      console.error('Failed to fetch berita for static params:', response.status)
      return []
    }
    
    const result = await response.json()
    const beritaList = result.success ? result.data : []
    
    console.log('Fetched berita count:', beritaList.length)
    
    // Generate params untuk 10 artikel terbaru dari setiap kategori
    const beritaParams = beritaList
      .filter((item: any) => item.kategori === BeritaPengumumanKategoriEnum.BERITA)
      .slice(0, 10)
      .map((item: any) => ({
        kategori: BeritaPengumumanKategoriEnum.BERITA,
        slug: item.slug
      }))
    
    const pengumumanParams = beritaList
      .filter((item: any) => item.kategori === BeritaPengumumanKategoriEnum.PENGUMUMAN)
      .slice(0, 10)
      .map((item: any) => ({
        kategori: BeritaPengumumanKategoriEnum.PENGUMUMAN,
        slug: item.slug
      }))
    
    const allParams = [...beritaParams, ...pengumumanParams]
    console.log('Generated static params count:', allParams.length)
    
    return allParams
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

export default function BeritaDetailPage({ params }: BeritaDetailPageProps) {
  const { kategori, slug } = params
  
  console.log('BeritaDetailPage rendered with:', { kategori, slug })
  
  // Validate kategori
  if (!Object.values(BeritaPengumumanKategoriEnum).includes(kategori as BeritaPengumumanKategoriEnum)) {
    console.log('Invalid kategori in page component:', kategori)
    notFound()
  }

  return <BeritaDetailClient kategori={kategori as BeritaPengumumanKategoriEnum} slug={slug} />
}