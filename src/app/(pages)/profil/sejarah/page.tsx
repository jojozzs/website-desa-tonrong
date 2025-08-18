// app/(pages)/profil/sejarah/page.tsx
import { Metadata } from 'next'
import SejarahDesa from '@/components/Profil/SejarahDesa'
import { generateProfilMetadata } from '@/lib/seo'

export const metadata: Metadata = generateProfilMetadata({
  title: 'Sejarah Desa Tonrong Rijang',
  description: 'Sejarah pembentukan dan perkembangan Desa Tonrong Rijang dari masa awal hingga menjadi desa maju di Kecamatan Baranti, Kabupaten Sidenreng Rappang.',
  category: 'sejarah',
  url: '/profil/sejarah'
})

export default function SejarahPage() {
  return <SejarahDesa />
}