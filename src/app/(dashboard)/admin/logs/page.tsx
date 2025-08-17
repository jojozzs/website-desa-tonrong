"use client"
import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs, where, startAfter, DocumentData, QueryDocumentSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AdminLogKategoriEnum } from '@/lib/enums';
import { Search, Filter, Calendar, User, Activity, Eye, RefreshCw, X, ChevronDown } from 'lucide-react';

interface AdminLog {
    id: string;
    admin_id: string;
    kategori: AdminLogKategoriEnum;
    deskripsi: string;
    entitas: string;
    entitas_id?: string;
    timestamp: unknown;
    detail?: Record<string, unknown>;
}

interface FilterState {
    kategori: AdminLogKategoriEnum | 'ALL';
    entitas: string;
    admin_id: string;
    dateFrom: string;
    dateTo: string;
    search: string;
}

const ITEMS_PER_PAGE = 20;

export default function AdminLogsPage() {
    const [logs, setLogs] = useState<AdminLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedLog, setSelectedLog] = useState<AdminLog | null>(null);
    const [searchResults, setSearchResults] = useState<AdminLog[]>([]);
    
    const [filters, setFilters] = useState<FilterState>({
        kategori: 'ALL',
        entitas: '',
        admin_id: '',
        dateFrom: '',
        dateTo: '',
        search: ''
    });

    const entitasList = [
        { value: 'profil', label: 'Profil' },
        { value: 'berita_dan_pengumuman', label: 'Berita & Pengumuman' },
        { value: 'galeri', label: 'Galeri' },
        { value: 'produk_unggulan', label: 'Produk Unggulan' },
        { value: 'kontak', label: 'Kontak' },
        { value: 'aspirasi', label: 'Aspirasi' },
        { value: 'admin', label: 'Admin' },
        { value: 'lainnya', label: 'Lainnya' }
    ];

    const kategoriOptions = Object.values(AdminLogKategoriEnum);

    const getKategoriColor = (kategori: string) => {
        const colorMap: Record<string, string> = {
            'CREATE': 'bg-green-100 text-green-800',
            'UPDATE': 'bg-blue-100 text-blue-800', 
            'DELETE': 'bg-red-100 text-red-800',
            'LOGIN': 'bg-purple-100 text-purple-800',
            'LOGOUT': 'bg-gray-100 text-gray-800'
        };
        return colorMap[kategori] || 'bg-gray-100 text-gray-800';
    };

    const fetchLogs = async (isLoadMore = false) => {
        try {
            setLoading(true);
            
            let q = query(
                collection(db, 'admin-logs'),
                orderBy('timestamp', 'desc')
            );

            if (filters.kategori !== 'ALL') {
                q = query(q, where('kategori', '==', filters.kategori));
            }
            
            if (filters.entitas) {
                q = query(q, where('entitas', '==', filters.entitas));
            }
            
            if (filters.admin_id) {
                q = query(q, where('admin_id', '==', filters.admin_id));
            }

            if (filters.dateFrom) {
                const fromDate = new Date(filters.dateFrom);
                q = query(q, where('timestamp', '>=', fromDate));
            }
            
            if (filters.dateTo) {
                const toDate = new Date(filters.dateTo);
                toDate.setHours(23, 59, 59, 999);
                q = query(q, where('timestamp', '<=', toDate));
            }

            if (isLoadMore && lastDoc) {
                q = query(q, startAfter(lastDoc));
            }
            
            q = query(q, limit(ITEMS_PER_PAGE));

            const querySnapshot = await getDocs(q);
            const logsData: AdminLog[] = [];
            
            querySnapshot.forEach((doc) => {
                logsData.push({
                    id: doc.id,
                    ...doc.data()
                } as AdminLog);
            });

            if (isLoadMore) {
                setLogs(prev => [...prev, ...logsData]);
            } else {
                setLogs(logsData);
            }

            setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1] || null);
            setHasMore(querySnapshot.docs.length === ITEMS_PER_PAGE);

        } catch (error) {
            console.error('Error fetching admin logs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let isSubscribed = true;
        
        const fetchLogsInternal = async () => {
            try {
                setLoading(true);
                
                let q = query(
                    collection(db, 'admin-logs'),
                    orderBy('timestamp', 'desc')
                );

                if (filters.kategori !== 'ALL') {
                    q = query(q, where('kategori', '==', filters.kategori));
                }
                
                if (filters.entitas) {
                    q = query(q, where('entitas', '==', filters.entitas));
                }
                
                if (filters.admin_id) {
                    q = query(q, where('admin_id', '==', filters.admin_id));
                }

                if (filters.dateFrom) {
                    const fromDate = new Date(filters.dateFrom);
                    q = query(q, where('timestamp', '>=', fromDate));
                }
                
                if (filters.dateTo) {
                    const toDate = new Date(filters.dateTo);
                    toDate.setHours(23, 59, 59, 999);
                    q = query(q, where('timestamp', '<=', toDate));
                }

                q = query(q, limit(ITEMS_PER_PAGE));

                const querySnapshot = await getDocs(q);
                const logsData: AdminLog[] = [];
                
                querySnapshot.forEach((doc) => {
                    logsData.push({
                        id: doc.id,
                        ...doc.data()
                    } as AdminLog);
                });

                if (isSubscribed) {
                    setLogs(logsData);
                    setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1] || null);
                    setHasMore(querySnapshot.docs.length === ITEMS_PER_PAGE);
                }

            } catch (error) {
                console.error('Error fetching admin logs:', error);
            } finally {
                if (isSubscribed) {
                    setLoading(false);
                }
            }
        };
        
        fetchLogsInternal();
        
        return () => {
            isSubscribed = false;
        };
    }, [filters.kategori, filters.entitas, filters.admin_id, filters.dateFrom, filters.dateTo]);

    useEffect(() => {
        if (filters.search.trim() === '') {
            setSearchResults(logs);
        } else {
            const filtered = logs.filter(log =>
                log.deskripsi.toLowerCase().includes(filters.search.toLowerCase()) ||
                log.admin_id.toLowerCase().includes(filters.search.toLowerCase()) ||
                log.entitas.toLowerCase().includes(filters.search.toLowerCase())
            );
            setSearchResults(filtered);
        }
    }, [logs, filters.search]);

    const handleFilterChange = (key: keyof FilterState, value: string) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
        if (key !== 'search') {
            setLastDoc(null);
        }
    };

    const clearFilters = () => {
        setFilters({
            kategori: 'ALL',
            entitas: '',
            admin_id: '',
            dateFrom: '',
            dateTo: '',
            search: ''
        });
    };

    const formatTimestamp = (timestamp: unknown) => {
        if (!timestamp) return '-';
        
        try {
            let date: Date;
            if (timestamp instanceof Timestamp) {
                date = timestamp.toDate();
            } else if (timestamp instanceof Date) {
                date = timestamp;
            } else if (typeof timestamp === 'string' || typeof timestamp === 'number') {
                date = new Date(timestamp);
            } else {
                return '-';
            }
            
            return new Intl.DateTimeFormat('id-ID', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
        } catch {
            return '-';
        }
    };

    const formatKategori = (kategori: string) => {
        return kategori.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
    };

    const formatEntitas = (entitas: string) => {
        const entity = entitasList.find(e => e.value === entitas);
        return entity?.label || formatKategori(entitas);
    };

    const loadMore = () => {
        if (!loading && hasMore) {
            fetchLogs(true);
        }
    };

    const refreshData = () => {
        setLogs([]);
        setLastDoc(null);
        setHasMore(true);
        fetchLogs(false);
    };

    const displayedLogs = searchResults;
    const activeFiltersCount = Object.entries(filters).filter(([key, value]) => 
        key !== 'search' && value !== '' && value !== 'ALL'
    ).length + (filters.search ? 1 : 0);

    const totalLogs = logs.length;
    const uniqueAdmins = new Set(logs.map(log => log.admin_id)).size;
    const todayLogs = logs.filter(log => {
        if (!log.timestamp) return false;
        try {
            let date: Date;
            if (log.timestamp instanceof Timestamp) {
                date = log.timestamp.toDate();
            } else if (log.timestamp instanceof Date) {
                date = log.timestamp;
            } else if (typeof log.timestamp === 'string' || typeof log.timestamp === 'number') {
                date = new Date(log.timestamp);
            } else {
                return false;
            }
            const today = new Date();
            return date.toDateString() === today.toDateString();
        } catch {
            return false;
        }
    }).length;

    return (
        <div className="min-h-screen bg-gray-50 text-gray-700">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="custom-max-width mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                                    <Activity className="mr-3 h-7 w-7 text-green-600" />
                                    Log Aktivitas Admin
                                </h1>
                                <p className="mt-1 text-sm text-gray-600">
                                    Riwayat aktivitas semua admin di sistem
                                </p>
                            </div>
                            <div className="flex space-x-3">
                                {/* <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                    <Download className="mr-2 h-4 w-4" />
                                    Export
                                </button> */}
                                <button 
                                    onClick={refreshData}
                                    disabled={loading}
                                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 disabled:opacity-50 cursor-pointer"
                                >
                                    <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                                    Refresh
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="custom-max-width mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search and Filter Bar */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                    <div className="p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Search Input */}
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <input
                                        type="text"
                                        placeholder="Cari berdasarkan deskripsi, admin ID, atau entitas..."
                                        value={filters.search}
                                        onChange={(e) => handleFilterChange('search', e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm text-gray-700"
                                    />
                                </div>
                            </div>
                            
                            {/* Filter Toggle */}
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`inline-flex items-center px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors cursor-pointer ${
                                        showFilters 
                                            ? 'bg-blue-50 text-green-700 border-green-200' 
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    <Filter className="mr-2 h-4 w-4" />
                                    Filter
                                    {activeFiltersCount > 0 && (
                                        <span className="ml-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            {activeFiltersCount}
                                        </span>
                                    )}
                                    <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                                </button>
                                
                                {activeFiltersCount > 0 && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
                                    >
                                        Clear all
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Advanced Filters */}
                        {showFilters && (
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Kategori
                                        </label>
                                        <select
                                            value={filters.kategori}
                                            onChange={(e) => handleFilterChange('kategori', e.target.value)}
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                                        >
                                            <option value="ALL">Semua Kategori</option>
                                            {kategoriOptions.map(kategori => (
                                                <option key={kategori} value={kategori}>
                                                    {formatKategori(kategori)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Entitas
                                        </label>
                                        <select
                                            value={filters.entitas}
                                            onChange={(e) => handleFilterChange('entitas', e.target.value)}
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 cursor-pointer"
                                        >
                                            <option value="">Semua Entitas</option>
                                            {entitasList.map(entitas => (
                                                <option key={entitas.value} value={entitas.value}>
                                                    {entitas.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Admin ID
                                        </label>
                                        <input
                                            type="text"
                                            value={filters.admin_id}
                                            onChange={(e) => handleFilterChange('admin_id', e.target.value)}
                                            placeholder="ID Admin"
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Dari Tanggal
                                        </label>
                                        <input
                                            type="date"
                                            value={filters.dateFrom}
                                            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Sampai Tanggal
                                        </label>
                                        <input
                                            type="date"
                                            value={filters.dateTo}
                                            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                                            className="w-full max-w-xs p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Activity className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Aktivitas</p>
                                <p className="text-2xl font-semibold text-gray-900">{totalLogs}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <User className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Admin Aktif</p>
                                <p className="text-2xl font-semibold text-gray-900">{uniqueAdmins}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <Calendar className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Hari Ini</p>
                                <p className="text-2xl font-semibold text-gray-900">{todayLogs}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Eye className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Ditampilkan</p>
                                <p className="text-2xl font-semibold text-gray-900">{displayedLogs.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Logs Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Waktu
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Admin
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Kategori
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Entitas
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Deskripsi
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Detail
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {displayedLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 font-medium">
                                                {formatTimestamp(log.timestamp)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {/* <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                                                    <User className="h-4 w-4 text-gray-600" />
                                                </div> */}
                                                <div className="ml-3">
                                                    <div className="text-sm font-medium text-gray-900">{log.admin_id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getKategoriColor(log.kategori)}`}>
                                                {formatKategori(log.kategori)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-800">
                                                {formatEntitas(log.entitas)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 max-w-xs">
                                                {log.deskripsi}
                                            </div>
                                            {log.entitas_id && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    ID: {log.entitas_id}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {log.detail && Object.keys(log.detail).length > 0 ? (
                                                <button
                                                    onClick={() => setSelectedLog(log)}
                                                    className="text-green-600 hover:text-green-800 p-1 rounded-md hover:bg-green-50 transition-colors cursor-pointer"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Loading State */}
                    {loading && logs.length === 0 && (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                            <p className="mt-2 text-gray-500">Memuat log...</p>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && displayedLogs.length === 0 && (
                        <div className="text-center py-12">
                            <Activity className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada log ditemukan</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {activeFiltersCount > 0 
                                    ? 'Coba ubah filter atau kriteria pencarian'
                                    : 'Belum ada aktivitas yang tercatat'
                                }
                            </p>
                        </div>
                    )}

                    {/* Load More Button */}
                    {displayedLogs.length > 0 && hasMore && !filters.search && (
                        <div className="p-6 text-center border-t">
                            <button
                                onClick={loadMore}
                                disabled={loading}
                                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Memuat...' : 'Muat Lebih Banyak'}
                            </button>
                        </div>
                    )}

                    {/* Results Info */}
                    {displayedLogs.length > 0 && (
                        <div className="px-6 py-3 bg-gray-50 border-t text-sm text-gray-700">
                            Menampilkan {displayedLogs.length} log
                            {!hasMore && !filters.search && ' (semua data telah dimuat)'}
                            {filters.search && ` dari ${logs.length} total log`}
                        </div>
                    )}
                </div>
            </div>

            {/* Detail Modal */}
            {selectedLog && (
                <div className="fixed inset-0 bg-black/90 bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h3 className="text-lg font-medium text-gray-900">Detail Log Aktivitas</h3>
                            <button
                                onClick={() => setSelectedLog(null)}
                                className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 cursor-pointer"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Waktu</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{formatTimestamp(selectedLog.timestamp)}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Admin</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{selectedLog.admin_id}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Kategori</dt>
                                    <dd className="mt-1">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getKategoriColor(selectedLog.kategori)}`}>
                                            {formatKategori(selectedLog.kategori)}
                                        </span>
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Entitas</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{formatEntitas(selectedLog.entitas)}</dd>
                                </div>
                                {selectedLog.entitas_id && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Entitas ID</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{selectedLog.entitas_id}</dd>
                                    </div>
                                )}
                                <div className="sm:col-span-2">
                                    <dt className="text-sm font-medium text-gray-500">Deskripsi</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{selectedLog.deskripsi}</dd>
                                </div>
                                {selectedLog.detail && Object.keys(selectedLog.detail).length > 0 && (
                                    <div className="sm:col-span-2">
                                        <dt className="text-sm font-medium text-gray-500 mb-2">Detail</dt>
                                        <dd className="mt-1">
                                            <div className="bg-gray-50 rounded-md p-3">
                                                <pre className="text-xs text-gray-800 whitespace-pre-wrap overflow-x-auto">
                                                    {JSON.stringify(selectedLog.detail, null, 2)}
                                                </pre>
                                            </div>
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}