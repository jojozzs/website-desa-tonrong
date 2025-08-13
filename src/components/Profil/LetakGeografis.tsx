'use client'

import { useProfilData } from '@/components/hooks/useProfilData'
import { LoadingState, ErrorState, EmptyState } from './Shared'
import { ProfilKategoriEnum } from '@/lib/enums'

export default function LetakGeografis() {
  const { data, loading, error, refetch } = useProfilData(ProfilKategoriEnum.LETAK_GEOGRAFIS_DAN_PETA_DESA)

  if (loading) return <LoadingState />
  if (error) return <ErrorState error={error} onRetry={refetch} />
  if (!data || data.length === 0) return <EmptyState kategori="letak geografis" />

  const mainData = data[0]
  const geografisData = mainData.data_tambahan

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
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">Posisi dan Luas Wilayah</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Informasi Wilayah */}
              <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-6">
                <h3 className="font-bold text-gray-800 mb-4">Informasi Wilayah</h3>
                <div className="space-y-3">
                  {geografisData?.informasi_wilayah ? (
                    Object.entries(geografisData.informasi_wilayah).map(([key, value], index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-gray-600 capitalize">{key.replace(/_/g, ' ')}:</span>
                        <span className="font-semibold text-blue-600">{String(value)}</span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Luas Wilayah:</span>
                        <span className="font-semibold text-blue-600">340 Ha</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Kecamatan:</span>
                        <span className="font-semibold">Baranti</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Kabupaten:</span>
                        <span className="font-semibold">Sidenreng Rappang</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Provinsi:</span>
                        <span className="font-semibold">Sulawesi Selatan</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Kode Pos:</span>
                        <span className="font-semibold">91652</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Koordinat Geografis */}
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6">
                <h3 className="font-bold text-gray-800 mb-4">Koordinat Geografis</h3>
                <div className="space-y-3">
                  {geografisData?.koordinat ? (
                    Object.entries(geografisData.koordinat).map(([key, value], index) => (
                      <div key={index}>
                        <span className="text-gray-600 capitalize">{key.replace(/_/g, ' ')}:</span>
                        <p className="font-semibold text-orange-600">{String(value)}</p>
                      </div>
                    ))
                  ) : (
                    <>
                      <div>
                        <span className="text-gray-600">Latitude:</span>
                        <p className="font-semibold text-orange-600">-4.2°S</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Longitude:</span>
                        <p className="font-semibold text-orange-600">119.6°E</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Ketinggian:</span>
                        <p className="font-semibold">±50 mdpl</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Topografi:</span>
                        <p className="font-semibold">Dataran rendah</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Batas Wilayah */}
          {geografisData?.batas_wilayah && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-6">Batas Wilayah</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(geografisData.batas_wilayah).map(([arah, berbatasan], index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm capitalize">{arah}</span>
                    </div>
                    <div className="flex-1 pt-2">
                      <h4 className="font-semibold text-gray-800 mb-1">Sebelah {arah}</h4>
                      <p className="text-gray-600 text-sm">{String(berbatasan)}</p>
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

          {/* Map Placeholder */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-6">Peta Lokasi</h3>
            <div className="bg-gray-100 rounded-2xl p-8 text-center">
              <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                <div className="text-gray-500">
                  <svg className="h-16 w-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-lg font-medium">Peta Interaktif</p>
                  <p className="text-sm">Integrasi Google Maps akan ditambahkan</p>
                </div>
              </div>
            </div>
          </div>
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