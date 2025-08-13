"use client";
import { JSX, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { requireIdToken } from "@/lib/client-auth";
import { ProdukUnggulan } from "@/lib/types";

type ProdukDetail = Omit<ProdukUnggulan, "created_at" | "updated_at"> & {
    created_at: string | null;
    updated_at: string | null;
};

type ApiDetailResponse = {
    success: boolean;
    data: ProdukDetail | null;
};

export default function ProdukEditPage(): JSX.Element {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const [judul, setJudul] = useState<string>("");
    const [deskripsi, setDeskripsi] = useState<string>("");
    const [namaUmkm, setNamaUmkm] = useState<string>("");
    const [alamatUmkm, setAlamatUmkm] = useState<string>("");
    const [kontakUmkm, setKontakUmkm] = useState<string>("");
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
                const r = await fetch(`/api/produk-unggulan?id=${encodeURIComponent(id)}`, { cache: "no-store" });
                const j: ApiDetailResponse = await r.json();
                if (!j.success || !j.data) {
                    setError("Data tidak ditemukan.");
                } else if (active) {
                    setJudul(j.data.judul);
                    setDeskripsi(j.data.deskripsi);
                    setNamaUmkm(j.data.nama_umkm);
                    setAlamatUmkm(j.data.alamat_umkm);
                    setKontakUmkm(j.data.kontak_umkm);
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
            fd.append("nama_umkm", namaUmkm);
            fd.append("alamat_umkm", alamatUmkm);
            fd.append("kontak_umkm", kontakUmkm);
            fd.append("slug", slug);
            if (gambar) fd.append("gambar", gambar);

            const r = await fetch("/api/produk-unggulan", {
                method: "PATCH",
                headers: { Authorization: `Bearer ${t}` },
                body: fd
            });
            if (!r.ok) {
                setError("Gagal memperbarui data.");
                setSubmitting(false);
                return;
            }
            router.replace("/admin/produk-unggulan");
        } catch {
            setError("Gagal memperbarui data.");
            setSubmitting(false);
        }
    }

    if (loading) return <p>Memuat...</p>;

    return (
        <>
            <h1>Edit Produk Unggulan</h1>
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
                        Nama UMKM
                        <input value={namaUmkm} onChange={(e) => setNamaUmkm(e.currentTarget.value)} required />
                    </label>
                </div>

                <div>
                    <label>
                        Alamat UMKM
                        <input value={alamatUmkm} onChange={(e) => setAlamatUmkm(e.currentTarget.value)} required />
                    </label>
                </div>

                <div>
                    <label>
                        Kontak UMKM
                        <input value={kontakUmkm} onChange={(e) => setKontakUmkm(e.currentTarget.value)} required />
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