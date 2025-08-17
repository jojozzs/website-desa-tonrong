"use client";
import { JSX, useEffect, useState } from "react";
import { requireIdToken } from "@/lib/client-auth";
import { MapPin, Phone, MessageCircle, Mail, Save, AlertCircle, CheckCircle, Clock, Info, Eye } from "lucide-react";
import { AdminLogHelpers } from "@/lib/admin-log";
import { useAdminData } from "@/hooks/useAdminData";

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
    const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

    const { admin, loading: loadingAdmin } = useAdminData();

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

    async function handleSave(e?: React.MouseEvent): Promise<void> {
        if (e) e.preventDefault();
        setSaving(true);
        setError("");
        setSaveSuccess(false);
        
        try {
            const token = await requireIdToken();
            const fd = new FormData();
            if (doc?.id) fd.append("id", doc.id);
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

            if (!admin) {
                setError("Gagal mencatat log. Data admin tidak ditemukan.");
                // setSubmitting(false);
                return;
            }

            await AdminLogHelpers.updateKontak(
                admin.uid,
                admin.nama
            );
            
            const jr: ApiDetailResponse = await (await fetch("/api/kontak-desa", { cache: "no-store" })).json();
            if ("success" in jr && jr.success) {
                setDoc(jr.data);
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 5000);
            }
        } catch {
            setError("Gagal menyimpan kontak.");
        } finally {
            setSaving(false);
        }
    }

    function formatDate(dateString: string | null): string {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    if (loading || loadingAdmin) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
                <div className="custom-max-width mx-auto">
                    <div className="text-center mb-8">
                        <div className="h-8 bg-gray-200 rounded-xl w-64 mx-auto mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded-lg w-96 mx-auto"></div>
                    </div>
                    
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Left Column Loading */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <div className="animate-pulse space-y-6">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                                        <div className="h-12 bg-gray-200 rounded-xl"></div>
                                    </div>
                                ))}
                                <div className="h-12 bg-gray-200 rounded-xl"></div>
                            </div>
                        </div>
                        
                        {/* Right Column Loading */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <div className="animate-pulse space-y-6">
                                <div className="h-6 bg-gray-200 rounded w-32"></div>
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
            <div className="custom-max-width mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Kontak Desa</h1>
                    <p className="text-gray-600">Kelola informasi kontak yang akan ditampilkan kepada masyarakat</p>
                </div>

                {/* Status Messages */}
                {saveSuccess && (
                    <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4 transition-all duration-300">
                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                                <CheckCircle className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-emerald-800 font-medium">Berhasil disimpan!</p>
                                <p className="text-emerald-700 text-sm">Kontak desa telah diperbarui</p>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                            <p className="text-red-800 font-medium">{error}</p>
                        </div>
                    </div>
                )}

                {/* Two Column Layout */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Column - Form */}
                    <div className="space-y-6">
                        {/* Main Form Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            {/* Last Updated Banner */}
                            {doc && (
                                <div className="bg-blue-50 border-b border-blue-100 px-6 py-3">
                                    <div className="flex items-center gap-2 text-blue-700">
                                        <Clock className="w-4 h-4" />
                                        <span className="text-sm font-medium">
                                            Terakhir diperbarui: {formatDate(doc.updated_at || doc.created_at)}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="p-6 space-y-6">
                                {/* Address Field */}
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                                        <MapPin className="w-4 h-4 text-green-600" />
                                        Alamat Lengkap
                                    </label>
                                    <textarea
                                        value={alamat}
                                        onChange={(e) => setAlamat(e.currentTarget.value)}
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none text-gray-800 placeholder-gray-400"
                                        placeholder="Masukkan alamat lengkap desa..."
                                    />
                                </div>

                                {/* Phone Field */}
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                                        <Phone className="w-4 h-4 text-orange-600" />
                                        Telepon
                                    </label>
                                    <input
                                        type="tel"
                                        value={telp}
                                        onChange={(e) => setTelp(e.currentTarget.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400"
                                        placeholder="(021) 1234567"
                                    />
                                </div>

                                {/* WhatsApp Field */}
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                                        <MessageCircle className="w-4 h-4 text-green-600" />
                                        WhatsApp
                                    </label>
                                    <input
                                        type="tel"
                                        value={wa}
                                        onChange={(e) => setWa(e.currentTarget.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400"
                                        placeholder="08123456789"
                                    />
                                </div>

                                {/* Email Field */}
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                                        <Mail className="w-4 h-4 text-orange-600" />
                                        Email Desa
                                    </label>
                                    <input
                                        type="email"
                                        inputMode="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.currentTarget.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400"
                                        placeholder="info@desa.go.id"
                                    />
                                </div>

                                {/* Save Button */}
                                <div className="pt-4">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleSave(e);
                                        }}
                                        disabled={saving}
                                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl cursor-pointer"
                                    >
                                        {saving ? (
                                            <span className="flex items-center justify-center gap-3">
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Menyimpan...
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center gap-3">
                                                <Save className="w-5 h-5" />
                                                Simpan Perubahan
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Live Preview */}
                    <div className="lg:sticky lg:top-6 lg:self-start">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-green-400 to-orange-400 px-6 py-4">
                                <div className="flex items-center gap-3 text-white">
                                    <Eye className="w-5 h-5" />
                                    <h3 className="font-semibold">Preview Kontak</h3>
                                    <div className="w-2 h-2 bg-white/80 rounded-full animate-pulse ml-auto"></div>
                                </div>
                            </div>

                            <div className="p-6">
                                {(alamat || telp || wa || email) ? (
                                    <div className="space-y-4">
                                        {alamat && (
                                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl transition-all duration-200 hover:bg-gray-100">
                                                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                    <MapPin className="w-5 h-5 text-green-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-gray-800 text-sm mb-1">Alamat</p>
                                                    <p className="text-gray-700 text-sm leading-relaxed">{alamat}</p>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {telp && (
                                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl transition-all duration-200 hover:bg-gray-100">
                                                <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                                    <Phone className="w-5 h-5 text-orange-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-gray-800 text-sm mb-1">Telepon</p>
                                                    <p className="text-gray-700 text-sm">{telp}</p>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {wa && (
                                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl transition-all duration-200 hover:bg-gray-100">
                                                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                    <MessageCircle className="w-5 h-5 text-green-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-gray-800 text-sm mb-1">WhatsApp</p>
                                                    <p className="text-gray-700 text-sm">{wa}</p>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {email && (
                                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl transition-all duration-200 hover:bg-gray-100">
                                                <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                                    <Mail className="w-5 h-5 text-orange-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-gray-800 text-sm mb-1">Email</p>
                                                    <p className="text-gray-700 text-sm">{email}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Eye className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <p className="text-gray-500 font-medium mb-2">Preview Kosong</p>
                                        <p className="text-gray-400 text-sm leading-relaxed">
                                            Mulai isi form di sebelah kiri untuk melihat preview kontak yang akan ditampilkan
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Information Card */}
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mt-6">
                            <div className="flex items-start gap-3">
                                <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-amber-800 mb-2">Informasi Penting</h3>
                                    <ul className="text-amber-700 text-sm space-y-1 leading-relaxed">
                                        <li>• Informasi ini akan ditampilkan di website publik untuk masyarakat</li>
                                        <li>• Pastikan semua kontak aktif dan dapat dihubungi</li>
                                        <li>• Format WhatsApp: gunakan 08xxx atau +62xxx</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}