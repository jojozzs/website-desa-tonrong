"use client";
import { JSX, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { requireIdToken } from "@/lib/client-auth";
import { BeritaPengumumanKategoriEnum } from "@/lib/enums";

type Detail = {
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

type ApiDetailResponse = {
    success: boolean;
    data: Detail | null;
};

export default function BeritaEditPage(): JSX.Element {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const [judul, setJudul] = useState<string>("");
    const [deskripsi, setDeskripsi] = useState<string>("");
    const [tanggal, setTanggal] = useState<string>(""); // yyyy-mm-dd
    const [penulis, setPenulis] = useState<string>("");
    const [kategori, setKategori] = useState<BeritaPengumumanKategoriEnum>(BeritaPengumumanKategoriEnum.BERITA);
    const [slug, setSlug] = useState<string>("");
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
                const r = await fetch(`/api/berita-pengumuman?id=${encodeURIComponent(id)}`, { cache: "no-store" });
                const j: ApiDetailResponse = await r.json();
                if (!j.success || !j.data) {
                    setError("Data tidak ditemukan.");
                } else if (active) {
                    setJudul(j.data.judul);
                    setDeskripsi(j.data.deskripsi);
                    setTanggal(j.data.tanggal ? new Date(j.data.tanggal).toISOString().slice(0, 10) : "");
                    setPenulis(j.data.penulis);
                    setKategori(j.data.kategori);
                    setSlug(j.data.slug);
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
            const t = await requireIdToken();
            const fd = new FormData();
            fd.append("id", id);
            fd.append("judul", judul);
            fd.append("deskripsi", deskripsi);
            fd.append("tanggal", tanggal);
            fd.append("penulis", penulis);
            fd.append("kategori", kategori);
            fd.append("slug", slug);
            if (gambar) fd.append("gambar", gambar);

            const r = await fetch("/api/berita-pengumuman", {
                method: "PATCH",
                headers: { Authorization: `Bearer ${t}` },
                body: fd
            });
            if (!r.ok) {
                setError("Gagal memperbarui data.");
                setSubmitting(false);
                return;
            }
            router.replace("/admin/berita-dan-pengumuman");
        } catch {
            setError("Gagal memperbarui data.");
            setSubmitting(false);
        }
    }

    if (loading) return <p>Memuat...</p>;

    return (
        <>
            <h1>Edit Berita / Pengumuman</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Judul
                        <input value={judul} onChange={(e) => setJudul(e.currentTarget.value)} required />
                    </label>
                </div>

                <div>
                    <label>
                        Deskripsi
                        <textarea value={deskripsi} onChange={(e) => setDeskripsi(e.currentTarget.value)} required />
                    </label>
                </div>

                <div>
                    <label>
                        Tanggal
                        <input
                            type="date"
                            value={tanggal}
                            onChange={(e) => setTanggal(e.currentTarget.value)}
                            required
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Penulis
                        <input value={penulis} onChange={(e) => setPenulis(e.currentTarget.value)} required />
                    </label>
                </div>

                <div>
                    <label>
                        Kategori
                        <select
                            value={kategori}
                            onChange={(e) => setKategori(e.currentTarget.value as BeritaPengumumanKategoriEnum)}
                        >
                            <option value={BeritaPengumumanKategoriEnum.BERITA}>Berita</option>
                            <option value={BeritaPengumumanKategoriEnum.PENGUMUMAN}>Pengumuman</option>
                        </select>
                    </label>
                </div>

                <div>
                    <label>
                        Slug
                        <input value={slug} onChange={(e) => setSlug(e.currentTarget.value)} />
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