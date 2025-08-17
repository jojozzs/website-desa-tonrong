// src/app/produk-unggulan/layout.tsx
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface ProdukUnggulanLayoutProps {
  children: React.ReactNode;
}

export default function ProdukUnggulanLayout({ children }: ProdukUnggulanLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export const metadata = {
  title: 'Produk Unggulan UMKM | Desa Tonrong Rijang',
  description: 'Temukan berbagai produk unggulan dari UMKM Desa Tonrong Rijang yang berkualitas dan inovatif',
};