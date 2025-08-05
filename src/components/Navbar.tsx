import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-green-700 text-white p-4">
      <ul className="flex gap-4">
        <li><Link href="/">Beranda</Link></li>
        <li><Link href="/profil">Profil</Link></li>
        <li><Link href="/berita">Berita</Link></li>
        <li><Link href="/galeri">Galeri</Link></li>
        <li><Link href="/produk">UMKM</Link></li>
        <li><Link href="/kontak">Kontak</Link></li>
      </ul>
    </nav>
  );
}
