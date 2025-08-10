"use client";
import { JSX, useEffect, useState } from "react";
import { requireIdToken } from "@/lib/client-auth";

type KontakDoc = {
    id: string;
    alamat: string;
    nomor_telepon: string;
    nomor_whatsapp: string;
    email_desa: string;
    created_at: string | null;
    updated_at: string | null;
    admin_uid: string | null;
};

type ApiDetailResponse =
    | { success: true; data: KontakDoc | null }
    | { success: false; error: string };

export default function KontakDesaPage(): JSX.Element {
    const [doc, setDoc] = useState<KontakDoc | null>(null);
    const [alamat, setAlamat] = useState<string>("");
    const [telp, setTelp] = useState<string>("");
    const [wa, setWa] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        let active = true;
        (async () => {
            setLoading(true);
            setError("");
            try {
                const r = await fetch("/api/kontak-desa", { cache: "no-store" });
                const j: ApiDetailResponse = await r.json();
                if (!("success" in j) || !j.success) {
                    setError("Gagal memuat kontak desa.");
                } else if (active) {
                    const d = j.data;
                    setDoc(d);
                    setAlamat(d?.alamat ?? "");
                    setTelp(d?.nomor_telepon ?? "");
                    setWa(d?.nomor_whatsapp ?? "");
                    setEmail(d?.email_desa ?? "");
                }
            } catch {
                setError("Gagal memuat kontak desa.");
            } finally {
                if (active) setLoading(false);
            }
        })();
        return () => { active = false; };
    }, []);

    async function handleSave(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        setSaving(true);
        setError("");
        try {
            const token = await requireIdToken();
            const fd = new FormData();
            if (doc?.id) fd.append("id", doc.id); // opsional; API akan pilih singleton jika kosong
            fd.append("alamat", alamat);
            fd.append("nomor_telepon", telp);
            fd.append("nomor_whatsapp", wa);
            fd.append("email_desa", email);

            const r = await fetch("/api/kontak-desa", {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` },
                body: fd
            });
            if (!r.ok) {
                setError("Gagal menyimpan kontak.");
                setSaving(false);
                return;
            }
            // reload ringan
            const jr: ApiDetailResponse = await (await fetch("/api/kontak-desa", { cache: "no-store" })).json();
            if ("success" in jr && jr.success) setDoc(jr.data);
        } catch {
            setError("Gagal menyimpan kontak.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <>
            <h1>Kontak Desa</h1>

            {loading && <p>Memuat...</p>}
            {error && <p>{error}</p>}

            {!loading && !error && (
                <>
                    {!doc && <p>Belum ada data. Hubungi developer untuk membuat dokumen awal.</p>}

                    <form onSubmit={handleSave}>
                        <div>
                            <label>
                                Alamat
                                <input
                                    value={alamat}
                                    onChange={(e) => setAlamat(e.currentTarget.value)}
                                />
                            </label>
                        </div>

                        <div>
                            <label>
                                Nomor Telepon
                                <input
                                    value={telp}
                                    onChange={(e) => setTelp(e.currentTarget.value)}
                                />
                            </label>
                        </div>

                        <div>
                            <label>
                                Nomor WhatsApp
                                <input
                                    value={wa}
                                    onChange={(e) => setWa(e.currentTarget.value)}
                                />
                            </label>
                        </div>

                        <div>
                            <label>
                                Email Desa
                                <input
                                    type="email"
                                    inputMode="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.currentTarget.value)}
                                />
                            </label>
                        </div>

                        <div>
                            <button type="submit" disabled={saving}>
                                {saving ? "Menyimpan..." : "Simpan"}
                            </button>
                        </div>
                    </form>
                </>
            )}
        </>
    );
}