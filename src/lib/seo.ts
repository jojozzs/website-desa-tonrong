// lib/seo.ts
import { Metadata } from 'next'

export const SITE_CONFIG = {
  name: 'Website Desa Tonrong Rijang',
  domain: 'tonrongrijang.desa.id',
  baseUrl: 'https://tonrongrijang.desa.id',
  description: 'Website resmi Desa Tonrong Rijang, Kecamatan Baranti, Kabupaten Sidenreng Rappang, Sulawesi Selatan untuk informasi berita, pengumuman, profil desa, galeri, dan produk UMKM.',
  keywords: [
    'desa tonrong rijang',
    'website desa',
    'baranti',
    'sidenreng rappang',
    'sulawesi selatan',
    'berita desa',
    'pengumuman desa',
    'produk umkm',
    'profil desa',
    'galeri desa'
  ],
  social: {
    twitter: '@desatonrongrijang',
    facebook: 'desa.tonrong.rijang'
  }
}

interface GenerateMetadataOptions {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
  section?: string
  tags?: string[]
  noIndex?: boolean
}

export function generateSiteMetadata(options: GenerateMetadataOptions = {}): Metadata {
  const {
    title,
    description = SITE_CONFIG.description,
    keywords = [],
    image = '/images/og-default.png',
    url = '',
    type = 'website',
    publishedTime,
    modifiedTime,
    authors = [],
    section,
    tags = [],
    noIndex = false
  } = options

  const fullTitle = title 
    ? `${title} | ${SITE_CONFIG.name}`
    : SITE_CONFIG.name

  const fullUrl = `${SITE_CONFIG.baseUrl}${url}`
  const fullImageUrl = image.startsWith('http') 
    ? image 
    : `${SITE_CONFIG.baseUrl}${image}`

  const allKeywords = [
    ...SITE_CONFIG.keywords,
    ...keywords,
    ...tags
  ].filter(Boolean)

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: allKeywords,
    authors: authors.map(name => ({ name })),
    creator: 'Pemerintah Desa Tonrong Rijang',
    publisher: 'Desa Tonrong Rijang',
    metadataBase: new URL(SITE_CONFIG.baseUrl),
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: fullUrl,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title || SITE_CONFIG.name,
        },
      ],
      locale: 'id_ID',
      type,
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors,
        section,
        tags,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      creator: SITE_CONFIG.social.twitter,
      images: [fullImageUrl],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }

  return metadata
}

// Helper untuk artikel/berita
export function generateArticleMetadata(options: {
  title: string
  description: string
  image?: string
  url: string
  publishedTime: string
  modifiedTime?: string
  author: string
  category: string
  tags?: string[]
}): Metadata {
  return generateSiteMetadata({
    ...options,
    type: 'article',
    authors: [options.author],
    section: options.category,
    keywords: [
      options.category,
      'desa tonrong rijang',
      ...(options.tags || [])
    ]
  })
}

// Helper untuk halaman profil
export function generateProfilMetadata(options: {
  title: string
  description: string
  category: string
  image?: string
  url: string
}): Metadata {
  return generateSiteMetadata({
    ...options,
    keywords: [
      'profil desa',
      options.category,
      'desa tonrong rijang',
      'baranti',
      'sidenreng rappang'
    ]
  })
}

// Helper untuk produk UMKM
export function generateProdukMetadata(options: {
  title: string
  description: string
  image?: string
  url: string
  umkmName: string
}): Metadata {
  return generateSiteMetadata({
    ...options,
    keywords: [
      'produk umkm',
      'usaha desa',
      options.umkmName,
      'desa tonrong rijang',
      'produk lokal'
    ]
  })
}

// Helper untuk galeri
export function generateGaleriMetadata(): Metadata {
  return generateSiteMetadata({
    title: 'Galeri Foto Kegiatan Desa',
    description: 'Dokumentasi foto kegiatan dan momen penting Desa Tonrong Rijang dalam pembangunan dan kemajuan desa.',
    url: '/galeri',
    keywords: [
      'galeri desa',
      'foto kegiatan',
      'dokumentasi desa',
      'aktivitas desa'
    ]
  })
}

// Helper untuk kontak & aspirasi
export function generateKontakMetadata(): Metadata {
  return generateSiteMetadata({
    title: 'Kontak & Aspirasi Warga',
    description: 'Hubungi Pemerintah Desa Tonrong Rijang atau sampaikan aspirasi Anda untuk kemajuan dan pembangunan desa.',
    url: '/kontak-aspirasi',
    keywords: [
      'kontak desa',
      'aspirasi warga',
      'pengaduan',
      'saran desa',
      'komunikasi desa'
    ]
  })
}