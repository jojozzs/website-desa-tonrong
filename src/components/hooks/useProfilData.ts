// hooks/useProfilData.ts - Updated untuk API yang sudah ada

'use client'
import { useState, useEffect, useCallback } from 'react'
import { ProfilWithContent } from '@/lib/types'
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
	const [data, setData] = useState<ProfilWithContent[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const fetchData = useCallback(async () => {
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
	}, [kategori])

	useEffect(() => {
		if (kategori) {
			fetchData()
		}
	}, [kategori, fetchData])


	return { data, loading, error, refetch: fetchData }
}