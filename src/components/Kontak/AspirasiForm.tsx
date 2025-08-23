'use client';

import React, { useState } from 'react';
import { Send } from 'lucide-react';
import toast from 'react-hot-toast';

interface FormData {
    judul: string;
    nama: string;
    email: string;
    nomor_telepon: string;
    isi: string;
}

// Validation utilities
const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^(\+62|62|0)[0-9]{8,12}$/;
    return phoneRegex.test(phone);
};

const validateRequired = (value: string): boolean => {
    return value.trim().length > 0;
};

const validateMinLength = (value: string, minLength: number): boolean => {
    return value.trim().length >= minLength;
};

const AspirasiForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        judul: '',
        nama: '',
        email: '',
        nomor_telepon: '',
        isi: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = (): boolean => {
        // Validate required fields
        if (!validateRequired(formData.judul)) {
            toast.error('Judul aspirasi wajib diisi');
            return false;
        }

        if (!validateRequired(formData.nama)) {
            toast.error('Nama lengkap wajib diisi');
            return false;
        }

        if (!validateRequired(formData.isi)) {
            toast.error('Isi aspirasi wajib diisi');
            return false;
        }

        // Validate content length
        if (!validateMinLength(formData.isi, 20)) {
            toast.error('Isi aspirasi minimal 20 karakter');
            return false;
        }

        // Validate judul length (reasonable limit)
        if (formData.judul.trim().length > 100) {
            toast.error('Judul aspirasi maksimal 100 karakter');
            return false;
        }

        // Validate nama length
        if (formData.nama.trim().length > 50) {
            toast.error('Nama maksimal 50 karakter');
            return false;
        }

        // Validate email format if provided
        const emailTrimmed = formData.email.trim();
        if (emailTrimmed && !validateEmail(emailTrimmed)) {
            toast.error('Format email tidak valid');
            return false;
        }

        // Validate phone format if provided
        const phoneTrimmed = formData.nomor_telepon.trim();
        if (phoneTrimmed && !validatePhoneNumber(phoneTrimmed)) {
            toast.error('Format nomor telepon tidak valid. Gunakan format: 08xxxxxxxxxx atau +62xxxxxxxxx');
            return false;
        }

        // Validate content quality (basic)
        const isiTrimmed = formData.isi.trim();
        if (isiTrimmed.length > 1000) {
            toast.error('Isi aspirasi maksimal 1000 karakter');
            return false;
        }

        const spamPatterns = [
            /(.)\1{10,}/, // Repeated characters
            /^[A-Z\s!@#$%^&*()]{50,}$/, // All caps with symbols
        ];
        
        if (spamPatterns.some(pattern => pattern.test(isiTrimmed))) {
            toast.error('Isi aspirasi tidak valid. Mohon tulis dengan format yang wajar.');
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setSubmitting(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('judul', formData.judul.trim());
            formDataToSend.append('nama', formData.nama.trim());
            formDataToSend.append('isi', formData.isi.trim());
            
            // Only append if not empty
            if (formData.email.trim()) {
                formDataToSend.append('email', formData.email.trim());
            }
            if (formData.nomor_telepon.trim()) {
                formDataToSend.append('nomor_telepon', formData.nomor_telepon.trim());
            }

            const response = await fetch('/api/aspirasi', {
                method: 'POST',
                body: formDataToSend
            });

            const result = await response.json();

            if (result.success) {
                toast.success(result.message || 'Aspirasi berhasil dikirim!', {
                    duration: 5000
                });
                setFormData({ judul: '', nama: '', email: '', nomor_telepon: '', isi: '' });
            } else {
                toast.error(result.error || 'Gagal mengirim aspirasi. Silakan coba lagi.');
            }
        } catch (error) {
            toast.error('Terjadi kesalahan jaringan. Silakan periksa koneksi internet dan coba lagi.');
            console.error('Submit error:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const isFormValid = () => {
        return (
            validateRequired(formData.judul) &&
            validateRequired(formData.nama) &&
            validateRequired(formData.isi) &&
            validateMinLength(formData.isi, 20) &&
            (formData.email.trim() || formData.nomor_telepon.trim())
        );
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden min-h-225" 
             style={{ borderColor: 'var(--border-light)' }}>
            {/* Header */}
            <div className="p-6 border-b" style={{ borderColor: 'var(--border-light)' }}>
                <div className="flex items-center">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4" 
                         style={{ backgroundColor: 'var(--bg-orange-light)' }}>
                        <Send className="w-6 h-6" style={{ color: 'var(--primary-orange)' }} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                            Sampaikan Aspirasi Anda
                        </h2>
                        <p className="text-base" style={{ color: 'var(--text-muted)' }}>
                            Partisipasi Anda sangat berharga untuk kemajuan desa
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {/* Form */}
                <div className="space-y-6">
                    {/* Judul Aspirasi */}
                    <div>
                        <label htmlFor="judul" className="block text-base font-semibold mb-3" 
                               style={{ color: 'var(--text-primary)' }}>
                            Judul Aspirasi <span className='text-red-600'>*</span>
                        </label>
                        <input
                            type="text"
                            id="judul"
                            name="judul"
                            value={formData.judul}
                            onChange={handleInputChange}
                            maxLength={100}
                            className="w-full px-4 py-4 text-base border-2 rounded-lg transition-all focus:outline-none text-black"
                            style={{ borderColor: 'var(--border-light)' }}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = 'var(--primary-orange)';
                                e.currentTarget.style.boxShadow = `0 0 0 3px var(--bg-orange-light)`;
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = 'var(--border-light)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                            placeholder="Contoh: Perbaikan Jalan Desa Menuju Pasar"
                        />
                        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                            {formData.judul.length}/100 karakter
                        </p>
                    </div>

                    {/* Nama */}
                    <div>
                        <label htmlFor="nama" className="block text-base font-semibold mb-3" 
                               style={{ color: 'var(--text-primary)' }}>
                            Nama Lengkap <span className='text-red-600'>*</span>
                        </label>
                        <input
                            type="text"
                            id="nama"
                            name="nama"
                            value={formData.nama}
                            onChange={handleInputChange}
                            maxLength={50}
                            className="w-full px-4 py-4 text-base border-2 rounded-lg transition-all focus:outline-none text-black/80"
                            style={{ borderColor: 'var(--border-light)' }}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = 'var(--primary-orange)';
                                e.currentTarget.style.boxShadow = `0 0 0 3px var(--bg-orange-light)`;
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = 'var(--border-light)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                            placeholder="Masukkan nama lengkap Anda"
                        />
                        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                            {formData.nama.length}/50 karakter
                        </p>
                    </div>

                    {/* Email dan Nomor Telepon */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="email" className="block text-base font-semibold mb-3" 
                                   style={{ color: 'var(--text-primary)' }}>
                                Alamat Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-4 py-4 text-base border-2 rounded-lg transition-all focus:outline-none text-black/80"
                                style={{ borderColor: 'var(--border-light)' }}
                                onFocus={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--primary-orange)';
                                    e.currentTarget.style.boxShadow = `0 0 0 3px var(--bg-orange-light)`;
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--border-light)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                                placeholder="email@contoh.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="nomor_telepon" className="block text-base font-semibold mb-3" 
                                   style={{ color: 'var(--text-primary)' }}>
                                Nomor Telepon
                            </label>
                            <input
                                type="tel"
                                id="nomor_telepon"
                                name="nomor_telepon"
                                value={formData.nomor_telepon}
                                onChange={handleInputChange}
                                className="w-full px-4 py-4 text-base border-2 rounded-lg transition-all focus:outline-none text-black/80"
                                style={{ borderColor: 'var(--border-light)' }}
                                onFocus={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--primary-orange)';
                                    e.currentTarget.style.boxShadow = `0 0 0 3px var(--bg-orange-light)`;
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--border-light)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                                placeholder="08123456789"
                            />
                        </div>
                    </div>

                    {/* Isi Aspirasi */}
                    <div>
                        <label htmlFor="isi" className="block text-base font-semibold mb-3" 
                               style={{ color: 'var(--text-primary)' }}>
                            Isi Aspirasi <span className='text-red-600'>*</span>
                        </label>
                        <textarea
                            id="isi"
                            name="isi"
                            value={formData.isi}
                            onChange={handleInputChange}
                            rows={8}
                            maxLength={1000}
                            className="w-full px-4 py-4 text-base border-2 rounded-lg transition-all focus:outline-none resize-vertical text-black/80"
                            style={{ borderColor: 'var(--border-light)' }}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = 'var(--primary-orange)';
                                e.currentTarget.style.boxShadow = `0 0 0 3px var(--bg-orange-light)`;
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = 'var(--border-light)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                            placeholder="Jelaskan aspirasi, saran, atau kritik Anda secara detail. Sertakan latar belakang masalah, dampak yang dirasakan, dan usulan solusi jika memungkinkan..."
                        />
                        <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
                            Minimum 20 karakter. Saat ini: {formData.isi.length}/1000 karakter
                        </p>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || !isFormValid()}
                        className="w-full py-4 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed text-base"
                        style={{ 
                            backgroundColor: submitting || !isFormValid() 
                                ? 'var(--text-muted)' 
                                : 'var(--primary-orange)', 
                            color: 'white' 
                        }}
                        onMouseOver={(e) => {
                            if (!submitting && isFormValid()) {
                                e.currentTarget.style.backgroundColor = 'var(--button-orange-hover)';
                            }
                        }}
                        onMouseOut={(e) => {
                            if (!submitting && isFormValid()) {
                                e.currentTarget.style.backgroundColor = 'var(--primary-orange)';
                            }
                        }}
                    >
                        {submitting ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Mengirim Aspirasi...</span>
                            </>
                        ) : (
                            <>
                                <Send className="w-5 h-5" />
                                <span>Kirim Aspirasi</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AspirasiForm;