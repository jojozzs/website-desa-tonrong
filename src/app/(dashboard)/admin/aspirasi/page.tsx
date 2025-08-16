"use client";
import { JSX, useCallback, useEffect, useState } from "react";
import { requireIdToken } from "@/lib/client-auth";
import { MessageSquare, Filter, Clock, CheckCircle, AlertCircle, Trash2, RefreshCw, Mail, User, Calendar, FileText, Search, X, MoreVertical } from "lucide-react";

type StatusType = "pending" | "done";

type AspirasiRow = {
    id: string;
    judul: string;
    nama: string;
    email: string;
    isi: string;
    status: StatusType;
    created_at: string | null;
    updated_at: string | null;
    admin_uid: string | null;
};

type ApiListResponse = {
    success: boolean;
    data: AspirasiRow[];
};

export default function AspirasiPage(): JSX.Element {
    const [rows, setRows] = useState<AspirasiRow[]>([]);
    const [filter, setFilter] = useState<"" | StatusType>("");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
    const [expandedCard, setExpandedCard] = useState<string | null>(null);
    const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const token = await requireIdToken();
            const url = filter ? `/api/aspirasi?status=${encodeURIComponent(filter)}` : "/api/aspirasi";
            const r = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
                cache: "no-store"
            });
            const j: ApiListResponse = await r.json();
            if (!j.success) {
                setError("Gagal memuat aspirasi.");
                setRows([]);
            } else {
                setRows(Array.isArray(j.data) ? j.data : []);
            }
        } catch {
            setError("Gagal memuat aspirasi.");
            setRows([]);
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        void load();
    }, [load]);

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

    async function setStatus(id: string, status: StatusType): Promise<void> {
        setProcessingIds(prev => new Set(prev).add(id));
        setOpenMenuId(null);
        try {
            const token = await requireIdToken();
            const fd = new FormData();
            fd.append("id", id);
            fd.append("status", status);
            await fetch("/api/aspirasi", {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` },
                body: fd
            });
            await load();
        } finally {
            setProcessingIds(prev => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
        }
    }

    async function handleDelete(id: string): Promise<void> {
        setProcessingIds(prev => new Set(prev).add(id));
        setDeleteConfirm(null);
        setOpenMenuId(null);
        try {
            const token = await requireIdToken();
            await fetch(`/api/aspirasi?id=${encodeURIComponent(id)}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            await load();
        } finally {
            setProcessingIds(prev => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
        }
    }

    function formatDate(dateString: string | null): string {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    function formatDateMobile(dateString: string | null): string {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }

    function getStatusColor(status: StatusType): string {
        switch (status) {
            case "pending": return "bg-orange-100 text-orange-800 border-orange-200";
            case "done": return "bg-green-100 text-green-800 border-green-200";
            default: return "bg-gray-100 text-gray-800 border-gray-200";
        }
    }

    function getStatusIcon(status: StatusType): JSX.Element {
        switch (status) {
            case "pending": return <Clock className="w-4 h-4" />;
            case "done": return <CheckCircle className="w-4 h-4" />;
            default: return <AlertCircle className="w-4 h-4" />;
        }
    }

    const filteredRows = rows.filter(row => 
        row.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.isi.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const pendingCount = rows.filter(r => r.status === "pending").length;
    const doneCount = rows.filter(r => r.status === "done").length;

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        {/* Header skeleton */}
                        <div className="mb-6 sm:mb-8">
                            <div className="h-8 sm:h-14 bg-gray-200 rounded w-48 sm:w-64 mb-2"></div>
                            <div className="h-4 sm:h-10 bg-gray-200 rounded w-64 sm:w-96"></div>
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
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
                                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto p-4">
                    <div className="flex flex-col gap-4">
                        {/* Top row - Title and Filter toggle */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                                <div>
                                    <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900">
                                        <span className="hidden sm:inline">Aspirasi Masyarakat</span>
                                        <span className="sm:hidden">Aspirasi</span>
                                    </h1>
                                    <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Kelola aspirasi dan saran dari masyarakat</p>
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
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Filter className="w-4 h-4 text-gray-500" />
                                    <label className="text-sm font-medium text-gray-700">Filter Status:</label>
                                </div>
                                <select
                                    value={filter}
                                    onChange={(e) => setFilter(e.currentTarget.value as "" | StatusType)}
                                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-700 cursor-pointer"
                                >
                                    <option value="">Semua Status</option>
                                    <option value="pending">Menunggu</option>
                                    <option value="done">Selesai</option>
                                </select>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Cari aspirasi..."
                                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm w-64 text-gray-700"
                                    />
                                </div>
                                <button
                                    onClick={() => void load()}
                                    disabled={loading}
                                    className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                                    title="Refresh data"
                                >
                                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                </button>
                            </div>
                        </div>

                        {/* Mobile search */}
                        <div className="sm:hidden">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Cari aspirasi..."
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
                                <h3 className="font-medium text-gray-900">Filter & Aksi</h3>
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
                            
                            {/* Status Filter */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">Status:</label>
                                <select
                                    value={filter}
                                    onChange={(e) => {
                                        setFilter(e.currentTarget.value as "" | StatusType);
                                        setShowMobileFilters(false);
                                    }}
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-700"
                                >
                                    <option value="">Semua Status</option>
                                    <option value="pending">Menunggu</option>
                                    <option value="done">Selesai</option>
                                </select>
                            </div>

                            {/* Refresh Button */}
                            <button
                                onClick={() => {
                                    void load();
                                    setShowMobileFilters(false);
                                }}
                                disabled={loading}
                                className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-green-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                            >
                                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                                Refresh Data
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="max-w-7xl mx-auto p-4">
                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center">
                            <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" />
                            <p className="text-sm text-red-700 font-medium">{error}</p>
                        </div>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-6">
                    <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-3 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="mb-2 sm:mb-0">
                                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Total</p>
                                <p className="text-lg sm:text-2xl font-bold text-gray-900">{rows.length}</p>
                            </div>
                            <div className="hidden sm:block p-2 sm:p-3 bg-blue-100 rounded-full">
                                <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-3 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="mb-2 sm:mb-0">
                                <p className="text-xs sm:text-sm font-medium text-orange-600 mb-1">
                                    <span className="hidden sm:inline">Menunggu</span>
                                    <span className="sm:hidden">Pending</span>
                                </p>
                                <p className="text-lg sm:text-2xl font-bold text-orange-600">{pendingCount}</p>
                            </div>
                            <div className="hidden sm:block p-2 sm:p-3 bg-orange-100 rounded-full">
                                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm border border-green-100 p-3 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="mb-2 sm:mb-0">
                                <p className="text-xs sm:text-sm font-medium text-green-600 mb-1">Selesai</p>
                                <p className="text-lg sm:text-2xl font-bold text-green-600">{doneCount}</p>
                            </div>
                            <div className="hidden sm:block p-2 sm:p-3 bg-green-100 rounded-full">
                                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Summary */}
                {!loading && (
                    <div className="mb-4 text-sm text-gray-600">
                        {searchTerm ? (
                            <>Menampilkan {filteredRows.length} dari {rows.length} aspirasi untuk &quot;{searchTerm}&quot;</>
                        ) : (
                            <>Total {filteredRows.length} aspirasi</>
                        )}
                    </div>
                )}

                {/* Content */}
                {filteredRows.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-8 sm:p-12 text-center">
                        <div className="text-orange-600 mb-4 sm:mb-6">
                            <MessageSquare className="h-12 w-12 sm:h-16 sm:w-16 mx-auto opacity-50" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">
                            {searchTerm ? "Tidak Ada Hasil Pencarian" : "Belum Ada Aspirasi"}
                        </h3>
                        <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
                            {searchTerm 
                                ? `Tidak ditemukan aspirasi dengan kata kunci "${searchTerm}"`
                                : "Belum ada aspirasi dari masyarakat yang perlu ditangani"
                            }
                        </p>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Hapus Filter Pencarian
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredRows.map((row) => (
                            <div
                                key={row.id}
                                className="bg-white rounded-xl shadow-sm border border-green-100 hover:shadow-md transition-shadow overflow-hidden"
                            >
                                <div className="p-4 sm:p-6">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1 pr-2">
                                            <h3 className="font-semibold text-gray-900 text-sm sm:text-lg line-clamp-2 mb-2">
                                                {row.judul}
                                            </h3>
                                            <div className="flex items-center justify-between">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(row.status)}`}>
                                                    {getStatusIcon(row.status)}
                                                    <span className="hidden sm:inline">{row.status === "pending" ? "Menunggu" : "Selesai"}</span>
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {/* Mobile menu */}
                                        <div className="relative sm:hidden">
                                            <button
                                                data-menu-container
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenMenuId(openMenuId === row.id ? null : row.id);
                                                }}
                                                className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                            
                                            {openMenuId === row.id && (
                                                <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 min-w-[140px]">
                                                    <button 
                                                        onClick={() => void setStatus(row.id, row.status === "pending" ? "done" : "pending")}
                                                        disabled={processingIds.has(row.id)}
                                                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left disabled:opacity-50"
                                                    >
                                                        {processingIds.has(row.id) ? (
                                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                                        ) : row.status === "pending" ? (
                                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                                        ) : (
                                                            <Clock className="w-4 h-4 text-orange-600" />
                                                        )}
                                                        {row.status === "pending" ? "Selesai" : "Pending"}
                                                    </button>
                                                    <button 
                                                        onClick={() => setDeleteConfirm(row.id)}
                                                        disabled={processingIds.has(row.id)}
                                                        className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left disabled:opacity-50"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Hapus
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* User Info */}
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-3">
                                        <div className="flex items-center gap-1">
                                            <User className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                            <span className="truncate">{row.nama}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                            <span className="truncate">{row.email}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                            <span className="hidden sm:inline">{formatDate(row.created_at)}</span>
                                            <span className="sm:hidden">{formatDateMobile(row.created_at)}</span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="mb-4">
                                        <div 
                                            className={`text-gray-700 text-sm sm:text-base leading-relaxed ${
                                                expandedCard === row.id ? '' : 'line-clamp-3'
                                            }`}
                                        >
                                            {row.isi}
                                        </div>
                                        {row.isi.length > 150 && (
                                            <button
                                                onClick={() => setExpandedCard(expandedCard === row.id ? null : row.id)}
                                                className="mt-2 text-sm text-green-600 hover:text-green-700 font-medium"
                                            >
                                                {expandedCard === row.id ? "Lihat lebih sedikit" : "Lihat selengkapnya"}
                                            </button>
                                        )}
                                    </div>

                                    {/* Desktop Action Buttons */}
                                    <div className="hidden sm:flex items-center gap-2 pt-4 border-t border-gray-100">
                                        <button
                                            type="button"
                                            onClick={() => void setStatus(row.id, row.status === "pending" ? "done" : "pending")}
                                            disabled={processingIds.has(row.id)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 cursor-pointer ${
                                                row.status === "pending"
                                                    ? "bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500"
                                                    : "bg-orange-600 text-white hover:bg-orange-700 focus:ring-2 focus:ring-orange-500"
                                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                                        >
                                            {processingIds.has(row.id) ? (
                                                <RefreshCw className="w-4 h-4 animate-spin" />
                                            ) : row.status === "pending" ? (
                                                <CheckCircle className="w-4 h-4" />
                                            ) : (
                                                <Clock className="w-4 h-4" />
                                            )}
                                            {row.status === "pending" ? "Tandai Selesai" : "Tandai Menunggu"}
                                        </button>
                                        
                                        <button
                                            type="button"
                                            onClick={() => setDeleteConfirm(row.id)}
                                            disabled={processingIds.has(row.id)}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 focus:ring-2 focus:ring-red-500 font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Information Note */}
                {!loading && filteredRows.length > 0 && (
                    <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <h3 className="font-semibold text-amber-800 mb-2 flex items-center">
                            <FileText className="w-5 h-5 mr-2" />
                            Panduan Pengelolaan Aspirasi
                        </h3>
                        <ul className="text-sm text-amber-700 space-y-1">
                            <li>• <strong>Status &quot;Menunggu&quot;:</strong> Aspirasi baru yang memerlukan tindak lanjut</li>
                            <li className="hidden sm:list-item">• <strong>Status &quot;Selesai&quot;:</strong> Aspirasi yang sudah ditangani dan diselesaikan</li>
                            <li className="sm:hidden">• <strong>Status &quot;Selesai&quot;:</strong> Aspirasi sudah ditangani</li>
                            <li>• Gunakan fitur pencarian untuk menemukan aspirasi tertentu</li>
                            <li className="hidden sm:list-item">• Pastikan untuk menindaklanjuti setiap aspirasi masyarakat dengan responsif</li>
                            <li className="sm:hidden">• Tindaklanjuti aspirasi masyarakat dengan responsif</li>
                            <li>• Data yang dihapus tidak dapat dikembalikan</li>
                        </ul>
                    </div>
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
                                Apakah Anda yakin ingin menghapus aspirasi ini? Tindakan ini tidak dapat dibatalkan.
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