import { useState, useEffect, useCallback } from 'react';
import { auth } from '@/lib/firebase';

export interface AdminListItem {
    uid: string;
    nama: string;
    email: string;
    role: 'admin';
    last_access: string | null;
    created_at: string | null;
}

export interface CreateAdminData {
    email: string;
    password: string;
    nama: string;
    role: 'admin';
}

export interface UpdateAdminData {
    nama?: string;
    role?: 'admin';
}

export interface UpdatePasswordData {
    targetUid: string;
    oldPassword: string;
    newPassword: string;
}

interface AdminManagementResponse {
    success: boolean;
    message?: string;
    data?: AdminListItem;
}

interface AdminListResponse {
    success: boolean;
    message?: string;
    data?: AdminListItem[];
}

export function useAdminManagement() {
    const [admins, setAdmins] = useState<AdminListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getAuthToken = useCallback(async () => {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            throw new Error('User tidak terautentikasi');
        }
        return await currentUser.getIdToken();
    }, []);

    const fetchAdmins = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            const token = await getAuthToken();
            const response = await fetch('/api/admins', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data: AdminListResponse = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Gagal mengambil data admin');
            }

            if (data.success && data.data) {
                setAdmins(data.data);
            } else {
                throw new Error(data.message || 'Respons tidak valid');
            }
        } catch (err) {
            console.error('Error fetching admins:', err);
            setError(err instanceof Error ? err.message : 'Gagal mengambil data admin');
        } finally {
            setLoading(false);
        }
    }, [getAuthToken]);

    const createAdmin = useCallback(async (adminData: CreateAdminData) => {
        const token = await getAuthToken();
        const response = await fetch('/api/admins', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(adminData),
        });

        const data: AdminManagementResponse = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Gagal membuat admin');
        }

        if (!data.success) {
            throw new Error(data.message || 'Gagal membuat admin');
        }

        await fetchAdmins();
        return data;
    }, [getAuthToken, fetchAdmins]);

    const updateAdmin = useCallback(async (targetUid: string, updateData: UpdateAdminData) => {
        const token = await getAuthToken();
        const response = await fetch('/api/admins', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...updateData, targetUid }),
        });

        const data: AdminManagementResponse = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Gagal update admin');
        }

        if (!data.success) {
            throw new Error(data.message || 'Gagal update admin');
        }

        await fetchAdmins();
        return data;
    }, [getAuthToken, fetchAdmins]);

    const updatePassword = useCallback(async (targetUid: string, oldPassword: string, newPassword: string) => {
        const token = await getAuthToken();
        
        const response = await fetch('/api/admins', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                targetUid, 
                newPassword,
                currentPasswordConfirmed: true
            }),
        });

        const data: AdminManagementResponse = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Gagal mengubah password');
        }

        if (!data.success) {
            throw new Error(data.message || 'Gagal mengubah password');
        }

        return data;
    }, [getAuthToken]);

    const deleteAdmin = useCallback(async (targetUid: string) => {
        const token = await getAuthToken();
        const response = await fetch(`/api/admins?uid=${targetUid}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data: AdminManagementResponse = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Gagal menghapus admin');
        }

        if (!data.success) {
            throw new Error(data.message || 'Gagal menghapus admin');
        }

        await fetchAdmins();
        return data;
    }, [getAuthToken, fetchAdmins]);

    useEffect(() => {
        fetchAdmins();
    }, [fetchAdmins]);

    return {
        admins,
        loading,
        error,
        createAdmin,
        updateAdmin,
        updatePassword,
        deleteAdmin,
        refreshAdmins: fetchAdmins,
    };
}