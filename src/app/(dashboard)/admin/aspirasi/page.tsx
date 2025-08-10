"use client";
import { JSX, useCallback, useEffect, useState } from "react";
import { requireIdToken } from "@/lib/client-auth";

type StatusType = "pending" | "done";

type AspirasiRow = {
    id: string;
    judul: string;
    nama: string;
    email: string;
    isi: string;
    status: StatusType;
    created_at: string | null;   // ISO string (atau null) dari API
    updated_at: string | null;
    admin_uid: string | null;
};

type ApiListResponse = {
    success: boolean;
    data: AspirasiRow[];
};

export default function AspirasiPage(): JSX.Element {
    const [rows, setRows] = useState<AspirasiRow[]>([]);
    const [filter, setFilter] = useState<"" | StatusType>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const load = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const token = await requireIdToken(); // GET admin-protected
            const url = filter ? `/api/aspirasi?status=${encodeURIComponent(filter)}` : "/api/aspirasi";
            const r = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
                cache: "no-store"
            });
            const j: ApiListResponse = await r.json();
            if (!j.success) {
                setError("Gagal memuat aspirasi.");
                setRows([]);
            } else {
                setRows(Array.isArray(j.data) ? j.data : []);
            }
        } catch {
            setError("Gagal memuat aspirasi.");
            setRows([]);
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        void load();
    }, [load]);

    async function setStatus(id: string, status: StatusType): Promise<void> {
        const token = await requireIdToken();
        const fd = new FormData();
        fd.append("id", id);
        fd.append("status", status);
        await fetch("/api/aspirasi", {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}` },
            body: fd
        });
        await load();
    }

    async function handleDelete(id: string): Promise<void> {
        const ok = window.confirm("Hapus aspirasi ini?");
        if (!ok) return;
        const token = await requireIdToken();
        await fetch(`/api/aspirasi?id=${encodeURIComponent(id)}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        await load();
    }

    return (
        <>
            <h1>Aspirasi</h1>

            <div>
                <label>
                    Filter status
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.currentTarget.value as "" | StatusType)}
                    >
                        <option value="">Semua</option>
                        <option value="pending">Pending</option>
                        <option value="done">Done</option>
                    </select>
                </label>
            </div>

            {loading && <p>Memuat...</p>}
            {error && <p>{error}</p>}

            {!loading && !error && (
                <table>
                    <thead>
                        <tr>
                            <th>Judul</th>
                            <th>Nama</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r) => (
                            <tr key={r.id}>
                                <td>{r.judul}</td>
                                <td>{r.nama}</td>
                                <td>{r.email}</td>
                                <td>{r.status}</td>
                                <td>
                                    <button
                                        type="button"
                                        onClick={() => { void setStatus(r.id, r.status === "pending" ? "done" : "pending"); }}
                                    >
                                        Set {r.status === "pending" ? "Done" : "Pending"}
                                    </button>{" "}
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
            )}
        </>
    );
}