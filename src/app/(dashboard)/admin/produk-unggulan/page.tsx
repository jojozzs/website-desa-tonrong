"use client";
import Link from "next/link";
import { JSX, useCallback, useEffect, useState } from "react";
import { requireIdToken } from "@/lib/client-auth";
import { ProdukUnggulan } from "@/lib/types";
import { Plus, Search, Package, Edit3, Trash2, AlertCircle, Store, Tag, RefreshCw, Grid3x3, List, Calendar, Filter, X, MoreVertical } from "lucide-react";
import Image from "next/image";
import { OutputData } from "@editorjs/editorjs/types/data-formats/output-data";

type ProdukRow = Omit<ProdukUnggulan, "created_at" | "updated_at"> & {
    created_at: string | null;
    updated_at: string | null;
    konten?: OutputData | null;
};

type ApiListResponse = {
    success: boolean;
    data: ProdukRow[];
};

type ViewMode = 'grid' | 'list';

function SkeletonBox({ className = "" }: { className?: string }) {
    return (
        <div className={`bg-gray-200 animate-pulse rounded ${className}`} />
    );
}

function SkeletonGrid() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <SkeletonBox className="aspect-video" />
                    <div className="p-4 space-y-3">
                        <SkeletonBox className="h-5 w-full" />
                        <SkeletonBox className="h-5 w-3/4" />
                        <div className="flex items-center gap-2">
                            <SkeletonBox className="h-4 w-4" />
                            <SkeletonBox className="h-4 w-2/3" />
                        </div>
                        <SkeletonBox className="h-4 w-full" />
                        <SkeletonBox className="h-4 w-4/5" />
                        <div className="flex items-center gap-2 pt-2 border-t">
                            <SkeletonBox className="h-3 w-3" />
                            <SkeletonBox className="h-3 w-24" />
                        </div>
                        <div className="hidden sm:flex gap-2">
                            <SkeletonBox className="h-8 flex-1" />
                            <SkeletonBox className="h-8 w-10" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function SkeletonList() {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden lg:block">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            {['Produk', 'UMKM', 'Slug', 'Tanggal', 'Aksi'].map((header, i) => (
                                <th key={i} className="px-6 py-3 text-left">
                                    <SkeletonBox className="h-4 w-16" />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <tr key={i}>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <SkeletonBox className="h-12 w-12" />
                                        <div className="space-y-1">
                                            <SkeletonBox className="h-4 w-32" />
                                            <SkeletonBox className="h-3 w-24" />
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <SkeletonBox className="h-4 w-4" />
                                        <SkeletonBox className="h-4 w-20" />
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <SkeletonBox className="h-4 w-16" />
                                </td>
                                <td className="px-6 py-4">
                                    <SkeletonBox className="h-4 w-20" />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2 justify-end">
                                        <SkeletonBox className="h-7 w-12" />
                                        <SkeletonBox className="h-7 w-16" />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-gray-200">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="p-4">
                        <div className="flex gap-3">
                            <SkeletonBox className="w-16 h-16 sm:w-20 sm:h-20" />
                            <div className="flex-1 space-y-2">
                                <SkeletonBox className="h-5 w-full" />
                                <SkeletonBox className="h-5 w-3/4" />
                                <SkeletonBox className="h-4 w-1/2" />
                                <SkeletonBox className="h-4 w-full" />
                                <div className="flex justify-between items-center pt-2 border-t">
                                    <SkeletonBox className="h-3 w-20" />
                                    <div className="hidden sm:flex gap-2">
                                        <SkeletonBox className="h-7 w-12" />
                                        <SkeletonBox className="h-7 w-16" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ProdukSkeleton({ viewMode }: { viewMode: ViewMode }) {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Skeleton */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto p-4">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <SkeletonBox className="w-8 h-8" />
                                <div className="space-y-1">
                                    <SkeletonBox className="h-8 w-48" />
                                    <SkeletonBox className="hidden sm:block h-4 w-64" />
                                </div>
                            </div>
                            <SkeletonBox className="sm:hidden w-9 h-9" />
                        </div>

                        {/* Desktop controls */}
                        <div className="hidden sm:flex justify-between items-center">
                            <div className="flex gap-3">
                                <SkeletonBox className="h-10 w-24" />
                                <SkeletonBox className="h-10 w-36" />
                            </div>
                            <div className="flex gap-4">
                                <SkeletonBox className="h-11 w-64" />
                                <SkeletonBox className="h-11 w-20" />
                            </div>
                        </div>

                        {/* Mobile search */}
                        <div className="sm:hidden">
                            <SkeletonBox className="h-11 w-full" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-4">
                <SkeletonBox className="mb-4 h-4 w-48" />
                
                {viewMode === 'grid' ? <SkeletonGrid /> : <SkeletonList />}

                {/* Tips skeleton */}
                <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <SkeletonBox className="h-5 w-48 mb-2" />
                    <div className="space-y-1">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <SkeletonBox key={i} className="h-4 w-full" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ProdukListPage(): JSX.Element {
    const [rows, setRows] = useState<ProdukRow[]>([]);
    const [filteredRows, setFilteredRows] = useState<ProdukRow[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [deletingProduct, setDeletingProduct] = useState<{ id: string; judul: string } | null>(null);
    const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const r = await fetch("/api/produk-unggulan", { cache: "no-store" });
            const j: ApiListResponse = await r.json();
            if (!j.success) {
                setError("Gagal memuat data produk unggulan.");
                setRows([]);
                setFilteredRows([]);
            } else {
                const data = Array.isArray(j.data) ? j.data : [];
                setRows(data);
                setFilteredRows(data);
            }
        } catch {
            setError("Gagal memuat data. Periksa koneksi internet Anda.");
            setRows([]);
            setFilteredRows([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { void load(); }, [load]);

    // Filter products based on search term
    useEffect(() => {
        if (!searchTerm) {
            setFilteredRows(rows);
        } else {
            const filtered = rows.filter(row =>
                row.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
                row.nama_umkm.toLowerCase().includes(searchTerm.toLowerCase()) ||
                row.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (row.deskripsi && row.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()))
            );
            setFilteredRows(filtered);
        }
    }, [searchTerm, rows]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('[data-menu-container]') && !target.closest('[data-filter-container]')) {
                setOpenMenuId(null);
                setShowMobileFilters(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    async function handleDelete(id: string): Promise<void> {
        setDeletingProduct(null);
        setDeleteConfirm(null);
        setOpenMenuId(null);
        
        try {
            const t = await requireIdToken();
            const response = await fetch(`/api/produk-unggulan?id=${encodeURIComponent(id)}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${t}` }
            });
            
            if (response.ok) {
                await load();
            } else {
                alert("Gagal menghapus produk. Silakan coba lagi.");
            }
        } catch {
            alert("Gagal menghapus produk. Periksa koneksi internet Anda.");
        }
    }

    function formatDate(dateString: string | null): string {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }

    function truncateText(text: string, maxLength: number): string {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + "...";
    }

    function stripHtml(s: string): string {
        if (!s) return "";
        if (typeof window === "undefined") {
            return s.replace(/<[^>]+>/g, ""); // fallback di SSR
        }
        const div = document.createElement("div");
        div.innerHTML = s;
        return div.textContent || div.innerText || "";
    }

    function getKontenPreview(
        konten?: OutputData | null,
        maxLength = 100
    ): string {
        if (!konten || !Array.isArray(konten.blocks)) return "";

        for (const block of konten.blocks) {
            switch (block.type) {
                case "paragraph":
                case "header": {
                    const raw = (block.data as { text?: string }).text ?? "";
                    const text = stripHtml(raw);
                    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
                }

                case "list": {
                    const items = (block.data as { items?: unknown[] }).items ?? [];
                    const first = items[0];
                    let raw = "";
                    if (typeof first === "string") {
                    raw = first;
                    } else if (
                    typeof first === "object" &&
                    first !== null &&
                    "content" in first
                    ) {
                    raw = (first as { content?: string }).content ?? "";
                    }
                    const text = stripHtml(raw);
                    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
                }
            }
        }

        return "";
    }

    if (loading) {
        return <ProdukSkeleton viewMode={viewMode} />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto p-4">
                    <div className="flex flex-col gap-4">
                        {/* Top row - Title and Actions */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Package className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
                                <div>
                                    <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900">
                                        <span className="hidden sm:inline">Produk Unggulan</span>
                                        <span className="sm:hidden">Produk</span>
                                    </h1>
                                    <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Kelola daftar produk unggulan UMKM desa</p>
                                </div>
                            </div>
                            
                            {/* Mobile filter toggle */}
                            <button
                                data-filter-container
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowMobileFilters(!showMobileFilters);
                                }}
                                className="sm:hidden p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <Filter className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Desktop controls */}
                        <div className="hidden sm:flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => void load()}
                                    disabled={loading}
                                    className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 cursor-pointer"
                                >
                                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                                    Refresh
                                </button>

                                <Link
                                    href="/admin/produk-unggulan/tambah"
                                    className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white font-medium rounded-lg hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200"
                                >
                                    <Plus className="w-5 h-5 mr-2" />
                                    Tambah Produk
                                </Link>
                            </div>

                            <div className="flex items-center gap-4">
                                {/* Desktop Search */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Cari produk, UMKM..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-2.5 w-64 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700"
                                    />
                                </div>

                                {/* View Mode Toggle */}
                                <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded-md transition-all duration-200 cursor-pointer ${
                                            viewMode === 'grid' 
                                                ? 'bg-green-100 text-green-700' 
                                                : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                        title="Grid View"
                                    >
                                        <Grid3x3 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded-md transition-all duration-200 cursor-pointer ${
                                            viewMode === 'list' 
                                                ? 'bg-green-100 text-green-700' 
                                                : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                        title="List View"
                                    >
                                        <List className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Mobile search */}
                        <div className="sm:hidden">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Cari produk..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-3 py-2.5 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile filters dropdown */}
                {showMobileFilters && (
                    <div className="sm:hidden bg-white border-t border-gray-200 p-4" data-filter-container>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium text-gray-900">Tampilan & Aksi</h3>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowMobileFilters(false);
                                    }}
                                    className="p-1 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            
                            {/* View Mode Toggle Mobile */}
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600 flex-shrink-0">Tampilan:</span>
                                <div className="flex bg-gray-100 rounded-lg p-1 flex-1">
                                    <button
                                        onClick={() => {
                                            setViewMode('grid');
                                            setShowMobileFilters(false);
                                        }}
                                        className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                                            viewMode === 'grid' 
                                                ? 'bg-white text-green-700 shadow-sm' 
                                                : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                    >
                                        <Grid3x3 className="w-4 h-4 mx-auto" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setViewMode('list');
                                            setShowMobileFilters(false);
                                        }}
                                        className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                                            viewMode === 'list' 
                                                ? 'bg-white text-green-700 shadow-sm' 
                                                : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                    >
                                        <List className="w-4 h-4 mx-auto" />
                                    </button>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        void load();
                                        setShowMobileFilters(false);
                                    }}
                                    disabled={loading}
                                    className="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg transition-colors disabled:opacity-50"
                                >
                                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                                    Refresh
                                </button>

                                <Link 
                                    href="/admin/produk-unggulan/tambah"
                                    className="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 text-white font-medium rounded-lg transition-colors"
                                    onClick={() => setShowMobileFilters(false)}
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Tambah
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="max-w-7xl mx-auto p-4">
                {/* Results Summary */}
                {!loading && (
                    <div className="mb-4 text-sm text-gray-600">
                        {searchTerm ? (
                            <>Menampilkan {filteredRows.length} dari {rows.length} produk untuk &quot;{searchTerm}&quot;</>
                        ) : (
                            <>Total {rows.length} produk unggulan</>
                        )}
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center">
                            <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
                            <div>
                                <h3 className="text-sm font-semibold text-red-800">Error</h3>
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Content */}
                {!loading && !error && (
                    <>
                        {filteredRows.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-8 sm:p-12 text-center">
                                <Package className="w-12 h-12 sm:w-16 sm:h-16 text-orange-300 mx-auto mb-4" />
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                                    {searchTerm ? "Tidak Ada Hasil" : "Belum Ada Produk"}
                                </h3>
                                <p className="text-gray-600 mb-6 text-sm sm:text-base">
                                    {searchTerm 
                                        ? `Tidak ditemukan produk yang cocok dengan "${searchTerm}"`
                                        : "Belum ada produk unggulan yang ditambahkan."
                                    }
                                </p>
                                {!searchTerm && (
                                    <Link
                                        href="/admin/produk-unggulan/tambah"
                                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-200"
                                    >
                                        <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                        Tambah Produk Pertama
                                    </Link>
                                )}
                            </div>
                        ) : viewMode === 'grid' ? (
                            /* Grid View - Improved Mobile */
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                                {filteredRows.map((row) => (
                                    <div key={row.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 group">
                                        {/* Product Image */}
                                        <div className="aspect-video bg-gray-100 overflow-hidden relative">
                                            {row.gambar_url ? (
                                                <Image
                                                    src={row.gambar_url}
                                                    alt={row.judul}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    width={400}
                                                    height={225}
                                                    priority
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Package className="w-12 h-12 text-gray-300" />
                                                </div>
                                            )}
                                            
                                            {/* Mobile menu button */}
                                            <div className="sm:hidden absolute top-2 right-2">
                                                <button
                                                    data-menu-container
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenMenuId(openMenuId === row.id ? null : row.id);
                                                    }}
                                                    className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
                                                >
                                                    <MoreVertical className="w-4 h-4 text-gray-600" />
                                                </button>

                                                {openMenuId === row.id && (
                                                    <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 min-w-[120px]">
                                                        <Link 
                                                            href={`/admin/produk-unggulan/edit/${row.id}`}
                                                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                            onClick={() => setOpenMenuId(null)}
                                                        >
                                                            <Edit3 className="w-4 h-4" />
                                                            Edit
                                                        </Link>
                                                        <button 
                                                            onClick={() => {
                                                                setDeletingProduct({ id: row.id, judul: row.judul });
                                                                setDeleteConfirm(row.id);
                                                                setOpenMenuId(null);
                                                            }}
                                                            className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left cursor-pointer"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                            Hapus
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Product Info */}
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2 mb-2">
                                                {row.judul}
                                            </h3>

                                            <div className="space-y-2 mb-3">
                                                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                                                    <Store className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0 text-orange-500" />
                                                    <span className="truncate">{row.nama_umkm}</span>
                                                </div>
                                                
                                                {row.created_at && (
                                                    <div className="flex items-center text-xs text-gray-500">
                                                        <Calendar className="w-3 h-3 mr-2 flex-shrink-0" />
                                                        <span>{formatDate(row.created_at)}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Description */}
                                            {(() => {
                                                const preview = getKontenPreview(row.konten, 80) || truncateText(row.deskripsi || "", 80);
                                                return preview ? (
                                                    <p className="text-xs sm:text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                                                    {preview}
                                                    </p>
                                                ) : null;
                                            })()}

                                            {/* Slug */}
                                            <div className="flex items-center text-xs text-gray-500 mb-4 pb-3 border-b border-gray-100">
                                                <Tag className="w-3 h-3 mr-1 flex-shrink-0" />
                                                <span className="truncate font-mono">{row.slug}</span>
                                            </div>

                                            {/* Desktop Actions */}
                                            <div className="hidden sm:flex items-center gap-2">
                                                <Link
                                                    href={`/admin/produk-unggulan/edit/${row.id}`}
                                                    className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-green-50 text-green-700 text-xs font-medium rounded-lg hover:bg-green-100 transition-colors duration-200"
                                                >
                                                    <Edit3 className="w-3 h-3 mr-1" />
                                                    Edit
                                                </Link>
                                                
                                                <button
                                                    onClick={() => {
                                                        setDeletingProduct({ id: row.id, judul: row.judul });
                                                        setDeleteConfirm(row.id);
                                                    }}
                                                    className="px-3 py-2 bg-red-50 text-red-700 text-xs font-medium rounded-lg hover:bg-red-100 transition-colors duration-200 cursor-pointer"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            /* List View - Mobile Optimized */
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                {/* Desktop Table */}
                                <div className="hidden lg:block">
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Produk
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        UMKM
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Slug
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Tanggal
                                                    </th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Aksi
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {filteredRows.map((row) => (
                                                    <tr key={row.id} className="hover:bg-gray-50 transition-colors duration-150">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="flex-shrink-0 h-12 w-12">
                                                                    {row.gambar_url ? (
                                                                        <Image
                                                                            src={row.gambar_url}
                                                                            alt={row.judul}
                                                                            className="h-12 w-12 rounded-lg object-cover"
                                                                            width={48}
                                                                            height={48}
                                                                            priority
                                                                        />
                                                                    ) : (
                                                                        <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                                                                            <Package className="h-6 w-6 text-gray-400" />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-medium text-gray-900 line-clamp-1">
                                                                        {row.judul}
                                                                    </div>
                                                                    {(() => {
                                                                        const preview = getKontenPreview(row.konten, 120) || truncateText(row.deskripsi || "", 120);
                                                                        return preview ? (
                                                                            <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                                                                            {preview}
                                                                            </p>
                                                                        ) : null;
                                                                    })()}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <Store className="w-4 h-4 text-gray-400 mr-2" />
                                                                <span className="text-sm text-gray-900">{row.nama_umkm}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <Tag className="w-4 h-4 text-gray-400 mr-2" />
                                                                <span className="text-sm text-gray-500 font-mono">{row.slug}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                                                                <span className="text-sm text-gray-500">{formatDate(row.created_at)}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <Link
                                                                    href={`/admin/produk-unggulan/edit/${row.id}`}
                                                                    className="inline-flex items-center px-3 py-1.5 bg-green-50 text-green-700 text-xs font-medium rounded-md hover:bg-green-100 transition-colors duration-200"
                                                                >
                                                                    <Edit3 className="w-3 h-3 mr-1" />
                                                                    Edit
                                                                </Link>
                                                                
                                                                <button
                                                                    onClick={() => {
                                                                        setDeletingProduct({ id: row.id, judul: row.judul });
                                                                        setDeleteConfirm(row.id);
                                                                    }}
                                                                    className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-700 text-xs font-medium rounded-md hover:bg-red-100 transition-colors duration-200 cursor-pointer"
                                                                >
                                                                    <Trash2 className="w-3 h-3 mr-1" />
                                                                    Hapus
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Mobile/Tablet Card List */}
                                <div className="lg:hidden divide-y divide-gray-200">
                                    {filteredRows.map((row) => (
                                        <div key={row.id} className="p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-start gap-3">
                                                {/* Product Image */}
                                                <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gray-100">
                                                    {row.gambar_url ? (
                                                        <Image
                                                            src={row.gambar_url}
                                                            alt={row.judul}
                                                            className="w-full h-full object-cover"
                                                            width={80}
                                                            height={80}
                                                            priority
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Package className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    {/* Header with title and mobile menu */}
                                                    <div className="flex items-start justify-between mb-2">
                                                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2 flex-1 pr-2">
                                                            {row.judul}
                                                        </h3>
                                                        
                                                        {/* Mobile menu */}
                                                        <div className="relative sm:hidden">
                                                            <button
                                                                data-menu-container
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setOpenMenuId(openMenuId === row.id ? null : row.id);
                                                                }}
                                                                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                                            >
                                                                <MoreVertical className="w-4 h-4" />
                                                            </button>
                                                            
                                                            {openMenuId === row.id && (
                                                                <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 min-w-[120px]">
                                                                    <Link 
                                                                        href={`/admin/produk-unggulan/edit/${row.id}`}
                                                                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                                        onClick={() => setOpenMenuId(null)}
                                                                    >
                                                                        <Edit3 className="w-4 h-4" />
                                                                        Edit
                                                                    </Link>
                                                                    <button 
                                                                        onClick={() => {
                                                                            setDeletingProduct({ id: row.id, judul: row.judul });
                                                                            setDeleteConfirm(row.id);
                                                                            setOpenMenuId(null);
                                                                        }}
                                                                        className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left cursor-pointer"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                        Hapus
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* UMKM Info */}
                                                    <div className="flex items-center text-sm text-gray-600 mb-2">
                                                        <Store className="w-4 h-4 mr-2 flex-shrink-0 text-orange-500" />
                                                        <span className="truncate">{row.nama_umkm}</span>
                                                    </div>

                                                    {/* Description */}
                                                    {row.deskripsi && (
                                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                                                            {truncateText(row.deskripsi, 120)}
                                                        </p>
                                                    )}

                                                    {/* Meta Info */}
                                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                                                        <div className="flex items-center gap-3">
                                                            {row.created_at && (
                                                                <div className="flex items-center gap-1">
                                                                    <Calendar className="w-3 h-3" />
                                                                    <span>{formatDate(row.created_at)}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Slug and Actions */}
                                                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                                        <div className="flex items-center text-xs text-gray-500 flex-1 pr-2">
                                                            <Tag className="w-3 h-3 mr-1 flex-shrink-0" />
                                                            <span className="truncate font-mono">{row.slug}</span>
                                                        </div>
                                                        
                                                        {/* Desktop/Tablet actions */}
                                                        <div className="hidden sm:flex items-center gap-2">
                                                            <Link 
                                                                href={`/admin/produk-unggulan/edit/${row.id}`}
                                                                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                                                            >
                                                                <Edit3 className="w-3 h-3 mr-1" />
                                                                Edit
                                                            </Link>
                                                            <button 
                                                                onClick={() => {
                                                                    setDeletingProduct({ id: row.id, judul: row.judul });
                                                                    setDeleteConfirm(row.id);
                                                                }}
                                                                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
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
                    </>
                )}

                {/* Tips Section */}
                {!loading && !error && filteredRows.length > 0 && (
                    <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <h3 className="font-semibold text-amber-800 mb-2">💡 Tips Pengelolaan Produk</h3>
                        <ul className="text-sm text-amber-700 space-y-1">
                            <li>• Upload gambar produk berkualitas tinggi untuk menarik perhatian</li>
                            <li className="hidden sm:list-item">• Tulis deskripsi yang menarik dan informatif tentang produk UMKM</li>
                            <li className="sm:hidden">• Tulis deskripsi menarik dan informatif</li>
                            <li>• Gunakan slug yang mudah diingat dan SEO friendly</li>
                            <li className="hidden sm:list-item">• Pastikan informasi UMKM akurat untuk memudahkan kontak</li>
                            <li className="sm:hidden">• Pastikan info UMKM akurat</li>
                            <li>• Update produk secara berkala untuk menjaga relevansi</li>
                        </ul>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {deleteConfirm && deletingProduct && (
                    <div className="fixed inset-0 bg-black/90 bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                            <div className="flex items-center mb-4">
                                <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Konfirmasi Hapus
                                </h3>
                            </div>
                            
                            <p className="text-gray-600 mb-6">
                                Apakah Anda yakin ingin menghapus produk <strong>&quot;{deletingProduct.judul}&quot;</strong>? 
                                <br />
                                <br />
                                Tindakan ini tidak dapat dibatalkan.
                            </p>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setDeleteConfirm(null);
                                        setDeletingProduct(null);
                                    }}
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