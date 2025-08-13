interface EmptyStateProps {
  kategori: string
}

export function EmptyState({ kategori }: EmptyStateProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
      <div className="text-gray-400 mb-4">
        <svg className="h-16 w-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Belum Ada Data</h2>
      <p className="text-gray-600">
        Data untuk kategori <span className="font-medium">"{kategori}"</span> belum tersedia. 
        Silakan hubungi admin untuk menambahkan konten.
      </p>
    </div>
  )
}