import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  className?: string
  showInfo?: boolean
  maxVisiblePages?: number
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className = '',
  showInfo = true,
  maxVisiblePages = 5
}: PaginationProps) {
  const startIndex = (currentPage - 1) * itemsPerPage + 1
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems)

  // Generate page numbers to show
  const getVisiblePages = () => {
    const delta = Math.floor(maxVisiblePages / 2)
    let start = Math.max(1, currentPage - delta)
    let end = Math.min(totalPages, start + maxVisiblePages - 1)
    
    // Adjust start if we're near the end
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1)
    }

    const pages = []
    
    // Always show first page
    if (start > 1) {
      pages.push(1)
      if (start > 2) {
        pages.push('...')
      }
    }
    
    // Show visible pages
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    // Always show last page
    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push('...')
      }
      pages.push(totalPages)
    }
    
    return pages
  }

  if (totalPages <= 1) return null

  const visiblePages = getVisiblePages()

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Info Text */}
        {showInfo && (
          <div className="text-sm text-gray-600 order-2 sm:order-1">
            Menampilkan <span className="font-medium">{startIndex}-{endIndex}</span> dari{' '}
            <span className="font-medium">{totalItems}</span> hasil
          </div>
        )}
        
        {/* Pagination Controls */}
        <div className="flex items-center space-x-1 order-1 sm:order-2">
          
          {/* Previous Button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`
              flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${currentPage === 1
                ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 bg-white border border-gray-300 hover:border-gray-400'
              }
            `}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Sebelumnya</span>
            <span className="sm:hidden">Prev</span>
          </button>

          {/* Page Numbers */}
          <div className="flex items-center space-x-1 mx-2">
            {visiblePages.map((page, index) => {
              if (page === '...') {
                return (
                  <span key={`ellipsis-${index}`} className="px-2">
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </span>
                )
              }
              
              const pageNum = page as number
              const isActive = currentPage === pageNum
              
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`
                    w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive
                      ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 bg-white border border-gray-300 hover:border-gray-400'
                    }
                  `}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>

          {/* Next Button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`
              flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${currentPage === totalPages
                ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 bg-white border border-gray-300 hover:border-gray-400'
              }
            `}
          >
            <span className="hidden sm:inline">Selanjutnya</span>
            <span className="sm:hidden">Next</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
      
      {/* Mobile Page Info */}
      <div className="mt-4 text-center text-xs text-gray-500 sm:hidden">
        Halaman {currentPage} dari {totalPages}
      </div>
    </div>
  )
}

// Simplified pagination for smaller spaces
export function SimplePagination({
  currentPage,
  totalPages,
  onPageChange,
  className = ''
}: Pick<PaginationProps, 'currentPage' | 'totalPages' | 'onPageChange' | 'className'>) {
  if (totalPages <= 1) return null

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`
          p-2 rounded-lg transition-colors
          ${currentPage === 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
          }
        `}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <span className="px-4 py-2 text-sm font-medium text-gray-700">
        {currentPage} / {totalPages}
      </span>
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`
          p-2 rounded-lg transition-colors
          ${currentPage === totalPages
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
          }
        `}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}