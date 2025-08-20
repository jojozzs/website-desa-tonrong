  // app/(pages)/berita/[kategori]/page.tsx
  import { notFound } from 'next/navigation'
  import { BeritaPengumumanKategoriEnum } from '@/lib/enums'
  import BeritaKategoriClient from '@/components/Berita/BeritaKategoriClient'

  interface KategoriPageProps {
    params: { kategori: string }
  }

  export const dynamic = 'force-static'

  // Generate static params untuk ISR
  export async function generateStaticParams() {
    return [
      { kategori: BeritaPengumumanKategoriEnum.BERITA },
      { kategori: BeritaPengumumanKategoriEnum.PENGUMUMAN }
    ]
  }

  export default function KategoriPage({ params }: KategoriPageProps) {
    const kategori = params.kategori as BeritaPengumumanKategoriEnum
    
    // Validate kategori
    if (!Object.values(BeritaPengumumanKategoriEnum).includes(kategori)) {
      notFound()
    }

    return <BeritaKategoriClient kategori={kategori} />
  }