// hooks/useProfilData.ts - Updated untuk API yang sudah ada

'use client'

import { useState, useEffect } from 'react'
import { ProfilKategoriEnum } from '@/lib/enums'

// Interface sesuai dengan response API yang sudah ada
export interface ProfilData {
  id: string
  judul: string
  deskripsi: string
  kategori: ProfilKategoriEnum
  konten?: string // HTML content yang baru ditambahkan
  data_tambahan?: any // Map/object untuk data terstruktur yang baru ditambahkan
  gambar_url: string
  gambar_id: string
  gambar_size: number
  gambar_type: string
  gambar_width?: number
  gambar_height?: number
  created_at: Date | string | null
  updated_at: Date | string | null
  admin_uid: string | null
}

interface ApiResponse {
  success: boolean
  data: ProfilData[] | ProfilData
  error?: string
}

// Hook utama untuk fetch profil berdasarkan kategori
export function useProfilData(kategori: ProfilKategoriEnum | 'umum') {
  const [data, setData] = useState<ProfilData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // API endpoint sesuai dengan route yang sudah ada
      const response = await fetch(`/api/profil?kategori=${kategori}`)
      const result: ApiResponse = await response.json()
      
      if (result.success) {
        // Handle response - API bisa return array atau single object
        const profilData = Array.isArray(result.data) ? result.data : [result.data]
        setData(profilData)
      } else {
        throw new Error(result.error || 'Gagal memuat data profil')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
      setData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (kategori) {
      fetchData()
    }
  }, [kategori])

  return { data, loading, error, refetch: fetchData }
}

// Hook untuk fetch single profil by ID
export function useProfilById(id: string) {
  const [data, setData] = useState<ProfilData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // API endpoint dengan ID parameter
        const response = await fetch(`/api/profil?id=${id}`)
        const result: ApiResponse = await response.json()
        
        if (result.success) {
          // API return single object untuk ID query
          setData(result.data as ProfilData)
        } else {
          throw new Error(result.error || 'Profil tidak ditemukan')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id])

  return { data, loading, error }
}

// Hook untuk fetch profil dengan limit 1 (untuk overview/featured)
export function useProfilOverview(kategori: ProfilKategoriEnum) {
  const [data, setData] = useState<ProfilData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Menggunakan limit=1 sesuai API route
      const response = await fetch(`/api/profil?kategori=${kategori}&limit=1`)
      const result: ApiResponse = await response.json()
      
      if (result.success) {
        const profilData = Array.isArray(result.data) ? result.data[0] : result.data
        setData(profilData || null)
      } else {
        throw new Error(result.error || 'Gagal memuat data profil')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (kategori) {
      fetchData()
    }
  }, [kategori])

  return { data, loading, error, refetch: fetchData }
}

// Hook khusus untuk data penduduk (dengan data_tambahan)
export function useDataPenduduk() {
  const { data, loading, error, refetch } = useProfilData(ProfilKategoriEnum.JUMLAH_PENDUDUK_DAN_DATA_UMUM)
  
  // Parse data_tambahan jika ada
  const parsedData = data.map(item => ({
    ...item,
    data_tambahan: item.data_tambahan ? 
      (typeof item.data_tambahan === 'string' ? 
        JSON.parse(item.data_tambahan) : 
        item.data_tambahan
      ) : null
  }))

  return { 
    data: parsedData, 
    loading, 
    error, 
    refetch,
    // Helper untuk akses data demografis
    demografiData: parsedData[0]?.data_tambahan?.demografi || null,
    mataPencaharianData: parsedData[0]?.data_tambahan?.mata_pencaharian || [],
    kelompokUmurData: parsedData[0]?.data_tambahan?.kelompok_umur || [],
    agamaData: parsedData[0]?.data_tambahan?.agama || null,
    idmData: parsedData[0]?.data_tambahan?.idm || null
  }
}

// Hook khusus untuk struktur pemerintahan (dengan data_tambahan)
export function useStrukturPemerintahan() {
  const { data, loading, error, refetch } = useProfilData(ProfilKategoriEnum.STRUKTUR_PEMERINTAHAN_DESA)
  
  // Parse data_tambahan untuk struktur
  const parsedData = data.map(item => ({
    ...item,
    data_tambahan: item.data_tambahan ? 
      (typeof item.data_tambahan === 'string' ? 
        JSON.parse(item.data_tambahan) : 
        item.data_tambahan
      ) : null
  }))

  return { 
    data: parsedData, 
    loading, 
    error, 
    refetch,
    // Helper untuk akses struktur organisasi
    strukturData: parsedData[0]?.data_tambahan?.struktur || [],
    kepalaDesa: parsedData[0]?.data_tambahan?.kepala_desa || null,
    perangkatDesa: parsedData[0]?.data_tambahan?.perangkat_desa || [],
    bpd: parsedData[0]?.data_tambahan?.bpd || []
  }
}

// Hook khusus untuk letak geografis (dengan data_tambahan)
export function useLetakGeografis() {
  const { data, loading, error, refetch } = useProfilData(ProfilKategoriEnum.LETAK_GEOGRAFIS_DAN_PETA_DESA)
  
  // Parse data_tambahan untuk geografis
  const parsedData = data.map(item => ({
    ...item,
    data_tambahan: item.data_tambahan ? 
      (typeof item.data_tambahan === 'string' ? 
        JSON.parse(item.data_tambahan) : 
        item.data_tambahan
      ) : null
  }))

  return { 
    data: parsedData, 
    loading, 
    error, 
    refetch,
    // Helper untuk akses data geografis
    koordinat: parsedData[0]?.data_tambahan?.koordinat || null,
    luasWilayah: parsedData[0]?.data_tambahan?.luas_wilayah || null,
    batasWilayah: parsedData[0]?.data_tambahan?.batas_wilayah || null,
    topografi: parsedData[0]?.data_tambahan?.topografi || null,
    iklim: parsedData[0]?.data_tambahan?.iklim || null
  }
}

// Hook untuk multiple kategori (jika diperlukan)
export function useMultipleProfilData(kategoris: ProfilKategoriEnum[]) {
  const [data, setData] = useState<Record<ProfilKategoriEnum, ProfilData[]>>({} as any)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMultipleData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const promises = kategoris.map(async (kategori) => {
          const response = await fetch(`/api/profil?kategori=${kategori}`)
          const result: ApiResponse = await response.json()
          
          if (result.success) {
            const profilData = Array.isArray(result.data) ? result.data : [result.data]
            return { kategori, data: profilData }
          } else {
            throw new Error(`Gagal memuat ${kategori}: ${result.error}`)
          }
        })

        const results = await Promise.all(promises)
        
        const dataMap = {} as Record<ProfilKategoriEnum, ProfilData[]>
        results.forEach(({ kategori, data: itemData }) => {
          dataMap[kategori] = itemData
        })
        
        setData(dataMap)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
        setData({} as any)
      } finally {
        setLoading(false)
      }
    }

    if (kategoris.length > 0) {
      fetchMultipleData()
    }
  }, [JSON.stringify(kategoris)]) // Dependency on serialized array

  return { data, loading, error }
}

// Type guards dan helpers
export function hasKonten(profil: ProfilData): boolean {
  return !!(profil.konten && profil.konten.trim().length > 0)
}

export function hasDataTambahan(profil: ProfilData): boolean {
  return !!(profil.data_tambahan && Object.keys(profil.data_tambahan).length > 0)
}

export function parseDataTambahan<T = any>(profil: ProfilData): T | null {
  if (!profil.data_tambahan) return null
  
  try {
    return typeof profil.data_tambahan === 'string' 
      ? JSON.parse(profil.data_tambahan) 
      : profil.data_tambahan
  } catch {
    return null
  }
}

// Helper untuk format konten HTML
export function getSafeHtmlContent(profil: ProfilData): string {
  return profil.konten || profil.deskripsi || ''
}

// Helper untuk mendapatkan excerpt dari konten
export function getContentExcerpt(profil: ProfilData, maxLength: number = 200): string {
  const content = profil.konten || profil.deskripsi || ''
  
  // Strip HTML tags
  const textOnly = content.replace(/<[^>]*>/g, '')
  
  if (textOnly.length <= maxLength) return textOnly
  
  return textOnly.substring(0, maxLength).trim() + '...'
}