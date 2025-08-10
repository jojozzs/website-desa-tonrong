"use client";
import { useRouter } from "next/navigation";
import { JSX, useState } from "react";
import { requireIdToken } from "@/lib/client-auth";
import { BeritaPengumumanKategoriEnum } from "@/lib/enums";

type FormState = {
    judul: string;
    deskripsi: string;
    tanggal: string;
    penulis: string;
    kategori: BeritaPengumumanKategoriEnum;
    slug: string;
};

function initialForm(): FormState {
    return {
        judul: "",
        deskripsi: "",
        tanggal: "",
        penulis: "",
        kategori: BeritaPengumumanKategoriEnum.BERITA,
        slug: ""
    };
}

export default function BeritaTambahPage(): JSX.Element {
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
            fd.append("tanggal", f.tanggal);
            fd.append("penulis", f.penulis);
            fd.append("kategori", f.kategori);
            fd.append("slug", f.slug);
            if (gambar) fd.append("gambar", gambar);

            const r = await fetch("/api/berita-pengumuman", {
                method: "POST",
                headers: { Authorization: `Bearer ${t}` },
                body: fd
            });
            if (!r.ok) {
                setError("Gagal menyimpan data.");
                setSubmitting(false);
                return;
            }
            router.replace("/admin/berita-dan-pengumuman");
        } catch {
            setError("Gagal menyimpan data.");
            setSubmitting(false);
        }
    }

    return (
        <>
            <h1>Tambah Berita / Pengumuman</h1>
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
                        Tanggal
                        <input
                            type="date"
                            value={f.tanggal}
                            onChange={(e) => setF({ ...f, tanggal: e.currentTarget.value })}
                            required
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Penulis
                        <input
                            value={f.penulis}
                            onChange={(e) => setF({ ...f, penulis: e.currentTarget.value })}
                            required
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Kategori
                        <select
                            value={f.kategori}
                            onChange={(e) =>
                                setF({ ...f, kategori: e.currentTarget.value as BeritaPengumumanKategoriEnum })
                            }
                        >
                            <option value={BeritaPengumumanKategoriEnum.BERITA}>Berita</option>
                            <option value={BeritaPengumumanKategoriEnum.PENGUMUMAN}>Pengumuman</option>
                        </select>
                    </label>
                </div>

                <div>
                    <label>
                        Slug (opsional)
                        <input
                            value={f.slug}
                            onChange={(e) => setF({ ...f, slug: e.currentTarget.value })}
                            placeholder="contoh: judul-berita-unik"
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