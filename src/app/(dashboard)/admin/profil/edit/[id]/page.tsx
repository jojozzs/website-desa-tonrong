'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ProfilWithContent } from '@/lib/types';
import { ProfilKategoriEnum } from '@/lib/enums';
import Image from 'next/image';
import { requireIdToken } from '@/lib/client-auth';
import { FileText, MapPin, Target, Users, Building, History, Image as ImageIcon, Save, ArrowLeft, AlertCircle,Upload, Eye,Info, Clock, RefreshCw } from 'lucide-react';
import { AdminLogHelpers } from "@/lib/admin-log";
import { useAdminData } from "@/hooks/useAdminData";

const getKategoriIcon = (kategori: ProfilKategoriEnum) => {
    switch (kategori) {
        case ProfilKategoriEnum.SEJARAH:
            return History;
        case ProfilKategoriEnum.VISI_DAN_MISI:
            return Target;
        case ProfilKategoriEnum.STRUKTUR_PEMERINTAHAN_DESA:
            return Users;
        case ProfilKategoriEnum.LETAK_GEOGRAFIS_DAN_PETA_DESA:
            return MapPin;
        case ProfilKategoriEnum.JUMLAH_PENDUDUK_DAN_DATA_UMUM:
            return Building;
        default:
            return FileText;
    }
};

const formatKategoriName = (kategori: string) => {
    return kategori
        .replace(/-/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

export default function EditProfilPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [profil, setProfil] = useState<ProfilWithContent | null>(null);
    const [judul, setJudul] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [konten, setKonten] = useState('');
    const [gambar, setGambar] = useState<File | null>(null);
    const [preview, setPreview] = useState('');
    const [dataTambahan, setDataTambahan] = useState<ProfilWithContent['data_tambahan']>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    const { admin, loading: loadingAdmin } = useAdminData();

    const formatDate = (dateValue: string | null | { toDate?: () => Date }): string => {
        if (!dateValue) return "-";
        
        if (typeof dateValue === 'object' && dateValue.toDate) {
            return dateValue.toDate().toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            });
        }
        
        if (typeof dateValue === 'string') {
            return new Date(dateValue).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            });
        }
        
        return "-";
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`/api/profil?id=${id}`);
                if (!res.ok) {
                    setError('Gagal memuat data profil');
                    return;
                }
                const json = await res.json();
                const data: ProfilWithContent = json.data;
                setProfil(data);
                setJudul(data.judul);
                setDeskripsi(data.deskripsi);
                setKonten(data.konten ?? '');
                setPreview(data.gambar_url);
                setDataTambahan(data.data_tambahan ?? {});
                setIsDataLoaded(true);
            } catch {
                setError('Terjadi kesalahan saat memuat data');
            }
        }

        if (id) fetchData();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profil) return;

        setError('');
        setSubmitting(true);
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('judul', judul);
            formData.append('deskripsi', deskripsi);
            formData.append('konten', konten);
            formData.append('kategori', profil.kategori);
            formData.append('data_tambahan', JSON.stringify(dataTambahan));
            if (gambar) formData.append('gambar', gambar);

            const token = await requireIdToken();
            const res = await fetch(`/api/profil?id=${id}`, {
                method: 'PATCH',
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                setError("Gagal memperbarui galeri.");
                setSubmitting(false);
                return;
            }

            if (!admin) {
                setError("Gagal mencatat log. Data admin tidak ditemukan.");
                setSubmitting(false);
                return;
            }

            await AdminLogHelpers.updateProfil(
                admin.uid,
                admin.nama,
                id,
                judul,
            );

            if (res.ok) {
                router.push('/admin/profil');
            } else {
                const err = await res.json();
                setError(err.error || 'Gagal memperbarui profil');
            }
        } catch {
            setError('Terjadi kesalahan saat menyimpan perubahan');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setGambar(file);
        if (file) {
            const url = URL.createObjectURL(file);
            setPreview(url);
        }
    };

    if (!isDataLoaded && !error || loadingAdmin) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-8">
                        <div className="h-8 bg-gray-200 rounded-xl w-64 mx-auto mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded-lg w-96 mx-auto"></div>
                    </div>
                    
                    <div className="space-y-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <div className="animate-pulse space-y-6">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                                        <div className="h-12 bg-gray-200 rounded-xl"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error && !profil) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-red-800 font-semibold mb-2">Gagal Memuat Data</h3>
                        <p className="text-red-700 mb-4">{error}</p>
                        <button
                            onClick={() => router.push('/admin/profil')}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition-colors"
                        >
                            Kembali ke Daftar Profil
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!profil) return null;

    const IconComponent = getKategoriIcon(profil.kategori);

    return (
        <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <button
                            onClick={() => router.back()}
                            className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-orange-600 rounded-xl flex items-center justify-center">
                                <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Edit Profil: {formatKategoriName(profil.kategori)}
                                </h1>
                                <p className="text-gray-600">Perbarui informasi profil {formatKategoriName(profil.kategori).toLowerCase()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Metadata Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-center gap-3 text-blue-700">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm font-medium">
                                Terakhir diperbarui: {formatDate(profil.updated_at || profil.created_at)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                            <p className="text-red-800 font-medium">{error}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-green-400 to-orange-400 px-6 py-4">
                            <div className="flex items-center gap-3 text-white">
                                <FileText className="w-5 h-5" />
                                <h3 className="font-semibold">Informasi Dasar</h3>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Judul */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                                    <FileText className="w-4 h-4 text-green-600" />
                                    Judul Profil
                                </label>
                                <input
                                    type="text"
                                    placeholder="Masukkan judul profil..."
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400"
                                    value={judul}
                                    onChange={(e) => setJudul(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Deskripsi */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                                    <FileText className="w-4 h-4 text-orange-600" />
                                    Deskripsi Singkat
                                </label>
                                <textarea
                                    placeholder="Masukkan deskripsi singkat profil..."
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none text-gray-800 placeholder-gray-400"
                                    value={deskripsi}
                                    onChange={(e) => setDeskripsi(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Konten */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                                    <FileText className="w-4 h-4 text-green-600" />
                                    Konten Detail (Opsional)
                                </label>
                                <textarea
                                    placeholder="Masukkan konten detail profil (opsional)..."
                                    rows={6}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none text-gray-800 placeholder-gray-400"
                                    value={konten}
                                    onChange={(e) => setKonten(e.target.value)}
                                />
                            </div>

                            {/* Current Image Preview */}
                            {preview && (
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                                        <Eye className="w-4 h-4 text-blue-600" />
                                        Gambar Saat Ini
                                    </label>
                                    <div className="relative w-full max-w-md">
                                        <Image 
                                            src={preview} 
                                            alt="Preview gambar profil" 
                                            className="w-full h-48 object-cover rounded-xl border border-gray-200" 
                                            width={400} 
                                            height={200}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Upload New Image */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                                    <ImageIcon className="w-4 h-4 text-orange-600" />
                                    Ganti Gambar (Opsional)
                                </label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-400 transition-colors">
                                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-gray-600 font-medium">
                                            {gambar ? gambar.name : 'Klik untuk upload gambar baru'}
                                        </p>
                                        <p className="text-gray-400 text-sm mt-1">PNG, JPG, GIF hingga 10MB</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Fields Based on Category */}
                    {profil.kategori === ProfilKategoriEnum.VISI_DAN_MISI && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="bg-green-50 border-b border-green-100 px-6 py-4">
                                <div className="flex items-center gap-3 text-green-700">
                                    <Target className="w-5 h-5" />
                                    <h3 className="font-semibold">Visi dan Misi</h3>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                                        <Target className="w-4 h-4 text-green-600" />
                                        Visi
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Masukkan visi desa..."
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400"
                                        value={dataTambahan?.visi ?? ''}
                                        onChange={(e) =>
                                            setDataTambahan((prev) => ({ ...prev, visi: e.target.value }))
                                        }
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                                        <Target className="w-4 h-4 text-orange-600" />
                                        Misi (pisahkan dengan baris baru)
                                    </label>
                                    <textarea
                                        placeholder="Masukkan misi desa, pisahkan setiap misi dengan baris baru..."
                                        rows={6}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none text-gray-800 placeholder-gray-400"
                                        value={(dataTambahan?.misi ?? []).join('\n')}
                                        onChange={(e) =>
                                            setDataTambahan((prev) => ({
                                                ...prev,
                                                misi: e.target.value.split('\n').filter(Boolean),
                                            }))
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {profil.kategori === ProfilKategoriEnum.LETAK_GEOGRAFIS_DAN_PETA_DESA && (
                        <div className="space-y-8">
                            {/* Informasi Wilayah */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-4">
                                    <div className="flex items-center gap-3 text-emerald-700">
                                        <MapPin className="w-5 h-5" />
                                        <h3 className="font-semibold">Informasi Wilayah</h3>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {[
                                            { key: 'luas_wilayah', label: 'Luas Wilayah', placeholder: 'contoh: 150 Ha' },
                                            { key: 'kecamatan', label: 'Kecamatan', placeholder: 'Nama kecamatan' },
                                            { key: 'kabupaten', label: 'Kabupaten', placeholder: 'Nama kabupaten' },
                                            { key: 'provinsi', label: 'Provinsi', placeholder: 'Nama provinsi' },
                                            { key: 'kode_pos', label: 'Kode Pos', placeholder: 'contoh: 12345' }
                                        ].map(({ key, label, placeholder }) => (
                                            <div key={key} className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">{label}</label>
                                                <input
                                                    type="text"
                                                    placeholder={placeholder}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400"
                                                    value={(dataTambahan?.informasi_wilayah?.[key as keyof typeof dataTambahan.informasi_wilayah] ?? '') as string}
                                                    onChange={(e) =>
                                                        setDataTambahan((prev) => ({
                                                            ...prev,
                                                            informasi_wilayah: {
                                                                ...prev?.informasi_wilayah,
                                                                [key]: e.target.value,
                                                            },
                                                        }))
                                                    }
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Koordinat */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="bg-blue-50 border-b border-blue-100 px-6 py-4">
                                    <div className="flex items-center gap-3 text-blue-700">
                                        <MapPin className="w-5 h-5" />
                                        <h3 className="font-semibold">Koordinat dan Topografi</h3>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {[
                                            { key: 'latitude', label: 'Latitude', placeholder: 'contoh: -6.2088' },
                                            { key: 'longitude', label: 'Longitude', placeholder: 'contoh: 106.8456' },
                                            { key: 'ketinggian', label: 'Ketinggian', placeholder: 'contoh: 25 mdpl' },
                                            { key: 'topografi', label: 'Topografi', placeholder: 'contoh: Dataran rendah' }
                                        ].map(({ key, label, placeholder }) => (
                                            <div key={key} className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">{label}</label>
                                                <input
                                                    type="text"
                                                    placeholder={placeholder}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400"
                                                    value={(dataTambahan?.koordinat?.[key as keyof typeof dataTambahan.koordinat] ?? '') as string}
                                                    onChange={(e) =>
                                                        setDataTambahan((prev) => ({
                                                            ...prev,
                                                            koordinat: {
                                                                ...prev?.koordinat,
                                                                [key]: e.target.value,
                                                            },
                                                        }))
                                                    }
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Batas Wilayah */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="bg-orange-50 border-b border-orange-100 px-6 py-4">
                                    <div className="flex items-center gap-3 text-orange-700">
                                        <MapPin className="w-5 h-5" />
                                        <h3 className="font-semibold">Batas Wilayah</h3>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {[
                                            { key: 'utara', label: 'Sebelah Utara', placeholder: 'Berbatasan dengan...' },
                                            { key: 'selatan', label: 'Sebelah Selatan', placeholder: 'Berbatasan dengan...' },
                                            { key: 'timur', label: 'Sebelah Timur', placeholder: 'Berbatasan dengan...' },
                                            { key: 'barat', label: 'Sebelah Barat', placeholder: 'Berbatasan dengan...' }
                                        ].map(({ key, label, placeholder }) => (
                                            <div key={key} className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">{label}</label>
                                                <input
                                                    type="text"
                                                    placeholder={placeholder}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400"
                                                    value={(dataTambahan?.batas_wilayah?.[key as keyof typeof dataTambahan.batas_wilayah] ?? '') as string}
                                                    onChange={(e) =>
                                                        setDataTambahan((prev) => ({
                                                            ...prev,
                                                            batas_wilayah: {
                                                                ...prev?.batas_wilayah,
                                                                [key]: e.target.value,
                                                            },
                                                        }))
                                                    }
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Information Card */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                        <div className="flex items-start gap-3">
                            <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-amber-800 mb-2">Informasi Penting</h3>
                                <ul className="text-amber-700 text-sm space-y-1 leading-relaxed">
                                    <li>• Perubahan akan tersimpan setelah menekan tombol &quot;Simpan Perubahan&quot;</li>
                                    <li>• Upload gambar baru hanya jika ingin mengganti gambar yang ada</li>
                                    <li>• Pastikan semua informasi sudah benar sebelum menyimpan</li>
                                    <li>• Konten dapat berisi HTML sederhana untuk formatting</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading || submitting}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl cursor-pointer"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-3">
                                    <RefreshCw className="w-5 h-5 animate-spin" />
                                    Menyimpan Perubahan...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-3">
                                    <Save className="w-5 h-5" />
                                    Simpan Perubahan
                                </span>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => router.back()}
                            disabled={loading}
                            className="px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 cursor-pointer"
                        >
                            Batal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}