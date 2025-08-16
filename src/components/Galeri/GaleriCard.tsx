import Image from "next/image";
import { useState } from "react";
import { Calendar, Eye } from "lucide-react";

interface GaleriItem {
  id: string;
  judul: string;
  deskripsi: string;
  gambar_url: string;
  created_at: Date | string;
}

function formatIDDate(d: Date | string) {
  const date = typeof d === 'string' ? new Date(d) : d
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

interface GaleriCardProps {
  item: GaleriItem;
  onClick: () => void;
}

export default function GaleriCard({ item, onClick }: GaleriCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <div className="group relative overflow-hidden rounded-xl bg-white shadow-sm border border-gray-200 hover:shadow-xl transition-all duration-500 cursor-pointer">
      {/* Image Container - Fixed aspect ratio to prevent cropping */}
      <div className="relative w-full h-64 overflow-hidden" onClick={onClick}>
        {/* Loading skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        
        <Image
          src={item.gambar_url}
          alt={item.judul}
          fill
          className={`object-cover transition-all duration-700 group-hover:scale-110 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          onLoadingComplete={() => setImageLoaded(true)}
        />
        
        {/* Overlay dengan gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* View Icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-100 scale-75">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 border border-white/30">
            <Eye className="w-8 h-8 text-white" />
          </div>
        </div>
        
        {/* Date Badge */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/30">
            <span className="text-white text-xs font-medium flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatIDDate(item.created_at)}
            </span>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors duration-300">
          {item.judul}
        </h3>
        
        {/* Description - Hidden by default, shown on hover */}
        <div className="max-h-0 overflow-hidden group-hover:max-h-24 transition-all duration-500 ease-in-out">
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 pt-2 border-t border-gray-100">
            {item.deskripsi}
          </p>
        </div>
        
        {/* View indicator */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatIDDate(item.created_at)}
          </span>
          <span className="text-green-600 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Klik untuk melihat
          </span>
        </div>
      </div>
      
      {/* Hover border effect */}
      <div className="absolute inset-0 border-2 border-green-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}