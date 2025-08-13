'use client'

import { useProfilData } from '@/components/hooks/useProfilData'
import { LoadingState, ErrorState, EmptyState } from './Shared'
import { ProfilKategoriEnum } from '@/lib/enums'

export default function VisiMisi() {
  const { data, loading, error, refetch } = useProfilData(ProfilKategoriEnum.VISI_DAN_MISI)

  if (loading) return <LoadingState />
  if (error) return <ErrorState error={error} onRetry={refetch} />
  if (!data || data.length === 0) return <EmptyState kategori="visi misi" />

  const mainData = data[0]
  const visiMisiData = mainData.data_tambahan

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={mainData.gambar_url || "landscape.jpg"} 
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
          {/* Visi */}
          {visiMisiData?.visi && (
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">Visi</h2>
              <div className="bg-gradient-to-r from-orange-50 to-green-50 rounded-2xl p-6 lg:p-8 border-l-4 border-orange-500">
                <p className="text-lg lg:text-xl text-gray-800 leading-relaxed font-medium italic">
                  "{visiMisiData.visi}"
                </p>
              </div>
            </div>
          )}

          {/* Misi */}
          {visiMisiData?.misi && Array.isArray(visiMisiData.misi) && (
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">Misi</h2>
              <div className="grid gap-4">
                {visiMisiData.misi.map((item: string, index: number) => (
                  <div key={index} className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{item}</p>
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