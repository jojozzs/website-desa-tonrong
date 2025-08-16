import { BeritaPengumumanKategoriEnum } from "@/lib/enums";
import { Newspaper, Megaphone, FileText } from "lucide-react";

interface Props {
  categories: BeritaPengumumanKategoriEnum[];
  activeCategory: BeritaPengumumanKategoriEnum;
  onChange: (category: BeritaPengumumanKategoriEnum) => void;
  categoryCounts?: { [key: string]: number };
}

export default function CategoryTabs({
  categories,
  activeCategory,
  onChange,
  categoryCounts = {},
}: Props) {
  // Helper function untuk format label yang lebih robust
  const formatCategoryLabel = (category: string): string => {
    return category
      .toLowerCase()
      .replace(/_/g, ' ') 
      .replace(/-/g, ' ') 
      .replace(/\b\w/g, char => char.toUpperCase());
  }

  // Helper function untuk mendapatkan jumlah artikel
  const getCategoryCount = (category: BeritaPengumumanKategoriEnum): string => {
    const count = categoryCounts[category] || 0;
    
    switch (category) {
      case BeritaPengumumanKategoriEnum.BERITA:
        return count === 1 ? '1 Artikel' : `${count} Artikel`;
      case BeritaPengumumanKategoriEnum.PENGUMUMAN:
        return count === 1 ? '1 Pengumuman' : `${count} Pengumuman`;
      default:
        return count === 1 ? '1 Item' : `${count} Item`;
    }
  }

  const getCategoryConfig = (category: BeritaPengumumanKategoriEnum) => {
    const count = getCategoryCount(category);
    
    switch (category) {
      case BeritaPengumumanKategoriEnum.BERITA:
        return {
          label: 'Berita',
          icon: Newspaper,
          description: 'Informasi kegiatan dan program desa',
          count: count,
          gradient: 'from-green-500 to-green-600',
          activeClass: 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-xl border-green-500',
          inactiveClass: 'bg-white border border-gray-200 text-gray-700 hover:border-green-300 hover:shadow-lg hover:bg-green-50/30',
          iconBg: 'bg-green-100 text-green-600',
          accentColor: 'green'
        }
      case BeritaPengumumanKategoriEnum.PENGUMUMAN:
        return {
          label: 'Pengumuman',
          icon: Megaphone,
          description: 'Pengumuman resmi pemerintah desa',
          count: count,
          gradient: 'from-orange-500 to-red-500',
          activeClass: 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-xl border-orange-500',
          inactiveClass: 'bg-white border border-gray-200 text-gray-700 hover:border-orange-300 hover:shadow-lg hover:bg-orange-50/30',
          iconBg: 'bg-orange-100 text-orange-600',
          accentColor: 'orange'
        }
      default:
        return {
          label: formatCategoryLabel(category),
          icon: FileText,
          description: 'Konten lainnya',
          count: count,
          gradient: 'from-gray-500 to-gray-600',
          activeClass: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-xl border-gray-500',
          inactiveClass: 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow-lg hover:bg-gray-50/30',
          iconBg: 'bg-gray-100 text-gray-600',
          accentColor: 'gray'
        }
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {categories.map((category) => {
        const config = getCategoryConfig(category)
        const isActive = activeCategory === category
        const itemCount = categoryCounts[category] || 0;
        const IconComponent = config.icon;
        
        return (
          <button
            key={category}
            onClick={() => onChange(category)}
            className={`
              relative p-6 rounded-2xl transition-all duration-500 transform
              ${isActive ? `${config.activeClass} scale-[1.02]` : config.inactiveClass}
              group overflow-hidden focus:outline-none focus:ring-4 focus:ring-${config.accentColor}-200
              hover:scale-[1.01] active:scale-[0.98] hover:cursor-pointer
            `}
          >
            {/* Background Pattern untuk active state */}
            {isActive && (
              <div className="absolute inset-0">
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 animate-pulse"></div>
                
                {/* Floating shapes */}
                <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
                <div className="absolute bottom-8 left-8 w-8 h-8 bg-white/15 rounded-full"></div>
                <div className="absolute top-1/2 right-8 w-4 h-4 bg-white/10 rounded-full animate-ping"></div>
              </div>
            )}
            
            {/* Hover effect untuk inactive */}
            {!isActive && (
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className={`absolute inset-0 bg-gradient-to-br from-${config.accentColor}-50 to-transparent`}></div>
              </div>
            )}
            
            <div className="relative z-10">
              {/* Header dengan Icon dan Status */}
              <div className="flex items-center justify-between mb-6">
                <div className={`
                  w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500
                  ${isActive ? 'bg-white/20 text-white scale-110' : `${config.iconBg} group-hover:scale-105`}
                  shadow-lg
                `}>
                  <IconComponent className="w-7 h-7" />
                </div>
                
                {/* Status indicator */}
                <div className="flex flex-col items-end">                  
                  <span className={`
                    text-xs px-3 py-1.5 rounded-full font-medium transition-colors duration-300
                    ${isActive 
                      ? 'bg-white/20 text-white' 
                      : `bg-${config.accentColor}-100 text-${config.accentColor}-700`
                    }
                    ${itemCount === 0 ? 'opacity-60' : ''}
                  `}>
                    {config.count}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="text-left">
                <h3 className={`
                  text-xl font-bold mb-3 transition-all duration-300 flex items-center gap-2
                  ${isActive ? 'text-white' : 'text-gray-800 group-hover:text-gray-900'}
                `}>
                  {config.label}
                </h3>
                
                <p className={`
                  text-sm leading-relaxed transition-all duration-300 min-h-[2.5rem]
                  ${isActive ? 'text-white/90' : 'text-gray-600 group-hover:text-gray-700'}
                `}>
                  {config.description}
                  {/* Tambahan info jika kosong */}
                  {itemCount === 0 && (
                    <span className="block text-xs mt-1 opacity-75">
                      Belum ada konten tersedia
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Loading effect saat klik */}
            <div className="absolute inset-0 bg-white/20 opacity-0 group-active:opacity-100 transition-opacity duration-150 rounded-2xl"></div>
          </button>
        )
      })}
    </div>
  )
}

// Compact Version yang lebih refined
export function CompactCategoryTabs({
  categories,
  activeCategory,
  onChange,
  categoryCounts = {},
}: Props) {
  const formatCategoryLabel = (category: string): string => {
    return category
      .toLowerCase()
      .replace(/_/g, ' ') 
      .replace(/-/g, ' ') 
      .replace(/\b\w/g, char => char.toUpperCase());
  }

  const getCategoryConfig = (category: BeritaPengumumanKategoriEnum) => {
    switch (category) {
      case BeritaPengumumanKategoriEnum.BERITA:
        return {
          label: 'Berita',
          icon: Newspaper,
          activeClass: 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-200',
          hoverClass: 'hover:bg-green-50 hover:text-green-700 hover:border-green-300',
          borderClass: 'border-green-200',
          countClass: 'bg-green-100 text-green-600'
        }
      case BeritaPengumumanKategoriEnum.PENGUMUMAN:
        return {
          label: 'Pengumuman',
          icon: Megaphone,
          activeClass: 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-200',
          hoverClass: 'hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300',
          borderClass: 'border-orange-200',
          countClass: 'bg-orange-100 text-orange-600'
        }
      default:
        return {
          label: formatCategoryLabel(category),
          icon: FileText,
          activeClass: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg shadow-gray-200',
          hoverClass: 'hover:bg-gray-50 hover:text-gray-700 hover:border-gray-300',
          borderClass: 'border-gray-200',
          countClass: 'bg-gray-100 text-gray-600'
        }
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 p-2 bg-gray-50/50 rounded-2xl">
      {categories.map((category) => {
        const config = getCategoryConfig(category)
        const isActive = activeCategory === category
        const count = categoryCounts[category] || 0;
        const IconComponent = config.icon;
        
        return (
          <button
            key={category}
            onClick={() => onChange(category)}
            className={`
              relative flex items-center justify-between px-6 py-4 rounded-xl font-semibold 
              transition-all duration-300 transform hover:scale-105 active:scale-95
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
              ${isActive 
                ? config.activeClass 
                : `bg-white border ${config.borderClass} text-gray-700 ${config.hoverClass}`
              }
              flex-1 group overflow-hidden
            `}
          >
            {/* Background effect */}
            {!isActive && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            )}
            
            <div className="flex items-center space-x-3">
              <IconComponent className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className="relative z-10">{config.label}</span>
            </div>

            {/* Count dan Active indicator */}
            <div className="flex items-center space-x-2">
              {/* Count badge */}
              <span className={`
                text-xs px-2 py-1 rounded-full font-medium transition-colors duration-300
                ${isActive 
                  ? 'bg-white/20 text-white' 
                  : config.countClass
                }
              `}>
                {count}
              </span>
              
              {/* Active indicator */}
              {isActive && (
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                  <div className="w-1.5 h-1.5 bg-white/80 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                </div>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}

// Mini Version untuk navbar atau header
export function MiniCategoryTabs({
  categories,
  activeCategory,
  onChange,
  categoryCounts = {},
}: Props) {
  const getCategoryConfig = (category: BeritaPengumumanKategoriEnum) => {
    switch (category) {
      case BeritaPengumumanKategoriEnum.BERITA:
        return { label: 'Berita', icon: Newspaper, color: 'green' }
      case BeritaPengumumanKategoriEnum.PENGUMUMAN:
        return { label: 'Pengumuman', icon: Megaphone, color: 'orange' }
      default:
        return { label: category, icon: FileText, color: 'gray' }
    }
  }

  return (
    <div className="inline-flex bg-gray-100 rounded-lg p-1">
      {categories.map((category) => {
        const config = getCategoryConfig(category)
        const isActive = activeCategory === category
        const count = categoryCounts[category] || 0;
        const IconComponent = config.icon;
        
        return (
          <button
            key={category}
            onClick={() => onChange(category)}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium
              transition-all duration-200 relative overflow-hidden
              ${isActive 
                ? `bg-white text-${config.color}-600 shadow-sm` 
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }
            `}
          >
            <IconComponent className="w-4 h-4" />
            <span>{config.label}</span>
            {/* Count untuk mini version */}
            {count > 0 && (
              <span className={`
                ml-1 px-1.5 py-0.5 text-xs rounded-full
                ${isActive 
                  ? `bg-${config.color}-100 text-${config.color}-600` 
                  : 'bg-gray-200 text-gray-600'
                }
              `}>
                {count}
              </span>
            )}
            
            {/* Active indicator */}
            {isActive && (
              <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-${config.color}-500`}></div>
            )}
          </button>
        )
      })}
    </div>
  )
}