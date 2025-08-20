// app/(pages)/produk-unggulan/[slug]/page.tsx  

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { generateProdukMetadata } from '@/lib/seo'
import ProdukDetailClient from '@/components/ProdukUnggulan/ProdukDetailClient'

interface ProdukDetailPageProps {
  params: { slug: string }
}

// Fetch produk data untuk metadata
async function getProdukBySlug(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/produk-unggulan?slug=${slug}`, {
      next: { revalidate: 3600 } // Revalidate every hour
    })
    
    if (!response.ok) {
      return null
    }
    
    const result = await response.json()
    return result.success ? result.data : null
  } catch (error) {
    console.error('Error fetching produk for metadata:', error)
    return null
  }
}

export async function generateMetadata(
  { params }: ProdukDetailPageProps
): Promise<Metadata> {
  const { slug } = params
  
  const produk = await getProdukBySlug(slug)
  
  if (!produk) {
    return {
      title: 'Produk Tidak Ditemukan',
      description: 'Produk UMKM yang Anda cari tidak ditemukan di Website Desa Tonrong Rijang.',
      robots: { index: false, follow: false }
    }
  }

  // Extract text from EditorJS content for description
  let description = produk.deskripsi || 'Produk unggulan UMKM dari Desa Tonrong Rijang'
  
  if (produk.konten && produk.konten.blocks) {
    const textBlocks = produk.konten.blocks
      .filter((block: any) => ['paragraph', 'header'].includes(block.type))
      .map((block: any) => block.data.text || '')
      .join(' ')
    
    if (textBlocks.length > 0) {
      description = textBlocks.substring(0, 160) + (textBlocks.length > 160 ? '...' : '')
    }
  }

  return generateProdukMetadata({
    title: produk.judul,
    description,
    image: produk.gambar_url,
    url: `/produk-unggulan/${slug}`,
    umkmName: produk.nama_umkm
  })
}

// Generate static params untuk produk yang populer
export async function generateStaticParams() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/produk-unggulan`, {
      next: { revalidate: 86400 } // Revalidate every 24 hours
    })
    
    if (!response.ok) {
      return []
    }
    
    const result = await response.json()
    const produkList = result.success ? result.data : []
    
    // Generate params untuk 15 produk terbaru
    return produkList
      .slice(0, 15)
      .map((item: any) => ({
        slug: item.slug
      }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

export default function ProdukDetailPage({ params }: ProdukDetailPageProps) {
  return <ProdukDetailClient slug={params.slug} />
}
