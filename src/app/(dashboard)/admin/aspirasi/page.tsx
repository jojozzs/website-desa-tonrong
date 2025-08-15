"use client";
import { JSX, useCallback, useEffect, useState } from "react";
import { requireIdToken } from "@/lib/client-auth";
import { MessageSquare, Filter, Clock, CheckCircle, AlertCircle, Trash2, RefreshCw, Mail, User, Calendar, FileText, Search } from "lucide-react";

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

    async function setStatus(id: string, status: StatusType): Promise<void> {
        setProcessingIds(prev => new Set(prev).add(id));
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
        const ok = window.confirm("Apakah Anda yakin ingin menghapus aspirasi ini? Tindakan ini tidak dapat dibatalkan.");
        if (!ok) return;
        
        setProcessingIds(prev => new Set(prev).add(id));
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
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
                        <div className="h-5 bg-gray-200 rounded w-96 mb-8"></div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white rounded-lg p-6 border">
                                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                                    <div className="h-8 bg-gray-200 rounded w-12"></div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white rounded-lg p-6 border">
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
        <div className="min-h-screen pb-9">
            {/* Header */}
            <div className="xl:sticky top-0 z-40 xl:backdrop-blur-xl xl:shadow-lg shadow-indigo-500/5">
                <div className="max-w-6xl mx-auto py-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
                                <MessageSquare className="w-8 h-8 text-green-600 mr-3" />
                    Aspirasi Masyarakat
                            </h1>
                            <p className="text-gray-600">Kelola aspirasi dan saran dari masyarakat</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                        <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                        <p className="text-sm text-red-700 font-medium">{error}</p>
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 mt-9">
                    <div className="bg-white rounded-lg shadow-sm border border-green-100 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Aspirasi</p>
                                <p className="text-2xl font-bold text-gray-900">{rows.length}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-full">
                                <MessageSquare className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm border border-orange-100 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Menunggu</p>
                                <p className="text-2xl font-bold text-orange-600">{pendingCount}</p>
                            </div>
                            <div className="p-3 bg-orange-100 rounded-full">
                                <Clock className="w-6 h-6 text-orange-600" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm border border-green-100 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Selesai</p>
                                <p className="text-2xl font-bold text-green-600">{doneCount}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-full">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-lg shadow-sm border border-green-100 p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
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
                                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm w-full md:w-64 text-gray-700"
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
                </div>

                {/* Content */}
                {filteredRows.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border border-orange-100 p-12 text-center">
                        <div className="text-orange-600 mb-4">
                            <MessageSquare className="h-16 w-16 mx-auto" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            {searchTerm ? "Tidak Ada Hasil Pencarian" : "Belum Ada Aspirasi"}
                        </h3>
                        <p className="text-gray-600">
                            {searchTerm 
                                ? `Tidak ditemukan aspirasi dengan kata kunci "${searchTerm}"`
                                : "Belum ada aspirasi dari masyarakat yang perlu ditangani"
                            }
                        </p>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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
                                className="bg-white rounded-lg shadow-sm border border-green-100 hover:shadow-md transition-shadow"
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                                                {row.judul}
                                            </h3>
                                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                                <div className="flex items-center gap-1">
                                                    <User className="w-4 h-4" />
                                                    <span>{row.nama}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Mail className="w-4 h-4" />
                                                    <span>{row.email}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{formatDate(row.created_at)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 ml-4">
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(row.status)}`}>
                                                {getStatusIcon(row.status)}
                                                {row.status === "pending" ? "Menunggu" : "Selesai"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content Preview/Full */}
                                    <div className="mb-4">
                                        <div 
                                            className={`text-gray-700 leading-relaxed ${
                                                expandedCard === row.id ? '' : 'line-clamp-3'
                                            }`}
                                        >
                                            {row.isi}
                                        </div>
                                        {row.isi.length > 200 && (
                                            <button
                                                onClick={() => setExpandedCard(expandedCard === row.id ? null : row.id)}
                                                className="mt-2 text-sm text-green-600 hover:text-green-700 font-medium"
                                            >
                                                {expandedCard === row.id ? "Lihat lebih sedikit" : "Lihat selengkapnya"}
                                            </button>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
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
                                            onClick={() => void handleDelete(row.id)}
                                            disabled={processingIds.has(row.id)}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 focus:ring-2 focus:ring-red-500 font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                        >
                                            {processingIds.has(row.id) ? (
                                                <RefreshCw className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-4 h-4" />
                                            )}
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Information Note */}
                <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h3 className="font-semibold text-amber-800 mb-2 flex items-center">
                        <FileText className="w-5 h-5 mr-2" />
                        Panduan Pengelolaan Aspirasi
                    </h3>
                    <ul className="text-sm text-amber-700 space-y-1">
                        <li>• <strong>Status &quot;Menunggu&quot;:</strong> Aspirasi yang baru masuk dan memerlukan tindak lanjut</li>
                        <li>• <strong>Status &quot;Selesai&quot;:</strong> Aspirasi yang sudah ditangani dan diselesaikan</li>
                        <li>• Gunakan fitur pencarian untuk menemukan aspirasi tertentu dengan cepat</li>
                        <li>• Pastikan untuk menindaklanjuti setiap aspirasi masyarakat dengan responsif</li>
                        <li>• Data yang dihapus tidak dapat dikembalikan, harap berhati-hati</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}