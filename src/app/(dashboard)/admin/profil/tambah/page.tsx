"use client";

import { useState } from "react";

export default function ProfilTambah() {
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [kategori, setKategori] = useState("");
  const [gambar, setGambar] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gambar) return alert("Pilih gambar");

    const fd = new FormData();
    fd.append("judul", judul);
    fd.append("deskripsi", deskripsi);
    fd.append("kategori", kategori);
    fd.append("gambar", gambar);

    const res = await fetch("/api/profil", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // token admin
      },
      body: fd,
    });

    const data = await res.json();
    if (data.success) {
      alert("Berhasil tambah profil");
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="text-black">
      <h1>Profil Tambah</h1>
      <form onSubmit={handleSubmit}>
        <input value={judul} onChange={(e) => setJudul(e.target.value)} placeholder="Judul" />
        <textarea value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} placeholder="Deskripsi" />
        <select value={kategori} onChange={(e) => setKategori(e.target.value)}>
          <option value="">Pilih kategori</option>
          <option value="sejarah">Sejarah</option>
          <option value="visi_misi">Visi Misi</option>
        </select>
        <input type="file" onChange={(e) => setGambar(e.target.files?.[0] ?? null)} />
        <button type="submit">Simpan</button>
      </form>
    </div>
  );
}
