"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Profil } from "@/lib/types";

export default function ProfilEdit() {
  const { id } = useParams();
  const [profil, setProfil] = useState<Profil | null>(null);
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [kategori, setKategori] = useState("");
  const [gambar, setGambar] = useState<File | null>(null);

  useEffect(() => {
    fetch(`/api/profil?id=${id}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setProfil(res.data);
          setJudul(res.data.judul);
          setDeskripsi(res.data.deskripsi);
          setKategori(res.data.kategori);
        }
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("id", id as string);
    fd.append("judul", judul);
    fd.append("deskripsi", deskripsi);
    fd.append("kategori", kategori);
    if (gambar) fd.append("gambar", gambar);

    const res = await fetch("/api/profil", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: fd,
    });

    const data = await res.json();
    if (data.success) {
      alert("Profil diperbarui");
    } else {
      alert(data.error);
    }
  };

  if (!profil) return <div>Loading...</div>;

  return (
    <div>
      <h1>Edit Profil</h1>
      <form onSubmit={handleSubmit}>
        <input value={judul} onChange={(e) => setJudul(e.target.value)} />
        <textarea value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} />
        <select value={kategori} onChange={(e) => setKategori(e.target.value)}>
          <option value="">Pilih kategori</option>
          <option value="sejarah">Sejarah</option>
          <option value="visi_misi">Visi Misi</option>
        </select>
        <input type="file" onChange={(e) => setGambar(e.target.files?.[0] ?? null)} />
        <button type="submit">Update</button>
      </form>
    </div>
  );
}
