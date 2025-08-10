"use client";
import Link from "next/link";
import { JSX, useCallback, useEffect, useState } from "react";
import { requireIdToken } from "@/lib/client-auth";
import { ProdukUnggulan } from "@/lib/types";

type ProdukRow = Omit<ProdukUnggulan, "created_at" | "updated_at"> & {
    created_at: string | null;
    updated_at: string | null;
};

type ApiListResponse = {
    success: boolean;
    data: ProdukRow[];
};

export default function ProdukListPage(): JSX.Element {
    const [rows, setRows] = useState<ProdukRow[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const load = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const r = await fetch("/api/produk-unggulan", { cache: "no-store" });
            const j: ApiListResponse = await r.json();
            if (!j.success) {
                setError("Gagal memuat data.");
                setRows([]);
            } else {
                setRows(Array.isArray(j.data) ? j.data : []);
            }
        } catch {
            setError("Gagal memuat data.");
            setRows([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { void load(); }, [load]);

    async function handleDelete(id: string): Promise<void> {
        if (!confirm("Hapus item ini?")) return;
        const t = await requireIdToken();
        await fetch(`/api/produk-unggulan?id=${encodeURIComponent(id)}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${t}` }
        });
        await load();
    }

    return (
        <>
            <h1>Produk Unggulan</h1>
            <p><Link href="/admin/produk-unggulan/tambah">Tambah</Link></p>

            {loading && <p>Memuat...</p>}
            {error && <p>{error}</p>}

            {!loading && !error && (
                <table>
                    <thead>
                        <tr>
                            <th>Judul</th>
                            <th>UMKM</th>
                            <th>Slug</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r) => (
                            <tr key={r.id}>
                                <td>{r.judul}</td>
                                <td>{r.nama_umkm}</td>
                                <td>{r.slug}</td>
                                <td>
                                    <Link href={`/admin/produk-unggulan/edit/${r.id}`}>Edit</Link>{" "}
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