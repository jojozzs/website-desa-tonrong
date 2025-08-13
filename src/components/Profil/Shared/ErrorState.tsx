interface ErrorStateProps {
  error: string
  onRetry?: () => void
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
      <div className="text-red-500 mb-4">
        <svg className="h-16 w-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Gagal Memuat Data</h2>
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