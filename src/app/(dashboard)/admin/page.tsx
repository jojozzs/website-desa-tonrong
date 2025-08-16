"use client";
import { JSX, useState, useEffect } from "react";
import { BarChart3, Camera, FileText, MessageCircle, Star, TrendingUp, Clock, CheckCircle, AlertCircle, Calendar, Users, Eye, Activity, RefreshCw } from "lucide-react";

type StatsData = {
    galeri: number;
    berita: number;
    produkUnggulan: number;
    aspirasi: number;
    aspirasiPending: number;
    aspirasiDone: number;
};

type ActivityItem = {
    id: string;
    type: 'berita' | 'galeri' | 'profil' | 'aspirasi' | 'produk';
    title: string;
    timestamp: string;
    status?: 'success' | 'info' | 'warning';
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

const ActivitySkeleton = () => (
    <div className="flex items-start gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
        <SkeletonShimmer className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex-shrink-0" />
        <div className="flex-1 min-w-0">
            <SkeletonShimmer className="h-4 w-3/4 mb-2" />
            <SkeletonShimmer className="h-3 w-24" />
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
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
                        {[1, 2, 3, 4].map((i) => (
                            <QuickActionSkeleton key={i} />
                        ))}
                    </div>
                </div>

                {/* System Info Skeleton */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
                    <div className="flex items-center mb-4">
                        <SkeletonShimmer className="w-5 h-5 rounded mr-2" />
                        <SkeletonShimmer className="h-5 w-32" />
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center justify-between">
                                <SkeletonShimmer className="h-4 w-20" />
                                <SkeletonShimmer className="h-4 w-16" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Activity Skeleton */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="px-4 sm:px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
                    <div className="flex items-center mb-1">
                        <SkeletonShimmer className="w-5 h-5 rounded mr-2" />
                        <SkeletonShimmer className="h-6 w-40" />
                    </div>
                    <SkeletonShimmer className="h-4 w-60" />
                </div>
                <div className="p-4 sm:p-6">
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <ActivitySkeleton key={i} />
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
                    {[1, 2, 3, 4, 5].map((i) => (
                        <SkeletonShimmer key={i} className="h-4 w-full max-w-md" />
                    ))}
                </div>
            </div>
        </div>
    </div>
);

export default function AdminPage(): JSX.Element {
    const [stats, setStats] = useState<StatsData>({
        galeri: 24,
        berita: 12,
        produkUnggulan: 8,
        aspirasi: 31,
        aspirasiPending: 15,
        aspirasiDone: 16
    });

    const [activities, setActivities] = useState<ActivityItem[]>([
        {
            id: '1',
            type: 'berita',
            title: 'Berita "Pembangunan Jembatan Desa" berhasil dipublikasi',
            timestamp: '2 jam yang lalu',
            status: 'success'
        },
        {
            id: '2',
            type: 'aspirasi',
            title: 'Aspirasi baru dari Budi Santoso tentang perbaikan jalan',
            timestamp: '3 jam yang lalu',
            status: 'info'
        },
        {
            id: '3',
            type: 'profil',
            title: 'Profil desa dan visi misi telah diperbarui',
            timestamp: '5 jam yang lalu',
            status: 'success'
        },
        {
            id: '4',
            type: 'galeri',
            title: '5 foto kegiatan gotong royong ditambahkan ke galeri',
            timestamp: '1 hari yang lalu',
            status: 'success'
        },
        {
            id: '5',
            type: 'produk',
            title: 'Produk unggulan "Keripik Singkong" telah diverifikasi',
            timestamp: '2 hari yang lalu',
            status: 'success'
        }
    ]);

    const [loading, setLoading] = useState<boolean>(false);
    const [initialLoading, setInitialLoading] = useState<boolean>(true);
    const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());

    useEffect(() => {
        const timer = setTimeout(() => {
            setInitialLoading(false);
        }, 1000);
        
        return () => clearTimeout(timer);
    }, []);

    const refreshData = async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLastUpdated(new Date().toISOString());
        setLoading(false);
    };

    function getActivityIcon(type: ActivityItem['type']): JSX.Element {
        const iconProps = "w-4 h-4";
        switch (type) {
            case 'berita': return <FileText className={iconProps} />;
            case 'galeri': return <Camera className={iconProps} />;
            case 'profil': return <Users className={iconProps} />;
            case 'aspirasi': return <MessageCircle className={iconProps} />;
            case 'produk': return <Star className={iconProps} />;
            default: return <Activity className={iconProps} />;
        }
    }

    function getActivityColor(status: ActivityItem['status']): string {
        switch (status) {
            case 'success': return 'bg-green-100 text-green-800 border-green-200';
            case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'warning': return 'bg-orange-100 text-orange-800 border-orange-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    }

    function formatTime(timestamp: string): string {
        return timestamp;
    }

    const completionRate = Math.round((stats.aspirasiDone / stats.aspirasi) * 100);

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
                                Update terakhir: {formatTime(new Date(lastUpdated).toLocaleTimeString('id-ID'))}
                            </span>
                            <button
                                onClick={refreshData}
                                disabled={loading}
                                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border border-green-200 rounded-lg hover:bg-green-50 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                            >
                                <RefreshCw className={`w-4 h-4 text-green-600 ${loading ? 'animate-spin' : ''}`} />
                                <span className="text-sm font-medium text-green-700">Refresh</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
                    {/* Galeri Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-green-100 hover:shadow-md transition-shadow">
                        <div className="p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Galeri</p>
                                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.galeri}</p>
                                    <p className="text-xs text-green-600 mt-1 flex items-center">
                                        <TrendingUp className="w-3 h-3 mr-1" />
                                        <span className="hidden sm:inline">+3 minggu ini</span>
                                        <span className="sm:hidden">+3</span>
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
                                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Berita</p>
                                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.berita}</p>
                                    <p className="text-xs text-orange-600 mt-1 flex items-center">
                                        <Eye className="w-3 h-3 mr-1" />
                                        <span className="hidden sm:inline">1.2k views</span>
                                        <span className="sm:hidden">1.2k</span>
                                    </p>
                                </div>
                                <div className="p-2 sm:p-3 bg-orange-100 rounded-full">
                                    <FileText className="w-4 h-4 sm:w-6 sm:h-6 text-orange-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Produk Unggulan Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-green-100 hover:shadow-md transition-shadow">
                        <div className="p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                                        <span className="hidden sm:inline">Produk Unggulan</span>
                                        <span className="sm:hidden">Produk</span>
                                    </p>
                                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.produkUnggulan}</p>
                                    <p className="text-xs text-green-600 mt-1 flex items-center">
                                        <Star className="w-3 h-3 mr-1" />
                                        <span className="hidden sm:inline">Terverifikasi</span>
                                        <span className="sm:hidden">OK</span>
                                    </p>
                                </div>
                                <div className="p-2 sm:p-3 bg-yellow-100 rounded-full">
                                    <Star className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Aspirasi Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-orange-100 hover:shadow-md transition-shadow">
                        <div className="p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Aspirasi</p>
                                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.aspirasi}</p>
                                    <p className="text-xs text-orange-600 mt-1 flex items-center">
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    {/* Aspirasi Detail */}
                    <div className="bg-white rounded-lg shadow-sm border border-green-100 p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 mr-2" />
                            Status Aspirasi
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                                <div className="flex items-center">
                                    <Clock className="w-4 h-4 text-orange-600 mr-2" />
                                    <span className="text-sm font-medium text-gray-700">Menunggu</span>
                                </div>
                                <span className="text-lg font-bold text-orange-600">{stats.aspirasiPending}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                <div className="flex items-center">
                                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                                    <span className="text-sm font-medium text-gray-700">Selesai</span>
                                </div>
                                <span className="text-lg font-bold text-green-600">{stats.aspirasiDone}</span>
                            </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="mt-4">
                            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                                <span>Tingkat Penyelesaian</span>
                                <span className="font-medium">{completionRate}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300" 
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
                            <button className="w-full flex items-center p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors group">
                                <FileText className="w-4 h-4 text-green-600 mr-3 group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-medium text-gray-700">
                                    <span className="hidden sm:inline">Buat Berita Baru</span>
                                    <span className="sm:hidden">Berita Baru</span>
                                </span>
                            </button>
                            <button className="w-full flex items-center p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group">
                                <Camera className="w-4 h-4 text-blue-600 mr-3 group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-medium text-gray-700">Upload Galeri</span>
                            </button>
                            <button className="w-full flex items-center p-3 text-left bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors group">
                                <Star className="w-4 h-4 text-yellow-600 mr-3 group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-medium text-gray-700">
                                    <span className="hidden sm:inline">Tambah Produk</span>
                                    <span className="sm:hidden">Produk</span>
                                </span>
                            </button>
                            <button className="w-full flex items-center p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group">
                                <MessageCircle className="w-4 h-4 text-purple-600 mr-3 group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-medium text-gray-700">
                                    <span className="hidden sm:inline">Kelola Aspirasi</span>
                                    <span className="sm:hidden">Aspirasi</span>
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* System Info */}
                    <div className="bg-white rounded-lg shadow-sm border border-green-100 p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 mr-2" />
                            Informasi Sistem
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Status Sistem</span>
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                    Online
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Server</span>
                                <span className="text-sm font-medium text-gray-800">Normal</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Database</span>
                                <span className="text-sm font-medium text-gray-800">Connected</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">
                                    <span className="hidden sm:inline">Backup Terakhir</span>
                                    <span className="sm:hidden">Backup</span>
                                </span>
                                <span className="text-sm font-medium text-gray-800">Hari ini</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow-sm border border-green-100">
                    <div className="px-4 sm:px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-orange-50">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center">
                            <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-2" />
                            Aktivitas Terbaru
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                            <span className="hidden sm:inline">Riwayat aktivitas sistem dalam 7 hari terakhir</span>
                            <span className="sm:hidden">7 hari terakhir</span>
                        </p>
                    </div>
                    <div className="p-4 sm:p-6">
                        {activities.length > 0 ? (
                            <div className="space-y-3 sm:space-y-4">
                                {activities.map((activity) => (
                                    <div key={activity.id} className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div className={`flex-shrink-0 p-1.5 sm:p-2 rounded-lg border ${getActivityColor(activity.status)}`}>
                                            {getActivityIcon(activity.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                                                {activity.title}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-3 h-3 text-gray-400" />
                                                <span className="text-xs text-gray-500">{activity.timestamp}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">Belum ada aktivitas terbaru</p>
                            </div>
                        )}
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
                        <li>• Backup data sistem dilakukan otomatis setiap hari</li>
                        <li className="hidden sm:list-item">• Galeri foto sebaiknya diorganisir berdasarkan kegiatan atau tanggal</li>
                        <li className="hidden sm:list-item">• Verifikasi produk unggulan sebelum dipublikasi ke masyarakat</li>
                        <li className="sm:hidden">• Update berita minimal 2x seminggu</li>
                        <li className="sm:hidden">• Verifikasi produk sebelum publikasi</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}