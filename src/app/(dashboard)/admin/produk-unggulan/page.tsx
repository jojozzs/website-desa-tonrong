"use client";
import Link from "next/link";
import { JSX, useCallback, useEffect, useState } from "react";
import { requireIdToken } from "@/lib/client-auth";
import { ProdukUnggulan } from "@/lib/types";
import { Plus, Search, Package, Edit3, Trash2, AlertCircle, Loader2, Store, Tag, RefreshCw, Grid3x3, List, Calendar } from "lucide-react";
import Image from "next/image";

type ProdukRow = Omit<ProdukUnggulan, "created_at" | "updated_at"> & {
    created_at: string | null;
    updated_at: string | null;
};

type ApiListResponse = {
    success: boolean;
    data: ProdukRow[];
};

type ViewMode = 'grid' | 'list';

export default function ProdukListPage(): JSX.Element {
    const [rows, setRows] = useState<ProdukRow[]>([]);
    const [filteredRows, setFilteredRows] = useState<ProdukRow[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [deleting, setDeleting] = useState<string | null>(null);

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

    async function handleDelete(id: string, judul: string): Promise<void> {
        const confirmed = window.confirm(`Apakah Anda yakin ingin menghapus produk "${judul}"?\n\nTindakan ini tidak dapat dibatalkan.`);
        if (!confirmed) return;
        
        setDeleting(id);
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
        } finally {
            setDeleting(null);
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

    return (
        <div className="min-h-screen pb-9">
                {/* Header */}
                <div className="xl:sticky top-0 z-40 xl:backdrop-blur-xl xl:shadow-lg shadow-indigo-500/5">
                    <div className="max-w-6xl mx-auto py-6">          
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
                                    <Package className="w-8 h-8 text-orange-600 mr-3" />
                                    Produk Unggulan
                                </h1>
                                <p className="text-gray-600">Kelola daftar produk unggulan UMKM desa</p>
                            </div>

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
                        </div>

                        {/* Search and View Toggle */}
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Cari produk, UMKM, atau slug..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-700"
                                />
                            </div>

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

                        {/* Results Summary */}
                        {!loading && (
                            <div className="mt-4 text-sm text-gray-600">
                                {searchTerm ? (
                                    <>Menampilkan {filteredRows.length} dari {rows.length} produk untuk &quot;{searchTerm}&quot;</>
                                ) : (
                                    <>Total {rows.length} produk unggulan</>
                                )}
                            </div>
                        )}
                    </div>
                </div>

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

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12">
                        <Loader2 className="w-8 h-8 text-green-600 mx-auto mb-4 animate-spin" />
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Memuat Data</h3>
                        <p className="text-gray-600">Sedang mengambil daftar produk unggulan...</p>
                    </div>
                )}

            <div className="max-w-6xl mx-auto mt-9">
                {/* Content */}
                {!loading && !error && (
                    <>
                        {filteredRows.length === 0 ? (
                            <div className="text-center py-12">
                                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    {searchTerm ? "Tidak ada hasil" : "Belum ada produk"}
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    {searchTerm 
                                        ? `Tidak ditemukan produk yang cocok dengan "${searchTerm}"`
                                        : "Belum ada produk unggulan yang ditambahkan."
                                    }
                                </p>
                                {!searchTerm && (
                                    <Link
                                        href="/admin/produk-unggulan/tambah"
                                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-medium rounded-lg hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200"
                                    >
                                        <Plus className="w-5 h-5 mr-2" />
                                        Tambah Produk Pertama
                                    </Link>
                                )}
                            </div>
                        ) : viewMode === 'grid' ? (
                            /* Grid View */
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredRows.map((row) => (
                                    <div key={row.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 group">
                                        {/* Product Image */}
                                        <div className="aspect-video bg-gray-100 overflow-hidden">
                                            {row.gambar_url ? (
                                                <Image
                                                    src={row.gambar_url}
                                                    alt={row.judul}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    width={400}
                                                    height={225}
                                                    />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Package className="w-12 h-12 text-gray-300" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Info */}
                                        <div className="p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1">
                                                    {row.judul}
                                                </h3>
                                            </div>

                                            <div className="space-y-2 mb-4">
                                                <div className="flex items-center text-xs text-gray-600">
                                                    <Store className="w-3 h-3 mr-1 flex-shrink-0" />
                                                    <span className="truncate">{row.nama_umkm}</span>
                                                </div>
                                                
                                                <div className="flex items-center text-xs text-gray-500">
                                                    <Tag className="w-3 h-3 mr-1 flex-shrink-0" />
                                                    <span className="truncate">{row.slug}</span>
                                                </div>
                                                
                                                {row.created_at && (
                                                    <div className="flex items-center text-xs text-gray-500">
                                                        <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
                                                        <span>{formatDate(row.created_at)}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Description */}
                                            {row.deskripsi && (
                                                <p className="text-xs text-gray-600 mb-4 line-clamp-2">
                                                    {truncateText(row.deskripsi, 100)}
                                                </p>
                                            )}

                                            {/* Actions */}
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/admin/produk-unggulan/edit/${row.id}`}
                                                    className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-green-100 text-green-700 text-xs font-medium rounded-md hover:bg-green-100 transition-colors duration-200 cursor-pointer"
                                                >
                                                    <Edit3 className="w-3 h-3 mr-1" />
                                                    Edit
                                                </Link>
                                                
                                                <button
                                                    onClick={() => handleDelete(row.id, row.judul)}
                                                    disabled={deleting === row.id}
                                                    className="px-3 py-2 bg-red-50 text-red-700 text-xs font-medium rounded-md hover:bg-red-100 transition-colors duration-200 disabled:opacity-50 cursor-pointer"
                                                >
                                                    {deleting === row.id ? (
                                                        <Loader2 className="w-3 h-3 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-3 h-3" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            /* List View */
                            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
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
                                                                {row.deskripsi && (
                                                                    <div className="text-sm text-gray-500 line-clamp-1">
                                                                        {truncateText(row.deskripsi, 60)}
                                                                    </div>
                                                                )}
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
                                                                className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-700 text-xs font-medium rounded-md hover:bg-green-100 transition-colors duration-200 cursor-pointer"
                                                            >
                                                                <Edit3 className="w-3 h-3 mr-1" />
                                                                Edit
                                                            </Link>
                                                            
                                                            <button
                                                                onClick={() => handleDelete(row.id, row.judul)}
                                                                disabled={deleting === row.id}
                                                                className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-700 text-xs font-medium rounded-md hover:bg-red-100 transition-colors duration-200 disabled:opacity-50 cursor-pointer"
                                                            >
                                                                {deleting === row.id ? (
                                                                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                                                ) : (
                                                                    <Trash2 className="w-3 h-3 mr-1" />
                                                                )}
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
                        )}
                    </>
                )}
            </div>
        </div>
    );
}