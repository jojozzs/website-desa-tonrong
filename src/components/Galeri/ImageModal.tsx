'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { X, Calendar, Download, Share2 } from 'lucide-react'

interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  image: {
    id: string
    judul: string
    deskripsi: string
    gambar_url: string
    created_at: Date | string
  } | null
}

function formatIDDate(d: Date | string) {
  const date = typeof d === 'string' ? new Date(d) : d
  return date.toLocaleDateString("id-ID", {
    weekday: 'long',
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function ImageModal({ isOpen, onClose, image }: ImageModalProps) {
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setImageLoaded(false)
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen || !image) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full h-full max-w-7xl max-h-screen p-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 z-10">
          <div className="flex-1">
            <h2 className="text-white text-xl font-semibold mb-1 line-clamp-1">
              {image.judul}
            </h2>
            <p className="text-gray-300 text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatIDDate(image.created_at)}
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors duration-200"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Image Container */}
        <div className="flex-1 relative flex items-center justify-center">
          {/* Loading skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-4 bg-gray-700 animate-pulse rounded-lg" />
          )}
          
          <div className="relative w-full h-full">
            <Image
              src={image.gambar_url}
              alt={image.judul}
              fill
              className={`object-contain transition-opacity duration-500 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              sizes="100vw"
              onLoadingComplete={() => setImageLoaded(true)}
              priority
            />
          </div>
        </div>
        
        {/* Description */}
        {image.deskripsi && (
          <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <p className="text-white text-sm leading-relaxed">
              {image.deskripsi}
            </p>
          </div>
        )}
        
        {/* Instructions */}
        <div className="mt-2 text-center">
          <p className="text-gray-400 text-xs">
            Tekan <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs">Esc</kbd> atau klik di luar gambar untuk menutup
          </p>
        </div>
      </div>
    </div>
  )
}