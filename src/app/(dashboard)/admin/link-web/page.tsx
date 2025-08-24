"use client";
import { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, Clock, Globe, ExternalLink, Save, Loader2, LinkIcon } from "lucide-react";
import { getAuth } from "firebase/auth";
import "@/lib/firebase";
import LinkWebPageSkeleton from "@/components/Dashboard/SkeletonLoader/LinkWebPageSkeleton";
import { AdminLogHelpers } from "@/lib/admin-log";
import { useAdminData } from "@/hooks/useAdminData";

export default function LinkWebPage() {
    const [link, setLink] = useState("");
    const [nama, setNama] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);
    const { admin } = useAdminData();

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/link-web", { cache: "no-store" });
                const data = await res.json();
                if (data.success && data.data) {
                    setLink(data.data.link ?? "");
                    setNama(data.data.nama ?? "");
                    setLastUpdated(data.data.updated_at ?? data.data.created_at ?? null);
                }
            } catch {
                setError("Gagal memuat data link web");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        setSuccess(false);

        try {
            const auth = getAuth();
            const currentUser = auth.currentUser;

            if (!currentUser) {
                setError("Anda belum login.");
                return;
            }

            if (!admin) {
                setError("Gagal mencatat log. Data admin tidak ditemukan.");
                return;
            }

            const token = await currentUser.getIdToken();

            const fd = new FormData();
            fd.append("link", link);
            fd.append("nama", nama);

            const res = await fetch("/api/link-web", {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: fd,
            });

            const result = await res.json();
            if (!res.ok) {
                setError(result.error || "Gagal menyimpan link");
                return;
            }

            await AdminLogHelpers.updateLinkWeb(
                admin.uid,
                admin.nama || "Unknown Admin",
                nama,
                link
            );

            setSuccess(true);
            setLastUpdated(new Date().toISOString());
            setTimeout(() => setSuccess(false), 4000);
        } catch {
            setError("Terjadi kesalahan saat menyimpan");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <LinkWebPageSkeleton />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-orange-500 rounded-2xl mb-4 shadow-lg">
                        <Globe className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-black mb-2">
                        Kelola Link Website
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Kelola dan perbarui informasi link website resmi dengan mudah dan aman
                    </p>
                </div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl shadow-xl border border-green-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-green-400 to-orange-400 px-8 py-6">
                                <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                                    <LinkIcon className="w-5 h-5" />
                                    Informasi Website
                                </h2>
                            </div>
                            
                            <div className="p-8">
                                {error && (
                                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 flex items-center gap-3 rounded-2xl animate-pulse">
                                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                {success && (
                                    <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 flex items-center gap-3 rounded-2xl animate-pulse">
                                        <CheckCircle className="w-5 h-5 flex-shrink-0" />
                                        <span>Link berhasil disimpan!</span>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="flex font-semibold text-gray-700 items-center gap-2">
                                            <Globe className="w-4 h-4" />
                                            Nama Website
                                        </label>
                                        <input
                                            type="text"
                                            value={nama}
                                            onChange={(e) => setNama(e.target.value)}
                                            className="w-full border-2 border-gray-200 px-4 py-3 rounded-2xl focus:outline-none focus:border-green-500 transition-colors duration-200 bg-gray-50 focus:bg-white text-gray-700"
                                            placeholder={nama || "Contoh: Website Kabupaten"}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="flex font-semibold text-gray-700 items-center gap-2">
                                            <ExternalLink className="w-4 h-4" />
                                            Link Website
                                        </label>
                                        <input
                                            type="url"
                                            value={link}
                                            onChange={(e) => setLink(e.target.value)}
                                            className="w-full border-2 border-gray-200 px-4 py-3 rounded-2xl focus:outline-none focus:border-green-500 transition-colors duration-200 bg-gray-50 focus:bg-white text-gray-700"
                                            placeholder={link || "https://example.com"}
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-3 cursor-pointer"
                                    >
                                        {saving ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Menyimpan...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-5 h-5" />
                                                Simpan Perubahan
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Info Sidebar */}
                    <div className="space-y-6">
                        {/* Last Updated Card */}
                        {lastUpdated && (
                            <div className="bg-white rounded-3xl shadow-lg border border-green-100 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-green-600" />
                                    </div>
                                    <h3 className="font-semibold text-gray-800">Status Terakhir</h3>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">Terakhir diperbarui:</p>
                                <p className="font-medium text-gray-800">
                                    {new Date(lastUpdated).toLocaleString("id-ID", {
                                        dateStyle: "full",
                                        timeStyle: "short"
                                    })}
                                </p>
                            </div>
                        )}

                        {/* Preview Card - Only show if there's data */}
                        {(link || nama) && (
                            <div className="bg-white rounded-3xl shadow-lg border border-green-100 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                        <ExternalLink className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <h3 className="font-semibold text-gray-800">Preview</h3>
                                </div>
                                <div className="space-y-3">
                                    {nama && (
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Nama:</p>
                                            <p className="font-medium text-gray-800 break-words">{nama}</p>
                                        </div>
                                    )}
                                    {link && (
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Link:</p>
                                            <a 
                                                href={link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-green-600 hover:text-green-800 break-all underline decoration-dotted underline-offset-2"
                                            >
                                                {link}
                                            </a>
                                        </div>
                                    )}
                                    {!nama && !link && (
                                        <p className="text-gray-400 text-sm italic">Belum ada data untuk ditampilkan</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}