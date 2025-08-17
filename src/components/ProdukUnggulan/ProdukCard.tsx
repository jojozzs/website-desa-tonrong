// src/components/ProdukUnggulan/ProdukCard.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Building2, Calendar } from 'lucide-react';
import type { OutputData } from "@editorjs/editorjs";

interface ProdukItem {
  id: string
  judul: string
  deskripsi: string
  konten?: OutputData
  nama_umkm: string
  alamat_umkm: string
  kontak_umkm: string
  slug: string
  gambar_url: string
  created_at: Date | string
}

interface ProdukCardProps {
  item: ProdukItem;
}

// Helper function untuk extract text dari EditorJS content
function extractTextFromEditorJS(data: OutputData): string {
  if (!data || !data.blocks) return ''
  
  let text = ''
  for (const block of data.blocks) {
    switch (block.type) {
      case 'paragraph':
        text += block.data.text + ' '
        break
      case 'header':
        text += block.data.text + ' '
        break
      case 'list':
        if (block.data.items) {
          for (const item of block.data.items) {
            if (typeof item === 'string') {
              text += item + ' '
            } else if (item.content) {
              text += item.content + ' '
            }
          }
        }
        break
      case 'quote':
        text += block.data.text + ' '
        break
    }
  }
  
  return text.trim()
}

export default function ProdukCard({ item }: ProdukCardProps) {
  const href = `/produk-unggulan/${item.slug}`;

  // Format tanggal
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Truncate text
  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength).trim() + '...';
  };

  // Extract content preview from EditorJS content, fallback to deskripsi
  const contentPreview = item.konten 
    ? extractTextFromEditorJS(item.konten)
    : item.deskripsi

  return (
    <Link href={href} className="block group h-full">
      <article className="h-full bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl hover:border-orange-200 transition-all duration-300 flex flex-col transform hover:-translate-y-1">
        
        {/* Image - Fixed height */}
        <div className="relative h-48 overflow-hidden flex-shrink-0">
          <Image
            src={item.gambar_url}
            alt={item.judul}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white backdrop-blur-sm bg-orange-600/90">
              <span className="mr-1">🏪</span>
              Produk UMKM
            </span>
          </div>

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Content - Fixed structure */}
        <div className="p-5 flex flex-col flex-grow">
          
          {/* Title - Fixed height */}
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors mb-3 min-h-[3.5rem] flex items-start">
            {item.judul}
          </h3>

          {/* Content Preview - Fixed height */}
          <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed min-h-[4rem]">
            {truncateText(contentPreview || 'Tidak ada konten preview tersedia')}
          </p>

          {/* UMKM Info - Fixed structure */}
          <div className="space-y-3 mb-4 flex-grow">
            {/* UMKM Name */}
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
              <Building2 className="w-4 h-4 text-orange-600 flex-shrink-0" />
              <p className="text-sm font-semibold text-gray-900 line-clamp-1">{item.nama_umkm}</p>
            </div>

            {/* Address */}
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
              <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">{item.alamat_umkm}</p>
            </div>

            {/* Contact */}
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <p className="text-sm text-gray-700 truncate">{item.kontak_umkm}</p>
            </div>
          </div>

          {/* Footer - Always at bottom */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              <time dateTime={new Date(item.created_at).toISOString()}>
                {formatDate(item.created_at)}
              </time>
            </div>
            <span className="text-orange-600 text-sm font-semibold group-hover:text-orange-700 flex items-center whitespace-nowrap">
              Lihat Detail
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}