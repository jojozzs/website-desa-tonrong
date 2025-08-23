'use client'

import { useProfilData } from '@/hooks/useProfilData'
import { LoadingState, ErrorState, EmptyState } from './Shared'
import { ProfilKategoriEnum } from '@/lib/enums'

export default function DataPenduduk() {
  const { data, loading, error, refetch } = useProfilData(ProfilKategoriEnum.JUMLAH_PENDUDUK_DAN_DATA_UMUM)

  if (loading) return <LoadingState />
  if (error) return <ErrorState error={error} onRetry={refetch} />
  if (!data || data.length === 0) return <EmptyState kategori="data penduduk" />

  const mainData = data[0]
  const pendudukData = mainData.data_tambahan

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
          {/* Data Umum */}
          {pendudukData?.demografi && (
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">Data Umum Penduduk</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white text-center">
                  <div className="text-3xl font-bold mb-2">
                    {pendudukData.demografi.total_penduduk?.toLocaleString() || '1,458'}
                  </div>
                  <div className="text-blue-100">Total Penduduk</div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white text-center">
                  <div className="text-3xl font-bold mb-2">
                    {pendudukData.demografi.total_kk || '463'}
                  </div>
                  <div className="text-green-100">Kepala Keluarga</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white text-center">
                  <div className="text-3xl font-bold mb-2">
                    {pendudukData.demografi.laki_laki || '728'}
                  </div>
                  <div className="text-purple-100">Laki-laki</div>
                </div>
                <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 text-white text-center">
                  <div className="text-3xl font-bold mb-2">
                    {pendudukData.demografi.perempuan || '730'}
                  </div>
                  <div className="text-pink-100">Perempuan</div>
                </div>
              </div>
            </div>
          )}

          {/* Mata Pencaharian */}
          {pendudukData?.mata_pencaharian && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-6">Mata Pencaharian</h3>
              <div className="space-y-3">
                {pendudukData.mata_pencaharian.map((item: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-700 font-medium">{item.kategori || item.jenis}</span>
                    <div className="flex items-center space-x-4">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${item.persen || item.persentase || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-gray-600 font-semibold min-w-[60px] text-right">
                        {item.persen || item.persentase || 0}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Kelompok Umur */}
          {pendudukData?.kelompok_umur && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-6">Distribusi Kelompok Umur</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {pendudukData.kelompok_umur.map((item: any, index: number) => (
                  <div key={index} className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 text-center border border-orange-200">
                    <div className="text-2xl font-bold text-orange-600 mb-2">
                      {item.jumlah}
                    </div>
                    <div className="text-gray-700 font-medium mb-2">
                      {item.kelompok || item.kategori}
                    </div>
                    <div className="text-gray-500">
                      {item.persen || item.persentase}% dari total
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Agama */}
          {pendudukData?.agama && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-6">Agama</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(pendudukData.agama).map(([agama, data]: [string, any], index) => (
                  <div key={index} className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 text-center">
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      {typeof data === 'object' ? data.persentase : data}%
                    </div>
                    <div className="text-gray-700 font-medium capitalize">{agama}</div>
                    {typeof data === 'object' && data.jumlah && (
                      <div className="text-gray-500 text-sm mt-1">{data.jumlah} jiwa</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status IDM */}
          {pendudukData?.idm && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-6">Indeks Desa Membangun (IDM)</h3>
              
              {/* 3 Indeks - Tampilkan hanya jika ada data */}
              {(pendudukData.idm.iks !== undefined || pendudukData.idm.ike !== undefined || pendudukData.idm.ikl !== undefined) && (
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-200 text-center">
                    <div className="text-2xl font-bold text-cyan-600 mb-2">
                      {pendudukData.idm.iks?.toFixed(4) || '0.0000'}
                    </div>
                    <div className="text-gray-700 font-medium">Indeks Ketahanan Sosial</div>
                    <div className="text-gray-500 text-sm">(IKS)</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-200 text-center">
                    <div className="text-2xl font-bold text-emerald-600 mb-2">
                      {pendudukData.idm.ike?.toFixed(4) || '0.0000'}
                    </div>
                    <div className="text-gray-700 font-medium">Indeks Ketahanan Ekonomi</div>
                    <div className="text-gray-500 text-sm">(IKE)</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-200 text-center">
                    <div className="text-2xl font-bold text-amber-600 mb-2">
                      {pendudukData.idm.ikl?.toFixed(4) || '0.0000'}
                    </div>
                    <div className="text-gray-700 font-medium">Indeks Ketahanan Lingkungan</div>
                    <div className="text-gray-500 text-sm">(IKL)</div>
                  </div>
                </div>
              )}
              
              {/* IDM Result */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {pendudukData.idm.nilai || '0.0000'}
                  </div>
                  <div className="text-gray-700 font-medium mb-2">Nilai IDM</div>
                  
                  {/* Tampilkan formula jika ada data 3 indeks */}
                  {(pendudukData.idm.iks !== undefined || pendudukData.idm.ike !== undefined || pendudukData.idm.ikl !== undefined) && (
                    <div className="text-sm text-gray-500 mb-3">
                      (IKS + IKE + IKL) ÷ 3
                    </div>
                  )}
                  
                  <div className={`inline-block px-4 py-2 rounded-full font-semibold ${
                    parseFloat(pendudukData.idm.nilai || '0') >= 0.5989 
                      ? 'bg-green-100 text-green-800'
                      : parseFloat(pendudukData.idm.nilai || '0') >= 0.4993
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    Status: Desa {pendudukData.idm.status || 'Maju'}
                  </div>
                  
                  {pendudukData.idm.deskripsi && (
                    <div className="text-gray-500 mt-4">
                      {pendudukData.idm.deskripsi}
                    </div>
                  )}
                  
                  {/* Default description jika tidak ada */}
                  {!pendudukData.idm.deskripsi && (
                    <div className="text-gray-500 mt-4">
                      Desa Tonrong Rijang termasuk dalam kategori Desa {pendudukData.idm.status || 'Maju'} berdasarkan Indeks Desa Membangun
                    </div>
                  )}
                </div>
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