"use client";
import { JSX, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { requireIdToken } from "@/lib/client-auth";
import { ArrowLeft, Upload, X, Image as ImageIcon, FileText, Type, RefreshCw } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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

    const [originalData, setOriginalData] = useState<GaleriDetail | null>(null);
    const [judul, setJudul] = useState<string>("");
    const [deskripsi, setDeskripsi] = useState<string>("");
    const [gambar, setGambar] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");
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
                    setOriginalData(j.data);
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

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.currentTarget.files?.[0] ?? null;
        setGambar(file);
        
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        } else {
            setPreviewUrl("");
        }
    }

    function removeNewImage() {
        setGambar(null);
        setPreviewUrl("");
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    }

    function formatFileSize(bytes: number): string {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
        return Math.round(bytes / (1024 * 1024)) + ' MB';
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

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 p-6">
                <div className="max-w-2xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
                        <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
                        <div className="h-5 bg-gray-200 rounded w-96 mb-8"></div>
                        
                        <div className="bg-white rounded-lg shadow-sm border border-green-100 p-6">
                            <div className="space-y-6">
                                <div>
                                    <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                                    <div className="h-12 bg-gray-200 rounded"></div>
                                </div>
                                <div>
                                    <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                                    <div className="h-24 bg-gray-200 rounded"></div>
                                </div>
                                <div>
                                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                                    <div className="h-48 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error && !originalData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 p-6">
                <div className="max-w-2xl mx-auto">
                    <Link 
                        href="/admin/galeri"
                        className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Kembali ke Galeri
                    </Link>
                    
                    <div className="bg-white rounded-lg shadow-sm border border-red-100 p-8 text-center">
                        <div className="text-red-600 mb-4">
                            <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Terjadi Kesalahan</h3>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Muat Ulang
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 p-6">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link 
                        href="/admin/galeri"
                        className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Kembali ke Galeri
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Edit Galeri</h1>
                    <p className="text-gray-600">Perbarui informasi dan gambar galeri</p>
                </div>

                {/* Current Image Info */}
                {originalData && (
                    <div className="bg-white rounded-lg shadow-sm border border-green-100 p-4 mb-6">
                        <div className="flex items-start gap-4">
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200 flex-shrink-0">
                                <Image 
                                    fill
                                    className="object-cover" 
                                    unoptimized 
                                    src={originalData.gambar_url}
                                    alt={originalData.judul}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-800 mb-1">Gambar Saat Ini</h3>
                                <p className="text-sm text-gray-600 mb-2">
                                    {formatFileSize(originalData.gambar_size)} • {originalData.gambar_type?.replace('image/', '').toUpperCase()}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Terakhir diperbarui: {formatDate(originalData.updated_at || originalData.created_at)}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Form */}
                <div className="bg-white rounded-lg shadow-sm border border-green-100">
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Title Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                <span className="flex items-center">
                                    <Type className="w-4 h-4 text-green-600 mr-2" />
                                    Judul
                                </span>
                            </label>
                            <input
                                type="text"
                                value={judul}
                                onChange={(e) => setJudul(e.currentTarget.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-700"
                                placeholder="Masukkan judul galeri"
                            />
                        </div>

                        {/* Description Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                <span className="flex items-center">
                                    <FileText className="w-4 h-4 text-orange-600 mr-2" />
                                    Deskripsi
                                </span>
                            </label>
                            <textarea
                                value={deskripsi}
                                onChange={(e) => setDeskripsi(e.currentTarget.value)}
                                required
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none text-gray-700"
                                placeholder="Masukkan deskripsi galeri"
                            />
                        </div>

                        {/* Image Update Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                <span className="flex items-center">
                                    <RefreshCw className="w-4 h-4 text-blue-600 mr-2" />
                                    Ganti Gambar
                                    <span className="ml-2 text-xs font-normal text-gray-500">(opsional)</span>
                                </span>
                            </label>
                            
                            {!gambar ? (
                                /* Upload Area */
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-200">
                                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                                        <p className="text-gray-600 font-medium mb-1">
                                            Klik untuk mengganti gambar
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Biarkan kosong jika tidak ingin mengganti
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                /* New Image Preview */
                                <div className="relative">
                                    <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                                        {previewUrl && (
                                            <div className="relative mb-4">
                                                <Image 
                                                    src={previewUrl} 
                                                    alt="Preview baru" 
                                                    className="w-full h-48 object-cover rounded-lg"
                                                    width={1920}
                                                    height={1080}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={removeNewImage}
                                                    className="absolute top-2 right-2 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors cursor-pointer"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                        
                                        {/* New File Info */}
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center text-blue-700">
                                                <ImageIcon className="w-4 h-4 mr-2" />
                                                <span className="font-medium">{gambar.name}</span>
                                            </div>
                                            <span className="text-blue-600 font-medium">{formatFileSize(gambar.size)}</span>
                                        </div>
                                        <p className="text-xs text-blue-600 mt-2">
                                            ✨ Gambar baru akan menggantikan gambar lama
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-sm text-red-700 font-medium">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-200">
                            <Link
                                href="/admin/galeri"
                                className="flex-1 sm:flex-initial px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-center"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 sm:flex-initial px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {submitting ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Menyimpan...
                                    </span>
                                ) : (
                                    "Simpan Perubahan"
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Info Note */}
                <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h3 className="font-semibold text-amber-800 mb-2">ℹ️ Informasi Edit</h3>
                    <ul className="text-sm text-amber-700 space-y-1">
                        <li>• Hanya upload gambar baru jika ingin mengganti gambar yang ada</li>
                        <li>• Gambar lama akan terhapus secara otomatis setelah diganti</li>
                        <li>• Perubahan akan tersimpan setelah menekan &quot;Simpan Perubahan&quot;</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}