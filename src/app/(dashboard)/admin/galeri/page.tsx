"use client";
import Link from "next/link";
import { JSX, useCallback, useEffect, useState } from "react";
import { requireIdToken } from "@/lib/client-auth";

type GaleriRow = {
    id: string;
    judul: string;
    deskripsi: string;
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
    data: GaleriRow[];
};

export default function GaleriListPage(): JSX.Element {
    const [rows, setRows] = useState<GaleriRow[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const load = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const r = await fetch("/api/galeri", { cache: "no-store" });
            const j: ApiListResponse = await r.json();
            if (!j.success) {
                setError("Gagal memuat galeri.");
                setRows([]);
            } else {
                setRows(Array.isArray(j.data) ? j.data : []);
            }
        } catch {
            setError("Gagal memuat galeri.");
            setRows([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void load();
    }, [load]);

    async function handleDelete(id: string): Promise<void> {
        const ok = window.confirm("Hapus item ini?");
        if (!ok) return;
        const token = await requireIdToken();
        await fetch(`/api/galeri?id=${encodeURIComponent(id)}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        await load();
    }

    return (
        <>
            <h1>Galeri</h1>
            <p><Link href="/admin/galeri/tambah">Tambah</Link></p>

            {loading && <p>Memuat...</p>}
            {error && <p>{error}</p>}

            {!loading && !error && (
                <table>
                    <thead>
                        <tr>
                            <th>Judul</th>
                            <th>Deskripsi</th>
                            <th>Gambar</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r) => (
                            <tr key={r.id}>
                                <td>{r.judul}</td>
                                <td>{r.deskripsi}</td>
                                <td>
                                    <a href={r.gambar_url} target="_blank" rel="noreferrer">lihat</a>
                                </td>
                                <td>
                                    <Link href={`/admin/galeri/edit/${r.id}`}>Edit</Link>{" "}
                                    <button type="button" onClick={() => { void handleDelete(r.id); }}>
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {rows.length === 0 && (
                            <tr>
                                <td colSpan={4}>Belum ada data.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </>
    );
}