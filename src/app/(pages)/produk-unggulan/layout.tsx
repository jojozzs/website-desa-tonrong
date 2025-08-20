// app/(pages)/produk-unggulan/layout.tsx
import { Metadata } from 'next'
import React from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { generateSiteMetadata } from '@/lib/seo'

export const metadata: Metadata = generateSiteMetadata({
  title: 'Produk Unggulan UMKM',
  description: 'Temukan berbagai produk unggulan dari UMKM Desa Tonrong Rijang yang berkualitas dan inovatif. Dukung ekonomi lokal dengan membeli produk buatan warga desa.',
  url: '/produk-unggulan',
  keywords: [
    'produk umkm',
    'usaha mikro',
    'ekonomi desa',
    'produk lokal',
    'umkm desa',
    'produk unggulan',
    'ekonomi kreatif',
    'usaha warga'
  ],
  type: 'website'
})

interface ProdukUnggulanLayoutProps {
  children: React.ReactNode
}

export default function ProdukUnggulanLayout({ children }: ProdukUnggulanLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}