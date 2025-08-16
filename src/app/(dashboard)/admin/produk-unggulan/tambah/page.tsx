"use client";
import { useRouter } from "next/navigation";
import { JSX, useState, useEffect } from "react";
import { requireIdToken } from "@/lib/client-auth";
import { ArrowLeft,Save, Package, FileText, Store, MapPin, Phone, Link as LinkIcon, Image as ImageIcon, AlertCircle, CheckCircle, Upload, X, Eye, Star, ShoppingBag } from "lucide-react";
import Image from "next/image";
import EditorJs from "@/components/EditorJS";
import type { OutputData } from "@editorjs/editorjs";

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
    const [gambarPreview, setGambarPreview] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<boolean>(false);
    
    const [konten, setKonten] = useState<OutputData | undefined>();

    useEffect(() => {
        if (f.judul && !f.slug) {
            const autoSlug = f.judul
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim();
            setF(prev => ({ ...prev, slug: autoSlug }));
        }
    }, [f.judul, f.slug]);

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
            fd.append("judul", f.judul);
            fd.append("deskripsi", f.deskripsi);
            fd.append("nama_umkm", f.nama_umkm);
            fd.append("alamat_umkm", f.alamat_umkm);
            fd.append("kontak_umkm", f.kontak_umkm);
            fd.append("slug", f.slug);
            if (gambar) fd.append("gambar", gambar);

            fd.append("konten", JSON.stringify(konten));

            const r = await fetch("/api/produk-unggulan", {
                method: "POST",
                headers: { Authorization: `Bearer ${t}` },
                body: fd
            });
            
            if (!r.ok) {
                setError("Gagal menyimpan data. Silakan periksa kembali form Anda.");
                setSubmitting(false);
                return;
            }
            
            setSuccess(true);
            setTimeout(() => {
                router.replace("/admin/produk-unggulan");
            }, 1500);
        } catch {
            setError("Gagal menyimpan data. Periksa koneksi internet Anda.");
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

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 p-6">
                <div className="max-w-2xl mx-auto pt-20">
                    <div className="bg-white rounded-lg shadow-sm border border-green-100 p-8 text-center">
                        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Berhasil Disimpan!</h2>
                        <p className="text-gray-600 mb-4">
                            Produk unggulan &quot;{f.judul}&quot; telah berhasil ditambahkan.
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
                        <Package className="w-8 h-8 text-orange-600 mr-3" />
                        Tambah Produk Unggulan
                    </h1>
                    <p className="text-gray-600">Tambahkan produk unggulan UMKM desa baru</p>
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
                                                initialData={konten ?? { blocks: [] }}
                                                onChange={(data) => setKonten(data)}
                                            />
                                        </div>
                                    </div>

                                    {/* Slug */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            <span className="flex items-center">
                                                <LinkIcon className="w-4 h-4 text-indigo-600 mr-2" />
                                                URL Slug
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            value={f.slug}
                                            onChange={(e) => setF({ ...f, slug: e.currentTarget.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-700"
                                            placeholder="contoh: keripik-pisang-rahayu (otomatis dibuat dari nama produk)"
                                        />
                                        <p className="text-xs text-gray-500">
                                            URL akan menjadi: /produk/{f.slug || "slug-otomatis"}
                                        </p>
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
                                            Foto Produk <span className="text-red-500 ml-1">*</span>
                                        </span>
                                    </label>
                                    
                                    {!gambar ? (
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors duration-200">
                                            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-600 mb-2">Drag & drop foto produk atau klik untuk pilih</p>
                                            <p className="text-xs text-gray-500 mb-4">PNG, JPG, JPEG (Maks. 5MB)</p>
                                            <input
                                                id="gambar-input"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                required
                                                className="hidden"
                                            />
                                            <label
                                                htmlFor="gambar-input"
                                                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer transition-colors duration-200"
                                            >
                                                <Upload className="w-4 h-4 mr-2" />
                                                Pilih Foto Produk
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
                                        className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
                                            <span className="flex items-center justify-center">
                                                <Save className="w-5 h-5 mr-2" />
                                                Simpan Produk Unggulan
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
                                Preview Produk
                            </h3>
                            
                            <div className="space-y-4">
                                {/* Product Image */}
                                {gambarPreview && (
                                    <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
                                        <Image
                                            src={gambarPreview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                            width={1920}
                                            height={1080}
                                        />
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

                        {/* Tips */}
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <h3 className="font-semibold text-amber-800 mb-2">💡 Tips Menambahkan Produk</h3>
                            <ul className="text-sm text-amber-700 space-y-1">
                                <li>• Gunakan foto produk yang berkualitas tinggi</li>
                                <li>• Deskripsi sebaiknya mencakup keunggulan produk</li>
                                <li>• Sertakan informasi UMKM yang lengkap</li>
                                <li>• Pastikan kontak yang mudah dihubungi</li>
                                <li>• Slug akan otomatis dibuat dari nama produk</li>
                            </ul>
                        </div>

                        {/* Product Guide */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h3 className="font-semibold text-green-800 mb-2">🏆 Kriteria Produk Unggulan</h3>
                            <div className="text-sm text-green-700 space-y-2">
                                <div className="flex items-start">
                                    <Star className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0 text-yellow-500" />
                                    <div>
                                        <strong>Kualitas:</strong> Produk berkualitas dan unik
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <Package className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
                                    <div>
                                        <strong>Potensi:</strong> Memiliki nilai jual dan daya saing
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <Store className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
                                    <div>
                                        <strong>UMKM:</strong> Mendukung ekonomi lokal desa
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