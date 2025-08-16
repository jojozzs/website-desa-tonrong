'use client';

import { useSemuaProfilData } from '@/components/hooks/useSemuaProfilData';
import { ProfilKategoriEnum } from '@/lib/enums';
import Link from 'next/link';

const kategoriList = Object.values(ProfilKategoriEnum);

export default function AdminProfilPage() {
  const { data, loading, error } = useSemuaProfilData();

  const getProfilByKategori = (kategori: ProfilKategoriEnum) =>
    data.find((item) => item.kategori === kategori);

  if (loading) return <p>Memuat...</p>;
  if (error) return <p>Gagal: {error}</p>;

  return (
    <div className="space-y-4 text-black">
      <h1 className="text-xl font-bold">Daftar Profil per Kategori</h1>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {kategoriList.map((kategori) => {
          const existing = getProfilByKategori(kategori);
          return (
            <div key={kategori} className="border rounded p-4 shadow">
              <h2 className="font-semibold">{kategori.replace(/-/g, ' ')}</h2>
              {existing ? (
                <>
                  <p className="text-sm text-gray-600">Sudah dibuat</p>
                  <Link href={`/admin/profil/edit/${existing.id}`}>
                    <button className="text-blue-600 hover:underline">Edit Profil</button>
                  </Link>
                </>
              ) : (
                <Link href={`/admin/profil/tambah?kategori=${kategori}`}>
                  <button className="text-green-600 hover:underline">Tambah Profil</button>
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
