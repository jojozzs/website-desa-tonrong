"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProfilWithContent } from "@/lib/types";
import { ProfilKategoriEnum } from "@/lib/enums";
import Image from "next/image";

const CATS = Object.values(ProfilKategoriEnum);

export default function ProfilList() {
  const [kategori, setKategori] = useState<string>(CATS[0]);
  const [items, setItems] = useState<ProfilWithContent[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async (kat: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/profil?kategori=${encodeURIComponent(kat)}`);
      const json = await res.json();
      if (json.success) setItems(json.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(kategori); }, [kategori]);

  return (
    <div className="space-y-4 text-black">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold">Profil List</h1>
        <Link href="/admin/profil/tambah" className="px-3 py-1 rounded bg-emerald-600 text-white text-sm">Tambah</Link>
      </div>

      <div className="flex gap-3 items-center">
        <label className="text-sm">Kategori</label>
        <select
          className="border rounded px-2 py-1"
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
        >
          {CATS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {loading ? (
        <div>Memuat…</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[800px] w-full border">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="p-2 border">Judul</th>
                <th className="p-2 border">Deskripsi</th>
                <th className="p-2 border">Kategori</th>
                <th className="p-2 border">Konten</th>
                <th className="p-2 border">Data Tambahan</th>
                <th className="p-2 border">Gambar</th>
                <th className="p-2 border">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id}>
                  <td className="p-2 border">{p.judul}</td>
                  <td className="p-2 border">{p.deskripsi}</td>
                  <td className="p-2 border">{p.kategori}</td>
                  <td className="p-2 border">{p.konten ? `${p.konten.slice(0, 50)}…` : "-"}</td>
                  <td className="p-2 border">
                    {p.data_tambahan ? (
                      <code className="text-xs">
                        {JSON.stringify(p.data_tambahan).slice(0, 60)}…
                      </code>
                    ) : "-"}
                  </td>
                  <td className="p-2 border">
                    {p.gambar_url ? <Image width={1920} height={1080} src={p.gambar_url} alt="" className="h-12 w-20 object-cover" /> : "-"}
                  </td>
                  <td className="p-2 border">
                    <Link href={`/admin/profil/edit/${p.id}`} className="text-blue-600 hover:underline">Edit</Link>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={7} className="p-3 text-center text-sm text-gray-500">Belum ada data untuk kategori ini.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
