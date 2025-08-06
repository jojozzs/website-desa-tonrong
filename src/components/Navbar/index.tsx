// components/Navbar.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Beranda', href: '/' },
  { 
    name: 'Profil', 
    href: '/profil',
    subMenu: [
      { name: 'Sejarah Desa', href: '/profil/sejarah' },
      { name: 'Letak Geografis', href: '/profil/geografis' },
      { name: 'Visi & Misi', href: '/profil/visi-misi' },
      { name: 'Struktur Pemerintahan', href: '/profil/struktur' },
      { name: 'Data Penduduk', href: '/profil/data-penduduk' },
    ]
  },
  { name: 'Berita', href: '/berita' },
  { name: 'Galeri', href: '/galeri' },
  { name: 'UMKM', href: '/produk-unggulan' },
  { name: 'Kontak', href: '/kontak-aspirasi' },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(null)
  const pathname = usePathname()
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(path)
  }

  const hasActiveSubMenu = (subMenu: any[]) => {
    return subMenu?.some(item => pathname.startsWith(item.href))
  }

  const handleMouseEnter = (itemName: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current)
    }
    setActiveDropdown(itemName)
  }

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 200) // 200ms delay before closing
  }

  const handleDropdownMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current)
    }
  }

  const handleDropdownMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 200)
  }

  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current)
      }
    }
  }, [])

  const toggleMobileDropdown = (itemName: string) => {
    setMobileDropdownOpen(mobileDropdownOpen === itemName ? null : itemName)
  }

  return (
    <header className="bg-nav-bg shadow-sm border-b border-nav-border sticky top-0 z-50 ">
      <nav className="max-w-full mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-11 h-11 bg-gradient-to-r from-primary-orange to-primary-green rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">DT</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-text-primary">Desa Tonrong</h1>
              <p className="text-xs text-text-muted hidden sm:block">Sistem Informasi Desa</p>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-8">
            {navigation.map((item) => (
              <div 
                key={item.name} 
                className="relative"
                onMouseEnter={() => item.subMenu && handleMouseEnter(item.name)}
                onMouseLeave={() => item.subMenu && handleMouseLeave()}
              >
                <Link
                  href={item.href}
                  className={`flex items-center space-x-1 font-medium transition-colors duration-200 py-2 px-1 ${
                    isActive(item.href) || hasActiveSubMenu(item.subMenu || [])
                      ? 'text-nav-active border-b-2 border-nav-active pb-1'
                      : 'text-nav-default hover:text-nav-hover'
                  }`}
                >
                  <span>{item.name}</span>
                  {item.subMenu && (
                    <ChevronDownIcon 
                      className={`h-4 w-4 transition-transform duration-200 ${
                        activeDropdown === item.name ? 'rotate-180' : ''
                      }`} 
                    />
                  )}
                </Link>
                
                {/* Desktop Dropdown */}
                {item.subMenu && activeDropdown === item.name && (
                  <div 
                    className="absolute left-0 mt-1 w-56 bg-dropdown-bg rounded-lg shadow-lg border border-dropdown-border py-2 z-50"
                    onMouseEnter={handleDropdownMouseEnter}
                    onMouseLeave={handleDropdownMouseLeave}
                  >
                    {item.subMenu.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className={`block px-4 py-3 text-sm transition-colors duration-150 ${
                          pathname === subItem.href
                            ? 'text-nav-active bg-dropdown-active border-l-4 border-nav-active font-medium'
                            : 'text-text-secondary hover:text-nav-hover hover:bg-dropdown-hover'
                        }`}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              type="button"
              className="text-text-muted hover:text-text-secondary p-2 rounded-md hover:bg-bg-gray-soft transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-nav-border bg-nav-bg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <div key={item.name}>
                  <div className="flex items-center justify-between">
                    <Link
                      href={item.href}
                      className={`flex-1 px-3 py-3 rounded-md text-base font-medium transition-colors duration-200 ${
                        isActive(item.href) || hasActiveSubMenu(item.subMenu || [])
                          ? 'text-nav-active bg-dropdown-active'
                          : 'text-nav-default hover:text-nav-hover hover:bg-bg-gray-soft'
                      }`}
                      onClick={() => !item.subMenu && setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                    
                    {item.subMenu && (
                      <button
                        className="px-3 py-3 text-text-light hover:text-nav-hover"
                        onClick={() => toggleMobileDropdown(item.name)}
                      >
                        <ChevronDownIcon 
                          className={`h-5 w-5 transition-transform duration-200 ${
                            mobileDropdownOpen === item.name ? 'rotate-180' : ''
                          }`} 
                        />
                      </button>
                    )}
                  </div>
                  
                  {/* Mobile Submenu */}
                  {item.subMenu && mobileDropdownOpen === item.name && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.subMenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className={`block px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                            pathname === subItem.href
                              ? 'text-nav-active bg-dropdown-active font-medium border-l-4 border-nav-active'
                              : 'text-text-muted hover:text-nav-hover hover:bg-dropdown-hover'
                          }`}
                          onClick={() => {
                            setMobileMenuOpen(false)
                            setMobileDropdownOpen(null)
                          }}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}