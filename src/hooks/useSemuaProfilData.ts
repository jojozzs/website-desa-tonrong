'use client';
import { useEffect, useState, useCallback } from 'react';
import { ProfilWithContent } from '@/lib/types';

export function useSemuaProfilData() {
    const [data, setData] = useState<ProfilWithContent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch('/api/profil?all=true');
            const result = await res.json();

            if (result.success) {
                setData(result.data || []);
            } else {
                throw new Error(result.error || 'Gagal memuat data');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
            setData([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
}