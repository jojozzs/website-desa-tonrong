'use client';

import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

interface FormData {
    judul: string;
    nama: string;
    email: string;
    isi: string;
}

const AspirasiForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        judul: '',
        nama: '',
        email: '',
        isi: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [submitMessage, setSubmitMessage] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        // Validate required fields
        if (!formData.judul.trim() || !formData.nama.trim() || !formData.email.trim() || !formData.isi.trim()) {
            setSubmitStatus('error');
            setSubmitMessage('Semua field wajib diisi.');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setSubmitStatus('error');
            setSubmitMessage('Format email tidak valid.');
            return;
        }

        // Validate content length
        if (formData.isi.length < 20) {
            setSubmitStatus('error');
            setSubmitMessage('Isi aspirasi minimal 20 karakter.');
            return;
        }

        setSubmitting(true);
        setSubmitStatus('idle');

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('judul', formData.judul);
            formDataToSend.append('nama', formData.nama);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('isi', formData.isi);

            const response = await fetch('/api/aspirasi', {
                method: 'POST',
                body: formDataToSend
            });

            const result = await response.json();

            if (result.success) {
                setSubmitStatus('success');
                setSubmitMessage('Aspirasi Anda berhasil dikirim! Tim kami akan menindaklanjuti dalam 3-7 hari kerja.');
                setFormData({ judul: '', nama: '', email: '', isi: '' });
            } else {
                setSubmitStatus('error');
                setSubmitMessage(result.error || 'Gagal mengirim aspirasi. Silakan coba lagi.');
            }
        } catch (error) {
            setSubmitStatus('error');
            setSubmitMessage('Terjadi kesalahan jaringan. Silakan periksa koneksi internet dan coba lagi.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden min-h-235" 
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
                {/* Status Messages */}
                {submitStatus === 'success' && (
                    <div className="mb-6 p-4 rounded-lg border-2" 
                         style={{ 
                           backgroundColor: 'var(--bg-green-light)', 
                           borderColor: 'var(--accent-green)',
                           color: 'var(--primary-green)'
                         }}>
                        <div className="flex items-start">
                            <CheckCircle className="w-6 h-6 mr-3 flex-shrink-0" />
                            <div>
                                <h4 className="font-semibold mb-2">Aspirasi Berhasil Dikirim!</h4>
                                <p className="text-sm">{submitMessage}</p>
                            </div>
                        </div>
                    </div>
                )}

                {submitStatus === 'error' && (
                    <div className="mb-6 p-4 rounded-lg border-2" 
                         style={{ 
                           backgroundColor: 'var(--bg-orange-light)', 
                           borderColor: 'var(--accent-orange)',
                           color: 'var(--primary-orange)'
                         }}>
                        <div className="flex items-start">
                            <AlertCircle className="w-6 h-6 mr-3 flex-shrink-0" />
                            <div>
                                <h4 className="font-semibold mb-2">Terjadi Kesalahan</h4>
                                <p className="text-sm">{submitMessage}</p>
                            </div>
                        </div>
                    </div>
                )}

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
                    </div>

                    {/* Nama dan Email */}
                    <div className="grid md:grid-cols-2 gap-6">
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
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-base font-semibold mb-3" 
                                   style={{ color: 'var(--text-primary)' }}>
                                Alamat Email <span className='text-red-600'>*</span>
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
                            Minimum 20 karakter. Saat ini: {formData.isi.length} karakter
                        </p>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || formData.isi.length < 20}
                        className="w-full py-4 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed text-base"
                        style={{ 
                            backgroundColor: submitting || formData.isi.length < 20 
                                ? 'var(--text-muted)' 
                                : 'var(--primary-orange)', 
                            color: 'white' 
                        }}
                        onMouseOver={(e) => {
                            if (!submitting && formData.isi.length >= 20) {
                                e.currentTarget.style.backgroundColor = 'var(--button-orange-hover)';
                            }
                        }}
                        onMouseOut={(e) => {
                            if (!submitting && formData.isi.length >= 20) {
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