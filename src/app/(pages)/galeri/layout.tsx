'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface GaleriLayoutProps {
  children: React.ReactNode
}

export default function GaleriLayout({ children }: GaleriLayoutProps) {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 md:px-8 lg:px-20 xl:px-40 py-8 pb-30">
          {/* Content */}
          {children}
        </div>
      </div>
      <Footer />
    </>
  )
}