"use client";
import { useRouter } from "next/navigation";
import { JSX, useState } from "react";
import { requireIdToken } from "@/lib/client-auth";

type FormState = {
    judul: string;
    deskripsi: string;
    nama_umkm: string;
    alamat_umkm: string;
    kontak_umkm: string;
    slug: string;
};

function initialForm(): FormState {
    return {
        judul: "",
        deskripsi: "",
        nama_umkm: "",
        alamat_umkm: "",
        kontak_umkm: "",
        slug: ""
    };
}

export default function ProdukTambahPage(): JSX.Element {
    const router = useRouter();
    const [f, setF] = useState<FormState>(initialForm());
    const [gambar, setGambar] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            const t = await requireIdToken();
            const fd = new FormData();
            fd.append("judul", f.judul);
            fd.append("deskripsi", f.deskripsi);
            fd.append("nama_umkm", f.nama_umkm);
            fd.append("alamat_umkm", f.alamat_umkm);
            fd.append("kontak_umkm", f.kontak_umkm);
            fd.append("slug", f.slug);
            if (gambar) fd.append("gambar", gambar);

            const r = await fetch("/api/produk-unggulan", {
                method: "POST",
                headers: { Authorization: `Bearer ${t}` },
                body: fd
            });
            if (!r.ok) {
                setError("Gagal menyimpan data.");
                setSubmitting(false);
                return;
            }
            router.replace("/admin/produk-unggulan");
        } catch {
            setError("Gagal menyimpan data.");
            setSubmitting(false);
        }
    }

    return (
        <>
            <h1>Tambah Produk Unggulan</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Judul
                        <input
                            value={f.judul}
                            onChange={(e) => setF({ ...f, judul: e.currentTarget.value })}
                            required
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Deskripsi
                        <textarea
                            value={f.deskripsi}
                            onChange={(e) => setF({ ...f, deskripsi: e.currentTarget.value })}
                            required
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Nama UMKM
                        <input
                            value={f.nama_umkm}
                            onChange={(e) => setF({ ...f, nama_umkm: e.currentTarget.value })}
                            required
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Alamat UMKM
                        <input
                            value={f.alamat_umkm}
                            onChange={(e) => setF({ ...f, alamat_umkm: e.currentTarget.value })}
                            required
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Kontak UMKM
                        <input
                            value={f.kontak_umkm}
                            onChange={(e) => setF({ ...f, kontak_umkm: e.currentTarget.value })}
                            required
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Slug (opsional)
                        <input
                            value={f.slug}
                            onChange={(e) => setF({ ...f, slug: e.currentTarget.value })}
                            placeholder="contoh: keripik-pisang-rahayu"
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Gambar
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setGambar(e.currentTarget.files?.[0] ?? null)}
                            required
                        />
                    </label>
                </div>

                <div>
                    <button type="submit" disabled={submitting}>
                        {submitting ? "Menyimpan..." : "Simpan"}
                    </button>
                </div>

                {error && <p>{error}</p>}
            </form>
        </>
    );
}