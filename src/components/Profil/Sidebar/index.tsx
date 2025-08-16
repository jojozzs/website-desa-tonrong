// components/profil/ProfilSidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { HomeIcon, DocumentTextIcon, EyeIcon, MapIcon, UsersIcon, ChartBarIcon, ChevronRightIcon, Bars3Icon, XMarkIcon} from '@heroicons/react/24/outline'

const navigationItems = [
  {
    name: 'Sejarah Desa',
    href: '/profil/sejarah',
    icon: DocumentTextIcon,
    description: 'Sejarah dan perkembangan desa'
  },
  {
    name: 'Visi & Misi',
    href: '/profil/visimisi',
    icon: EyeIcon,
    description: 'Visi, misi dan tujuan desa'
  },
  {
    name: 'Letak Geografis',
    href: '/profil/letak-geografis',
    icon: MapIcon,
    description: 'Lokasi dan kondisi geografis'
  },
  {
    name: 'Struktur Pemerintahan',
    href: '/profil/struktur-pemerintahan',
    icon: UsersIcon,
    description: 'Susunan organisasi pemerintah desa'
  },
  {
    name: 'Data Penduduk',
    href: '/profil/data-penduduk',
    icon: ChartBarIcon,
    description: 'Statistik dan demografi penduduk'
  }
]

export default function ProfilSidebar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === '/profil') {
      return pathname === '/profil'
    }
    return pathname.startsWith(href)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden mb-6">
        <button
          onClick={toggleMobileMenu}
          className="flex items-center space-x-3 w-full p-4 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:cursor-pointer transition-shadow duration-200"
        >
          <div className="w-10 h-10 bg-primary-green rounded-lg flex items-center justify-center">
            <Bars3Icon className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-semibold text-text-primary">Menu Profil Desa</h3>
            <p className="text-xs text-text-muted">Tap untuk membuka navigasi</p>
          </div>
          <ChevronRightIcon className="h-5 w-5 text-gray-400" />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-full lg:w-80 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-primary-green p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <HomeIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Profil Desa</h2>
              <p className="text-white/80 text-sm">Desa Tonrong</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`group block w-full p-4 rounded-xl transition-all duration-200 ${
                      active 
                        ? 'bg-gradient-to-r from-primary-green/10 to-primary-green/10 border-l-4 border-primary-green shadow-sm' 
                        : 'hover:bg-gray-50 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                        active 
                          ? 'bg-primary-green text-white' 
                          : 'bg-gray-100 text-gray-600 group-hover:bg-primary-green group-hover:text-white'
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className={`font-semibold text-sm transition-colors ${
                            active ? 'text-primary-green' : 'text-text-primary group-hover:text-primary-green'
                          }`}>
                            {item.name}
                          </h3>
                          <ChevronRightIcon className={`h-4 w-4 transition-all duration-200 ${
                            active 
                              ? 'text-primary-green translate-x-1' 
                              : 'text-gray-400 group-hover:text-primary-green group-hover:translate-x-1'
                          }`} />
                        </div>
                        <p className="text-xs text-text-muted mt-1 line-clamp-1">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={closeMobileMenu}
          />
          
          {/* Mobile Sidebar */}
          <aside className={`fixed left-0 top-0 bottom-0 w-80 bg-white z-50 lg:hidden transform transition-transform duration-300 shadow-2xl ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
            
            {/* Header */}
            <div className="bg-primary-green p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <HomeIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Profil Desa</h2>
                    <p className="text-white/80 text-sm">Desa Tonrong</p>
                  </div>
                </div>
                <button
                  onClick={closeMobileMenu}
                  className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white hover:bg-white/30 transition-colors hover:cursor-pointer"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="p-4 flex-1 overflow-y-auto">
              <ul className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href)
                  
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={closeMobileMenu}
                        className={`group block w-full p-4 rounded-xl transition-all duration-200 ${
                          active 
                            ? 'bg-gradient-to-r from-primary-green/10 to-primary-green/10 border-l-4 border-primary-green' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                            active 
                              ? 'bg-primary-green text-white' 
                              : 'bg-gray-100 text-gray-600 group-hover:bg-primary-green group-hover:text-white'
                          }`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          
                          <div className="flex-1">
                            <h3 className={`font-semibold text-sm transition-colors ${
                              active ? 'text-primary-green' : 'text-text-primary group-hover:text-primary-green'
                            }`}>
                              {item.name}
                            </h3>
                            <p className="text-xs text-text-muted mt-1">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>

          </aside>
        </>
      )}
    </>
  )
}