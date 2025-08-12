"use client";
import Link from "next/link";
import { JSX, useCallback, useEffect, useState } from "react";
import { requireIdToken } from "@/lib/client-auth";
import { BeritaPengumumanKategoriEnum } from "@/lib/enums";

type Kategori = BeritaPengumumanKategoriEnum | "";

type BeritaRow = {
    id: string;
    judul: string;
    deskripsi: string;
    tanggal: string | null;
    penulis: string;
    kategori: BeritaPengumumanKategoriEnum;
    slug: string;
    gambar_url: string;
    gambar_id: string;
    gambar_size: number;
    gambar_type: string;
    gambar_width?: number;
    gambar_height?: number;
    created_at: string | null;
    updated_at: string | null;
    admin_uid: string | null;
};

type ApiListResponse = {
    success: boolean;
    data: BeritaRow[];
};

export default function BeritaListPage(): JSX.Element {
    const [rows, setRows] = useState<BeritaRow[]>([]);
    const [filter, setFilter] = useState<Kategori>("");

    const load = useCallback(async () => {
        const url =
            filter === ""
                ? "/api/berita-pengumuman"
                : `/api/berita-pengumuman?kategori=${encodeURIComponent(filter)}`;
        const r = await fetch(url, { cache: "no-store" });
        const j: ApiListResponse = await r.json();
        setRows(Array.isArray(j.data) ? j.data : []);
    }, [filter]);

    useEffect(() => {
        void load();
    }, [load]);

    async function handleDelete(id: string): Promise<void> {
        if (!confirm("Hapus item ini?")) return;
        const t = await requireIdToken();
        await fetch(`/api/berita-pengumuman?id=${encodeURIComponent(id)}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${t}` }
        });
        await load();
    }

    return (
        <>
            <h1>Berita & Pengumuman</h1>

            <div>
                <Link href="/admin/berita-dan-pengumuman/tambah">Tambah</Link>
            </div>

            <div>
                <label>
                    Filter kategori
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.currentTarget.value as Kategori)}
                    >
                        <option value="">Semua</option>
                        <option value={BeritaPengumumanKategoriEnum.BERITA}>Berita</option>
                        <option value={BeritaPengumumanKategoriEnum.PENGUMUMAN}>Pengumuman</option>
                    </select>
                </label>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Judul</th>
                        <th>Kategori</th>
                        <th>Tanggal</th>
                        <th>Slug</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((r) => (
                        <tr key={r.id}>
                            <td>{r.judul}</td>
                            <td>{r.kategori}</td>
                            <td>{r.tanggal ? new Date(r.tanggal).toLocaleDateString() : "-"}</td>
                            <td>{r.slug}</td>
                            <td>
                                <Link href={`/admin/berita-dan-pengumuman/edit/${r.id}`}>Edit</Link>{" "}
                                <button type="button" onClick={() => { void handleDelete(r.id); }}>
                                    Hapus
                                </button>
                            </td>
                        </tr>
                    ))}
                    {rows.length === 0 && (
                        <tr>
                            <td colSpan={5}>Belum ada data.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    );
}