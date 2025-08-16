"use client"
import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs, where, startAfter, DocumentData, QueryDocumentSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AdminLogKategoriEnum } from '@/lib/enums';

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
}

const ITEMS_PER_PAGE = 20;

export default function AdminLogsPage() {
    const [logs, setLogs] = useState<AdminLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [filters, setFilters] = useState<FilterState>({
        kategori: 'ALL',
        entitas: '',
        admin_id: '',
        dateFrom: '',
        dateTo: ''
    });

    const entitasList = [
        'profil', 'berita_dan_pengumuman', 'galeri', 
        'produk_unggulan', 'kontak', 'aspirasi', 'admin', 'lainnya'
    ];

    const kategoriOptions = Object.values(AdminLogKategoriEnum);

    // Fetch logs with filters
    const fetchLogs = async (isLoadMore = false) => {
        try {
            setLoading(true);
            
            let q = query(
                collection(db, 'admin-logs'),
                orderBy('timestamp', 'desc')
            );

            // Apply filters
            if (filters.kategori !== 'ALL') {
                q = query(q, where('kategori', '==', filters.kategori));
            }
            
            if (filters.entitas) {
                q = query(q, where('entitas', '==', filters.entitas));
            }
            
            if (filters.admin_id) {
                q = query(q, where('admin_id', '==', filters.admin_id));
            }

            // Date range filtering (simplified - you might want to use Firestore timestamp)
            if (filters.dateFrom) {
                const fromDate = new Date(filters.dateFrom);
                q = query(q, where('timestamp', '>=', fromDate));
            }
            
            if (filters.dateTo) {
                const toDate = new Date(filters.dateTo);
                toDate.setHours(23, 59, 59, 999); // End of day
                q = query(q, where('timestamp', '<=', toDate));
            }

            // Pagination
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

            // Set pagination state
            setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1] || null);
            setHasMore(querySnapshot.docs.length === ITEMS_PER_PAGE);

        } catch (error) {
            console.error('Error fetching admin logs:', error);
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        let isSubscribed = true;
        
        const fetchLogsInternal = async () => {
            try {
                setLoading(true);
                
                let q = query(
                    collection(db, 'admin-logs'),
                    orderBy('timestamp', 'desc')
                );

                // Apply filters
                if (filters.kategori !== 'ALL') {
                    q = query(q, where('kategori', '==', filters.kategori));
                }
                
                if (filters.entitas) {
                    q = query(q, where('entitas', '==', filters.entitas));
                }
                
                if (filters.admin_id) {
                    q = query(q, where('admin_id', '==', filters.admin_id));
                }

                // Date range filtering (simplified - you might want to use Firestore timestamp)
                if (filters.dateFrom) {
                    const fromDate = new Date(filters.dateFrom);
                    q = query(q, where('timestamp', '>=', fromDate));
                }
                
                if (filters.dateTo) {
                    const toDate = new Date(filters.dateTo);
                    toDate.setHours(23, 59, 59, 999); // End of day
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
    }, [filters]);

    const handleFilterChange = (key: keyof FilterState, value: string) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
        setLastDoc(null); // Reset pagination
    };

    const clearFilters = () => {
        setFilters({
            kategori: 'ALL',
            entitas: '',
            admin_id: '',
            dateFrom: '',
            dateTo: ''
        });
    };

    const formatTimestamp = (timestamp: unknown) => {
        if (!timestamp) return '-';
        
        try {
            // Handle Firestore Timestamp
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
                dateStyle: 'medium',
                timeStyle: 'short'
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

    const loadMore = () => {
        if (!loading && hasMore) {
            fetchLogs(true);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Log Aktivitas Admin</h1>
                <p className="text-gray-600">Riwayat aktivitas semua admin di sistem</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Log</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {/* Kategori Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Kategori
                        </label>
                        <select
                            value={filters.kategori}
                            onChange={(e) => handleFilterChange('kategori', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="ALL">Semua Kategori</option>
                            {kategoriOptions.map(kategori => (
                                <option key={kategori} value={kategori}>
                                    {formatKategori(kategori)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Entitas Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Entitas
                        </label>
                        <select
                            value={filters.entitas}
                            onChange={(e) => handleFilterChange('entitas', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Semua Entitas</option>
                            {entitasList.map(entitas => (
                                <option key={entitas} value={entitas}>
                                    {formatKategori(entitas)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Admin ID Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Admin ID
                        </label>
                        <input
                            type="text"
                            value={filters.admin_id}
                            onChange={(e) => handleFilterChange('admin_id', e.target.value)}
                            placeholder="ID Admin"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Date From Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Dari Tanggal
                        </label>
                        <input
                            type="date"
                            value={filters.dateFrom}
                            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Date To Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sampai Tanggal
                        </label>
                        <input
                            type="date"
                            value={filters.dateTo}
                            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="mt-4">
                    <button
                        onClick={clearFilters}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Logs Table */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Waktu
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Admin
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Kategori
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Entitas
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Deskripsi
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Detail
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {logs.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatTimestamp(log.timestamp)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {log.admin_id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                            {formatKategori(log.kategori)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-800">
                                            {formatKategori(log.entitas)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                                        {log.deskripsi}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {log.detail && Object.keys(log.detail).length > 0 ? (
                                            <details className="cursor-pointer">
                                                <summary className="text-blue-600 hover:text-blue-800">
                                                    Lihat Detail
                                                </summary>
                                                <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                                                    <pre className="whitespace-pre-wrap">
                                                        {JSON.stringify(log.detail, null, 2)}
                                                    </pre>
                                                </div>
                                            </details>
                                        ) : (
                                            '-'
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
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-2 text-gray-500">Memuat log...</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && logs.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Tidak ada log yang ditemukan</p>
                    </div>
                )}

                {/* Load More Button */}
                {logs.length > 0 && hasMore && (
                    <div className="p-6 text-center border-t">
                        <button
                            onClick={loadMore}
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Memuat...' : 'Muat Lebih Banyak'}
                        </button>
                    </div>
                )}

                {/* Results Info */}
                {logs.length > 0 && (
                    <div className="px-6 py-3 bg-gray-50 border-t text-sm text-gray-700">
                        Menampilkan {logs.length} log
                        {!hasMore && ' (semua data telah dimuat)'}
                    </div>
                )}
            </div>
        </div>
    );
}