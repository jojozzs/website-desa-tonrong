// app/(pages)/galeri/page.tsx
import GaleriClient from '@/components/Galeri/GaleriClient'

export const dynamic = 'force-static'

export default function GaleriPage() {
  return <GaleriClient />
}