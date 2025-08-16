export function LoadingState() {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="h-48 bg-gray-200 animate-pulse"></div>
          <div className="p-6">
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function ErrorState({ error, onRetry }: { error: string; onRetry?: () => void }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
      <div className="text-red-500 mb-4">
        <svg className="h-16 w-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Gagal Memuat Berita</h2>
      <p className="text-gray-600 mb-4">{error}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors font-medium"
        >
          Coba Lagi
        </button>
      )}
    </div>
  )
}

export function EmptyState({ kategori }: { kategori?: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
      <div className="text-gray-400 mb-4">
        <svg className="h-16 w-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Belum Ada Berita</h2>
      <p className="text-gray-600">
        {kategori 
          ? `Belum ada ${kategori} yang dipublikasikan.`
          : 'Belum ada berita atau pengumuman yang dipublikasikan.'
        }
      </p>
    </div>
  )
}