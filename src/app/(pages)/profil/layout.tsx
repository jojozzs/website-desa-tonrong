// app/(pages)/profil/layout.tsx
import { Metadata } from 'next'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import ProfilSidebar from '@/components/Profil/Sidebar'
import { generateSiteMetadata } from '@/lib/seo'

export const metadata: Metadata = generateSiteMetadata({
  title: 'Profil Desa Tonrong Rijang',
  description: 'Profil lengkap Desa Tonrong Rijang meliputi sejarah, visi misi, struktur pemerintahan, letak geografis, dan data demografi penduduk.',
  url: '/profil',
  keywords: [
    'profil desa',
    'sejarah desa',
    'visi misi desa',
    'struktur pemerintahan',
    'letak geografis',
    'data penduduk',
    'demografi desa',
    'pemerintahan desa'
  ],
  type: 'website'
})

export default function ProfilLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gray-50">
        
      <div className="container mx-auto px-6 md:px-8 lg:px-20 xl:px-40 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-30">
              <ProfilSidebar />
            </div>
          </div>
          
          {/* Main Content */}
          <main className="lg:col-span-3 lg:ml-10 xl:ml-10">
            {children}
          </main>
        </div>
      </div>
    </div>
    <Footer />
    </>
  )
}