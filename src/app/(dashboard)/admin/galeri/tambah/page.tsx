"use client";
import { useRouter } from "next/navigation";
import { JSX, useState } from "react";
import { requireIdToken } from "@/lib/client-auth";

export default function GaleriTambahPage(): JSX.Element {
    const router = useRouter();
    const [judul, setJudul] = useState<string>("");
    const [deskripsi, setDeskripsi] = useState<string>("");
    const [gambar, setGambar] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            const token = await requireIdToken();
            const fd = new FormData();
            fd.append("judul", judul);
            fd.append("deskripsi", deskripsi);
            if (gambar) fd.append("gambar", gambar);

            const r = await fetch("/api/galeri", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: fd
            });
            if (!r.ok) {
                setError("Gagal menyimpan galeri.");
                setSubmitting(false);
                return;
            }
            router.replace("/admin/galeri");
        } catch {
            setError("Gagal menyimpan galeri.");
            setSubmitting(false);
        }
    }

    return (
        <>
            <h1>Tambah Galeri</h1>
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