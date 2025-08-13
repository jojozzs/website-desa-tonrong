'use client'

import { useProfilData } from '@/components/hooks/useProfilData'
import { LoadingState, ErrorState, EmptyState } from './Shared'
import { ProfilKategoriEnum } from '@/lib/enums'

export default function StrukturPemerintahan() {
  const { data, loading, error, refetch } = useProfilData(ProfilKategoriEnum.STRUKTUR_PEMERINTAHAN_DESA)

  if (loading) return <LoadingState />
  if (error) return <ErrorState error={error} onRetry={refetch} />
  if (!data || data.length === 0) return <EmptyState kategori="struktur pemerintahan" />

  const mainData = data[0]
  const strukturData = mainData.data_tambahan

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={mainData.gambar_url || "../landscape.jpg"} 
            alt={mainData.judul}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40"></div>
        </div>
        
        <div className="relative z-10 p-8 lg:p-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              {mainData.judul}
            </h1>
            <p className="text-xl text-gray-200 leading-relaxed">
              {mainData.deskripsi}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="space-y-8">
          {/* Pimpinan Desa */}
          {strukturData?.pimpinan && (
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">Pimpinan Desa</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {strukturData.pimpinan.map((pejabat: any, index: number) => (
                  <div key={index} className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-6 text-center">
                    <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
                      {pejabat.foto ? (
                        <img 
                          src={pejabat.foto} 
                          alt={pejabat.nama}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg className="h-12 w-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      )}
                    </div>
                    <h3 className="font-bold text-lg text-gray-800">{pejabat.nama}</h3>
                    <p className="text-blue-600 font-medium">{pejabat.jabatan}</p>
                    {pejabat.periode && (
                      <p className="text-gray-500 text-sm mt-1">Periode: {pejabat.periode}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Perangkat Desa */}
          {strukturData?.perangkat && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-6">Perangkat Desa</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {strukturData.perangkat.map((perangkat: any, index: number) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <span className="text-gray-700 font-medium">
                        {typeof perangkat === 'string' ? perangkat : perangkat.jabatan}
                      </span>
                      {typeof perangkat === 'object' && perangkat.nama && (
                        <p className="text-gray-500 text-sm">{perangkat.nama}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Main Content */}
          {mainData.konten && (
            <div 
              className="prose prose-lg max-w-none text-gray-600"
              dangerouslySetInnerHTML={{ __html: mainData.konten }}
            />
          )}

         
        </div>
      </div>

      {/* Additional Content Items */}
      {data.length > 1 && (
        <div className="space-y-6">
          {data.slice(1).map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">{item.judul}</h3>
              {item.gambar_url && (
                <div className="mb-4">
                  <img 
                    src={item.gambar_url} 
                    alt={item.judul}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
              {item.konten ? (
                <div 
                  className="prose max-w-none text-gray-600"
                  dangerouslySetInnerHTML={{ __html: item.konten }}
                />
              ) : (
                <p className="text-gray-600">{item.deskripsi}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}