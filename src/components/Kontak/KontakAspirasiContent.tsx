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
        <div className="min-h-screen bg-gray-50">
            {/* Main Content */}
            <div className=" mx-auto px-6 md:px-20 lg:px-40 py-8 lg:py-12">
                
                {/* Header */}
                <div className="relative bg-gradient-to-br from-green-50 via-white to-green-50 rounded-2xl p-8 mb-8 overflow-hidden lg:min-h-100">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute top-4 left-4 w-16 h-16 border-2 border-green-400 rounded-full"></div>
                        <div className="absolute top-8 right-8 w-8 h-8 bg-green-300 rounded-full"></div>
                        <div className="absolute bottom-6 left-12 w-12 h-12 border border-green-300 rotate-45"></div>
                        <div className="absolute bottom-4 right-16 w-6 h-6 bg-green-400 rounded-full"></div>
                    </div>

                    {/* Content */}
                    <div className="relative text-center max-w-4xl mx-auto">
                        {/* Icon and Badge */}
                        <div className="flex justify-center mb-4">
                            <div className="relative">
                                <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-2xl shadow-lg">
                                    <MessageCircle className="w-8 h-8 text-white" />
                                </div>
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 bg-clip-text text-transparent mb-4">
                            Kontak & Aspirasi
                        </h1>

                        {/* Subtitle */}
                        <p className="text-gray-600 text-lg lg:text-xl mb-6 max-w-2xl mx-auto leading-relaxed">
                            Hubungi kami atau sampaikan aspirasi untuk kemajuan
                            <br/>
                            <span className="font-semibold text-green-700"> Desa Tonrong Rijang</span>
                        </p>

                        {/* Decorative Line */}
                        <div className="flex items-center justify-center space-x-4">
                            <div className="h-px bg-gradient-to-r from-transparent via-green-300 to-transparent flex-1 max-w-32"></div>
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <div className="w-1 h-1 bg-green-300 rounded-full"></div>
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <div className="h-px bg-gradient-to-r from-transparent via-green-300 to-transparent flex-1 max-w-32"></div>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
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