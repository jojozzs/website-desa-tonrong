'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProfilKategoriEnum } from '@/lib/enums';
import { ProfilWithContent } from '@/lib/types';
import { requireIdToken } from '@/lib/client-auth';
import { FileText, MapPin, Target, Users, Building, History, Image as ImageIcon, Save, ArrowLeft, AlertCircle, Upload, Info, Plus, Trash2, User } from 'lucide-react';
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

export default function TambahProfilPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const kategori = searchParams.get('kategori') as ProfilKategoriEnum | null;

    const [judul, setJudul] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [konten, setKonten] = useState<string>('');
    const [gambar, setGambar] = useState<File | null>(null);
    const [dataTambahan, setDataTambahan] = useState<ProfilWithContent['data_tambahan']>({
        visi: undefined,
        misi: undefined,
        informasi_wilayah: undefined,
        koordinat: undefined,
        batas_wilayah: undefined,
        pimpinan: undefined,
        perangkat: undefined,
        demografi: undefined,
        mata_pencaharian: undefined,
        kelompok_umur: undefined,
        agama: undefined,
        idm: undefined
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { admin } = useAdminData();

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

            if (!res.ok) {
                setError("Gagal menyimpan data. Silakan periksa kembali form Anda.");
                return;
            }

            const responseData = await res.json();
            const createdId = responseData.id || responseData.data?.id || responseData.documentId || responseData.berita_id;

            if (!admin) {
                setError("Gagal mencatat log. Data admin tidak ditemukan.");
                return;
            }

            if (createdId) {
                await AdminLogHelpers.createProfil(
                    admin.uid,
                    admin.nama,
                    createdId,
                    judul,
                );
            }

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
                    
                    {/* Visi dan Misi */}
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

                    {/* Letak Geografis dan Peta Desa */}
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

                    {/* Struktur Pemerintahan Desa */}
                    {kategori === ProfilKategoriEnum.STRUKTUR_PEMERINTAHAN_DESA && (
                        <div className="space-y-8 text-gray-700">
                            {/* Data Pimpinan */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="bg-indigo-50 border-b border-indigo-100 px-6 py-4">
                                    <div className="flex items-center gap-3 text-indigo-700">
                                        <User className="w-5 h-5" />
                                        <h3 className="font-semibold">Data Pimpinan</h3>
                                    </div>
                                </div>

                                <div className="p-6 space-y-6">
                                    {(dataTambahan?.pimpinan ?? []).map((pimpinan, index) => (
                                        <div key={index} className="border border-gray-200 rounded-xl p-4 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-medium text-gray-800">Pimpinan {index + 1}</h4>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setDataTambahan(prev => ({
                                                            ...prev,
                                                            pimpinan: prev?.pimpinan?.filter((_, i) => i !== index)
                                                        }));
                                                    }}
                                                    className="text-red-600 hover:text-red-700 p-1 rounded"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700 mb-2 block">Nama</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Nama pimpinan"
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                        value={pimpinan.nama || ''}
                                                        onChange={(e) => {
                                                            setDataTambahan(prev => ({
                                                                ...prev,
                                                                pimpinan: prev?.pimpinan?.map((p, i) => 
                                                                    i === index ? {...p, nama: e.target.value} : p
                                                                )
                                                            }));
                                                        }}
                                                    />
                                                </div>
                                                
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700 mb-2 block">Jabatan</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Jabatan"
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                        value={pimpinan.jabatan || ''}
                                                        onChange={(e) => {
                                                            setDataTambahan(prev => ({
                                                                ...prev,
                                                                pimpinan: prev?.pimpinan?.map((p, i) => 
                                                                    i === index ? {...p, jabatan: e.target.value} : p
                                                                )
                                                            }));
                                                        }}
                                                    />
                                                </div>
                                                
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700 mb-2 block">Periode (Opsional)</label>
                                                    <input
                                                        type="text"
                                                        placeholder="contoh: 2020-2026"
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                        value={pimpinan.periode || ''}
                                                        onChange={(e) => {
                                                            setDataTambahan(prev => ({
                                                                ...prev,
                                                                pimpinan: prev?.pimpinan?.map((p, i) => 
                                                                    i === index ? {...p, periode: e.target.value} : p
                                                                )
                                                            }));
                                                        }}
                                                    />
                                                </div>
                                                
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700 mb-2 block">URL Foto (Opsional)</label>
                                                    <input
                                                        type="text"
                                                        placeholder="https://example.com/foto.jpg"
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                        value={pimpinan.foto || ''}
                                                        onChange={(e) => {
                                                            setDataTambahan(prev => ({
                                                                ...prev,
                                                                pimpinan: prev?.pimpinan?.map((p, i) => 
                                                                    i === index ? {...p, foto: e.target.value} : p
                                                                )
                                                            }));
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setDataTambahan(prev => ({
                                                ...prev,
                                                pimpinan: [...(prev?.pimpinan ?? []), { nama: '', jabatan: '', periode: '', foto: '' }]
                                            }));
                                        }}
                                        className="w-full border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-indigo-400 hover:bg-indigo-50 transition-colors"
                                    >
                                        <Plus className="w-5 h-5 mx-auto mb-2 text-gray-400" />
                                        <span className="text-gray-600 font-medium">Tambah Pimpinan</span>
                                    </button>
                                </div>
                            </div>

                            {/* Data Perangkat */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="bg-purple-50 border-b border-purple-100 px-6 py-4">
                                    <div className="flex items-center gap-3 text-purple-700">
                                        <Users className="w-5 h-5" />
                                        <h3 className="font-semibold">Data Perangkat Desa</h3>
                                    </div>
                                </div>

                                <div className="p-6 space-y-6">
                                    {(dataTambahan?.perangkat ?? []).map((perangkat, index) => (
                                        <div key={index} className="border border-gray-200 rounded-xl p-4 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-medium text-gray-800">Perangkat {index + 1}</h4>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setDataTambahan(prev => ({
                                                            ...prev,
                                                            perangkat: prev?.perangkat?.filter((_, i) => i !== index)
                                                        }));
                                                    }}
                                                    className="text-red-600 hover:text-red-700 p-1 rounded"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700 mb-2 block">Jabatan *</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Jabatan perangkat"
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                        value={typeof perangkat === 'object' ? perangkat.jabatan : ''}
                                                        onChange={(e) => {
                                                            setDataTambahan(prev => ({
                                                                ...prev,
                                                                perangkat: prev?.perangkat?.map((p, i) => 
                                                                    i === index 
                                                                        ? (typeof p === 'object' ? {...p, jabatan: e.target.value} : {jabatan: e.target.value, nama: ''})
                                                                        : p
                                                                )
                                                            }));
                                                        }}
                                                    />
                                                </div>
                                                
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700 mb-2 block">Nama (Opsional)</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Nama perangkat"
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                        value={typeof perangkat === 'object' ? (perangkat.nama || '') : ''}
                                                        onChange={(e) => {
                                                            setDataTambahan(prev => ({
                                                                ...prev,
                                                                perangkat: prev?.perangkat?.map((p, i) => 
                                                                    i === index 
                                                                        ? (typeof p === 'object' ? {...p, nama: e.target.value} : {jabatan: '', nama: e.target.value})
                                                                        : p
                                                                )
                                                            }));
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setDataTambahan(prev => ({
                                                ...prev,
                                                perangkat: [...(prev?.perangkat ?? []), { jabatan: '', nama: '' }]
                                            }));
                                        }}
                                        className="w-full border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-purple-400 hover:bg-purple-50 transition-colors"
                                    >
                                        <Plus className="w-5 h-5 mx-auto mb-2 text-gray-400" />
                                        <span className="text-gray-600 font-medium">Tambah Perangkat</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Jumlah Penduduk dan Data Umum */}
                    {kategori === ProfilKategoriEnum.JUMLAH_PENDUDUK_DAN_DATA_UMUM && (
                        <div className="space-y-8 text-gray-700">
                            {/* Data Demografi */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="bg-cyan-50 border-b border-cyan-100 px-6 py-4">
                                    <div className="flex items-center gap-3 text-cyan-700">
                                        <Building className="w-5 h-5" />
                                        <h3 className="font-semibold">Data Demografi</h3>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 mb-2 block">Total Penduduk</label>
                                            <input
                                                type="number"
                                                placeholder="Jumlah total penduduk"
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                                value={dataTambahan?.demografi?.total_penduduk || ''}
                                                onChange={(e) => {
                                                    setDataTambahan(prev => ({
                                                        ...prev,
                                                        demografi: {
                                                            ...prev?.demografi,
                                                            total_penduduk: parseInt(e.target.value) || 0
                                                        }
                                                    }));
                                                }}
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 mb-2 block">Total Kepala Keluarga</label>
                                            <input
                                                type="number"
                                                placeholder="Jumlah kepala keluarga"
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                                value={dataTambahan?.demografi?.total_kk || ''}
                                                onChange={(e) => {
                                                    setDataTambahan(prev => ({
                                                        ...prev,
                                                        demografi: {
                                                            ...prev?.demografi,
                                                            total_kk: parseInt(e.target.value) || 0
                                                        }
                                                    }));
                                                }}
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 mb-2 block">Jumlah Laki-laki</label>
                                            <input
                                                type="number"
                                                placeholder="Jumlah penduduk laki-laki"
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                                value={dataTambahan?.demografi?.laki_laki || ''}
                                                onChange={(e) => {
                                                    setDataTambahan(prev => ({
                                                        ...prev,
                                                        demografi: {
                                                            ...prev?.demografi,
                                                            laki_laki: parseInt(e.target.value) || 0
                                                        }
                                                    }));
                                                }}
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 mb-2 block">Jumlah Perempuan</label>
                                            <input
                                                type="number"
                                                placeholder="Jumlah penduduk perempuan"
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                                value={dataTambahan?.demografi?.perempuan || ''}
                                                onChange={(e) => {
                                                    setDataTambahan(prev => ({
                                                        ...prev,
                                                        demografi: {
                                                            ...prev?.demografi,
                                                            perempuan: parseInt(e.target.value) || 0
                                                        }
                                                    }));
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Data Mata Pencaharian */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="bg-teal-50 border-b border-teal-100 px-6 py-4">
                                    <div className="flex items-center gap-3 text-teal-700">
                                        <Building className="w-5 h-5" />
                                        <h3 className="font-semibold">Data Mata Pencaharian</h3>
                                    </div>
                                </div>

                                <div className="p-6 space-y-6">
                                    {(dataTambahan?.mata_pencaharian ?? []).map((item, index) => (
                                        <div key={index} className="border border-gray-200 rounded-xl p-4 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-medium text-gray-800">Mata Pencaharian {index + 1}</h4>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setDataTambahan(prev => ({
                                                            ...prev,
                                                            mata_pencaharian: prev?.mata_pencaharian?.filter((_, i) => i !== index)
                                                        }));
                                                    }}
                                                    className="text-red-600 hover:text-red-700 p-1 rounded"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700 mb-2 block">Kategori</label>
                                                    <input
                                                        type="text"
                                                        placeholder="contoh: Petani"
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                                        value={item.kategori || ''}
                                                        onChange={(e) => {
                                                            setDataTambahan(prev => ({
                                                                ...prev,
                                                                mata_pencaharian: prev?.mata_pencaharian?.map((m, i) => 
                                                                    i === index ? {...m, kategori: e.target.value} : m
                                                                )
                                                            }));
                                                        }}
                                                    />
                                                </div>
                                                
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700 mb-2 block">Persentase (%)</label>
                                                    <input
                                                        type="number"
                                                        placeholder="0-100"
                                                        min="0"
                                                        max="100"
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                                        value={item.persen || ''}
                                                        onChange={(e) => {
                                                            setDataTambahan(prev => ({
                                                                ...prev,
                                                                mata_pencaharian: prev?.mata_pencaharian?.map((m, i) => 
                                                                    i === index ? {...m, persen: parseInt(e.target.value) || 0} : m
                                                                )
                                                            }));
                                                        }}
                                                    />
                                                </div>
                                                
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700 mb-2 block">Jumlah (Opsional)</label>
                                                    <input
                                                        type="number"
                                                        placeholder="Jumlah orang"
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                                        value={item.jumlah || ''}
                                                        onChange={(e) => {
                                                            setDataTambahan(prev => ({
                                                                ...prev,
                                                                mata_pencaharian: prev?.mata_pencaharian?.map((m, i) => 
                                                                    i === index ? {...m, jumlah: parseInt(e.target.value) || undefined} : m
                                                                )
                                                            }));
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setDataTambahan(prev => ({
                                                ...prev,
                                                mata_pencaharian: [...(prev?.mata_pencaharian ?? []), { kategori: '', persen: 0, jumlah: undefined }]
                                            }));
                                        }}
                                        className="w-full border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-teal-400 hover:bg-teal-50 transition-colors"
                                    >
                                        <Plus className="w-5 h-5 mx-auto mb-2 text-gray-400" />
                                        <span className="text-gray-600 font-medium">Tambah Mata Pencaharian</span>
                                    </button>
                                </div>
                            </div>

                            {/* Kelompok Umur */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="bg-amber-50 border-b border-amber-100 px-6 py-4">
                                    <div className="flex items-center gap-3 text-amber-700">
                                        <Users className="w-5 h-5" />
                                        <h3 className="font-semibold">Data Kelompok Umur</h3>
                                    </div>
                                </div>

                                <div className="p-6 space-y-6">
                                    {(dataTambahan?.kelompok_umur ?? []).map((item, index) => (
                                        <div key={index} className="border border-gray-200 rounded-xl p-4 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-medium text-gray-800">Kelompok Umur {index + 1}</h4>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setDataTambahan(prev => ({
                                                            ...prev,
                                                            kelompok_umur: prev?.kelompok_umur?.filter((_, i) => i !== index)
                                                        }));
                                                    }}
                                                    className="text-red-600 hover:text-red-700 p-1 rounded"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700 mb-2 block">Kelompok Umur</label>
                                                    <input
                                                        type="text"
                                                        placeholder="contoh: 0-5 tahun"
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                                        value={item.kelompok || ''}
                                                        onChange={(e) => {
                                                            setDataTambahan(prev => ({
                                                                ...prev,
                                                                kelompok_umur: prev?.kelompok_umur?.map((k, i) => 
                                                                    i === index ? {...k, kelompok: e.target.value} : k
                                                                )
                                                            }));
                                                        }}
                                                    />
                                                </div>
                                                
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700 mb-2 block">Jumlah</label>
                                                    <input
                                                        type="number"
                                                        placeholder="Jumlah orang"
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                                        value={item.jumlah || ''}
                                                        onChange={(e) => {
                                                            setDataTambahan(prev => ({
                                                                ...prev,
                                                                kelompok_umur: prev?.kelompok_umur?.map((k, i) => 
                                                                    i === index ? {...k, jumlah: parseInt(e.target.value) || 0} : k
                                                                )
                                                            }));
                                                        }}
                                                    />
                                                </div>
                                                
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700 mb-2 block">Persentase (%)</label>
                                                    <input
                                                        type="number"
                                                        placeholder="0-100"
                                                        min="0"
                                                        max="100"
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                                        value={item.persen || ''}
                                                        onChange={(e) => {
                                                            setDataTambahan(prev => ({
                                                                ...prev,
                                                                kelompok_umur: prev?.kelompok_umur?.map((k, i) => 
                                                                    i === index ? {...k, persen: parseInt(e.target.value) || 0} : k
                                                                )
                                                            }));
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setDataTambahan(prev => ({
                                                ...prev,
                                                kelompok_umur: [...(prev?.kelompok_umur ?? []), { kelompok: '', jumlah: 0, persen: 0 }]
                                            }));
                                        }}
                                        className="w-full border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-amber-400 hover:bg-amber-50 transition-colors"
                                    >
                                        <Plus className="w-5 h-5 mx-auto mb-2 text-gray-400" />
                                        <span className="text-gray-600 font-medium">Tambah Kelompok Umur</span>
                                    </button>
                                </div>
                            </div>

                            {/* Data Agama */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="bg-rose-50 border-b border-rose-100 px-6 py-4">
                                    <div className="flex items-center gap-3 text-rose-700">
                                        <Building className="w-5 h-5" />
                                        <h3 className="font-semibold">Data Agama</h3>
                                    </div>
                                </div>

                                <div className="p-6 space-y-6">
                                    {Object.entries(dataTambahan?.agama ?? {}).map(([agama, data]) => (
                                        <div key={agama} className="border border-gray-200 rounded-xl p-4 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-medium text-gray-800">Agama: {agama}</h4>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setDataTambahan(prev => {
                                                            const newAgama = {...prev?.agama};
                                                            delete newAgama[agama];
                                                            return {...prev, agama: newAgama};
                                                        });
                                                    }}
                                                    className="text-red-600 hover:text-red-700 p-1 rounded"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700 mb-2 block">Nama Agama</label>
                                                    <input
                                                        type="text"
                                                        placeholder="contoh: Islam"
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                                        value={agama}
                                                        onChange={(e) => {
                                                            if (e.target.value !== agama) {
                                                                setDataTambahan(prev => {
                                                                    const newAgama = {...prev?.agama};
                                                                    newAgama[e.target.value] = newAgama[agama];
                                                                    delete newAgama[agama];
                                                                    return {...prev, agama: newAgama};
                                                                });
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700 mb-2 block">Persentase (%)</label>
                                                    <input
                                                        type="number"
                                                        placeholder="0-100"
                                                        min="0"
                                                        max="100"
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                                        value={data.persentase || ''}
                                                        onChange={(e) => {
                                                                    setDataTambahan(prev => ({
                                                                        ...prev,
                                                                        agama: {
                                                                            ...prev?.agama,
                                                                            [agama]: {
                                                                                persentase: parseInt(e.target.value) || 0,
                                                                                jumlah: prev?.agama?.[agama]?.jumlah || 0
                                                                            }
                                                                        }
                                                                    }));
                                                                }}
                                                    />
                                                </div>
                                                
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700 mb-2 block">Jumlah (Opsional)</label>
                                                    <input
                                                        type="number"
                                                        placeholder="Jumlah orang"
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                                        value={data.jumlah || ''}
                                                        onChange={(e) => {
                                                            setDataTambahan(prev => ({
                                                                ...prev,
                                                                agama: {
                                                                    ...prev?.agama,
                                                                    [agama]: {
                                                                        persentase: parseInt(e.target.value) || 0,
                                                                        jumlah: prev?.agama?.[agama]?.jumlah || 0
                                                                    }
                                                                }
                                                            }));
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const agamaCount = Object.keys(dataTambahan?.agama ?? {}).length;
                                            const newAgamaName = `Agama ${agamaCount + 1}`;
                                            setDataTambahan(prev => ({
                                                ...prev,
                                                agama: {
                                                    ...prev?.agama,
                                                    [newAgamaName]: { persentase: 0, jumlah: undefined }
                                                }
                                            }));
                                        }}
                                        className="w-full border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-rose-400 hover:bg-rose-50 transition-colors"
                                    >
                                        <Plus className="w-5 h-5 mx-auto mb-2 text-gray-400" />
                                        <span className="text-gray-600 font-medium">Tambah Data Agama</span>
                                    </button>
                                </div>
                            </div>

                            {/* Data IDM */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-4">
                                    <div className="flex items-center gap-3 text-emerald-700">
                                        <Target className="w-5 h-5" />
                                        <h3 className="font-semibold">Data Indeks Desa Membangun (IDM)</h3>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 mb-2 block">Nilai IDM</label>
                                            <input
                                                type="text"
                                                placeholder="contoh: 0.75"
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                value={dataTambahan?.idm?.nilai || ''}
                                                onChange={(e) => {
                                                    setDataTambahan(prev => ({
                                                        ...prev,
                                                        idm: {
                                                            ...prev?.idm,
                                                            nilai: prev?.idm?.nilai || '',
                                                            status: e.target.value,
                                                            deskripsi: prev?.idm?.deskripsi
                                                        }
                                                    }));
                                                }}
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 mb-2 block">Status IDM</label>
                                            <select
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                value={dataTambahan?.idm?.status || ''}
                                                onChange={(e) => {
                                                    setDataTambahan(prev => ({
                                                        ...prev,
                                                        idm: {
                                                            ...prev?.idm,
                                                            nilai: prev?.idm?.nilai || '',
                                                            status: e.target.value,
                                                            deskripsi: prev?.idm?.deskripsi
                                                        }
                                                    }));
                                                }}
                                            >
                                                <option value="">Pilih Status IDM</option>
                                                <option value="Sangat Tertinggal">Sangat Tertinggal</option>
                                                <option value="Tertinggal">Tertinggal</option>
                                                <option value="Berkembang">Berkembang</option>
                                                <option value="Maju">Maju</option>
                                                <option value="Mandiri">Mandiri</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-6">
                                        <label className="text-sm font-medium text-gray-700 mb-2 block">Deskripsi IDM (Opsional)</label>
                                        <textarea
                                            placeholder="Deskripsi tambahan tentang status IDM..."
                                            rows={4}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 resize-none text-gray-800 placeholder-gray-400"
                                            value={dataTambahan?.idm?.deskripsi || ''}
                                            onChange={(e) => {
                                                setDataTambahan(prev => ({
                                                    ...prev,
                                                    idm: {
                                                        ...prev?.idm,
                                                        nilai: prev?.idm?.nilai || '',
                                                        status: prev?.idm?.status || '',
                                                        deskripsi: e.target.value
                                                    }
                                                }));
                                            }}
                                        />
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
                                    {kategori === ProfilKategoriEnum.STRUKTUR_PEMERINTAHAN_DESA && (
                                        <li>• Data pimpinan dan perangkat dapat ditambahkan sesuai kebutuhan</li>
                                    )}
                                    {kategori === ProfilKategoriEnum.JUMLAH_PENDUDUK_DAN_DATA_UMUM && (
                                        <li>• Pastikan total persentase tidak melebihi 100% untuk setiap kategori</li>
                                    )}
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