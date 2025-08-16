'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ProfilWithContent } from '@/lib/types';
import { ProfilKategoriEnum } from '@/lib/enums';
import Image from 'next/image';
import { requireIdToken } from '@/lib/client-auth';

export default function EditProfilPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [profil, setProfil] = useState<ProfilWithContent | null>(null);
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [konten, setKonten] = useState('');
  const [gambar, setGambar] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [dataTambahan, setDataTambahan] = useState<ProfilWithContent['data_tambahan']>({});

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`/api/profil?id=${id}`);
      const json = await res.json();
      const data: ProfilWithContent = json.data;
      setProfil(data);
      setJudul(data.judul);
      setDeskripsi(data.deskripsi);
      setKonten(data.konten ?? '');
      setPreview(data.gambar_url);
      setDataTambahan(data.data_tambahan ?? {});
    }

    if (id) fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profil) return;

    const formData = new FormData();
    formData.append('judul', judul);
    formData.append('deskripsi', deskripsi);
    formData.append('konten', konten);
    formData.append('kategori', profil.kategori);
    formData.append('data_tambahan', JSON.stringify(dataTambahan));
    if (gambar) formData.append('gambar', gambar);

    const token = await requireIdToken();
    const res = await fetch(`/api/profil?id=${id}`, {
      method: 'PATCH',
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      router.push('/admin/profil');
    } else {
      const err = await res.json();
      alert(err.error || 'Gagal memperbarui profil');
    }
  };

  if (!profil) return <p>Memuat data...</p>;

  return (
    <div className="space-y-4 text-black">
      <h1 className="text-xl font-bold">Edit Profil: {profil.kategori.replace(/-/g, ' ')}</h1>
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
        {preview && (
          <Image src={preview} alt="preview" className="w-60 rounded" width={1920} height={1080} />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0] ?? null;
            setGambar(file);
            if (file) {
              const url = URL.createObjectURL(file);
              setPreview(url);
            }
          }}
        />

        {/* Field Tambahan Berdasarkan Kategori */}
        {profil.kategori === ProfilKategoriEnum.VISI_DAN_MISI && (
          <>
            <input
              type="text"
              placeholder="Visi"
              className="w-full border rounded p-2"
              value={dataTambahan?.visi ?? ''}
              onChange={(e) =>
                setDataTambahan((prev) => ({ ...prev, visi: e.target.value }))
              }
            />
            <textarea
              placeholder="Misi (baris per baris)"
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

        {profil.kategori === ProfilKategoriEnum.LETAK_GEOGRAFIS_DAN_PETA_DESA && (
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
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
}
