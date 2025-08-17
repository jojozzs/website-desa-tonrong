"use client"
import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Edit3, Save, X, Eye, EyeOff, Key, Clock, RefreshCw, AlertCircle, CheckCircle, Lock, Settings, Zap } from 'lucide-react';
import { useAdminData } from '@/hooks/useAdminData';

const ProfileSkeleton = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-4 md:p-6">
        <div className="custom-max-width mx-auto">
            {/* Header Skeleton */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 mb-8">
                <div className="animate-pulse flex flex-col md:flex-row items-center gap-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl"></div>
                    <div className="flex-1 space-y-4 text-center md:text-left">
                        <div className="h-8 bg-gray-200 rounded-xl w-64 mx-auto md:mx-0"></div>
                        <div className="h-5 bg-gray-200 rounded-lg w-48 mx-auto md:mx-0"></div>
                        <div className="h-6 bg-gray-200 rounded-full w-24 mx-auto md:mx-0"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default function AdminProfilePage() {
    const { admin, loading, error, updateAdminProfile, changePassword } = useAdminData();
    
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    
    const [nama, setNama] = useState('');
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (admin) {
            setNama(admin.nama || '');
        }
    }, [admin]);

    const handleSaveProfile = async () => {
        setSaving(true);
        setMessage({ type: '', text: '' });
        
        try {
            await updateAdminProfile(nama);
            setMessage({ type: 'success', text: 'Profil berhasil diperbarui!' });
            setIsEditing(false);
            
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            if (error instanceof Error) {
                setMessage({ type: 'error', text: error.message || 'Gagal memperbarui profil' });
            } else {
                setMessage({ type: 'error', text: 'Gagal memperbarui profil' });
            }
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'Password baru dan konfirmasi password tidak cocok!' });
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password minimal 6 karakter!' });
            return;
        }

        setSaving(true);
        setMessage({ type: '', text: '' });
        
        try {
            await changePassword(passwordData.currentPassword, passwordData.newPassword);
            
            setMessage({ type: 'success', text: 'Password berhasil diubah!' });
            setIsChangingPassword(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            if (error instanceof Error) {
                setMessage({ type: 'error', text: error.message || 'Gagal mengubah password' });
            } else {
                setMessage({ type: 'error', text: 'Gagal mengubah password' });
            }
        } finally {
            setSaving(false);
        }
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setMessage({ type: '', text: '' });
        if (admin) {
            setNama(admin.nama || '');
        }
    };

    if (loading) return <ProfileSkeleton />;
    
    if (error) return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50/30 flex items-center justify-center p-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full text-center shadow-xl border border-white/20">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Gagal Memuat Data</h3>
                <p className="text-gray-600">{error}</p>
            </div>
        </div>
    );
    
    if (!admin) return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50/30 flex items-center justify-center p-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full text-center shadow-xl border border-white/20">
                <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-8 h-8 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Akses Ditolak</h3>
                <p className="text-gray-600">Anda belum login sebagai admin.</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-4 md:p-6">
            <div className="custom-max-width mx-auto space-y-8">
                {/* Header Profile */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl py-4 px-8 shadow-xl border border-white/20">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-orange-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                {admin.nama?.charAt(0).toUpperCase() || 'A'}
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{admin.nama || 'Administrator'}</h1>
                            <p className="text-gray-600 text-lg mb-4">{admin.email}</p>
                            <div className="flex items-center justify-center md:justify-start gap-3">
                                <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-sm font-medium shadow-lg">
                                    <Zap className="w-4 h-4" />
                                    {admin.role === 'superadmin' ? 'Super Admin' : 'Admin'}
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {!isEditing && !isChangingPassword && (
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={() => setIsChangingPassword(true)}
                                    className="px-6 py-3 bg-white/80 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 shadow-lg border border-gray-200/50 flex items-center justify-center gap-2 font-medium cursor-pointer"
                                >
                                    <Key className="w-4 h-4" />
                                    Ubah Password
                                </button>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 shadow-lg flex items-center justify-center gap-2 font-medium cursor-pointer"
                                >
                                    <Edit3 className="w-4 h-4" />
                                    Edit Profil
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Alert Message */}
                {message.text && (
                    <div className={`p-5 rounded-2xl flex items-center gap-4 shadow-lg border ${
                        message.type === 'success' 
                            ? 'bg-green-50/80 backdrop-blur-sm text-green-800 border-green-200/50' 
                            : 'bg-red-50/80 backdrop-blur-sm text-red-800 border-red-200/50'
                    }`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            message.type === 'success' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                            {message.type === 'success' ? (
                                <CheckCircle className="w-5 h-5" />
                            ) : (
                                <AlertCircle className="w-5 h-5" />
                            )}
                        </div>
                        <span className="font-medium">{message.text}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="xl:col-span-2 space-y-8">
                        {/* Profile Information */}
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                        <User className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">Informasi Profil</h2>
                                </div>
                                {isEditing && (
                                    <div className="flex gap-3">
                                        <button
                                            onClick={cancelEdit}
                                            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors rounded-xl hover:bg-gray-200 cursor-pointer"
                                        >
                                            <X className="w-4 h-4 mr-2 inline" />
                                            Batal
                                        </button>
                                        <button
                                            onClick={handleSaveProfile}
                                            disabled={saving}
                                            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 disabled:opacity-50 shadow-lg cursor-pointer"
                                        >
                                            {saving ? (
                                                <RefreshCw className="w-4 h-4 mr-2 inline animate-spin" />
                                            ) : (
                                                <Save className="w-4 h-4 mr-2 inline" />
                                            )}
                                            Simpan
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6 text-gray-700">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Nama Lengkap
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={nama}
                                            onChange={(e) => setNama(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200 outline-none"
                                            placeholder="Masukkan nama lengkap"
                                        />
                                    ) : (
                                        <div className="flex items-center gap-4 p-4 bg-gray-50/50 backdrop-blur-sm rounded-xl border border-gray-100">
                                            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                                                <User className="w-5 h-5 text-gray-600" />
                                            </div>
                                            <span className="text-gray-900 font-medium text-lg">{admin.nama || '-'}</span>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Email
                                    </label>
                                    <div className="flex items-center gap-4 p-4 bg-gray-50/50 backdrop-blur-sm rounded-xl border border-gray-100">
                                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                            <Mail className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-gray-900 font-medium text-lg block">{admin.email}</span>
                                            <span className="text-xs text-gray-500">Email tidak dapat diubah</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Change Password */}
                        {isChangingPassword && (
                            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 text-gray-700">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                            <Key className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">Ubah Password</h2>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setIsChangingPassword(false);
                                            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                            setMessage({ type: '', text: '' });
                                        }}
                                        className="w-10 h-10 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200 flex items-center justify-center cursor-pointer"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Password Lama
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showCurrentPassword ? 'text' : 'password'}
                                                value={passwordData.currentPassword}
                                                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200 outline-none"
                                                placeholder="Masukkan password lama"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                                            >
                                                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Password Baru
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showNewPassword ? 'text' : 'password'}
                                                value={passwordData.newPassword}
                                                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200 outline-none"
                                                placeholder="Masukkan password baru"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                                            >
                                                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Konfirmasi Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200 outline-none"
                                                placeholder="Konfirmasi password baru"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                                            >
                                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-100">
                                        <button
                                            onClick={() => {
                                                setIsChangingPassword(false);
                                                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                            }}
                                            className="px-6 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium cursor-pointer"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            onClick={handleChangePassword}
                                            disabled={saving}
                                            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 shadow-lg font-medium cursor-pointer"
                                        >
                                            {saving ? (
                                                <RefreshCw className="w-4 h-4 mr-2 inline animate-spin" />
                                            ) : (
                                                'Ubah Password'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Account Details */}
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                                    <Settings className="w-5 h-5 text-indigo-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Detail Akun</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100/50">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-600">Role</span>
                                        <span className="text-sm font-bold text-indigo-600">
                                            {admin.role === 'superadmin' ? 'Super Admin' : 'Admin'}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="p-4 bg-gray-50/50 backdrop-blur-sm rounded-xl border border-gray-100">
                                    <span className="text-sm font-medium text-gray-600 block mb-2">User ID</span>
                                    <span className="text-xs font-mono text-gray-900 break-all bg-white px-2 py-1 rounded-lg">
                                        {admin.uid}
                                    </span>
                                </div>

                                {admin.last_access && (
                                    <div className="p-4 bg-blue-50/50 backdrop-blur-sm rounded-xl border border-blue-100/50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <Clock className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium text-gray-600 block">Akses Terakhir</span>
                                                <span className="text-sm font-bold text-blue-600">
                                                    {admin.last_access.toLocaleDateString('id-ID', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Security Status */}
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Status Keamanan</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100/50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                                <Lock className="w-4 h-4 text-green-600" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">Password</span>
                                        </div>
                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                                            Aman
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-100/50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <Shield className="w-4 h-4 text-gray-500" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">2FA</span>
                                        </div>
                                        <span className="px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-xs font-bold">
                                            Tidak Aktif
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}