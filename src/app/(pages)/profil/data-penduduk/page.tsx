// app/(pages)/profil/data-penduduk/page.tsx
import { Metadata } from 'next'
import DataPenduduk from '@/components/Profil/DataPenduduk'
import { generateProfilMetadata } from '@/lib/seo'

export const metadata: Metadata = generateProfilMetadata({
  title: 'Data Penduduk Desa Tonrong Rijang',
  description: 'Statistik dan demografi penduduk Desa Tonrong Rijang meliputi jumlah penduduk, komposisi gender, mata pencaharian, dan Indeks Desa Membangun (IDM).',
  category: 'data penduduk',
  url: '/profil/data-penduduk'
})

export default function DataPendudukPage() {
  return <DataPenduduk />
}