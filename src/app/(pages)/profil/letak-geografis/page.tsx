// app/(pages)/profil/letak-geografis/page.tsx
import { Metadata } from 'next'
import LetakGeografis from '@/components/Profil/LetakGeografis'
import { generateProfilMetadata } from '@/lib/seo'

export const metadata: Metadata = generateProfilMetadata({
  title: 'Letak Geografis Desa Tonrong Rijang',
  description: 'Informasi letak geografis, batas wilayah, luas area, dan kondisi topografi Desa Tonrong Rijang di Kecamatan Baranti, Kabupaten Sidenreng Rappang.',
  category: 'letak geografis',
  url: '/profil/letak-geografis'
})

export default function LetakGeografisPage() {
  return <LetakGeografis />
}