"use client";
import Link from "next/link";
import { JSX, useCallback, useEffect, useState } from "react";
import { requireIdToken } from "@/lib/client-auth";
import { Search, Plus, Edit, Trash2, Eye, Image as ImageIcon, Calendar, FileText, HardDrive } from "lucide-react";
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
        const ok = window.confirm("Hapus item ini?");
        if (!ok) return;
        const token = await requireIdToken();
        await fetch(`/api/galeri?id=${encodeURIComponent(id)}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header skeleton */}
                    <div className="mb-8">
                        <div className="h-10 bg-gray-200 rounded w-48 mb-3 animate-pulse"></div>
                        <div className="h-5 bg-gray-200 rounded w-64 animate-pulse"></div>
                    </div>
                    
                    {/* Controls skeleton */}
                    <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
                            <div className="flex gap-3">
                                <div className="h-10 bg-gray-200 rounded w-72 animate-pulse"></div>
                                <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Table skeleton */}
                    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                        <div className="p-4">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-b-0">
                                    <div className="h-16 w-16 bg-gray-200 rounded-lg animate-pulse"></div>
                                    <div className="flex-1">
                                        <div className="h-5 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
                                        <div className="h-4 bg-gray-200 rounded w-2/3 mb-2 animate-pulse"></div>
                                        <div className="flex gap-4">
                                            <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                                            <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                                        <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                                        <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="xl:sticky top-0 z-40 xl:backdrop-blur-xl xl:shadow-lg shadow-indigo-500/5">
                    <div className="max-w-7xl mx-auto py-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">Galeri</h1>
                                <p className="text-gray-600">Kelola galeri DKP Makassar</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        {/* Stats */}
                        <div className="flex items-center gap-6">
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
                        
                        {/* Search & Add */}
                        <div className="flex gap-3 w-full lg:w-auto">
                            <div className="relative flex-1 lg:w-80">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Cari berdasarkan judul atau deskripsi..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-gray-700"
                                />
                            </div>
                            <Link
                                href="/admin/galeri/tambah"
                                className="inline-flex items-center px-5 py-2.5 bg-green-700 hover:bg-green-800 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Tambah
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8 text-center">
                        <div className="text-red-500 mb-4">
                            <svg className="h-16 w-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Terjadi Kesalahan</h3>
                        <p className="text-gray-600 mb-6">{error}</p>
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
                            <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                                <div className="text-gray-400 mb-6">
                                    {searchTerm ? (
                                        <Search className="h-20 w-20 mx-auto" />
                                    ) : (
                                        <ImageIcon className="h-20 w-20 mx-auto" />
                                    )}
                                </div>
                                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                                    {searchTerm ? "Tidak ada hasil" : "Belum ada galeri"}
                                </h3>
                                <p className="text-gray-600 mb-8 text-lg">
                                    {searchTerm 
                                        ? `Tidak ditemukan galeri dengan kata kunci "${searchTerm}"`
                                        : "Mulai dengan menambahkan galeri pertama Anda"
                                    }
                                </p>
                                {!searchTerm && (
                                    <Link 
                                        href="/admin/galeri/tambah"
                                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                                    >
                                        <Plus className="h-5 w-5 mr-2" />
                                        Tambah Galeri
                                    </Link>
                                )}
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm("")}
                                        className="text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        Hapus pencarian
                                    </button>
                                )}
                            </div>
                        ) : (
                            <>
                                {/* Search Results Info */}
                                {searchTerm && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                        <p className="text-blue-800">
                                            Menampilkan <span className="font-semibold">{filteredRows.length}</span> dari {rows.length} galeri
                                            untuk pencarian &quot;<span className="font-semibold">{searchTerm}</span>&quot;
                                        </p>
                                    </div>
                                )}

                                {/* Gallery List */}
                                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                                    <div className="divide-y divide-gray-100">
                                        {filteredRows.map((row) => (
                                            <div key={row.id} className="p-6 hover:bg-gray-50 transition-colors">
                                                <div className="flex items-start gap-6">
                                                    {/* Thumbnail */}
                                                    <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 group">
                                                        <Image 
                                                            fill
                                                            className="object-cover group-hover:scale-105 transition-transform duration-200" 
                                                            unoptimized 
                                                            src={row.gambar_url}
                                                            alt={row.judul}
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement;
                                                                target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2IiByeD0iOCIvPgo8cGF0aCBkPSJNMjggMjhIMzZWMzZIMjhWMjhaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0yNCAzMkgyOFYzNkgyNFYzMloiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTM2IDMySDQwVjM2SDM2VjMyWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K";
                                                            }}
                                                        />
                                                    </div>
                                                    
                                                    {/* Content */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div className="flex-1">
                                                                <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-1">
                                                                    {row.judul}
                                                                </h3>
                                                                <p className="text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                                                                    {row.deskripsi}
                                                                </p>
                                                                
                                                                {/* Meta Info */}
                                                                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                                                    <div className="flex items-center gap-1">
                                                                        <HardDrive className="h-4 w-4" />
                                                                        <span>{formatFileSize(row.gambar_size)}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1">
                                                                        <FileText className="h-4 w-4" />
                                                                        <span>{row.gambar_type}</span>
                                                                    </div>
                                                                    {row.gambar_width && row.gambar_height && (
                                                                        <div className="flex items-center gap-1">
                                                                            <ImageIcon className="h-4 w-4" />
                                                                            <span>{row.gambar_width} × {row.gambar_height}</span>
                                                                        </div>
                                                                    )}
                                                                    <div className="flex items-center gap-1">
                                                                        <Calendar className="h-4 w-4" />
                                                                        <span>{formatDate(row.created_at)}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            
                                                            {/* Actions */}
                                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                                <a 
                                                                    href={row.gambar_url} 
                                                                    target="_blank" 
                                                                    rel="noreferrer"
                                                                    className="inline-flex items-center justify-center w-9 h-9 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                                                                    title="Lihat gambar"
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </a>
                                                                
                                                                <Link 
                                                                    href={`/admin/galeri/edit/${row.id}`}
                                                                    className="inline-flex items-center justify-center w-9 h-9 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                                                                    title="Edit galeri"
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Link>

                                                                <button 
                                                                    type="button" 
                                                                    onClick={() => { void handleDelete(row.id); }}
                                                                    className="inline-flex items-center justify-center w-9 h-9 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors cursor-pointer"
                                                                    title="Hapus galeri"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}