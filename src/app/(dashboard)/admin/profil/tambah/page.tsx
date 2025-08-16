'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProfilKategoriEnum } from '@/lib/enums';
import { ProfilWithContent } from '@/lib/types';
import { requireIdToken } from '@/lib/client-auth';

export default function TambahProfilPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const kategori = searchParams.get('kategori') as ProfilKategoriEnum | null;

  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [konten, setKonten] = useState<string>('');
  const [gambar, setGambar] = useState<File | null>(null);
  const [dataTambahan, setDataTambahan] = useState<ProfilWithContent['data_tambahan']>({});

  if (!kategori || !(Object.values(ProfilKategoriEnum) as string[]).includes(kategori)) {
    return <p>Kategori tidak valid</p>;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!judul || !deskripsi || !gambar) {
      alert('Judul, deskripsi, dan gambar wajib diisi.');
      return;
    }

    const formData = new FormData();
    formData.append('judul', judul);
    formData.append('deskripsi', deskripsi);
    formData.append('kategori', kategori);
    formData.append('gambar', gambar);
    formData.append('konten', konten);
    formData.append('data_tambahan', JSON.stringify(dataTambahan));

    const token = await requireIdToken();
    const res = await fetch('/api/profil', {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      router.push('/admin/profil');
    } else {
      const data = await res.json();
      alert(data.error || 'Gagal menyimpan profil');
    }
  };

  return (
    <div className="space-y-4 text-black">
      <h1 className="text-xl font-bold">Tambah Profil: {kategori.replace(/-/g, ' ')}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Judul"
          className="w-full border rounded p-2"
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
        />
        <textarea
          placeholder="Deskripsi"
          className="w-full border rounded p-2"
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
        />
        <textarea
          placeholder="Konten (opsional)"
          className="w-full border rounded p-2"
          value={konten}
          onChange={(e) => setKonten(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setGambar(e.target.files?.[0] ?? null)}
        />

        {/* Field Tambahan Berdasarkan Kategori */}
        {kategori === ProfilKategoriEnum.VISI_DAN_MISI && (
          <>
            <input
              type="text"
              placeholder="Visi"
              className="w-full border rounded p-2"
              value={dataTambahan?.visi ?? ''}
              onChange={(e) => setDataTambahan((prev) => ({ ...prev, visi: e.target.value }))}
            />
            <textarea
              placeholder="Misi (pisahkan dengan baris baru)"
              className="w-full border rounded p-2"
              value={(dataTambahan?.misi ?? []).join('\n')}
              onChange={(e) =>
                setDataTambahan((prev) => ({
                  ...prev,
                  misi: e.target.value.split('\n').filter(Boolean),
                }))
              }
            />
          </>
        )}

        {kategori === ProfilKategoriEnum.LETAK_GEOGRAFIS_DAN_PETA_DESA && (
          <>
            <h2 className="font-semibold">Informasi Wilayah</h2>
            {['luas_wilayah', 'kecamatan', 'kabupaten', 'provinsi', 'kode_pos'].map((key) => (
              <input
                key={key}
                type="text"
                placeholder={key}
                className="w-full border rounded p-2"
                value={(dataTambahan?.informasi_wilayah?.[key as keyof typeof dataTambahan.informasi_wilayah] ?? '') as string}
                onChange={(e) =>
                  setDataTambahan((prev) => ({
                    ...prev,
                    informasi_wilayah: {
                      ...prev?.informasi_wilayah,
                      [key]: e.target.value,
                    },
                  }))
                }
              />
            ))}

            <h2 className="font-semibold">Koordinat</h2>
            {['latitude', 'longitude', 'ketinggian', 'topografi'].map((key) => (
              <input
                key={key}
                type="text"
                placeholder={key}
                className="w-full border rounded p-2"
                value={(dataTambahan?.koordinat?.[key as keyof typeof dataTambahan.koordinat] ?? '') as string}
                onChange={(e) =>
                  setDataTambahan((prev) => ({
                    ...prev,
                    koordinat: {
                      ...prev?.koordinat,
                      [key]: e.target.value,
                    },
                  }))
                }
              />
            ))}

            <h2 className="font-semibold">Batas Wilayah</h2>
            {['utara', 'selatan', 'timur', 'barat'].map((key) => (
              <input
                key={key}
                type="text"
                placeholder={key}
                className="w-full border rounded p-2"
                value={(dataTambahan?.batas_wilayah?.[key as keyof typeof dataTambahan.batas_wilayah] ?? '') as string}
                onChange={(e) =>
                  setDataTambahan((prev) => ({
                    ...prev,
                    batas_wilayah: {
                      ...prev?.batas_wilayah,
                      [key]: e.target.value,
                    },
                  }))
                }
              />
            ))}
          </>
        )}

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Simpan
        </button>
      </form>
    </div>
  );
}
