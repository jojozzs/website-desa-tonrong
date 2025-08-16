"use client";
import { JSX, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { requireIdToken } from "@/lib/client-auth";
import { ProdukUnggulan } from "@/lib/types";
import { ArrowLeft,Save, Package, FileText, Store, MapPin, Phone, Image as ImageIcon, AlertCircle, CheckCircle, Upload, X, Eye, Edit, Loader2, Star, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { OutputData } from "@editorjs/editorjs";
import EditorJs from "@/components/EditorJS";
import { AdminLogHelpers } from "@/lib/admin-log";
import { useAdminData } from "@/hooks/useAdminData";

type ProdukDetail = Omit<ProdukUnggulan, "created_at" | "updated_at"> & {
    created_at: string | null;
    updated_at: string | null;
};

type ApiDetailResponse = {
    success: boolean;
    data: ProdukDetail | null;
};

type FormState = {
    judul: string;
    deskripsi: string;
    konten?: OutputData;
    nama_umkm: string;
    alamat_umkm: string;
    kontak_umkm: string;
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

export default function ProdukEditPage(): JSX.Element {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const [f, setF] = useState<FormState>({
        judul: "",
        deskripsi: "",
        nama_umkm: "",
        alamat_umkm: "",
        kontak_umkm: "",
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

    const { admin, loading: loadingAdmin } = useAdminData();

    useEffect(() => {
        let active = true;
        (async () => {
            setLoading(true);
            setError("");
            try {
                const r = await fetch(`/api/produk-unggulan?id=${encodeURIComponent(id)}`, { cache: "no-store" });
                const j: ApiDetailResponse = await r.json();
                if (!j.success || !j.data) {
                    setError("Data produk tidak ditemukan.");
                } else if (active) {
                    const data = j.data;
                    setF({
                        judul: data.judul,
                        deskripsi: data.deskripsi,
                        konten: data.konten,
                        nama_umkm: data.nama_umkm,
                        alamat_umkm: data.alamat_umkm,
                        kontak_umkm: data.kontak_umkm,
                    });
                    setCurrentSlug(data.slug);
                    setCurrentImageUrl(data.gambar_url);
                }
            } catch {
                setError("Gagal memuat data produk.");
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
            fd.append("nama_umkm", f.nama_umkm);
            fd.append("alamat_umkm", f.alamat_umkm);
            fd.append("kontak_umkm", f.kontak_umkm);
            if (gambar) fd.append("gambar", gambar);

            const r = await fetch("/api/produk-unggulan", {
                method: "PATCH",
                headers: { Authorization: `Bearer ${t}` },
                body: fd
            });
            
            if (!r.ok) {
                setError("Gagal memperbarui produk. Silakan periksa kembali form Anda.");
                setSubmitting(false);
                return;
            }

            if (!admin) {
                setError("Gagal mencatat log. Data admin tidak ditemukan.");
                setSubmitting(false);
                return;
            }

            await AdminLogHelpers.updateProdukUnggulan(
                admin.uid,
                admin.nama,
                id,
                f.judul,
            );
            
            setSuccess(true);
            setTimeout(() => {
                router.replace("/admin/produk-unggulan");
            }, 1500);
        } catch {
            setError("Gagal memperbarui produk. Periksa koneksi internet Anda.");
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
        // Reset the file input
        const fileInput = document.getElementById('gambar-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    }

    if (loading || loadingAdmin) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 p-6">
                <div className="max-w-2xl mx-auto pt-20">
                    <div className="bg-white rounded-lg shadow-sm border border-green-100 p-8 text-center">
                        <Loader2 className="w-16 h-16 text-orange-600 mx-auto mb-4 animate-spin" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Memuat Data Produk</h2>
                        <p className="text-gray-600">
                            Mohon tunggu sebentar, sedang mengambil data produk unggulan.
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
                            Produk unggulan &quot;{f.judul}&quot; telah berhasil diperbarui.
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
                        Edit Produk Unggulan
                    </h1>
                    <p className="text-gray-600">Perbarui informasi produk unggulan UMKM desa</p>
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
                                {/* Product Information Section */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-800 pb-2 border-b border-gray-200 flex items-center">
                                        <ShoppingBag className="w-5 h-5 text-orange-600 mr-2" />
                                        Informasi Produk
                                    </h3>

                                    {/* Title */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            <span className="flex items-center">
                                                <Package className="w-4 h-4 text-orange-600 mr-2" />
                                                Nama Produk <span className="text-red-500 ml-1">*</span>
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            value={f.judul}
                                            onChange={(e) => setF({ ...f, judul: e.currentTarget.value })}
                                            required
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-700"
                                            placeholder="Masukkan nama produk unggulan..."
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
                                                Deskripsi Produk <span className="text-red-500 ml-1">*</span>
                                            </span>
                                        </label>
                                        {/* <textarea
                                            value={f.deskripsi}
                                            onChange={(e) => setF({ ...f, deskripsi: e.currentTarget.value })}
                                            required
                                            rows={4}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-none text-gray-700"
                                            placeholder="Deskripsikan produk unggulan ini secara detail..."
                                        /> */}
                                        <div className="text-gray-700">
                                            <EditorJs
                                                initialData={f.konten ?? { blocks: [] }}
                                                onChange={(data) => setF({ ...f, konten: data })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* UMKM Information Section */}
                                <div className="space-y-6 mt-9">
                                    <h3 className="text-lg font-semibold text-gray-800 pb-2 border-b border-gray-200 flex items-center">
                                        <Store className="w-5 h-5 text-blue-600 mr-2" />
                                        Informasi UMKM
                                    </h3>

                                    {/* UMKM Name */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            <span className="flex items-center">
                                                <Store className="w-4 h-4 text-blue-600 mr-2" />
                                                Nama UMKM <span className="text-red-500 ml-1">*</span>
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            value={f.nama_umkm}
                                            onChange={(e) => setF({ ...f, nama_umkm: e.currentTarget.value })}
                                            required
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-700"
                                            placeholder="Masukkan nama UMKM..."
                                        />
                                    </div>

                                    {/* UMKM Address */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            <span className="flex items-center">
                                                <MapPin className="w-4 h-4 text-red-600 mr-2" />
                                                Alamat UMKM <span className="text-red-500 ml-1">*</span>
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            value={f.alamat_umkm}
                                            onChange={(e) => setF({ ...f, alamat_umkm: e.currentTarget.value })}
                                            required
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-700"
                                            placeholder="Masukkan alamat lengkap UMKM..."
                                        />
                                    </div>

                                    {/* UMKM Contact */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            <span className="flex items-center">
                                                <Phone className="w-4 h-4 text-green-600 mr-2" />
                                                Kontak UMKM <span className="text-red-500 ml-1">*</span>
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            value={f.kontak_umkm}
                                            onChange={(e) => setF({ ...f, kontak_umkm: e.currentTarget.value })}
                                            required
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-700"
                                            placeholder="No. HP atau email kontak UMKM..."
                                        />
                                    </div>
                                </div>

                                {/* Image Upload */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        <span className="flex items-center">
                                            <ImageIcon className="w-4 h-4 text-pink-600 mr-2" />
                                            Foto Produk
                                        </span>
                                    </label>

                                    {/* Current Image */}
                                    {currentImageUrl && !gambar && (
                                        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                            <p className="text-sm text-gray-600 mb-3">Foto saat ini:</p>
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
                                                {currentImageUrl ? "Ganti foto produk" : "Drag & drop foto atau klik untuk pilih"}
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
                                                {currentImageUrl ? "Ganti Foto" : "Pilih Foto"}
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
                                                            ✓ Foto baru akan mengganti foto lama
                                                        </p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={removeImage}
                                                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors duration-200"
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
                                <Eye className="w-5 h-5 text-orange-600 mr-2" />
                                Preview Perubahan
                            </h3>
                            
                            <div className="space-y-4">
                                {/* Product Image */}
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
                                                ✓ Foto baru
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Product Title */}
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900 line-clamp-2">
                                        {f.judul || "Nama produk akan muncul di sini..."}
                                    </h4>
                                    <div className="flex items-center mt-1">
                                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                        <span className="text-sm text-gray-500 ml-1">Produk Unggulan</span>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-sm text-gray-600 line-clamp-3">
                                    {f.deskripsi || "Deskripsi produk akan muncul di sini..."}
                                </p>

                                {/* UMKM Info */}
                                <div className="space-y-2 pt-2 border-t border-gray-200">
                                    <div className="flex items-center">
                                        <Store className="w-4 h-4 text-blue-600 mr-2" />
                                        <span className="text-sm font-medium text-gray-900">
                                            {f.nama_umkm || "Nama UMKM"}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-start">
                                        <MapPin className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm text-gray-600 line-clamp-2">
                                            {f.alamat_umkm || "Alamat UMKM"}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center">
                                        <Phone className="w-4 h-4 text-green-600 mr-2" />
                                        <span className="text-sm text-gray-600">
                                            {f.kontak_umkm || "Kontak UMKM"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Edit Tips */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="font-semibold text-blue-800 mb-2">✏️ Tips Edit Produk</h3>
                            <ul className="text-sm text-blue-700 space-y-1">
                                <li>• Periksa kembali semua informasi produk</li>
                                <li>• Foto baru akan mengganti foto yang lama</li>
                                <li>• Slug sebaiknya tidak diubah jika sudah dipublikasi</li>
                                <li>• Pastikan kontak UMKM masih aktif</li>
                                <li>• Simpan perubahan setelah yakin</li>
                            </ul>
                        </div>

                        {/* Product Quality Guide */}
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <h3 className="font-semibold text-amber-800 mb-2">🏆 Standar Produk Unggulan</h3>
                            <div className="text-sm text-amber-700 space-y-2">
                                <div className="flex items-start">
                                    <Star className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0 text-yellow-500" />
                                    <div>
                                        <strong>Kualitas:</strong> Pastikan informasi produk akurat
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <Package className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
                                    <div>
                                        <strong>Deskripsi:</strong> Jelaskan keunggulan produk
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <Store className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
                                    <div>
                                        <strong>UMKM:</strong> Informasi kontak yang mudah dihubungi
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