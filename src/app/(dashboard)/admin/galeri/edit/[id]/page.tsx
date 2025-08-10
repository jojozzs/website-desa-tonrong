"use client";
import { JSX, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { requireIdToken } from "@/lib/client-auth";

type GaleriDetail = {
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

type ApiDetailResponse = {
    success: boolean;
    data: GaleriDetail | null;
};

export default function GaleriEditPage(): JSX.Element {
    const params = useParams<{ id: string }>();
    const id = params.id;
    const router = useRouter();

    const [judul, setJudul] = useState<string>("");
    const [deskripsi, setDeskripsi] = useState<string>("");
    const [gambar, setGambar] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        let active = true;
        (async () => {
            setLoading(true);
            setError("");
            try {
                const r = await fetch(`/api/galeri?id=${encodeURIComponent(id)}`, { cache: "no-store" });
                const j: ApiDetailResponse = await r.json();
                if (!j.success || !j.data) {
                    setError("Data tidak ditemukan.");
                } else if (active) {
                    setJudul(j.data.judul);
                    setDeskripsi(j.data.deskripsi);
                }
            } catch {
                setError("Gagal memuat data.");
            } finally {
                if (active) setLoading(false);
            }
        })();
        return () => { active = false; };
    }, [id]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            const token = await requireIdToken();
            const fd = new FormData();
            fd.append("id", id);
            fd.append("judul", judul);
            fd.append("deskripsi", deskripsi);
            if (gambar) fd.append("gambar", gambar);

            const r = await fetch("/api/galeri", {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` },
                body: fd
            });
            if (!r.ok) {
                setError("Gagal memperbarui galeri.");
                setSubmitting(false);
                return;
            }
            router.replace("/admin/galeri");
        } catch {
            setError("Gagal memperbarui galeri.");
            setSubmitting(false);
        }
    }

    if (loading) return <p>Memuat...</p>;

    return (
        <>
            <h1>Edit Galeri</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Judul
                        <input
                            value={judul}
                            onChange={(e) => setJudul(e.currentTarget.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Deskripsi
                        <textarea
                            value={deskripsi}
                            onChange={(e) => setDeskripsi(e.currentTarget.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Ganti Gambar (opsional)
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setGambar(e.currentTarget.files?.[0] ?? null)}
                        />
                    </label>
                </div>
                <div>
                    <button type="submit" disabled={submitting}>
                        {submitting ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                </div>
                {error && <p>{error}</p>}
            </form>
        </>
    );
}
