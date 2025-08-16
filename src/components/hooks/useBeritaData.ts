'use client'

import { useState, useEffect } from 'react'
import { BeritaPengumumanKategoriEnum } from '@/lib/enums'
import type { OutputData } from '@editorjs/editorjs'

export interface BeritaData {
  id: string
  judul: string
  deskripsi: string
  tanggal: Date | string
  penulis: string
  kategori: BeritaPengumumanKategoriEnum
  slug: string
  gambar_url: string
  gambar_id: string
  gambar_size: number
  gambar_type: string
  gambar_width?: number
  gambar_height?: number
  created_at: Date | string
  updated_at: Date | string
  admin_uid: string | null  
  konten: OutputData
}

export function useBeritaData(kategori?: BeritaPengumumanKategoriEnum) {
  const [data, setData] = useState<BeritaData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Build URL with optional kategori filter
      const url = kategori 
        ? `/api/berita-pengumuman?kategori=${kategori}`
        : '/api/berita-pengumuman'
      
      const response = await fetch(url)
      const result = await response.json()
      
      if (result.success) {
        setData(result.data || [])
      } else {
        throw new Error(result.error || 'Gagal memuat data berita')
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
  }, [kategori])

  return { data, loading, error, refetch: fetchData }
}

// Hook untuk single berita by slug
export function useBeritaBySlug(slug: string) {
  const [berita, setBerita] = useState<BeritaData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBySlug = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Get all berita first, then find by slug
        const response = await fetch('/api/berita-pengumuman')
        const result = await response.json()
        
        if (result.success) {
          const foundBerita = result.data.find((b: BeritaData) => b.slug === slug)
          if (foundBerita) {
            setBerita(foundBerita)
          } else {
            throw new Error('Berita tidak ditemukan')
          }
        } else {
          throw new Error(result.error || 'Gagal memuat berita')
        }
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
        setBerita(null)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchBySlug()
    }
  }, [slug])

  return { data: berita, loading, error }
}