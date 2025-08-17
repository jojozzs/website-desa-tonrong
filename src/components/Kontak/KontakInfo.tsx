import React from 'react';
import { MapPin, Phone, MessageCircle, Mail, Clock, ExternalLink } from 'lucide-react';

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

interface KontakInfoProps {
    kontakData: KontakDesa | null;
    loading: boolean;
    error?: string | null;
}

const KontakInfo: React.FC<KontakInfoProps> = ({ kontakData, loading, error }) => {
    const contactItems = [
        {
            icon: MapPin,
            title: 'Alamat Kantor',
            value: kontakData?.alamat || 'Jl. Jeruk No. 3, Dusun Tonrong Rijang, Kode Pos 91652, Kecamatan Baranti, Kabupaten Sidenreng Rappang, Sulawesi Selatan',
            color: 'var(--primary-orange)',
            bgColor: 'var(--bg-orange-light)'
        },
        {
            icon: Phone,
            title: 'Telepon',
            value: kontakData?.nomor_telepon || 'Sedang dalam pemutakhiran',
            color: 'var(--primary-green)',
            bgColor: 'var(--bg-green-light)',
            href: kontakData?.nomor_telepon ? `tel:${kontakData.nomor_telepon}` : undefined
        },
        {
            icon: MessageCircle,
            title: 'WhatsApp',
            value: kontakData?.nomor_whatsapp || 'Sedang dalam pemutakhiran',
            color: 'var(--primary-green)',
            bgColor: 'var(--bg-green-light)',
            href: kontakData?.nomor_whatsapp ? `https://wa.me/${kontakData.nomor_whatsapp.replace(/\D/g, '')}` : undefined,
            action: 'Chat WhatsApp'
        },
        {
            icon: Mail,
            title: 'Email Desa',
            value: kontakData?.email_desa || 'Sedang dalam pemutakhiran',
            color: 'var(--text-secondary)',
            bgColor: 'var(--bg-gray-soft)',
            href: kontakData?.email_desa ? `mailto:${kontakData.email_desa}` : undefined
        }
    ];

    const operatingHours = [
        { day: 'Senin - Kamis', time: '08:00 - 15:00 WITA', status: 'open' },
        { day: 'Jumat', time: '08:00 - 11:00 WITA', status: 'open' },
        { day: 'Sabtu - Minggu', time: 'Tutup', status: 'closed' }
    ];

    if (loading) {
        return (
            <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg p-4 shadow-sm border animate-pulse" 
                         style={{ borderColor: 'var(--border-light)' }}>
                        <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: 'var(--bg-gray-soft)' }}></div>
                            <div className="flex-1">
                                <div className="h-3 rounded w-1/3 mb-2" style={{ backgroundColor: 'var(--bg-gray-soft)' }}></div>
                                <div className="h-4 rounded w-2/3" style={{ backgroundColor: 'var(--bg-gray-soft)' }}></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg p-6 shadow-sm border text-center" 
                 style={{ borderColor: 'var(--border-light)' }}>
                <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" 
                     style={{ backgroundColor: 'var(--bg-orange-light)' }}>
                    <Phone className="w-6 h-6" style={{ color: 'var(--primary-orange)' }} />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    {error}
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    Silakan coba muat ulang halaman
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg p-4 shadow-sm border" 
                 style={{ borderColor: 'var(--border-light)' }}>
                <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                    Informasi Kontak
                </h2>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    Hubungi kami melalui berbagai cara berikut
                </p>
            </div>

            {/* Contact Items */}
            <div className="space-y-3">
                {contactItems.map((item, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow" 
                         style={{ borderColor: 'var(--border-light)' }}>
                        <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" 
                                 style={{ backgroundColor: item.bgColor }}>
                                <item.icon className="w-5 h-5" style={{ color: item.color }} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                                    {item.title}
                                </h3>
                                <p className="break-words text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                                    {item.value}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Map Section */}
            <div className="bg-white rounded-lg p-4 shadow-sm border" 
                 style={{ borderColor: 'var(--border-light)' }}>
                <div className="flex items-center mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-2" 
                         style={{ backgroundColor: 'var(--bg-green-light)' }}>
                        <MapPin className="w-4 h-4" style={{ color: 'var(--primary-green)' }} />
                    </div>
                    <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Lokasi Kantor
                    </h3>
                </div>
                <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
                    Desa Tonrong Rijang, Kec. Baranti
                </p>
                <div className="h-48 rounded-lg overflow-hidden border-2 mb-3" 
                     style={{ borderColor: 'var(--border-light)' }}>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15892.472234567!2d119.94!3d-4.14!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dbee5b7c8f8f8f8%3A0x1234567890abcdef!2sTonrong%20Rijang%2C%20Baranti%2C%20Sidenreng%20Rappang%20Regency%2C%20South%20Sulawesi!5e0!3m2!1sen!2sid!4v1234567890123!5m2!1sen!2sid"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Lokasi Desa Tonrong Rijang"
                    />
                </div>
                <button
                    onClick={() => window.open('https://maps.google.com/maps?q=-4.14,119.94', '_blank')}
                    className="w-full py-2 px-3 rounded-lg font-medium text-white transition-colors flex items-center justify-center text-sm"
                    style={{ backgroundColor: 'var(--primary-green)' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--button-green-hover)'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-green)'}
                >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Buka di Google Maps
                </button>
            </div>
        </div>
    );
};

export default KontakInfo;