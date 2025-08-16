'use client'

import { useState, useEffect } from 'react'

export interface GaleriData {
  id: string
  judul: string
  deskripsi: string
  gambar_url: string
  gambar_id: string
  gambar_size: number
  gambar_type: string
  gambar_width?: number
  gambar_height?: number
  created_at: Date | string
  updated_at: Date | string
  admin_uid: string | null
}

export function useGaleriData() {
  const [data, setData] = useState<GaleriData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/galeri')
      const result = await response.json()
      
      if (result.success) {
        // Sort by created_at descending (terbaru di atas)
        const sortedData = (result.data || []).sort((a: GaleriData, b: GaleriData) => {
          const dateA = new Date(a.created_at).getTime()
          const dateB = new Date(b.created_at).getTime()
          return dateB - dateA // Descending order
        })
        setData(sortedData)
      } else {
        throw new Error(result.error || 'Gagal memuat data galeri')
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
      setData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return { data, loading, error, refetch: fetchData }
}