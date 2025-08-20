// app/(pages)/profil/struktur-pemerintahan/page.tsx
import { Metadata } from 'next'
import StrukturPemerintahan from '@/components/Profil/StrukturPemerintahan'
import { generateProfilMetadata } from '@/lib/seo'

export const metadata: Metadata = generateProfilMetadata({
  title: 'Struktur Pemerintahan Desa Tonrong Rijang',
  description: 'Struktur organisasi dan susunan pemerintahan Desa Tonrong Rijang dengan Kepala Desa Haedar dan perangkat desa yang melayani masyarakat.',
  category: 'struktur pemerintahan',
  url: '/profil/struktur-pemerintahan'
})

export default function StrukturPemerintahanPage() {
  return <StrukturPemerintahan />
}