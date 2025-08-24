"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import { useAdminData } from '@/hooks/useAdminData';
import AdminManagement from '@/components/Dashboard/AdminManagement';
import { AlertCircle, Shield } from 'lucide-react';

const AdminManagementPage = () => {
    const { admin, loading, error } = useAdminData();
    const router = useRouter();

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-4 md:p-6">
                <div className="custom-max-width mx-auto">
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
                        <div className="animate-pulse space-y-6">
                            <div className="h-8 bg-gray-200 rounded-xl w-48"></div>
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-16 bg-gray-200 rounded-xl"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50/30 flex items-center justify-center p-6">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full text-center shadow-xl border border-white/20">
                    <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Gagal Memuat Data</h3>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => router.push('/admin/dashboard')}
                        className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 shadow-lg font-medium cursor-pointer"
                    >
                        Kembali ke Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (!admin) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50/30 flex items-center justify-center p-6">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full text-center shadow-xl border border-white/20">
                    <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Shield className="w-8 h-8 text-amber-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Akses Ditolak</h3>
                    <p className="text-gray-600 mb-6">Anda belum login sebagai admin.</p>
                    <button
                        onClick={() => router.push('/admin/login')}
                        className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 shadow-lg font-medium cursor-pointer"
                    >
                        Login Admin
                    </button>
                </div>
            </div>
        );
    }

    return <AdminManagement />;
};

export default AdminManagementPage;