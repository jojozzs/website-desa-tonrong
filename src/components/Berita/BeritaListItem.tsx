import Image from "next/image";
import Link from "next/link";
import { Calendar, User, Clock, Tag } from "lucide-react";
import { BeritaPengumumanKategoriEnum } from "@/lib/enums";
import type { OutputData } from "@editorjs/editorjs";

interface BeritaItem {
  id: string;
  judul: string;
  deskripsi: string;
  konten?: OutputData;
  tanggal: Date;
  penulis: string;
  kategori: BeritaPengumumanKategoriEnum;
  slug: string;
  gambar_url: string;
}

function formatIDDate(d: Date) {
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function timeAgo(date: Date) {
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) return '1 hari lalu'
  if (diffDays < 7) return `${diffDays} hari lalu`
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} minggu lalu`
  if (diffDays < 365) return `${Math.ceil(diffDays / 30)} bulan lalu`
  return `${Math.ceil(diffDays / 365)} tahun lalu`
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

interface BeritaListItemProps {
  item: BeritaItem;
}

export default function BeritaListItem({ item }: BeritaListItemProps) {
  const href = `/berita/${item.kategori}/${item.slug}`;
  const isBerita = item.kategori === BeritaPengumumanKategoriEnum.BERITA;

  // Extract text preview from EditorJS content, fallback to deskripsi
  const contentPreview = item.konten 
    ? extractTextFromEditorJS(item.konten)
    : item.deskripsi

  return (
    <Link href={href} className="block group">
      <article className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 p-4 border border-gray-100 rounded-xl hover:border-green-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white">
        
        {/* Thumbnail */}
        <div className="relative w-full sm:w-20 h-48 sm:h-20 flex-shrink-0 overflow-hidden rounded-lg">
          <Image
            src={item.gambar_url}
            alt={item.judul}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, 80px"
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 w-full">
          {/* Header untuk mobile */}
          <div className="flex items-center justify-between mb-2 sm:hidden">
            <span className="text-xs text-gray-500 flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {formatIDDate(item.tanggal)}
            </span>
            <span className="text-xs text-gray-500 flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {timeAgo(item.tanggal)}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2 mb-2">
            {item.judul}
          </h3>

          {/* Content Preview */}
          <p className="text-gray-600 text-sm line-clamp-2 sm:line-clamp-1 mb-3 leading-relaxed">
            {contentPreview || 'Tidak ada konten preview tersedia'}
          </p>

          {/* Meta Info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center space-x-3 text-xs text-gray-500">
              {/* Desktop meta info */}
              <span className="hidden sm:flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {formatIDDate(item.tanggal)}
              </span>
              <span className="flex items-center">
                <User className="w-3 h-3 mr-1" />
                {item.penulis}
              </span>
              <span className="hidden sm:flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {timeAgo(item.tanggal)}
              </span>
              {/* Category Badge di meta info */}
              <span className="flex items-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  isBerita 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {isBerita ? 'Berita' : 'Pengumuman'}
                </span>
              </span>
            </div>

            {/* Arrow */}
            <span className="text-green-600 text-sm font-semibold group-hover:text-green-700 flex items-center whitespace-nowrap ml-auto">
              Baca Selengkapnya
              <svg 
                className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-all duration-200" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}