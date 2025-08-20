import Image from "next/image";
import Link from "next/link";
import { Calendar, User, Clock } from "lucide-react";
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

interface BeritaCardProps {
  item: BeritaItem;
  compact?: boolean;
}

export default function BeritaCard({ item, compact = false }: BeritaCardProps) {
  const href = `/berita/${item.kategori}/${item.slug}`;
  const isBerita = item.kategori === BeritaPengumumanKategoriEnum.BERITA;

  // Extract text preview from EditorJS content, fallback to deskripsi
  const contentPreview = item.konten 
    ? extractTextFromEditorJS(item.konten)
    : item.deskripsi

  return (
    <Link href={href} className="block group h-full">
      <article className="h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl hover:border-green-200 transition-all duration-300 flex flex-col transform hover:-translate-y-1">
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
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white backdrop-blur-sm ${
              isBerita 
                ? 'bg-green-600/90' 
                : 'bg-orange-600/90'
            }`}>
              {isBerita ? 'Berita' : 'Pengumuman'}
            </span>
          </div>

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Content - Flex grow to fill remaining space */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Date and Time Ago - Fixed height */}
          <div className="flex items-center justify-between mb-3 text-xs text-gray-500 h-4">
            <span className="flex items-center">
              <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
              {formatIDDate(item.tanggal)}
            </span>
            <span className="flex items-center">
              <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
              {timeAgo(item.tanggal)}
            </span>
          </div>

          {/* Title - Fixed height with line clamp */}
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors min-h-[3.5rem] flex items-start">
            {item.judul}
          </h3>

          {/* Content Preview - Fixed height with line clamp */}
          <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed min-h-[4.5rem] flex-grow">
            {contentPreview || 'Tidak ada konten preview tersedia'}
          </p>

          {/* Footer - Always at bottom */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
            <span className="flex items-center text-xs text-gray-500 truncate mr-2">
              <User className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="truncate">{item.penulis}</span>
            </span>
            <span className="text-green-600 text-xs font-medium group-hover:text-green-700 flex items-center whitespace-nowrap">
              Baca Selengkapnya 
              <svg className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}