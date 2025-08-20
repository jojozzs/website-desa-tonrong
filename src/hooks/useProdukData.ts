// src/components/hooks/useProdukData.ts
'use client'

import { useState, useEffect } from 'react'
import type { OutputData } from '@editorjs/editorjs'

export interface ProdukData {
  id: string
  judul: string
  deskripsi: string
  konten?: OutputData
  nama_umkm: string
  alamat_umkm: string
  kontak_umkm: string
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
}

export function useProdukData() {
  const [data, setData] = useState<ProdukData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/produk-unggulan')
      const result = await response.json()
      
      if (result.success) {
        const sortedData = (result.data || []).sort((a: ProdukData, b: ProdukData) => {
          const dateA = new Date(a.created_at).getTime()
          const dateB = new Date(b.created_at).getTime()
          return dateB - dateA 
        })
        setData(sortedData)
      } else {
        throw new Error(result.error || 'Gagal memuat data produk unggulan')
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

// Hook untuk single produk by slug
export function useProdukBySlug(slug: string) {
  const [produk, setProduk] = useState<ProdukData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBySlug = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/produk-unggulan?slug=${slug}`)
        const result = await response.json()
        
        if (result.success) {
          setProduk(result.data)
        } else {
          throw new Error(result.error || 'Produk tidak ditemukan')
        }
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
        setProduk(null)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchBySlug()
    }
  }, [slug])

  return { data: produk, loading, error }
}