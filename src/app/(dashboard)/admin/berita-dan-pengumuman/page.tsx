"use client";
import Link from "next/link";
import { JSX, useCallback, useEffect, useState } from "react";
import { requireIdToken } from "@/lib/client-auth";
import { BeritaPengumumanKategoriEnum } from "@/lib/enums";
import { Newspaper, Megaphone, Plus, Filter, Calendar, User, Edit3, Trash2, AlertCircle, Search,FileText } from "lucide-react";
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

    const filteredRows = rows.filter(row =>
        row.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.penulis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.kategori.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const beritaCount = rows.filter(r => r.kategori === BeritaPengumumanKategoriEnum.BERITA).length;
    const pengumumanCount = rows.filter(r => r.kategori === BeritaPengumumanKategoriEnum.PENGUMUMAN).length;

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
                        <div className="h-5 bg-gray-200 rounded w-96 mb-8"></div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white rounded-lg shadow-sm border border-green-100 p-6">
                                    <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
                                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-green-100 p-6">
                            <div className="space-y-4">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-16 bg-gray-200 rounded"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-9">
            {/* Header */}
            <div className="xl:sticky top-0 z-40 xl:backdrop-blur-xl xl:shadow-lg shadow-indigo-500/5">
                <div className="max-w-6xl mx-auto py-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
                                <FileText className="w-8 h-8 text-green-600 mr-3" />
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">Berita & Pengumuman</h1>
                            </h1>
                            <p className="text-gray-600">Kelola berita dan pengumuman Desa Tonrong</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="max-w-6xl mx-auto mt-9">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-600 mb-1">Total Berita</p>
                                <p className="text-2xl font-bold text-blue-800">{beritaCount}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-full">
                                <Newspaper className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-orange-100 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-orange-600 mb-1">Total Pengumuman</p>
                                <p className="text-2xl font-bold text-orange-800">{pengumumanCount}</p>
                            </div>
                            <div className="p-3 bg-orange-100 rounded-full">
                                <Megaphone className="w-6 h-6 text-orange-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-green-100 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-600 mb-1">Total Semua</p>
                                <p className="text-2xl font-bold text-green-800">{rows.length}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-full">
                                <FileText className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions & Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-green-100 p-6 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
                        {/* Add Button */}
                        <Link 
                            href="/admin/berita-dan-pengumuman/tambah"
                            className="inline-flex items-center px-6 py-3 bg-green-700 hover:bg-green-600 text-white font-medium rounded-lg hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 cursor-pointer"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Tambah Baru
                        </Link>

                        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Cari berita / pengumuman..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-3 py-2.5 w-full sm:w-64 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700"
                                />
                            </div>

                            {/* Category Filter */}
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <select
                                    value={filter}
                                    onChange={(e) => setFilter(e.currentTarget.value as Kategori)}
                                    className="pl-10 pr-8 py-2.5 w-full sm:w-48 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white appearance-none text-gray-700"
                                >
                                    <option value="">Semua Kategori</option>
                                    <option value={BeritaPengumumanKategoriEnum.BERITA}>Berita</option>
                                    <option value={BeritaPengumumanKategoriEnum.PENGUMUMAN}>Pengumuman</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                {filteredRows.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border border-orange-100 p-12 text-center">
                        <div className="text-orange-600 mb-4">
                            <FileText className="h-16 w-16 mx-auto opacity-50" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            {searchTerm ? "Tidak Ada Hasil Pencarian" : "Belum Ada Data"}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {searchTerm 
                                ? `Tidak ditemukan berita atau pengumuman dengan kata kunci "${searchTerm}"`
                                : "Belum ada berita atau pengumuman yang dibuat. Mulai dengan menambahkan yang pertama."
                            }
                        </p>
                        {!searchTerm && (
                            <Link 
                                href="/admin/berita-dan-pengumuman/tambah"
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-orange-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-200"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Tambah Berita/Pengumuman
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm border border-green-100 overflow-hidden">
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
                                                                width={1920}
                                                                height={1080}
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
                                                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors duration-150 cursor-pointer"
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

                        {/* Mobile Card View */}
                        <div className="lg:hidden divide-y divide-gray-200">
                            {filteredRows.map((r) => (
                                <div key={r.id} className="p-6">
                                    <div className="flex items-start space-x-4">
                                        {r.gambar_url && (
                                            <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                                                <Image 
                                                    src={r.gambar_url} 
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                    width={1920}
                                                    height={1080}
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="font-semibold text-gray-900 flex-1 pr-2">
                                                    {r.judul}
                                                </h3>
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(r.kategori)}`}>
                                                    {getCategoryIcon(r.kategori)}
                                                    <span className="ml-1">{r.kategori}</span>
                                                </span>
                                            </div>
                                            
                                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                                {r.deskripsi}
                                            </p>

                                            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                                                <div className="flex items-center">
                                                    <Calendar className="w-3 h-3 mr-1" />
                                                    {formatDate(r.tanggal)}
                                                </div>
                                                <div className="flex items-center">
                                                    <User className="w-3 h-3 mr-1" />
                                                    {r.penulis}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-gray-500">
                                                    Slug: {r.slug}
                                                </span>
                                                <div className="flex items-center space-x-2">
                                                    <Link 
                                                        href={`/admin/berita-dan-pengumuman/edit/${r.id}`}
                                                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors duration-150"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </Link>
                                                    <button 
                                                        type="button" 
                                                        onClick={() => setDeleteConfirm(r.id)}
                                                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors duration-150"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
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
                        <li>• Gunakan kategori &quot;Pengumuman&quot; untuk informasi penting dan mendesak</li>
                        <li>• Pastikan judul dan deskripsi jelas dan menarik</li>
                        <li>• Upload gambar yang relevan untuk meningkatkan keterbacaan</li>
                        <li>• Periksa slug URL agar mudah diakses dan SEO friendly</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}