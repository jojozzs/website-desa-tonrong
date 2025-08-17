"use client";
import { useRouter } from "next/navigation";
import { JSX, useState } from "react";
import { requireIdToken } from "@/lib/client-auth";
import { ArrowLeft, Upload, X, Image as ImageIcon, FileText, Type } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { AdminLogHelpers } from "@/lib/admin-log";
import { useAdminData } from "@/hooks/useAdminData";

export default function GaleriTambahPage(): JSX.Element {
    const router = useRouter();
    const [judul, setJudul] = useState<string>("");
    const [deskripsi, setDeskripsi] = useState<string>("");
    const [gambar, setGambar] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const { admin } = useAdminData();

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

            const responseData = await r.json();
            const createdId = responseData.id || responseData.data?.id || responseData.documentId || responseData.berita_id;

            if (!admin) {
                setError("Gagal mencatat log. Data admin tidak ditemukan.");
                setSubmitting(false);
                return;
            }

            if (createdId) {
                await AdminLogHelpers.createGaleri(
                    admin.uid,
                    admin.nama,
                    createdId,
                    judul
                );
            }

            router.replace("/admin/galeri");
        } catch {
            setError("Gagal menyimpan galeri.");
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

    function removeImage() {
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 p-6">
            <div className="custom-max-width mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link 
                        href="/admin/galeri"
                        className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Kembali ke Galeri
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Tambah Galeri</h1>
                    <p className="text-gray-600">Tambahkan gambar baru ke koleksi galeri</p>
                </div>

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
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-600"
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
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none  text-gray-600"
                                placeholder="Masukkan deskripsi galeri"
                            />
                        </div>

                        {/* Image Upload Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                <span className="flex items-center">
                                    <ImageIcon className="w-4 h-4 text-blue-600 mr-2" />
                                    Gambar
                                </span>
                            </label>
                            
                            {!gambar ? (
                                /* Upload Area */
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        required
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 hover:bg-green-50 transition-all duration-200">
                                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600 font-medium mb-2">
                                            Klik atau drag & drop untuk upload gambar
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Format: JPG, PNG, GIF (Maks. 10MB)
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                /* Preview Area */
                                <div className="relative">
                                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                        {previewUrl && (
                                            <div className="relative mb-4">
                                                <Image 
                                                    src={previewUrl} 
                                                    alt="Preview" 
                                                    className="w-full h-48 object-cover rounded-lg"
                                                    width={1920}
                                                    height={1080}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={removeImage}
                                                    className="absolute top-2 right-2 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors cursor-pointer"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                        
                                        {/* File Info */}
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center text-gray-600">
                                                <ImageIcon className="w-4 h-4 mr-2" />
                                                <span className="font-medium">{gambar.name}</span>
                                            </div>
                                            <span className="text-gray-500">{formatFileSize(gambar.size)}</span>
                                        </div>
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
                                className="flex-1 sm:flex-initial px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors text-center"
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
                                    "Simpan Galeri"
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Tips */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 mb-2">💡 Tips Upload Gambar</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Gunakan gambar berkualitas tinggi untuk hasil terbaik</li>
                        <li>• Format yang disarankan: JPG untuk foto, PNG untuk gambar dengan transparansi</li>
                        <li>• Ukuran file maksimal 10MB</li>
                        <li>• Pastikan gambar memiliki resolusi yang cukup untuk ditampilkan</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}