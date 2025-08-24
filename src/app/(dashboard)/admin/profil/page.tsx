'use client';
import { useSemuaProfilData } from '@/hooks/useSemuaProfilData';
import { ProfilKategoriEnum } from '@/lib/enums';
import { FileText, Plus, Edit3, Clock, Users, Building, MapPin, Target, History, Eye } from 'lucide-react';
import Link from 'next/link';

const kategoriList = Object.values(ProfilKategoriEnum);

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

const getPreviewSlug = (kategori: ProfilKategoriEnum): string => {
    switch (kategori) {
        case ProfilKategoriEnum.SEJARAH:
            return 'sejarah';
        case ProfilKategoriEnum.VISI_DAN_MISI:
            return 'visimisi';
        case ProfilKategoriEnum.STRUKTUR_PEMERINTAHAN_DESA:
            return 'struktur-pemerintahan';
        case ProfilKategoriEnum.LETAK_GEOGRAFIS_DAN_PETA_DESA:
            return 'letak-geografis';
        case ProfilKategoriEnum.JUMLAH_PENDUDUK_DAN_DATA_UMUM:
            return 'data-penduduk';
        default:
            return '';
    }
};

const getKategoriColor = (kategori: ProfilKategoriEnum) => {
    const colors: Record<ProfilKategoriEnum, string> = {
        [ProfilKategoriEnum.SEJARAH]: 'bg-blue-100 text-blue-600 border-blue-200',
        [ProfilKategoriEnum.VISI_DAN_MISI]: 'bg-green-100 text-green-600 border-green-200',
        [ProfilKategoriEnum.STRUKTUR_PEMERINTAHAN_DESA]: 'bg-orange-100 text-orange-600 border-orange-200',
        [ProfilKategoriEnum.LETAK_GEOGRAFIS_DAN_PETA_DESA]: 'bg-emerald-100 text-emerald-600 border-emerald-200',
        [ProfilKategoriEnum.JUMLAH_PENDUDUK_DAN_DATA_UMUM]: 'bg-purple-100 text-purple-600 border-purple-200',
    };
    return colors[kategori] || 'bg-gray-100 text-gray-600 border-gray-200';
};

const formatKategoriName = (kategori: string) => {
    return kategori
        .replace(/-/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

export default function AdminProfilPage() {
    const { data, loading, error } = useSemuaProfilData();

    const getProfilByKategori = (kategori: ProfilKategoriEnum) =>
        data.find((item) => item.kategori === kategori);

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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
                <div className="custom-max-width mx-auto">
                    <div className="text-center mb-8">
                        <div className="h-8 bg-gray-200 rounded-xl w-64 mx-auto mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded-lg w-96 mx-auto"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[300px]">
                                <div className="animate-pulse space-y-4">
                                    <div className="h-12 w-12 bg-gray-200 rounded-xl"></div>
                                    <div className="h-5 bg-gray-200 rounded w-32"></div>
                                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                                    <div className="h-10 bg-gray-200 rounded-xl"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
                <div className="custom-max-width mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-red-800 font-semibold mb-2">Gagal Memuat Data</h3>
                        <p className="text-red-700">{error}</p>
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Manajemen Profil Desa</h1>
                    <p className="text-gray-600">Kelola semua informasi profil desa berdasarkan kategori</p>
                </div>

                {/* Profil Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {kategoriList.map((kategori) => {
                        const existing = getProfilByKategori(kategori);
                        const IconComponent = getKategoriIcon(kategori);
                        const colorClass = getKategoriColor(kategori);
                        
                        return (
                            <div key={kategori} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 min-h-[300px] flex flex-col">
                                <div className="p-6 flex-1 flex flex-col">
                                    {/* Icon & Title */}
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center border ${colorClass}`}>
                                            <IconComponent className="w-7 h-7" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-gray-900 text-lg mb-1">
                                                {formatKategoriName(kategori)}
                                            </h3>
                                            <p className="text-gray-600 text-sm">
                                                {existing ? 'Siap dipublikasikan' : 'Perlu dibuat'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Metadata - Only for existing profiles */}
                                    {existing && (
                                        <div className="bg-gray-50 rounded-xl py-3 px-4 mb-3">
                                            <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                                                <Clock className="w-4 h-4" />
                                                <span>Terakhir diperbarui</span>
                                            </div>
                                            <p className="text-gray-800 font-medium text-sm">
                                                {formatDate(existing.updated_at || existing.created_at)}
                                            </p>
                                        </div>
                                    )}

                                    {/* Spacer for cards without metadata */}
                                    {!existing && <div className="flex-1"></div>}

                                    {/* Action Buttons - Always at the bottom */}
                                    <div className="space-y-3 mt-auto">
                                        {existing ? (
                                            <div className="space-y-2">
                                                <Link href={`/admin/profil/edit/${existing.id}`} className="block">
                                                    <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer">
                                                        <span className="flex items-center justify-center gap-2">
                                                            <Edit3 className="w-4 h-4" />
                                                            Edit Profil
                                                        </span>
                                                    </button>
                                                </Link>
                                                
                                                {/* Preview Button */}
                                                <Link href={`/profil/${getPreviewSlug(kategori)}`} target="_blank">
                                                    <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 cursor-pointer">
                                                        <span className="flex items-center justify-center gap-2 cursor-pointer">
                                                            <Eye className="w-4 h-4" />
                                                            Preview
                                                        </span>
                                                    </button>
                                                </Link>
                                            </div>
                                        ) : (
                                            <Link href={`/admin/profil/tambah?kategori=${kategori}`} className="block">
                                                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer">
                                                    <span className="flex items-center justify-center gap-2">
                                                        <Plus className="w-4 h-4" />
                                                        Tambah Profil
                                                    </span>
                                                </button>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}