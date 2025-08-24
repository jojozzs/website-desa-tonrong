import Image from "next/image";
import Link from "next/link";
import { Calendar, User, Clock, ArrowRight } from "lucide-react";
import { BeritaPengumumanKategoriEnum } from "@/lib/enums";
import type { OutputData } from "@editorjs/editorjs";
import { useState } from "react";

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
  const [isHovered, setIsHovered] = useState(false);
  const href = `/berita/${item.kategori}/${item.slug}`;
  const isBerita = item.kategori === BeritaPengumumanKategoriEnum.BERITA;

  // Extract text preview from EditorJS content, fallback to deskripsi
  const contentPreview = item.konten 
    ? extractTextFromEditorJS(item.konten)
    : item.deskripsi

  return (
    <Link href={href} className="block">
      <article 
        onMouseEnter={() => setIsHovered(true)} 
        onMouseLeave={() => setIsHovered(false)}
        className={`group cursor-pointer transition-all duration-500 transform h-full ${
          isHovered ? 'scale-105 -translate-y-2' : 'scale-100'
        }`}
      >
        <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 h-full flex flex-col">
          {/* Image Section */}
          <div className="relative overflow-hidden flex-shrink-0">
            <div className="w-full aspect-[16/10] relative">
              <Image
                src={item.gambar_url}
                alt={item.judul}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              
              {/* Overlay on hover */}
              <div className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}></div>
            </div>
            
            {/* Category Badge */}
            <div className={`absolute top-4 left-4 text-white text-xs font-semibold px-3 py-2 rounded-full shadow-lg ${
              isBerita 
                ? 'bg-green-500' 
                : 'bg-orange-500'
            }`}>
              {isBerita ? 'Berita' : 'Pengumuman'}
            </div>
          </div>

          {/* Content Section */}
          <div className="flex flex-col p-6 gap-1 flex-grow">
            {/* Title */}
            <h3 className={`text-xl font-bold text-gray-900 mb-3 leading-tight line-clamp-2 transition-colors duration-300 ${
              isBerita ? 'group-hover:text-green-600' : 'group-hover:text-orange-600'
            }`}>
              {item.judul}
            </h3>
            
            {/* Content Preview */}
            <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
              {contentPreview || 'Tidak ada konten preview tersedia'}
            </p>
            
            {/* Meta Information */}
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2 mt-auto">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatIDDate(item.tanggal)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{timeAgo(item.tanggal)}</span>
              </div>
            </div>

            {/* Author */}
            <div className="flex items-center text-xs text-gray-500 mb-4">
              <User className="w-4 h-4 mr-1" />
              <span>{item.penulis}</span>
            </div>
          </div>
          
          {/* Read More Button */}
          <div className={`px-6 pb-6 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}>
            <div className={`w-full text-white py-3 px-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
              isBerita 
                ? 'bg-gradient-to-r from-green-500 to-green-600' 
                : 'bg-gradient-to-r from-orange-500 to-orange-600'
            }`}>
              Baca Selengkapnya
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}