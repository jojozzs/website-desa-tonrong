// app/(pages)/profil/visimisi/page.tsx
import { Metadata } from 'next'
import VisiMisi from '@/components/Profil/VisiMisi'
import { generateProfilMetadata } from '@/lib/seo'

export const metadata: Metadata = generateProfilMetadata({
  title: 'Visi dan Misi Desa Tonrong Rijang',
  description: 'Visi dan misi pembangunan Desa Tonrong Rijang untuk mewujudkan desa yang maju, mandiri, dan sejahtera berbasis pertanian dan kebersamaan.',
  category: 'visi dan misi',
  url: '/profil/visimisi'
})

export default function VisiMisiPage() {
  return <VisiMisi />
}