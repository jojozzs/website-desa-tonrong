"use client";
import Link from "next/link";
import { JSX, useCallback, useEffect, useState } from "react";
import { requireIdToken } from "@/lib/client-auth";
import { BeritaPengumumanKategoriEnum } from "@/lib/enums";
import { Newspaper, Megaphone, Plus, Calendar, User, Edit3, Trash2, AlertCircle, Search, FileText } from "lucide-react";
import Image from "next/image";

type Kategori = BeritaPengumumanKategoriEnum | "";

type BeritaRow = {
    id: string;
    judul: string;
    deskripsi: string;
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

type ApiListResponse = {
    success: boolean;
    data: BeritaRow[];
};

export default function BeritaListPage(): JSX.Element {
    const [rows, setRows] = useState<BeritaRow[]>([]);
    const [filter, setFilter] = useState<Kategori>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const url =
                filter === ""
                    ? "/api/berita-pengumuman"
                    : `/api/berita-pengumuman?kategori=${encodeURIComponent(filter)}`;
            const r = await fetch(url, { cache: "no-store" });
            const j: ApiListResponse = await r.json();
            setRows(Array.isArray(j.data) ? j.data : []);
        } catch (error) {
            console.error("Failed to load data:", error);
            setRows([]);
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        void load();
    }, [load]);

    async function handleDelete(id: string): Promise<void> {
        const t = await requireIdToken();
        await fetch(`/api/berita-pengumuman?id=${encodeURIComponent(id)}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${t}` }
        });
        setDeleteConfirm(null);
        await load();
    }

    function formatDate(dateString: string | null): string {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }

    function getCategoryIcon(kategori: BeritaPengumumanKategoriEnum) {
        return kategori === BeritaPengumumanKategoriEnum.BERITA 
            ? <Newspaper className="w-4 h-4" />
            : <Megaphone className="w-4 h-4" />;
    }

    function getCategoryColor(kategori: BeritaPengumumanKategoriEnum) {
        return kategori === BeritaPengumumanKategoriEnum.BERITA 
            ? "bg-blue-100 text-blue-800 border-blue-200"
            : "bg-orange-100 text-orange-800 border-orange-200";
    }

    const filteredRows = rows.filter(row => {
        const matchesSearch = row.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.penulis.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.kategori.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesSearch;
    });

    const beritaCount = rows.filter(r => r.kategori === BeritaPengumumanKategoriEnum.BERITA).length;
    const pengumumanCount = rows.filter(r => r.kategori === BeritaPengumumanKategoriEnum.PENGUMUMAN).length;

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="animate-pulse">
                        {/* Header skeleton */}
                        <div className="mb-6 sm:mb-8">
                            <div className="h-8 sm:h-14 bg-gray-200 rounded w-48 sm:w-64 mb-2"></div>
                            <div className="h-4 sm:h-12 bg-gray-200 rounded w-64 sm:w-96"></div>
                        </div>
                        
                        {/* Stats skeleton */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                                            <div className="h-6 sm:h-8 bg-gray-200 rounded w-12"></div>
                                        </div>
                                        <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gray-200 rounded-full"></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Content skeleton */}
                        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
                            <div className="space-y-4">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="flex items-start gap-4">
                                        <div className="h-12 w-12 sm:h-16 sm:w-16 bg-gray-200 rounded-lg"></div>
                                        <div className="flex-1">
                                            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                                            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
                <div className="max-w-6xl mx-auto p-4 sm:p-6">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                                <div>
                                    <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900">
                                        <span className="hidden sm:inline">Berita & Pengumuman</span>
                                        <span className="sm:hidden">Berita</span>
                                    </h1>
                                    <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Kelola berita dan pengumuman Desa Tonrong</p>
                                </div>
                            </div>
                            
                            {/* Add Button - Always visible */}
                            <Link 
                                href="/admin/berita-dan-pengumuman/tambah"
                                className="inline-flex items-center px-3 sm:px-6 py-2 sm:py-2.5 bg-green-700 hover:bg-green-600 text-white font-medium rounded-lg hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
                            >
                                <Plus className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" />
                                <span className="hidden sm:inline">Tambah Baru</span>
                            </Link>
                        </div>

                        {/* Search and Filter - Simplified */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* Search */}
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Cari berita / pengumuman..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-3 py-2.5 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700"
                                />
                            </div>

                            {/* Simple Filter Tabs - Mobile Friendly */}
                            <div className="flex bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setFilter("")}
                                    className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                                        filter === "" 
                                            ? "bg-white text-green-700 shadow-sm" 
                                            : "text-gray-600 hover:text-gray-800"
                                    }`}
                                >
                                    Semua
                                </button>
                                <button
                                    onClick={() => setFilter(BeritaPengumumanKategoriEnum.BERITA)}
                                    className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                                        filter === BeritaPengumumanKategoriEnum.BERITA 
                                            ? "bg-white text-blue-700 shadow-sm" 
                                            : "text-gray-600 hover:text-gray-800"
                                    }`}
                                >
                                    Berita
                                </button>
                                <button
                                    onClick={() => setFilter(BeritaPengumumanKategoriEnum.PENGUMUMAN)}
                                    className={`px-2 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                                        filter === BeritaPengumumanKategoriEnum.PENGUMUMAN 
                                            ? "bg-white text-orange-700 shadow-sm" 
                                            : "text-gray-600 hover:text-gray-800"
                                    }`}
                                >
                                    <span className="hidden sm:inline">Pengumuman</span>
                                    <span className="sm:hidden">Pengumuman</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-4 sm:p-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
                    <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-3 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="mb-2 sm:mb-0">
                                <p className="text-xs sm:text-sm font-medium text-blue-600 mb-1">Berita</p>
                                <p className="text-lg sm:text-2xl font-bold text-blue-800">{beritaCount}</p>
                            </div>
                            <div className="hidden sm:block p-2 sm:p-3 bg-blue-100 rounded-full">
                                <Newspaper className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-3 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="mb-2 sm:mb-0">
                                <p className="text-xs sm:text-sm font-medium text-orange-600 mb-1">
                                    <span className="hidden sm:inline">Pengumuman</span>
                                    <span className="sm:hidden">Pengumuman</span>
                                </p>
                                <p className="text-lg sm:text-2xl font-bold text-orange-800">{pengumumanCount}</p>
                            </div>
                            <div className="hidden sm:block p-2 sm:p-3 bg-orange-100 rounded-full">
                                <Megaphone className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-green-100 p-3 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="mb-2 sm:mb-0">
                                <p className="text-xs sm:text-sm font-medium text-green-600 mb-1">Total</p>
                                <p className="text-lg sm:text-2xl font-bold text-green-800">{rows.length}</p>
                            </div>
                            <div className="hidden sm:block p-2 sm:p-3 bg-green-100 rounded-full">
                                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                {filteredRows.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-8 sm:p-12 text-center">
                        <div className="text-orange-600 mb-4 sm:mb-6">
                            <FileText className="h-12 w-12 sm:h-16 sm:w-16 mx-auto opacity-50" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">
                            {searchTerm ? "Tidak Ada Hasil Pencarian" : "Belum Ada Data"}
                        </h3>
                        <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
                            {searchTerm 
                                ? `Tidak ditemukan berita atau pengumuman dengan kata kunci "${searchTerm}"`
                                : "Belum ada berita atau pengumuman yang dibuat. Mulai dengan menambahkan yang pertama."
                            }
                        </p>
                        {!searchTerm && (
                            <Link 
                                href="/admin/berita-dan-pengumuman/tambah"
                                className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-200"
                            >
                                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                Tambah Berita/Pengumuman
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
                        {/* Desktop Table View */}
                        <div className="hidden lg:block">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Judul & Deskripsi
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Kategori
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Tanggal
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Penulis
                                        </th>
                                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredRows.map((r) => (
                                        <tr key={r.id} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="px-6 py-4">
                                                <div className="flex items-start space-x-3">
                                                    {r.gambar_url && (
                                                        <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                                                            <Image 
                                                                src={r.gambar_url} 
                                                                alt=""
                                                                className="w-full h-full object-cover"
                                                                width={48}
                                                                height={48}
                                                                unoptimized
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                                                            {r.judul}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 line-clamp-2">
                                                            {r.deskripsi}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Slug: {r.slug}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(r.kategori)}`}>
                                                    {getCategoryIcon(r.kategori)}
                                                    <span className="ml-1">{r.kategori}</span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <Calendar className="w-4 h-4 mr-1" />
                                                    {formatDate(r.tanggal)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <User className="w-4 h-4 mr-1" />
                                                    {r.penulis}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <Link 
                                                        href={`/admin/berita-dan-pengumuman/edit/${r.id}`}
                                                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors duration-150"
                                                        title="Edit"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </Link>
                                                    <button 
                                                        type="button" 
                                                        onClick={() => setDeleteConfirm(r.id)}
                                                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors duration-150"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile & Tablet Card View - Redesigned */}
                        <div className="lg:hidden divide-y divide-gray-200">
                            {filteredRows.map((r) => (
                                <div key={r.id} className="p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start gap-3">
                                        {r.gambar_url && (
                                            <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-gray-100">
                                                <Image 
                                                    src={r.gambar_url} 
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                    width={64}
                                                    height={64}
                                                    unoptimized
                                                />
                                            </div>
                                        )}
                                        
                                        <div className="flex-1 min-w-0">
                                            {/* Category badge at top */}
                                            <div className="flex items-center justify-between mb-2">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(r.kategori)}`}>
                                                    {getCategoryIcon(r.kategori)}
                                                    <span className="ml-1">{r.kategori}</span>
                                                </span>
                                            </div>
                                            
                                            {/* Title */}
                                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2 mb-2">
                                                {r.judul}
                                            </h3>
                                            
                                            {/* Description */}
                                            <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                                                {r.deskripsi}
                                            </p>

                                            {/* Meta info */}
                                            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        <span>{formatDate(r.tanggal)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <User className="w-3 h-3" />
                                                        <span className="truncate max-w-20">{r.penulis}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions Row */}
                                            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                                <span className="text-xs text-gray-500 truncate flex-1 pr-2">
                                                    {r.slug}
                                                </span>
                                                
                                                <div className="flex items-center gap-2">
                                                    <Link 
                                                        href={`/admin/berita-dan-pengumuman/edit/${r.id}`}
                                                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                                    >
                                                        <Edit3 className="w-3 h-3 mr-1" />
                                                        Edit
                                                    </Link>
                                                    <button 
                                                        type="button" 
                                                        onClick={() => setDeleteConfirm(r.id)}
                                                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-3 h-3 mr-1" />
                                                        Hapus
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {deleteConfirm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                            <div className="flex items-center mb-4">
                                <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Konfirmasi Hapus
                                </h3>
                            </div>
                            
                            <p className="text-gray-600 mb-6">
                                Apakah Anda yakin ingin menghapus item ini? Tindakan ini tidak dapat dibatalkan.
                            </p>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setDeleteConfirm(null)}
                                    className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors duration-150"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(deleteConfirm)}
                                    className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-150"
                                >
                                    Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Information Note */}
                <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h3 className="font-semibold text-amber-800 mb-2">💡 Tips Pengelolaan</h3>
                    <ul className="text-sm text-amber-700 space-y-1">
                        <li>• Gunakan kategori &quot;Berita&quot; untuk informasi umum dan artikel</li>
                        <li className="hidden sm:list-item">• Gunakan kategori &quot;Pengumuman&quot; untuk informasi penting dan mendesak</li>
                        <li className="sm:hidden">• Gunakan &quot;Pengumuman&quot; untuk info penting</li>
                        <li>• Pastikan judul dan deskripsi jelas dan menarik</li>
                        <li className="hidden sm:list-item">• Upload gambar yang relevan untuk meningkatkan keterbacaan</li>
                        <li className="hidden sm:list-item">• Periksa slug URL agar mudah diakses dan SEO friendly</li>
                        <li className="sm:hidden">• Upload gambar relevan dan periksa slug URL</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}