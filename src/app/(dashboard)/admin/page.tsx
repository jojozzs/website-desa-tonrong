"use client";
import { JSX, useState, useEffect } from "react";
import { BarChart3, Camera, FileText, MessageCircle, Star, Clock, CheckCircle, AlertCircle, Users, Eye, Activity, RefreshCw, Phone } from "lucide-react";
import { requireIdToken } from "@/lib/client-auth";
import Link from "next/link";

type StatsData = {
    galeri: number;
    berita: number;
    produkUnggulan: number;
    aspirasi: number;
    aspirasiPending: number;
    aspirasiDone: number;
};

type AspirasiItem = {
    id: string;
    status: "pending" | "done";
    judul: string;
    nama: string;
    email: string;
    isi: string;
    created_at: string | null;
    updated_at: string | null;
    admin_uid: string | null;
};

type ApiResponse<T> = {
    success: boolean;
    data: T[];
};

const SkeletonShimmer = ({ className = "" }: { className?: string }) => (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
);

const StatsCardSkeleton = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
        <div className="flex items-center justify-between">
            <div className="flex-1">
                <SkeletonShimmer className="h-4 w-16 mb-2" />
                <SkeletonShimmer className="h-6 sm:h-8 w-12 mb-1" />
                <SkeletonShimmer className="h-3 w-20" />
            </div>
            <SkeletonShimmer className="w-10 h-10 sm:w-12 sm:h-12 rounded-full" />
        </div>
    </div>
);

const QuickActionSkeleton = () => (
    <div className="w-full flex items-center p-3 bg-gray-50 rounded-lg">
        <SkeletonShimmer className="w-4 h-4 rounded mr-3" />
        <SkeletonShimmer className="h-4 w-32" />
    </div>
);

const AdminDashboardSkeleton = () => (
    <div className="min-h-screen p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
            {/* Header Skeleton */}
            <div className="mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center mb-2">
                            <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-gray-300 mr-2 sm:mr-3" />
                            <SkeletonShimmer className="h-6 sm:h-8 w-32 sm:w-48" />
                        </div>
                        <SkeletonShimmer className="h-4 sm:h-5 w-60 sm:w-80" />
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <SkeletonShimmer className="h-4 w-32" />
                        <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-200 rounded-lg">
                            <RefreshCw className="w-4 h-4 text-gray-300" />
                            <SkeletonShimmer className="h-4 w-16" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Stats Cards Skeleton */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
                <StatsCardSkeleton />
                <StatsCardSkeleton />
                <StatsCardSkeleton />
                <StatsCardSkeleton />
            </div>

            {/* Secondary Stats Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {/* Aspirasi Detail Skeleton */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
                    <div className="flex items-center mb-4">
                        <SkeletonShimmer className="w-5 h-5 rounded mr-2" />
                        <SkeletonShimmer className="h-5 w-32" />
                    </div>
                    <div className="space-y-3">
                        {[1, 2].map((i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                    <SkeletonShimmer className="w-4 h-4 rounded mr-2" />
                                    <SkeletonShimmer className="h-4 w-16" />
                                </div>
                                <SkeletonShimmer className="h-6 w-6" />
                            </div>
                        ))}
                    </div>
                    <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                            <SkeletonShimmer className="h-4 w-32" />
                            <SkeletonShimmer className="h-4 w-8" />
                        </div>
                        <SkeletonShimmer className="w-full h-2 rounded-full" />
                    </div>
                </div>

                {/* Quick Actions Skeleton */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
                    <div className="flex items-center mb-4">
                        <SkeletonShimmer className="w-5 h-5 rounded mr-2" />
                        <SkeletonShimmer className="h-5 w-24" />
                    </div>
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <QuickActionSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer Info Skeleton */}
            <div className="mt-6 sm:mt-8 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                    <SkeletonShimmer className="w-5 h-5 rounded mr-2" />
                    <SkeletonShimmer className="h-5 w-32" />
                </div>
                <div className="space-y-2">
                    {[1, 2, 3, 4].map((i) => (
                        <SkeletonShimmer key={i} className="h-4 w-full max-w-md" />
                    ))}
                </div>
            </div>
        </div>
    </div>
);

export default function AdminPage(): JSX.Element {
    const [stats, setStats] = useState<StatsData>({
        galeri: 0,
        berita: 0,
        produkUnggulan: 0,
        aspirasi: 0,
        aspirasiPending: 0,
        aspirasiDone: 0
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [initialLoading, setInitialLoading] = useState<boolean>(true);
    const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
    const [error, setError] = useState<string>("");

    const loadStats = async () => {
        try {
            setError("");
            const token = await requireIdToken();
            
            const [galeriRes, beritaRes, produkRes, aspirasiRes] = await Promise.all([
                fetch("/api/galeri", { cache: "no-store" }),
                fetch("/api/berita-pengumuman", { cache: "no-store" }),
                fetch("/api/produk-unggulan", { cache: "no-store" }),
                fetch("/api/aspirasi", {
                    headers: { Authorization: `Bearer ${token}` },
                    cache: "no-store"
                })
            ]);

            const [galeriData, beritaData, produkData, aspirasiData] = await Promise.all([
                galeriRes.json() as Promise<ApiResponse<unknown>>,
                beritaRes.json() as Promise<ApiResponse<unknown>>,
                produkRes.json() as Promise<ApiResponse<unknown>>,
                aspirasiRes.json() as Promise<ApiResponse<AspirasiItem>>
            ]);

            const aspirasiList: AspirasiItem[] = aspirasiData.success ? aspirasiData.data : [];
            const aspirasiPending = aspirasiList.filter((item: AspirasiItem) => item.status === "pending").length;
            const aspirasiDone = aspirasiList.filter((item: AspirasiItem) => item.status === "done").length;

            setStats({
                galeri: galeriData.success ? galeriData.data.length : 0,
                berita: beritaData.success ? beritaData.data.length : 0,
                produkUnggulan: produkData.success ? produkData.data.length : 0,
                aspirasi: aspirasiList.length,
                aspirasiPending,
                aspirasiDone
            });

            setLastUpdated(new Date().toISOString());
        } catch (err) {
            console.error("Error loading stats:", err);
            setError("Gagal memuat statistik. Silakan coba lagi.");
        }
    };

    useEffect(() => {
        const loadData = async () => {
            await loadStats();
            setInitialLoading(false);
        };
        
        loadData();
    }, []);

    const refreshData = async () => {
        setLoading(true);
        await loadStats();
        setLoading(false);
    };

    const completionRate = stats.aspirasi > 0 ? Math.round((stats.aspirasiDone / stats.aspirasi) * 100) : 0;

    if (initialLoading) {
        return <AdminDashboardSkeleton />;
    }

    return (
        <div className="min-h-screen p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 flex items-center">
                                <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mr-2 sm:mr-3" />
                                Dashboard Admin
                            </h1>
                            <p className="text-sm sm:text-base text-gray-600">Selamat datang di panel administrasi desa 👋</p>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <span className="text-xs sm:text-sm text-gray-500">
                                Update terakhir: {new Date(lastUpdated).toLocaleTimeString('id-ID')}
                            </span>
                            <button
                                onClick={refreshData}
                                disabled={loading}
                                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border border-green-200 rounded-lg hover:bg-green-50 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 cursor-pointer"
                            >
                                <RefreshCw className={`w-4 h-4 text-green-600 ${loading ? 'animate-spin' : ''}`} />
                                <span className="text-sm font-medium text-green-700">Refresh</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center">
                            <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" />
                            <p className="text-sm text-red-700 font-medium">{error}</p>
                        </div>
                    </div>
                )}

                {/* Main Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
                    {/* Galeri Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-green-100 hover:shadow-md transition-shadow">
                        <div className="p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Galeri</p>
                                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.galeri}</p>
                                    <p className="text-xs text-blue-600 mt-1 flex items-center">
                                        <Eye className="w-3 h-3 mr-1" />
                                        <span className="hidden sm:inline">foto tersimpan</span>
                                        <span className="sm:hidden">foto</span>
                                    </p>
                                </div>
                                <div className="p-2 sm:p-3 bg-blue-100 rounded-full">
                                    <Camera className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Berita Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-orange-100 hover:shadow-md transition-shadow">
                        <div className="p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                                        <span className="hidden sm:inline">Berita & Pengumuman</span>
                                        <span className="sm:hidden">Berita</span>
                                    </p>
                                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.berita}</p>
                                    <p className="text-xs text-orange-600 mt-1 flex items-center">
                                        <FileText className="w-3 h-3 mr-1" />
                                        <span className="hidden sm:inline">artikel</span>
                                        <span className="sm:hidden">artikel</span>
                                    </p>
                                </div>
                                <div className="p-2 sm:p-3 bg-orange-100 rounded-full">
                                    <FileText className="w-4 h-4 sm:w-6 sm:h-6 text-orange-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Produk Unggulan Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-yellow-100 hover:shadow-md transition-shadow">
                        <div className="p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                                        <span className="hidden sm:inline">Produk Unggulan</span>
                                        <span className="sm:hidden">Produk</span>
                                    </p>
                                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.produkUnggulan}</p>
                                    <p className="text-xs text-yellow-600 mt-1 flex items-center">
                                        <Star className="w-3 h-3 mr-1" />
                                        <span className="hidden sm:inline">produk</span>
                                        <span className="sm:hidden">produk</span>
                                    </p>
                                </div>
                                <div className="p-2 sm:p-3 bg-yellow-100 rounded-full">
                                    <Star className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Aspirasi Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-purple-100 hover:shadow-md transition-shadow">
                        <div className="p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Aspirasi</p>
                                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.aspirasi}</p>
                                    <p className="text-xs text-purple-600 mt-1 flex items-center">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        <span>{completionRate}%</span>
                                        <span className="hidden sm:inline ml-1">diselesaikan</span>
                                    </p>
                                </div>
                                <div className="p-2 sm:p-3 bg-purple-100 rounded-full">
                                    <MessageCircle className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Secondary Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    {/* Aspirasi Detail */}
                    <div className="bg-white rounded-lg shadow-sm border border-green-100 p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 mr-2" />
                            Status Aspirasi
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between py-6 px-4 bg-orange-50 rounded-lg">
                                <div className="flex items-center">
                                    <Clock className="w-4 h-4 text-orange-600 mr-2" />
                                    <span className="text-sm font-medium text-gray-700">Menunggu</span>
                                </div>
                                <span className="text-lg font-bold text-orange-600">{stats.aspirasiPending}</span>
                            </div>
                            <div className="flex items-center justify-between py-6 px-4 bg-green-50 rounded-lg">
                                <div className="flex items-center">
                                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                                    <span className="text-sm font-medium text-gray-700">Selesai</span>
                                </div>
                                <span className="text-lg font-bold text-green-600">{stats.aspirasiDone}</span>
                            </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="mt-6">
                            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                                <span>Tingkat Penyelesaian</span>
                                <span className="font-medium">{completionRate}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all duration-300" 
                                    style={{ width: `${completionRate}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-lg shadow-sm border border-orange-100 p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-2" />
                            Aksi Cepat
                        </h3>
                        <div className="space-y-3">
                            <Link href="/admin/galeri/tambah" className="block" target="_blank">
                                <div className="w-full flex items-center p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group cursor-pointer">
                                    <Camera className="w-4 h-4 text-blue-600 mr-3 group-hover:scale-110 transition-transform" />
                                    <span className="text-sm font-medium text-gray-700">
                                        <span className="hidden sm:inline">Tambah Galeri</span>
                                        <span className="sm:hidden">Galeri</span>
                                    </span>
                                </div>
                            </Link>

                            <Link href="/admin/berita-dan-pengumuman/tambah" className="block" target="_blank">
                                <div className="w-full flex items-center p-3 text-left bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors group cursor-pointer">
                                    <FileText className="w-4 h-4 text-orange-600 mr-3 group-hover:scale-110 transition-transform" />
                                    <span className="text-sm font-medium text-gray-700">
                                        <span className="hidden sm:inline">Tambah Berita</span>
                                        <span className="sm:hidden">Berita</span>
                                    </span>
                                </div>
                            </Link>

                            <Link href="/admin/produk-unggulan/tambah" className="block" target="_blank">
                                <div className="w-full flex items-center p-3 text-left bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors group cursor-pointer">
                                    <Star className="w-4 h-4 text-yellow-600 mr-3 group-hover:scale-110 transition-transform" />
                                    <span className="text-sm font-medium text-gray-700">
                                        <span className="hidden sm:inline">Tambah Produk</span>
                                        <span className="sm:hidden">Produk</span>
                                    </span>
                                </div>
                            </Link>

                            <Link href="/admin/aspirasi" className="block" target="_blank">
                                <div className="w-full flex items-center p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group cursor-pointer">
                                    <MessageCircle className="w-4 h-4 text-purple-600 mr-3 group-hover:scale-110 transition-transform" />
                                    <span className="text-sm font-medium text-gray-700">
                                        <span className="hidden sm:inline">Kelola Aspirasi</span>
                                        <span className="sm:hidden">Aspirasi</span>
                                    </span>
                                </div>
                            </Link>

                            <Link href="/admin/profil" className="block" target="_blank">
                                <div className="w-full flex items-center p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors group cursor-pointer">
                                    <Users className="w-4 h-4 text-green-600 mr-3 group-hover:scale-110 transition-transform" />
                                    <span className="text-sm font-medium text-gray-700">
                                        <span className="hidden sm:inline">Kelola Profil</span>
                                        <span className="sm:hidden">Profil</span>
                                    </span>
                                </div>
                            </Link>

                            <Link href="/admin/kontak-desa" className="block" target="_blank">
                                <div className="w-full flex items-center p-3 text-left bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors group cursor-pointer">
                                    <Phone className="w-4 h-4 text-indigo-600 mr-3 group-hover:scale-110 transition-transform" />
                                    <span className="text-sm font-medium text-gray-700">
                                        <span className="hidden sm:inline">Kelola Kontak</span>
                                        <span className="sm:hidden">Kontak</span>
                                    </span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="mt-6 sm:mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h3 className="font-semibold text-amber-800 mb-2 flex items-center">
                        <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Tips Pengelolaan
                    </h3>
                    <ul className="text-sm text-amber-700 space-y-1">
                        <li>• Periksa aspirasi yang belum ditanggapi secara berkala</li>
                        <li className="hidden sm:list-item">• Update berita dan informasi desa minimal 2 kali seminggu</li>
                        <li>• Pastikan data profil desa selalu terkini dan akurat</li>
                        <li className="hidden sm:list-item">• Galeri foto sebaiknya diorganisir berdasarkan kegiatan atau tanggal</li>
                        <li className="sm:hidden">• Update berita minimal 2x seminggu</li>
                        <li className="sm:hidden">• Pastikan profil desa selalu terkini</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}