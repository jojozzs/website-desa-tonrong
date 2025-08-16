"use client";
import Link from "next/link";
import { JSX, useCallback, useEffect, useState } from "react";
import { requireIdToken } from "@/lib/client-auth";
import { Search, Plus, Edit, Trash2, Eye, Image as ImageIcon, Calendar, FileText, HardDrive, MoreVertical, AlertCircle } from "lucide-react";
import Image from "next/image";

type GaleriRow = {
    id: string;
    judul: string;
    deskripsi: string;
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
    data: GaleriRow[];
};

export default function GaleriListPage(): JSX.Element {
    const [rows, setRows] = useState<GaleriRow[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const r = await fetch("/api/galeri", { cache: "no-store" });
            const j: ApiListResponse = await r.json();
            if (!j.success) {
                setError("Gagal memuat galeri.");
                setRows([]);
            } else {
                setRows(Array.isArray(j.data) ? j.data : []);
            }
        } catch {
            setError("Gagal memuat galeri.");
            setRows([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void load();
    }, [load]);

    async function handleDelete(id: string): Promise<void> {
        const token = await requireIdToken();
        await fetch(`/api/galeri?id=${encodeURIComponent(id)}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        setDeleteConfirm(null);
        setOpenMenuId(null);
        await load();
    }

    const filteredRows = rows.filter(row =>
        row.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
        return Math.round(bytes / (1024 * 1024)) + ' MB';
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setOpenMenuId(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header skeleton */}
                    <div className="mb-6 sm:mb-8">
                        <div className="h-8 sm:h-10 bg-gray-200 rounded w-32 sm:w-48 mb-2 sm:mb-3 animate-pulse"></div>
                        <div className="h-4 sm:h-5 bg-gray-200 rounded w-48 sm:w-64 animate-pulse"></div>
                    </div>
                    
                    {/* Controls skeleton */}
                    <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 mb-4 sm:mb-6">
                        <div className="flex flex-col gap-4">
                            <div className="h-6 bg-gray-200 rounded w-24 sm:w-32 animate-pulse"></div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="h-10 bg-gray-200 rounded flex-1 animate-pulse"></div>
                                <div className="h-10 bg-gray-200 rounded w-20 sm:w-24 animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Cards skeleton for mobile */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="bg-white rounded-xl shadow-sm border overflow-hidden animate-pulse">
                                <div className="h-48 sm:h-56 bg-gray-200"></div>
                                <div className="p-4">
                                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
                                    <div className="flex justify-between items-center">
                                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                                        <div className="h-8 bg-gray-200 rounded w-8"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto p-4 sm:p-6">
                    <div className="flex flex-col gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Galeri</h1>
                            <p className="text-sm sm:text-base text-gray-600">Kelola galeri Desa Tonrong</p>
                        </div>
                        
                        {/* Mobile search and add button */}
                        <div className="flex gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Cari galeri..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-gray-700 text-sm sm:text-base"
                                />
                            </div>
                            <Link
                                href="/admin/galeri/tambah"
                                className="inline-flex items-center justify-center px-4 py-2.5 bg-green-700 hover:bg-green-800 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md whitespace-nowrap"
                            >
                                <Plus className="w-4 h-4 sm:mr-2" />
                                <span className="hidden sm:inline">Tambah</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-4 sm:p-6">
                {/* Stats */}
                <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 mb-4 sm:mb-6">
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                        <div className="flex items-center gap-2">
                            <ImageIcon className="h-5 w-5 text-green-600" />
                            <span className="text-sm text-gray-500">Total:</span>
                            <span className="font-semibold text-gray-900 text-lg">{rows.length}</span>
                        </div>
                        {searchTerm && (
                            <div className="flex items-center gap-2">
                                <Search className="h-4 w-4 text-green-600" />
                                <span className="text-sm text-gray-500">Ditemukan:</span>
                                <span className="font-semibold text-green-600">{filteredRows.length}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6 sm:p-8 text-center">
                        <div className="text-red-500 mb-4">
                            <svg className="h-12 w-12 sm:h-16 sm:w-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Terjadi Kesalahan</h3>
                        <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">{error}</p>
                        <button 
                            onClick={() => void load()}
                            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                        >
                            Coba Lagi
                        </button>
                    </div>
                )}

                {/* Content */}
                {!error && (
                    <>
                        {filteredRows.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-sm border p-8 sm:p-12 text-center">
                                <div className="text-gray-400 mb-4 sm:mb-6">
                                    {searchTerm ? (
                                        <Search className="h-16 w-16 sm:h-20 sm:w-20 mx-auto" />
                                    ) : (
                                        <ImageIcon className="h-16 w-16 sm:h-20 sm:w-20 mx-auto" />
                                    )}
                                </div>
                                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
                                    {searchTerm ? "Tidak ada hasil" : "Belum ada galeri"}
                                </h3>
                                <p className="text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg">
                                    {searchTerm 
                                        ? `Tidak ditemukan galeri dengan kata kunci "${searchTerm}"`
                                        : "Mulai dengan menambahkan galeri pertama Anda"
                                    }
                                </p>
                                {!searchTerm && (
                                    <Link 
                                        href="/admin/galeri/tambah"
                                        className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                                    >
                                        <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                                        Tambah Galeri
                                    </Link>
                                )}
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm("")}
                                        className="text-green-600 hover:text-green-700 font-medium cursor-pointer"
                                    >
                                        Hapus pencarian
                                    </button>
                                )}
                            </div>
                        ) : (
                            <>
                                {/* Search Results Info */}
                                {searchTerm && (
                                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                                        <p className="text-orange-800 text-sm sm:text-base">
                                            Menampilkan <span className="font-semibold">{filteredRows.length}</span> dari {rows.length} galeri
                                            untuk pencarian &quot;<span className="font-semibold">{searchTerm}</span>&quot;
                                        </p>
                                    </div>
                                )}

                                {/* Gallery Grid - Mobile First */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                    {filteredRows.map((row) => (
                                        <div key={row.id} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-all duration-200">
                                            {/* Image */}
                                            <div className="relative aspect-video bg-gray-100 overflow-hidden group">
                                                <Image 
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300" 
                                                    unoptimized 
                                                    src={row.gambar_url}
                                                    alt={row.judul}
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2IiByeD0iOCIvPgo8cGF0aCBkPSJNMjggMjhIMzZWMzZIMjhWMjhaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0yNCAzMkgyOFYzNkgyNFYzMloiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTM2IDMySDQwVjM2SDM2VjMyWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K";
                                                    }}
                                                    priority
                                                />
                                                {/* Overlay actions for larger screens */}
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 items-center justify-center gap-2 sm:flex hidden">
                                                    <a 
                                                        href={row.gambar_url} 
                                                        target="_blank" 
                                                        rel="noreferrer"
                                                        className="inline-flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
                                                        title="Lihat gambar"
                                                    >
                                                        <Eye className="h-5 w-5" />
                                                    </a>
                                                    <Link 
                                                        href={`/admin/galeri/edit/${row.id}`}
                                                        className="inline-flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
                                                        title="Edit galeri"
                                                    >
                                                        <Edit className="h-5 w-5" />
                                                    </Link>
                                                    <button 
                                                        type="button" 
                                                        onClick={() => setDeleteConfirm(row.id)}
                                                        className="inline-flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors cursor-pointer"
                                                        title="Hapus galeri"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            {/* Content */}
                                            <div className="p-4">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h3 className="font-semibold text-gray-900 text-base sm:text-lg line-clamp-2 flex-1 pr-2">
                                                        {row.judul}
                                                    </h3>
                                                    {/* Mobile menu */}
                                                    <div className="relative sm:hidden">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setOpenMenuId(openMenuId === row.id ? null : row.id);
                                                            }}
                                                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                                        >
                                                            <MoreVertical className="h-5 w-5" />
                                                        </button>
                                                        
                                                        {/* Dropdown menu */}
                                                        {openMenuId === row.id && (
                                                            <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 min-w-[120px]">
                                                                <a 
                                                                    href={row.gambar_url} 
                                                                    target="_blank" 
                                                                    rel="noreferrer"
                                                                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                    Lihat
                                                                </a>
                                                                <Link 
                                                                    href={`/admin/galeri/edit/${row.id}`}
                                                                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                    Edit
                                                                </Link>
                                                                <button 
                                                                    type="button" 
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setDeleteConfirm(row.id);
                                                                    }}
                                                                    className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                    Hapus
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    {/* Desktop actions */}
                                                    <div className="hidden sm:flex items-center gap-1">
                                                        <a 
                                                            href={row.gambar_url} 
                                                            target="_blank" 
                                                            rel="noreferrer"
                                                            className="inline-flex items-center justify-center w-8 h-8 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                                                            title="Lihat gambar"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </a>
                                                        <Link 
                                                            href={`/admin/galeri/edit/${row.id}`}
                                                            className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                                                            title="Edit galeri"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                        <button 
                                                            type="button" 
                                                            onClick={() => setDeleteConfirm(row.id)}
                                                            className="inline-flex items-center justify-center w-8 h-8 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors cursor-pointer"
                                                            title="Hapus galeri"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                                
                                                <p className="text-gray-600 mb-3 line-clamp-2 text-sm sm:text-base leading-relaxed">
                                                    {row.deskripsi}
                                                </p>
                                                
                                                {/* Meta Info */}
                                                <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm text-gray-500">
                                                    <div className="flex items-center gap-1">
                                                        <HardDrive className="h-3 w-3 sm:h-4 sm:w-4" />
                                                        <span>{formatFileSize(row.gambar_size)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                                                        <span>{formatDate(row.created_at)}</span>
                                                    </div>
                                                    {row.gambar_width && row.gambar_height && (
                                                        <div className="flex items-center gap-1 col-span-1">
                                                            <ImageIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                                                            <span className="truncate">{row.gambar_width} × {row.gambar_height}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-1">
                                                        <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                                                        <span className="truncate">{row.gambar_type}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                )}

                {/* Delete Confirmation Modal */}
                {deleteConfirm && (
                    <div className="fixed inset-0 bg-black/90 bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                            <div className="flex items-center mb-4">
                                <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Konfirmasi Hapus
                                </h3>
                            </div>
                            
                            <p className="text-gray-600 mb-6">
                                Apakah Anda yakin ingin menghapus galeri ini? Tindakan ini tidak dapat dibatalkan.
                            </p>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setDeleteConfirm(null)}
                                    className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors duration-150 cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(deleteConfirm)}
                                    className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-150 cursor-pointer"
                                >
                                    Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}