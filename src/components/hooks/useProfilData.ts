'use client'

import { useState, useEffect } from 'react'
import { ProfilWithContent } from '@/lib/types'
import { ProfilKategoriEnum } from '@/lib/enums'

export function useProfilData(kategori: ProfilKategoriEnum | 'umum') {
  const [data, setData] = useState<ProfilWithContent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/profil?kategori=${kategori}`)
      const result = await response.json()
      
      if (result.success) {
        setData(result.data || [])
      } else {
        throw new Error(result.error || 'Gagal memuat data')
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