"use client"
import React, { useState } from 'react';
import { Users, Plus, Edit3, Trash2, Shield, Mail, Clock, AlertCircle, CheckCircle, RefreshCw, Eye, EyeOff, X, Save, User, Lock, Key } from 'lucide-react';
import { useAdminManagement, AdminListItem, CreateAdminData, UpdateAdminData } from '@/hooks/useAdminManagement';
import { useAdminData } from '@/hooks/useAdminData';

interface UpdatePasswordData {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

interface PasswordValidation {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
    isValid: boolean;
}

const AdminManagement = () => {
    const { admin: currentAdmin } = useAdminData();
    const { admins, loading, error, createAdmin, updateAdmin, deleteAdmin, updatePassword } = useAdminManagement();
    
    const [isCreating, setIsCreating] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState<AdminListItem | null>(null);
    const [changingPasswordFor, setChangingPasswordFor] = useState<AdminListItem | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<AdminListItem | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const [createForm, setCreateForm] = useState<CreateAdminData>({
        email: '',
        password: '',
        nama: '',
        role: 'admin'
    });

    const [editForm, setEditForm] = useState<UpdateAdminData>({
        nama: '',
        role: 'admin'
    });

    const [passwordForm, setPasswordForm] = useState<UpdatePasswordData>({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const validatePassword = (password: string): PasswordValidation => {
        const minLength = password.length >= 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?]/.test(password);
        
        return {
            minLength,
            hasUppercase,
            hasLowercase,
            hasNumber,
            hasSpecialChar,
            isValid: minLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar
        };
    };

    const PasswordValidationDisplay = ({ password }: { password: string }) => {
        const validation = validatePassword(password);
        
        const requirements = [
            { key: 'minLength', label: 'Minimal 8 karakter', met: validation.minLength },
            { key: 'hasUppercase', label: 'Huruf besar (A-Z)', met: validation.hasUppercase },
            { key: 'hasLowercase', label: 'Huruf kecil (a-z)', met: validation.hasLowercase },
            { key: 'hasNumber', label: 'Angka (0-9)', met: validation.hasNumber },
            { key: 'hasSpecialChar', label: 'Karakter khusus (!@#$%^&*)', met: validation.hasSpecialChar }
        ];

        return (
            <div className="mt-2 p-3 bg-gray-50/50 rounded-lg space-y-2">
                <p className="text-xs font-semibold text-gray-700 mb-2">Persyaratan Password:</p>
                {requirements.map((req) => (
                    <div key={req.key} className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                            req.met ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                            {req.met ? (
                                <CheckCircle className="w-3 h-3 text-green-600" />
                            ) : (
                                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                            )}
                        </div>
                        <span className={`text-xs ${req.met ? 'text-green-700' : 'text-gray-600'}`}>
                            {req.label}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    const handleCreateAdmin = async () => {
        if (!createForm.email || !createForm.password || !createForm.nama) {
            setMessage({ type: 'error', text: 'Semua field harus diisi' });
            return;
        }

        const passwordValidation = validatePassword(createForm.password);
        if (!passwordValidation.isValid) {
            setMessage({ type: 'error', text: 'Password tidak memenuhi persyaratan keamanan' });
            return;
        }

        try {
            setActionLoading(true);
            await createAdmin(createForm);
            setMessage({ type: 'success', text: 'Admin berhasil dibuat' });
            setIsCreating(false);
            setCreateForm({ email: '', password: '', nama: '', role: 'admin' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            setMessage({ 
                type: 'error', 
                text: error instanceof Error ? error.message : 'Gagal membuat admin' 
            });
        } finally {
            setActionLoading(false);
        }
    };

    const handleEditAdmin = async () => {
        if (!editingAdmin) return;

        try {
            setActionLoading(true);
            await updateAdmin(editingAdmin.uid, editForm);
            setMessage({ type: 'success', text: 'Admin berhasil diupdate' });
            setEditingAdmin(null);
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            setMessage({ 
                type: 'error', 
                text: error instanceof Error ? error.message : 'Gagal update admin' 
            });
        } finally {
            setActionLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (!changingPasswordFor) return;

        if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
            setMessage({ type: 'error', text: 'Semua field password harus diisi' });
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setMessage({ type: 'error', text: 'Konfirmasi password tidak cocok' });
            return;
        }

        const passwordValidation = validatePassword(passwordForm.newPassword);
        if (!passwordValidation.isValid) {
            setMessage({ type: 'error', text: 'Password baru tidak memenuhi persyaratan keamanan' });
            return;
        }

        try {
            setActionLoading(true);
            
            const { signInWithEmailAndPassword } = await import('firebase/auth');
            const { auth } = await import('@/lib/firebase');
            
            try {
                await signInWithEmailAndPassword(auth, changingPasswordFor.email, passwordForm.oldPassword);
            } catch {
                setMessage({ type: 'error', text: 'Password lama tidak benar' });
                return;
            }
            
            await updatePassword(changingPasswordFor.uid, passwordForm.oldPassword, passwordForm.newPassword);
            setMessage({ type: 'success', text: 'Password berhasil diubah' });
            setChangingPasswordFor(null);
            setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            setMessage({ 
                type: 'error', 
                text: error instanceof Error ? error.message : 'Gagal mengubah password' 
            });
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteAdmin = async (adminToDelete: AdminListItem) => {
        try {
            setActionLoading(true);
            await deleteAdmin(adminToDelete.uid);
            setMessage({ type: 'success', text: 'Admin berhasil dihapus' });
            setDeleteConfirm(null);
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            setMessage({ 
                type: 'error', 
                text: error instanceof Error ? error.message : 'Gagal menghapus admin' 
            });
        } finally {
            setActionLoading(false);
        }
    };

    const startEdit = (admin: AdminListItem) => {
        setEditingAdmin(admin);
        setEditForm({
            nama: admin.nama,
            role: admin.role
        });
    };

    const cancelEdit = () => {
        setEditingAdmin(null);
        setEditForm({ nama: '', role: 'admin' });
    };

    const startChangePassword = (admin: AdminListItem) => {
        setChangingPasswordFor(admin);
        setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    };

    const cancelChangePassword = () => {
        setChangingPasswordFor(null);
        setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Belum pernah login';
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading && admins.length === 0) {
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-4 md:p-6">
            <div className="custom-max-width mx-auto space-y-8">
                {/* Header */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <Users className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Manajemen Admin</h1>
                                <p className="text-gray-600">Kelola akun administrator</p>
                            </div>
                        </div>
                        
                        <button
                            onClick={() => setIsCreating(true)}
                            className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 shadow-lg flex items-center gap-2 font-medium cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            Tambah Admin
                        </button>
                    </div>
                </div>

                {/* Alert Message */}
                {message && (
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

                {/* Create Form Modal */}
                {isCreating && (
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Tambah Admin Baru</h2>
                            <button
                                onClick={() => setIsCreating(false)}
                                className="w-8 h-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 flex items-center justify-center cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Nama Lengkap
                                </label>
                                <input
                                    type="text"
                                    value={createForm.nama}
                                    onChange={(e) => setCreateForm({...createForm, nama: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-gray-800 outline-none"
                                    placeholder="Masukkan nama lengkap"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={createForm.email}
                                    onChange={(e) => setCreateForm({...createForm, email: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-gray-800 outline-none"
                                    placeholder="Masukkan email"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={createForm.password}
                                        onChange={(e) => setCreateForm({...createForm, password: e.target.value})}
                                        className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-gray-800 outline-none"
                                        placeholder="Masukkan password yang kuat"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {createForm.password && (
                                    <PasswordValidationDisplay password={createForm.password} />
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                            <button
                                onClick={() => setIsCreating(false)}
                                className="px-6 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium cursor-pointer"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleCreateAdmin}
                                disabled={actionLoading || !validatePassword(createForm.password).isValid}
                                className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 disabled:opacity-50 shadow-lg font-medium cursor-pointer"
                            >
                                {actionLoading ? (
                                    <RefreshCw className="w-4 h-4 mr-2 inline animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4 mr-2 inline" />
                                )}
                                Simpan
                            </button>
                        </div>
                    </div>
                )}

                {/* Change Password Modal */}
                {changingPasswordFor && (
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                                    <Key className="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Ubah Password</h2>
                                    <p className="text-gray-600">Admin: {changingPasswordFor.nama}</p>
                                </div>
                            </div>
                            <button
                                onClick={cancelChangePassword}
                                className="w-8 h-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 flex items-center justify-center cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Password Lama
                                </label>
                                <div className="relative">
                                    <input
                                        type={showOldPassword ? 'text' : 'password'}
                                        value={passwordForm.oldPassword}
                                        onChange={(e) => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
                                        className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-gray-800 outline-none"
                                        placeholder="Masukkan password lama"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowOldPassword(!showOldPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                                    >
                                        {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Password Baru
                                </label>
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? 'text' : 'password'}
                                        value={passwordForm.newPassword}
                                        onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                                        className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-gray-800 outline-none"
                                        placeholder="Masukkan password baru"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                                    >
                                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {passwordForm.newPassword && (
                                    <PasswordValidationDisplay password={passwordForm.newPassword} />
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Konfirmasi Password Baru
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={passwordForm.confirmPassword}
                                        onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                                        className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-gray-800 outline-none"
                                        placeholder="Ulangi password baru"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
                                    <p className="text-red-600 text-sm mt-2 flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" />
                                        Password tidak cocok
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                            <button
                                onClick={cancelChangePassword}
                                className="px-6 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium cursor-pointer"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleChangePassword}
                                disabled={actionLoading || !validatePassword(passwordForm.newPassword).isValid || passwordForm.newPassword !== passwordForm.confirmPassword}
                                className="px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all duration-200 disabled:opacity-50 shadow-lg font-medium cursor-pointer"
                            >
                                {actionLoading ? (
                                    <RefreshCw className="w-4 h-4 mr-2 inline animate-spin" />
                                ) : (
                                    <Key className="w-4 h-4 mr-2 inline" />
                                )}
                                Ubah Password
                            </button>
                        </div>
                    </div>
                )}

                {/* Admin List */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Daftar Administrator</h2>
                    
                    {error && (
                        <div className="p-4 bg-red-50/50 backdrop-blur-sm text-red-800 rounded-xl border border-red-200/50 mb-6 flex items-center gap-3">
                            <AlertCircle className="w-5 h-5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="space-y-4">
                        {admins.map((admin: AdminListItem) => (
                            <div key={admin.uid} className="p-6 bg-gradient-to-r from-gray-50/50 to-white/50 backdrop-blur-sm rounded-xl border border-gray-100/50 hover:shadow-lg transition-all duration-200">
                                {editingAdmin?.uid === admin.uid ? (
                                    /* Edit Mode */
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Nama Lengkap
                                                </label>
                                                <input
                                                    type="text"
                                                    value={editForm.nama}
                                                    onChange={(e) => setEditForm({...editForm, nama: e.target.value})}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-gray-800 outline-none"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                                            <button
                                                onClick={cancelEdit}
                                                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200 cursor-pointer"
                                            >
                                                <X className="w-4 h-4 mr-2 inline" />
                                                Batal
                                            </button>
                                            <button
                                                onClick={handleEditAdmin}
                                                disabled={actionLoading}
                                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 disabled:opacity-50 cursor-pointer"
                                            >
                                                {actionLoading ? (
                                                    <RefreshCw className="w-4 h-4 mr-2 inline animate-spin" />
                                                ) : (
                                                    <Save className="w-4 h-4 mr-2 inline" />
                                                )}
                                                Simpan
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    /* Display Mode */
                                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                        <div className="flex items-center gap-4 flex-1">
                                            {/* Avatar */}
                                            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                                {admin.nama.charAt(0).toUpperCase()}
                                            </div>
                                            
                                            {/* Info */}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-bold text-gray-900">{admin.nama}</h3>
                                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700">
                                                        <Shield className="w-3 h-3" />
                                                        Admin
                                                    </span>
                                                    {currentAdmin?.uid === admin.uid && (
                                                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                                                            Anda
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="w-4 h-4" />
                                                        <span>{admin.email}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4" />
                                                        <span>Terakhir: {formatDate(admin.last_access)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Actions - Hanya untuk admin yang bersangkutan */}
                                        {currentAdmin?.uid === admin.uid && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => startEdit(admin)}
                                                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all duration-200 flex items-center gap-2 text-sm font-medium cursor-pointer"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => startChangePassword(admin)}
                                                    className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-all duration-200 flex items-center gap-2 text-sm font-medium cursor-pointer"
                                                >
                                                    <Lock className="w-4 h-4" />
                                                    Ubah Password
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(admin)}
                                                    disabled={actionLoading}
                                                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all duration-200 disabled:opacity-50 flex items-center gap-2 text-sm font-medium cursor-pointer"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Hapus
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                        
                        {admins.length === 0 && !loading && (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <User className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Admin</h3>
                                <p className="text-gray-600 mb-6">Mulai dengan menambahkan administrator pertama</p>
                                <button
                                    onClick={() => setIsCreating(true)}
                                    className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 shadow-lg flex items-center gap-2 font-medium mx-auto cursor-pointer"
                                >
                                    <Plus className="w-4 h-4" />
                                    Tambah Admin
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                {deleteConfirm && (
                    <div className="h-screen fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-100">
                        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl max-w-md w-full p-6 border border-white/20">
                            <div className="flex items-center mb-4">
                                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center mr-3">
                                    <AlertCircle className="w-5 h-5 text-red-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">
                                    Konfirmasi Hapus Admin
                                </h3>
                            </div>
                            
                            <div className="bg-red-50/50 backdrop-blur-sm rounded-xl p-4 mb-6 border border-red-100/50">
                                <p className="text-red-800 text-sm mb-2 font-medium">
                                    ⚠️ Peringatan: Tindakan ini tidak dapat dibatalkan!
                                </p>
                                <p className="text-red-700 text-sm">
                                    Anda akan menghapus admin <strong>&quot;{deleteConfirm.nama}&quot;</strong> dengan email <strong>{deleteConfirm.email}</strong>
                                </p>
                            </div>

                            <p className="text-gray-600 mb-6">
                                Semua data terkait admin ini akan dihapus secara permanen dari sistem. 
                                Pastikan Anda yakin dengan keputusan ini.
                            </p>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    disabled={actionLoading}
                                    className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 font-medium disabled:opacity-50 cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={() => handleDeleteAdmin(deleteConfirm)}
                                    disabled={actionLoading}
                                    className="px-6 py-3 text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all duration-200 font-medium disabled:opacity-50 shadow-lg cursor-pointer"
                                >
                                    {actionLoading ? (
                                        <>
                                            <RefreshCw className="w-4 h-4 mr-2 inline animate-spin" />
                                            Menghapus...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="w-4 h-4 mr-2 inline" />
                                            Hapus Admin
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Info Card */}
                <div className="bg-gradient-to-r from-green-50/50 to-indigo-50/50 backdrop-blur-sm rounded-2xl p-6 border border-green-100/50">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <AlertCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-green-900 mb-2">Informasi Penting</h3>
                            <ul className="text-sm text-green-800 space-y-1">
                                <li>• Admin dapat membuat akun admin baru untuk administrator lain</li>
                                <li>• Setiap admin hanya dapat mengedit dan menghapus akun mereka sendiri</li>
                                <li>• Admin dapat mengubah password mereka sendiri kapan saja</li>
                                <li>• Password harus memenuhi kriteria keamanan yang ditetapkan</li>
                                <li>• Semua admin memiliki akses yang sama untuk fitur ini</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Security Info Card */}
                <div className="bg-gradient-to-r from-orange-50/50 to-red-50/50 backdrop-blur-sm rounded-2xl p-6 border border-orange-100/50">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Shield className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-orange-900 mb-2">Kebijakan Keamanan Password</h3>
                            <ul className="text-sm text-orange-800 space-y-1">
                                <li>• Password minimal 8 karakter</li>
                                <li>• Harus mengandung huruf besar (A-Z) dan huruf kecil (a-z)</li>
                                <li>• Harus mengandung minimal 1 angka (0-9)</li>
                                <li>• Harus mengandung minimal 1 karakter khusus (!@#$%^&*)</li>
                                <li>• Disarankan menggunakan kombinasi yang tidak mudah ditebak</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminManagement;