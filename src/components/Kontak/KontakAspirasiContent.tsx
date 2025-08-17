'use client';

import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import KontakInfo from '@/components/Kontak/KontakInfo';
import AspirasiForm from '@/components/Kontak/AspirasiForm';

interface KontakDesa {
    id: string;
    alamat: string;
    nomor_telepon: string;
    nomor_whatsapp: string;
    email_desa: string;
    created_at: Date;
    updated_at: Date;
    admin_id: string;
}

const KontakAspirasiContent: React.FC = () => {
    const [kontakData, setKontakData] = useState<KontakDesa | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchKontakData = async () => {
            try {
                const response = await fetch('/api/kontak-desa');
                const result = await response.json();
                if (result.success && result.data) {
                    setKontakData(result.data);
                } else {
                    setError('Data kontak tidak tersedia');
                }
            } catch (error) {
                console.error('Error fetching kontak data:', error);
                setError('Gagal memuat data kontak');
            } finally {
                setLoading(false);
            }
        };

        fetchKontakData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4" 
                         style={{ 
                           borderColor: 'var(--bg-orange-soft)', 
                           borderTopColor: 'var(--primary-orange)' 
                         }}>
                    </div>
                    <p className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
                        Memuat data kontak...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Hero Section - Clean & Simple */}
            <div className="bg-white shadow-sm border-b" style={{ borderColor: 'var(--border-light)' }}>
                <div className="max-w-7xl mx-auto px-6 md:px-20 lg:px-40 py-8 lg:py-12">
                    <div className="text-center">
                        <h1 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                            Kontak &{' '}
                            <span style={{ color: 'var(--primary-orange)' }}>Aspirasi</span>
                        </h1>
                        <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
                            Hubungi kami atau sampaikan aspirasi untuk kemajuan Desa Tonrong Rijang
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 md:px-20 lg:px-40 py-8 lg:py-12">
                <div className="grid lg:grid-cols-3 gap-6 lg:gap-4">
                    {/* LEFT SIDE */}
                    <div className="lg:col-span-1">
                        <KontakInfo kontakData={kontakData} loading={loading} error={error} />
                    </div>
                    
                    {/* RIGHT SIDE */}
                    <div className="lg:col-span-2 lg:top-8 lg:self-start">
                        <AspirasiForm />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KontakAspirasiContent;