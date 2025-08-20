// app/(pages)/kontak-aspirasi/layout.tsx
import { Metadata } from 'next'
import { generateKontakMetadata } from '@/lib/seo'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'

interface KontakAspirasiLayoutProps {
  children: React.ReactNode
}

export const metadata: Metadata = generateKontakMetadata()

export default function KontakAspirasiLayout({ children }: KontakAspirasiLayoutProps) {
  return (
    <>
      <Navbar />
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-gray-light)' }}>
        {children}
      </div>
      <Footer />
    </>
  )
}