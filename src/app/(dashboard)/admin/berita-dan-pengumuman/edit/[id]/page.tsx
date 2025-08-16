"use client";
import { JSX, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { requireIdToken } from "@/lib/client-auth";
import { BeritaPengumumanKategoriEnum } from "@/lib/enums";
import { ArrowLeft, Save, FileText, Calendar, User, Tag, Image as ImageIcon, Newspaper, Megaphone, AlertCircle, CheckCircle, Upload, X, Eye, Edit, Loader2 } from "lucide-react";
import Image from "next/image";
import { OutputData } from "@editorjs/editorjs";
import EditorJs from "@/components/EditorJS";

type Detail = {
    id: string;
    judul: string;
    deskripsi: string;
    konten?: OutputData;
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

type FormState = {
    judul: string;
    deskripsi: string;
    konten?: OutputData;
    tanggal: string;
    penulis: string;
    kategori: BeritaPengumumanKategoriEnum;
};

function generateSlugPreview(title: string): string {
    if (!title.trim()) return "slug-otomatis";
    
    return title
        .toLowerCase()
        .trim()
        .replace(/[àáâãäå]/g, 'a')
        .replace(/[èéêë]/g, 'e')
        .replace(/[ìíîï]/g, 'i')
        .replace(/[òóôõöø]/g, 'o')
        .replace(/[ùúûü]/g, 'u')
        .replace(/[ñ]/g, 'n')
        .replace(/[ç]/g, 'c')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, ' ')
        .replace(/\s/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '') || "slug-otomatis";
}

export default function BeritaEditPage(): JSX.Element {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    
    const [f, setF] = useState<FormState>({
        judul: "",
        deskripsi: "",
        tanggal: "",
        penulis: "",
        kategori: BeritaPengumumanKategoriEnum.BERITA
    });
    
    const [currentSlug, setCurrentSlug] = useState<string>("");
    const [gambar, setGambar] = useState<File | null>(null);
    const [gambarPreview, setGambarPreview] = useState<string | null>(null);
    const [currentImageUrl, setCurrentImageUrl] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<boolean>(false);

    const newSlugPreview = generateSlugPreview(f.judul);
    const slugWillChange = currentSlug && newSlugPreview !== currentSlug;

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
                    const data = j.data;
                    setF({
                        judul: data.judul,
                        deskripsi: data.deskripsi,
                        konten: data.konten,
                        tanggal: data.tanggal ? new Date(data.tanggal).toISOString().slice(0, 10) : "",
                        penulis: data.penulis,
                        kategori: data.kategori,
                    });
                    setCurrentSlug(data.slug);
                    setCurrentImageUrl(data.gambar_url);
                }
            } catch {
                setError("Gagal memuat data.");
            } finally {
                if (active) setLoading(false);
            }
        })();
        return () => { active = false; };
    }, [id]);

    useEffect(() => {
        if (gambar) {
            const objectUrl = URL.createObjectURL(gambar);
            setGambarPreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        } else {
            setGambarPreview(null);
        }
    }, [gambar]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        
        try {
            const t = await requireIdToken();
            const fd = new FormData();
            fd.append("id", id);
            fd.append("judul", f.judul);
            fd.append("deskripsi", f.deskripsi);
            if (f.konten) {
                fd.append("konten", JSON.stringify(f.konten));
            }
            fd.append("tanggal", f.tanggal);
            fd.append("penulis", f.penulis);
            fd.append("kategori", f.kategori);
            if (gambar) fd.append("gambar", gambar);

            const r = await fetch("/api/berita-pengumuman", {
                method: "PATCH",
                headers: { Authorization: `Bearer ${t}` },
                body: fd
            });
            
            if (!r.ok) {
                setError("Gagal memperbarui data. Silakan periksa kembali form Anda.");
                setSubmitting(false);
                return;
            }
            
            setSuccess(true);
            setTimeout(() => {
                router.replace("/admin/berita-dan-pengumuman");
            }, 1500);
        } catch {
            setError("Gagal memperbarui data. Periksa koneksi internet Anda.");
            setSubmitting(false);
        }
    }

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.currentTarget.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError("Ukuran gambar terlalu besar. Maksimal 5MB.");
                return;
            }
            
            if (!file.type.startsWith('image/')) {
                setError("File harus berupa gambar.");
                return;
            }
            
            setGambar(file);
            setError("");
        }
    }

    function removeImage() {
        setGambar(null);
        setGambarPreview(null);
        const fileInput = document.getElementById('gambar-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    }

    function getCategoryIcon(kategori: BeritaPengumumanKategoriEnum) {
        return kategori === BeritaPengumumanKategoriEnum.BERITA 
            ? <Newspaper className="w-5 h-5 text-blue-600" />
            : <Megaphone className="w-5 h-5 text-orange-600" />;
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 p-6">
                <div className="max-w-2xl mx-auto pt-20">
                    <div className="bg-white rounded-lg shadow-sm border border-green-100 p-8 text-center">
                        <Loader2 className="w-16 h-16 text-green-600 mx-auto mb-4 animate-spin" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Memuat Data...</h2>
                        <p className="text-gray-600">
                            Mohon tunggu sebentar, sedang mengambil data berita/pengumuman.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 p-6">
                <div className="max-w-2xl mx-auto pt-20">
                    <div className="bg-white rounded-lg shadow-sm border border-green-100 p-8 text-center">
                        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Berhasil Diperbarui!</h2>
                        <p className="text-gray-600 mb-4">
                            {f.kategori === BeritaPengumumanKategoriEnum.BERITA ? "Berita" : "Pengumuman"} &quot;{f.judul}&quot; telah berhasil diperbarui.
                        </p>
                        <p className="text-sm text-gray-500">
                            Anda akan dialihkan ke halaman daftar dalam beberapa detik...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors duration-200 cursor-pointer"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Kembali
                    </button>
                    
                    <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
                        <Edit className="w-8 h-8 text-blue-600 mr-3" />
                        Edit Berita & Pengumuman
                    </h1>
                    <p className="text-gray-600">Perbarui informasi berita atau pengumuman desa</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center">
                            <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" />
                            <p className="text-sm text-red-700 font-medium">{error}</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border border-green-100">
                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                {/* Title */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        <span className="flex items-center">
                                            <FileText className="w-4 h-4 text-green-600 mr-2" />
                                            Judul <span className="text-red-500 ml-1">*</span>
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        value={f.judul}
                                        onChange={(e) => setF({ ...f, judul: e.currentTarget.value })}
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-700"
                                        placeholder="Masukkan judul berita atau pengumuman..."
                                    />

                                    {/* Slug Changes Info */}
                                    <div className="text-xs bg-gray-50 px-3 py-2 rounded-lg border space-y-2">
                                        <div className="text-gray-500">
                                            <strong>URL saat ini:</strong> /berita/<span className="text-gray-700 font-mono">{currentSlug}</span>
                                        </div>
                                        {slugWillChange && (
                                            <div className="text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                                                <strong>⚠️ URL akan berubah menjadi:</strong> /berita/<span className="font-mono">{newSlugPreview}</span>
                                            </div>
                                        )}
                                        {!slugWillChange && f.judul && (
                                            <div className="text-green-600">
                                                ✓ URL tetap sama
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        <span className="flex items-center">
                                            <FileText className="w-4 h-4 text-green-600 mr-2" />
                                            Deskripsi <span className="text-red-500 ml-1">*</span>
                                        </span>
                                    </label>
                                    {/* <textarea
                                        value={f.deskripsi}
                                        onChange={(e) => setF({ ...f, deskripsi: e.currentTarget.value })}
                                        required
                                        rows={5}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none text-gray-700"
                                        placeholder="Tulis deskripsi lengkap berita atau pengumuman..."
                                    /> */}
                                    <div className="text-gray-700">
                                        <EditorJs
                                            initialData={f.konten ?? { blocks: [] }}
                                            onChange={(data) => setF({ ...f, konten: data })}
                                        />
                                    </div>
                                </div>

                                {/* Date and Author Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            <span className="flex items-center">
                                                <Calendar className="w-4 h-4 text-blue-600 mr-2" />
                                                Tanggal <span className="text-red-500 ml-1">*</span>
                                            </span>
                                        </label>
                                        <input
                                            type="date"
                                            value={f.tanggal}
                                            onChange={(e) => setF({ ...f, tanggal: e.currentTarget.value })}
                                            required
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-700"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            <span className="flex items-center">
                                                <User className="w-4 h-4 text-purple-600 mr-2" />
                                                Penulis <span className="text-red-500 ml-1">*</span>
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            value={f.penulis}
                                            onChange={(e) => setF({ ...f, penulis: e.currentTarget.value })}
                                            required
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-700"
                                            placeholder="Nama penulis..."
                                        />
                                    </div>
                                </div>

                                {/* Category */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        <span className="flex items-center">
                                            <Tag className="w-4 h-4 text-orange-600 mr-2" />
                                            Kategori <span className="text-red-500 ml-1">*</span>
                                        </span>
                                    </label>
                                    <select
                                        value={f.kategori}
                                        onChange={(e) =>
                                            setF({ ...f, kategori: e.currentTarget.value as BeritaPengumumanKategoriEnum })
                                        }
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white text-gray-700 cursor-pointer"
                                    >
                                        <option value={BeritaPengumumanKategoriEnum.BERITA}>📰 Berita</option>
                                        <option value={BeritaPengumumanKategoriEnum.PENGUMUMAN}>📢 Pengumuman</option>
                                    </select>
                                </div>

                                {/* Image Upload */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        <span className="flex items-center">
                                            <ImageIcon className="w-4 h-4 text-pink-600 mr-2" />
                                            Gambar
                                        </span>
                                    </label>

                                    {/* Current Image */}
                                    {currentImageUrl && !gambar && (
                                        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                            <p className="text-sm text-gray-600 mb-3">Gambar saat ini:</p>
                                            <Image
                                                src={currentImageUrl}
                                                alt="Current image"
                                                className="w-full h-48 object-cover rounded-lg"
                                                width={1920}
                                                height={1080}
                                            />
                                        </div>
                                    )}
                                    
                                    {!gambar ? (
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors duration-200">
                                            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-600 mb-2">
                                                {currentImageUrl ? "Ganti gambar" : "Drag & drop gambar atau klik untuk pilih"}
                                            </p>
                                            <p className="text-xs text-gray-500 mb-4">PNG, JPG, JPEG (Maks. 5MB)</p>
                                            <input
                                                id="gambar-input"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                            <label
                                                htmlFor="gambar-input"
                                                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer transition-colors duration-200"
                                            >
                                                <Upload className="w-4 h-4 mr-2" />
                                                {currentImageUrl ? "Ganti Gambar" : "Pilih Gambar"}
                                            </label>
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <div className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex items-start space-x-4">
                                                    {gambarPreview && (
                                                        <Image
                                                            src={gambarPreview}
                                                            alt="Preview"
                                                            className="w-20 h-20 object-cover rounded-lg"
                                                            width={1920}
                                                            height={1080}
                                                        />
                                                    )}
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-900">{gambar.name}</p>
                                                        <p className="text-sm text-gray-500">
                                                            {(gambar.size / 1024 / 1024).toFixed(2)} MB
                                                        </p>
                                                        <p className="text-xs text-green-600 mt-1">
                                                            ✓ Gambar baru akan mengganti gambar lama
                                                        </p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={removeImage}
                                                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors duration-200 cursor-pointer"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <div className="pt-4 border-t border-gray-200">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"

                                    >
                                        {submitting ? (
                                            <span className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Memperbarui...
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center">
                                                <Save className="w-5 h-5 mr-2" />
                                                Simpan Perubahan
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Sidebar Preview */}
                    <div className="space-y-6">
                        {/* Preview Card */}
                        <div className="bg-white rounded-lg shadow-sm border border-green-100 p-6">
                            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                                <Eye className="w-5 h-5 text-blue-600 mr-2" />
                                Preview Perubahan
                            </h3>
                            
                            <div className="space-y-4">
                                {/* Category Badge */}
                                <div className="flex items-center">
                                    {getCategoryIcon(f.kategori)}
                                    <span className="ml-2 text-sm font-medium text-gray-800">
                                        {f.kategori || "Kategori"}
                                    </span>
                                </div>

                                {/* Title */}
                                <h4 className="text-lg font-bold text-gray-900 line-clamp-2">
                                    {f.judul || "Judul akan muncul di sini..."}
                                </h4>

                                {/* Image Preview */}
                                {(gambarPreview || currentImageUrl) && (
                                    <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
                                        <Image
                                            src={gambarPreview || currentImageUrl}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                            width={1920}
                                            height={1080}
                                        />
                                        {gambarPreview && (
                                            <p className="text-xs text-green-600 mt-2 text-center">
                                                ✓ Gambar baru
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Description */}
                                <p className="text-sm text-gray-600 line-clamp-3">
                                    {f.deskripsi || "Deskripsi akan muncul di sini..."}
                                </p>

                                {/* Meta Info */}
                                <div className="text-xs text-gray-500 space-y-1">
                                    <div className="flex items-center">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        {f.tanggal ? new Date(f.tanggal).toLocaleDateString('id-ID') : "Tanggal"}
                                    </div>
                                    <div className="flex items-center">
                                        <User className="w-3 h-3 mr-1" />
                                        {f.penulis || "Penulis"}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Edit Tips */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="font-semibold text-blue-800 mb-2">✏️ Tips Edit</h3>
                            <ul className="text-sm text-blue-700 space-y-1">
                                <li>• Periksa kembali semua informasi</li>
                                <li>• Gambar baru akan mengganti yang lama</li>
                                <li>• Slug sebaiknya tidak diubah jika sudah dipublikasi</li>
                                <li>• Pastikan tanggal sesuai dengan konten</li>
                                <li>• Simpan perubahan setelah yakin</li>
                            </ul>
                        </div>

                        {/* Category Guide */}
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <h3 className="font-semibold text-amber-800 mb-2">📋 Panduan Kategori</h3>
                            <div className="text-sm text-amber-700 space-y-2">
                                <div className="flex items-start">
                                    <Newspaper className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
                                    <div>
                                        <strong>Berita:</strong> Informasi umum, kegiatan desa, artikel
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <Megaphone className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
                                    <div>
                                        <strong>Pengumuman:</strong> Informasi penting, jadwal, peraturan
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}