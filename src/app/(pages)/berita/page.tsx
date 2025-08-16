import { redirect } from 'next/navigation'

export default function BeritaPage() {
  // Redirect ke kategori berita sebagai default
  redirect('/berita/berita')
}