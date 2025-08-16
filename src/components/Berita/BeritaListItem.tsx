import Image from "next/image";
import Link from "next/link";
import { Calendar, User, Clock } from "lucide-react";
import { BeritaPengumumanKategoriEnum } from "@/lib/enums";

interface BeritaItem {
  id: string;
  judul: string;
  deskripsi: string;
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

interface BeritaListItemProps {
  item: BeritaItem;
}

export default function BeritaListItem({ item }: BeritaListItemProps) {
  const href = `/berita/${item.kategori}/${item.slug}`;
  const isBerita = item.kategori === BeritaPengumumanKategoriEnum.BERITA;

  return (
    <Link href={href} className="block group">
      <article className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all duration-200">
        
        {/* Thumbnail */}
        <div className="relative w-full sm:w-20 h-48 sm:h-20 flex-shrink-0">
          <Image
            src={item.gambar_url}
            alt={item.judul}
            fill
            className="object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
            sizes="(max-width: 640px) 100vw, 80px"
          />
          
          {/* Category Badge untuk mobile */}
          <div className="absolute top-2 left-2 sm:hidden">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white backdrop-blur-sm ${
              isBerita 
                ? 'bg-green-600/90' 
                : 'bg-orange-600/90'
            }`}>
              <span className="mr-1">{isBerita ? '📰' : '📢'}</span>
              {isBerita ? 'Berita' : 'Pengumuman'}
            </span>
          </div>
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
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 group-hover:text-green-600 transition-colors line-clamp-2 mb-2">
            {item.judul}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-sm line-clamp-2 sm:line-clamp-1 mb-3 leading-relaxed">
            {item.deskripsi}
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
            </div>

            {/* Category Badge & Arrow untuk desktop */}
            <div className="flex items-center justify-between">
              {/* Category Badge untuk desktop */}
              <span className={`hidden sm:inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                isBerita 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-orange-100 text-orange-800'
              }`}>
                <span className="mr-1">{isBerita ? '📰' : '📢'}</span>
                {isBerita ? 'Berita' : 'Pengumuman'}
              </span>

              {/* Arrow */}
              <svg 
                className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-200 ml-auto sm:ml-3" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}