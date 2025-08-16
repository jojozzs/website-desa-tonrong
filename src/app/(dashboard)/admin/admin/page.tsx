"use client"
import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Edit3, Save, X, Eye, EyeOff, Key, Calendar, Clock, RefreshCw, AlertCircle, CheckCircle, Lock, UserCheck } from 'lucide-react';
import { useAdminData } from '@/hooks/useAdminData';

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

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4">
            <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-2xl shadow-xl max-w-xs w-full">
                <RefreshCw className="w-8 h-8 animate-spin text-emerald-600" />
                <p className="text-slate-600 font-medium text-center">Memuat data admin...</p>
            </div>
        </div>
    );
    
    if (error) return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4">
            <div className="bg-white border border-red-100 rounded-2xl p-6 max-w-sm w-full shadow-xl">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-700 text-center font-medium text-sm">{error}</p>
            </div>
        </div>
    );
    
    if (!admin) return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4">
            <div className="bg-white border border-amber-100 rounded-2xl p-6 max-w-sm w-full shadow-xl">
                <Shield className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                <p className="text-amber-700 text-center font-medium text-sm">Anda belum login sebagai admin.</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-gray-700">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
                {/* Hero Section */}
                <div className="relative overflow-hidden bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-slate-100 py-4 sm:py-6 px-4 sm:px-8 mb-6 sm:mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-blue-500/5 to-indigo-500/5"></div>
                    <div className="relative flex flex-col gap-4 sm:gap-6">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                            <div className="relative flex-shrink-0">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-600 to-blue-600 rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg">
                                    {admin.nama?.charAt(0).toUpperCase() || 'A'}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-emerald-500 rounded-full border-2 border-white"></div>
                            </div>
                            <div className="text-center sm:text-left flex-1">
                                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
                                    {admin.nama || 'Administrator'}
                                </h1>
                                <p className="text-slate-600 mb-2 text-sm sm:text-base break-all sm:break-normal">{admin.email}</p>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                                    <UserCheck className="w-3 h-3 mr-1" />
                                    {admin.role === 'superadmin' ? 'Super Admin' : 'Admin'}
                                </span>
                            </div>
                        </div>
                        
                        {!isEditing && !isChangingPassword && (
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:justify-end">
                                <button
                                    onClick={() => setIsChangingPassword(true)}
                                    className="inline-flex items-center justify-center px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all duration-200 font-medium cursor-pointer text-sm"
                                >
                                    <Key className="w-4 h-4 mr-2" />
                                    Ubah Password
                                </button>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="inline-flex items-center justify-center px-6 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 font-medium shadow-lg cursor-pointer text-sm"
                                >
                                    <Edit3 className="w-4 h-4 mr-2" />
                                    Edit Profil
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Alert Message */}
                {message.text && (
                    <div className={`mb-6 sm:mb-8 p-4 rounded-2xl flex items-start gap-3 border ${
                        message.type === 'success' 
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                            : 'bg-red-50 border-red-200 text-red-700'
                    }`}>
                        {message.type === 'success' ? (
                            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        ) : (
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        )}
                        <span className="font-medium text-sm">{message.text}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6 lg:space-y-8">
                        {/* Profile Information */}
                        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-4 sm:p-8">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
                                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Informasi Pribadi</h2>
                                {isEditing && (
                                    <div className="flex items-center gap-3 w-full sm:w-auto">
                                        <button
                                            onClick={cancelEdit}
                                            className="flex-1 sm:flex-initial inline-flex items-center justify-center px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors font-medium cursor-pointer text-sm"
                                        >
                                            <X className="w-4 h-4 mr-1" />
                                            Batal
                                        </button>
                                        <button
                                            onClick={handleSaveProfile}
                                            disabled={saving}
                                            className="flex-1 sm:flex-initial inline-flex items-center justify-center px-6 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 disabled:opacity-50 font-medium shadow-lg cursor-pointer text-sm"
                                        >
                                            {saving ? (
                                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                            ) : (
                                                <Save className="w-4 h-4 mr-2" />
                                            )}
                                            Simpan
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold text-slate-700">
                                        Nama Lengkap
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={nama}
                                            onChange={(e) => setNama(e.target.value)}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-slate-50 focus:bg-white text-sm"
                                            placeholder="Masukkan nama lengkap"
                                        />
                                    ) : (
                                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                                            <User className="w-5 h-5 text-slate-500" />
                                            <span className="text-slate-900 font-medium text-sm">{admin.nama || '-'}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold text-slate-700">
                                        Email
                                    </label>
                                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                                        <Mail className="w-5 h-5 text-slate-500 flex-shrink-0" />
                                        <span className="text-slate-900 font-medium text-sm break-all">{admin.email}</span>
                                    </div>
                                    <p className="text-xs text-slate-500">Email tidak dapat diubah</p>
                                </div>
                            </div>
                        </div>

                        {/* Change Password */}
                        {isChangingPassword && (
                            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-4 sm:p-8">
                                <div className="flex items-center justify-between mb-6 sm:mb-8">
                                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Ubah Password</h2>
                                    <button
                                        onClick={() => {
                                            setIsChangingPassword(false);
                                            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                            setMessage({ type: '', text: '' });
                                        }}
                                        className="text-slate-600 hover:text-slate-800 transition-colors p-2 hover:bg-slate-100 rounded-lg cursor-pointer"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="block text-sm font-semibold text-slate-700">
                                            Password Lama
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showCurrentPassword ? 'text' : 'password'}
                                                value={passwordData.currentPassword}
                                                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                                className="w-full px-4 py-3 pr-12 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-slate-50 focus:bg-white text-sm"
                                                placeholder="Masukkan password lama"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
                                            >
                                                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="block text-sm font-semibold text-slate-700">
                                            Password Baru
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showNewPassword ? 'text' : 'password'}
                                                value={passwordData.newPassword}
                                                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                                className="w-full px-4 py-3 pr-12 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-slate-50 focus:bg-white text-sm"
                                                placeholder="Masukkan password baru"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
                                            >
                                                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="block text-sm font-semibold text-slate-700">
                                            Konfirmasi Password Baru
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                                className="w-full px-4 py-3 pr-12 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-slate-50 focus:bg-white text-sm"
                                                placeholder="Konfirmasi password baru"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
                                            >
                                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                                        <button
                                            onClick={() => {
                                                setIsChangingPassword(false);
                                                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                            }}
                                            className="px-6 py-3 text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all duration-200 font-medium cursor-pointer text-sm"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            onClick={handleChangePassword}
                                            disabled={saving}
                                            className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 disabled:opacity-50 font-medium shadow-lg cursor-pointer text-sm"
                                        >
                                            {saving ? (
                                                <RefreshCw className="w-4 h-4 animate-spin" />
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
                    <div className="space-y-6">
                        {/* Account Details */}
                        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-4 sm:p-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-6">Detail Akun</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-blue-50">
                                    <UserCheck className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-xs text-slate-600 font-medium mb-1">Role</p>
                                        <p className="font-semibold text-slate-900 text-sm">
                                            {admin.role === 'superadmin' ? 'Super Admin' : 'Admin'}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50">
                                    <Calendar className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-xs text-slate-600 font-medium mb-1">User ID</p>
                                        <p className="font-mono text-xs text-slate-900 break-all leading-relaxed">{admin.uid}</p>
                                    </div>
                                </div>

                                {admin.last_access && (
                                    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50">
                                        <Clock className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-xs text-slate-600 font-medium mb-1">Akses Terakhir</p>
                                            <p className="text-sm font-medium text-slate-900">
                                                {admin.last_access.toLocaleDateString('id-ID', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Security Status */}
                        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-4 sm:p-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-6">Keamanan</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50">
                                    <div className="flex items-center gap-3">
                                        <Lock className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                                        <span className="text-sm font-medium text-slate-700">Password</span>
                                    </div>
                                    <span className="text-xs px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full font-semibold">
                                        Aman
                                    </span>
                                </div>
                                
                                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                                    <div className="flex items-center gap-3">
                                        <Shield className="w-5 h-5 text-slate-600 flex-shrink-0" />
                                        <span className="text-sm font-medium text-slate-700">2FA Auth</span>
                                    </div>
                                    <span className="text-xs px-3 py-1 bg-slate-200 text-slate-600 rounded-full font-semibold">
                                        Tidak Aktif
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}