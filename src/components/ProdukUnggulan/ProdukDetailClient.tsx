// components/ProdukUnggulan/ProdukDetailClient.tsx
'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { useProdukBySlug } from '@/hooks/useProdukData'
import Image from 'next/image'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Calendar, 
  Building2, 
  MapPin, 
  Phone, 
  Mail,
  Globe,
  AlertCircle,
  ExternalLink,
  Package,
  MessageCircle
} from 'lucide-react'
import EditorJSRenderer from '@/components/EditorJSRenderer'
import { generateAltText } from '@/lib/imageAlt'

interface ProdukDetailClientProps {
  slug: string
}

export default function ProdukDetailClient({ slug }: ProdukDetailClientProps) {
  const { data: produk, loading, error } = useProdukBySlug(slug)

  // Format date
  const formatDate = (date: Date | string) => {
    const d = new Date(date)
    return d.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  // Format contact for WhatsApp
  const formatWhatsAppLink = (contact: string) => {
    const cleaned = contact.replace(/\D/g, '')
    if (cleaned.startsWith('0')) {
      return `https://wa.me/62${cleaned.slice(1)}`
    }
    if (cleaned.startsWith('62')) {
      return `https://wa.me/${cleaned}`
    }
    return `https://wa.me/62${cleaned}`
  }

  // Check if contact is email
  const isEmail = (contact: string) => {
    return contact.includes('@')
  }

  // Check if contact is website
  const isWebsite = (contact: string) => {
    return contact.startsWith('http') || contact.includes('www.')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header Skeleton */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="bg-gray-200 rounded-2xl p-8 mb-8 h-64"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-80 bg-gray-200 rounded-xl mb-6"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
              <div className="h-64 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Produk Tidak Ditemukan
          </h1>
          <p className="text-gray-600 mb-6">
            {error}
          </p>
          <Link
            href="/produk-unggulan"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Daftar Produk
          </Link>
        </div>
      </div>
    )
  }

  if (!produk) {
    return null
  }

  // Generate context-aware alt text
  const imageAlt = generateAltText({
    type: 'produk',
    title: produk.judul,
    description: produk.deskripsi,
    umkmName: produk.nama_umkm
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/produk-unggulan"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Kembali ke Produk Unggulan</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Header */}
        <div className="relative bg-gradient-to-br from-orange-50 via-white to-orange-50 rounded-2xl p-8 mb-8 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-4 left-4 w-16 h-16 border-2 border-orange-400 rounded-full"></div>
            <div className="absolute top-8 right-8 w-8 h-8 bg-orange-300 rounded-full"></div>
            <div className="absolute bottom-6 left-12 w-12 h-12 border border-orange-300 rotate-45"></div>
            <div className="absolute bottom-4 right-16 w-6 h-6 bg-orange-400 rounded-full"></div>
          </div>

          {/* Content */}
          <div className="relative text-center max-w-4xl mx-auto">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-2xl shadow-lg">
                <Package className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 bg-clip-text text-transparent mb-6">
              {produk.judul}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-orange-100 rounded-xl px-4 py-2">
                <Building2 className="w-4 h-4 text-orange-600" />
                <span className="font-semibold text-orange-800">{produk.nama_umkm}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-orange-100 rounded-xl px-4 py-2">
                <Calendar className="w-4 h-4 text-orange-600" />
                <span className="text-orange-800">{formatDate(produk.created_at)}</span>
              </div>
            </div>

            {/* Decorative Line */}
            <div className="flex items-center justify-center space-x-4 mt-6">
              <div className="h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent flex-1 max-w-32"></div>
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <div className="w-1 h-1 bg-orange-300 rounded-full"></div>
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <div className="h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent flex-1 max-w-32"></div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Product Image & Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Image */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white shadow-lg border border-gray-200">
              <Image
                src={produk.gambar_url}
                alt={imageAlt}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 10vw, 66vw"
              />
            </div>

            {/* Product Content */}
            {produk.konten && produk.konten.blocks && produk.konten.blocks.length > 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-2 h-8 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
                  Detail Produk
                </h2>
                <EditorJSRenderer data={produk.konten} />
              </div>
            ) : produk.deskripsi ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-2 h-8 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
                  Detail Produk
                </h2>
                <div className="text-gray-700 leading-relaxed space-y-4">
                  {produk.deskripsi.split('\n').map((paragraph, index) => (
                    paragraph.trim() && (
                      <p key={index} className="text-base leading-relaxed">
                        {paragraph.trim()}
                      </p>
                    )
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-2 h-8 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
                  Detail Produk
                </h2>
                <div className="text-gray-500 italic">
                  Detail produk tidak tersedia
                </div>
              </div>
            )}
          </div>

          {/* Right Column - UMKM Info */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              
              {/* UMKM Contact Card */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-2 h-6 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
                  Informasi UMKM
                </h3>

                <div className="space-y-6">
                  {/* UMKM Name */}
                  <div className="p-4 bg-gradient-to-r from-orange-50 to-green-50 rounded-lg border border-orange-100">
                    <div className="flex items-center gap-3 mb-2">
                      <Building2 className="w-5 h-5 text-orange-600" />
                      <h4 className="font-semibold text-gray-900">Nama UMKM</h4>
                    </div>
                    <p className="text-gray-800 font-medium">{produk.nama_umkm}</p>
                  </div>

                  {/* Address */}
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <MapPin className="w-5 h-5 text-green-600" />
                      <h4 className="font-semibold text-gray-900">Alamat</h4>
                    </div>
                    <p className="text-gray-700 leading-relaxed pl-8">
                      {produk.alamat_umkm}
                    </p>
                  </div>

                  {/* Contact */}
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      {isEmail(produk.kontak_umkm) ? (
                        <Mail className="w-5 h-5 text-green-600" />
                      ) : isWebsite(produk.kontak_umkm) ? (
                        <Globe className="w-5 h-5 text-green-600" />
                      ) : (
                        <Phone className="w-5 h-5 text-green-600" />
                      )}
                      <h4 className="font-semibold text-gray-900">Kontak</h4>
                    </div>
                    
                    <div className="pl-8 space-y-3">
                      <p className="text-gray-700 font-medium break-all">{produk.kontak_umkm}</p>
                      
                      {/* Contact Action Button */}
                      {isEmail(produk.kontak_umkm) ? (
                        <a
                          href={`mailto:${produk.kontak_umkm}`}
                          className="inline-flex items-center gap-3 px-4 py-3 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md w-full justify-center"
                        >
                          <Mail className="w-5 h-5" />
                          Kirim Email
                        </a>
                      ) : isWebsite(produk.kontak_umkm) ? (
                        <a
                          href={produk.kontak_umkm.startsWith('http') ? produk.kontak_umkm : `https://${produk.kontak_umkm}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-3 px-4 py-3 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-md w-full justify-center"
                        >
                          <Globe className="w-5 h-5" />
                          Kunjungi Website
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      ) : (
                        <a
                          href={formatWhatsAppLink(produk.kontak_umkm)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-3 px-4 py-3 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-md w-full justify-center"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.886 3.488"/>
                          </svg>
                          Hubungi via WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}