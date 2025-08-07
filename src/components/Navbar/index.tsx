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
    href: '#', // Tidak redirect, hanya untuk dropdown
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
  { name: 'Website Kabupaten', href:'https://youtube.com'}
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(null)
  const pathname = usePathname()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(path)
  }

  const hasActiveSubMenu = (subMenu: any[]) => {
    return subMenu?.some(item => pathname.startsWith(item.href))
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setActiveDropdown(null)
      }
      
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
        setMobileMenuOpen(false)
        setMobileDropdownOpen(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleDropdownClick = (itemName: string) => {
    setActiveDropdown(activeDropdown === itemName ? null : itemName)
  }

  const toggleMobileDropdown = (itemName: string) => {
    setMobileDropdownOpen(mobileDropdownOpen === itemName ? null : itemName)
  }

  const handleLinkClick = (href: string, hasSubMenu: boolean, itemName: string) => {
    if (hasSubMenu) {
      handleDropdownClick(itemName)
    } else if (href !== '#') {
      setActiveDropdown(null)
    }
  }

  return (
    <header className="bg-nav-bg shadow-sm border-b border-nav-border sticky top-0 z-50 h-25 justify-center items-center">
      <nav className="w-full mx-auto px-6 sm:px-8 lg:px-12 h-full flex items-center justify-between relative" ref={mobileMenuRef}>
        <div className="flex justify-between items-center h-16 w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-11 h-11 bg-gradient-to-r from-primary-orange to-primary-green rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">DT</span>
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-text-primary">Desa Tonrong</h1>
              <p className="text-sm text-text-muted hidden sm:block">Sistem Informasi Desa</p>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-8 text-md" ref={dropdownRef}>
            {navigation.map((item) => (
              <div 
                key={item.name} 
                className="relative"
              >
                {item.subMenu ? (
                  <button
                    onClick={() => handleDropdownClick(item.name)}
                    className={`flex items-center space-x-1 font-medium transition-colors duration-200 py-2 px-1 ${
                      hasActiveSubMenu(item.subMenu || []) || activeDropdown === item.name
                        ? 'text-nav-active border-b-2 border-nav-active pb-1'
                        : 'text-nav-default hover:text-nav-hover'
                    }`}
                  >
                    <span>{item.name}</span>
                    <ChevronDownIcon 
                      className={`h-4 w-4 transition-transform duration-200 ${
                        activeDropdown === item.name ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : '_self'}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : ''}
                    className={`flex items-center space-x-1 font-medium transition-colors duration-200 py-2 px-1 ${
                      isActive(item.href)
                        ? 'text-nav-active border-b-2 border-nav-active pb-1'
                        : 'text-nav-default hover:text-nav-hover'
                    }`}
                    onClick={() => setActiveDropdown(null)}
                  >
                    <span>{item.name}</span>
                    {item.href.startsWith('http') && (
                      <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    )}
                  </Link>
                )}
                
                {/* Desktop Dropdown */}
                {item.subMenu && activeDropdown === item.name && (
                  <div className="absolute left-0 mt-1 w-56 bg-dropdown-bg rounded-lg shadow-lg border border-dropdown-border py-2 z-50">
                    {item.subMenu.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className={`block px-4 py-3 text-sm transition-colors duration-150 ${
                          pathname === subItem.href
                            ? 'text-nav-active bg-dropdown-active border-l-4 border-nav-active font-medium'
                            : 'text-text-secondary hover:text-nav-hover hover:bg-dropdown-hover'
                        }`}
                        onClick={() => setActiveDropdown(null)}
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
          <div className="lg:hidden absolute top-full left-0 right-0 border-t border-nav-border bg-nav-bg shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <div key={item.name}>
                  <div className="flex items-center justify-between">
                    {item.subMenu ? (
                      <button
                        className={`flex-1 px-3 py-3 rounded-md text-base font-medium transition-colors duration-200 text-left ${
                          hasActiveSubMenu(item.subMenu || [])
                            ? 'text-nav-active bg-dropdown-active'
                            : 'text-nav-default hover:text-nav-hover hover:bg-bg-gray-soft'
                        }`}
                        onClick={() => toggleMobileDropdown(item.name)}
                      >
                        {item.name}
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        target={item.href.startsWith('http') ? '_blank' : '_self'}
                        rel={item.href.startsWith('http') ? 'noopener noreferrer' : ''}
                        className={`flex-1 px-3 py-3 rounded-md text-base font-medium transition-colors duration-200 ${
                          isActive(item.href)
                            ? 'text-nav-active bg-dropdown-active'
                            : 'text-nav-default hover:text-nav-hover hover:bg-bg-gray-soft'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span>{item.name}</span>
                        {item.href.startsWith('http') && (
                          <svg className="w-4 h-4 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        )}
                      </Link>
                    )}
                    
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