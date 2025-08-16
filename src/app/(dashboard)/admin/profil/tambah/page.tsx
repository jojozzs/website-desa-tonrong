'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProfilKategoriEnum } from '@/lib/enums';
import { ProfilWithContent } from '@/lib/types';
import { requireIdToken } from '@/lib/client-auth';
import { FileText, MapPin, Target, Users, Building, History, Image as ImageIcon, Save, ArrowLeft, AlertCircle,Upload,Info } from 'lucide-react';

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

export default function TambahProfilPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const kategori = searchParams.get('kategori') as ProfilKategoriEnum | null;

    const [judul, setJudul] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [konten, setKonten] = useState<string>('');
    const [gambar, setGambar] = useState<File | null>(null);
    const [dataTambahan, setDataTambahan] = useState<ProfilWithContent['data_tambahan']>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!kategori || !(Object.values(ProfilKategoriEnum) as string[]).includes(kategori)) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-red-800 font-semibold mb-2">Kategori Tidak Valid</h3>
                        <p className="text-red-700 mb-4">Kategori profil yang dipilih tidak valid atau tidak ditemukan.</p>
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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        if (!judul || !deskripsi || !gambar) {
            setError('Judul, deskripsi, dan gambar wajib diisi.');
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('judul', judul);
            formData.append('deskripsi', deskripsi);
            formData.append('kategori', kategori);
            formData.append('gambar', gambar);
            formData.append('konten', konten);
            formData.append('data_tambahan', JSON.stringify(dataTambahan));

            const token = await requireIdToken();
            const res = await fetch('/api/profil', {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                router.push('/admin/profil');
            } else {
                const data = await res.json();
                setError(data.error || 'Gagal menyimpan profil');
            }
        } catch {
            setError('Terjadi kesalahan saat menyimpan profil');
        } finally {
            setLoading(false);
        }
    };

    const IconComponent = getKategoriIcon(kategori);

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
                                    Tambah Profil: {formatKategoriName(kategori)}
                                </h1>
                                <p className="text-gray-600">Buat profil baru untuk kategori {formatKategoriName(kategori).toLowerCase()}</p>
                            </div>
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
                                    Judul Profil *
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
                                    Deskripsi Singkat *
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

                            {/* Upload Gambar */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                                    <ImageIcon className="w-4 h-4 text-orange-600" />
                                    Gambar Profil *
                                </label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setGambar(e.target.files?.[0] ?? null)}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        required
                                    />
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-400 transition-colors">
                                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-gray-600 font-medium">
                                            {gambar ? gambar.name : 'Klik untuk upload gambar'}
                                        </p>
                                        <p className="text-gray-400 text-sm mt-1">PNG, JPG, GIF hingga 10MB</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Fields Based on Category */}
                    {kategori === ProfilKategoriEnum.VISI_DAN_MISI && (
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
                                        onChange={(e) => setDataTambahan((prev) => ({ ...prev, visi: e.target.value }))}
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

                    {kategori === ProfilKategoriEnum.LETAK_GEOGRAFIS_DAN_PETA_DESA && (
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
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <div className="flex items-start gap-3">
                            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-blue-800 mb-2">Informasi Penting</h3>
                                <ul className="text-blue-700 text-sm space-y-1 leading-relaxed">
                                    <li>• Field bertanda (*) wajib diisi</li>
                                    <li>• Gambar akan digunakan sebagai thumbnail profil</li>
                                    <li>• Gunakan gambar dengan kualitas baik dan ukuran maksimal 10MB</li>
                                    <li>• Konten dapat berisi HTML sederhana untuk formatting</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl cursor-pointer"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-3">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Menyimpan...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-3">
                                    <Save className="w-5 h-5" />
                                    Simpan Profil
                                </span>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 cursor-pointer"
                        >
                            Batal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}