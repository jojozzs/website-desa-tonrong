'use client'

import React, { useState } from 'react';
import { Calendar, Folder, Eye, ArrowRight, TrendingUp, BookOpen } from 'lucide-react';

export default function BeritaTerkini() {
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);

    const newsData = [
        {
            id: 1,
            title: "Kembali Lepas Dua ASN Memasuki Masa Purna Tugas",
            excerpt: "Setiap ASN memiliki batas usia purna tugas yang berbeda-beda, dan pada waktunya akan mengakhiri masa pengabdiannya dengan dedikasi tinggi.",
            category: "Berita Internal",
            date: "23 Juli 2025",
            readTime: "3 min",
            views: "245",
            image: "/api/placeholder/400/300",
            author: "Admin BBKESMAV",
            trending: true,
            categoryColor: "from-blue-500 to-blue-600",
            categoryBg: "bg-blue-500"
        },
        {
            id: 2,
            title: "Peningkatan Kualitas Laboratorium Kesehatan Masyarakat Veteriner",
            excerpt: "Investasi peralatan modern dan pelatihan SDM untuk meningkatkan standar pelayanan laboratorium sesuai regulasi internasional.",
            category: "Pengumuman",
            date: "22 Juli 2025",
            readTime: "5 min",
            views: "189",
            image: "/api/placeholder/400/300",
            author: "Dr. Siti Rahayu",
            trending: false,
            categoryColor: "from-emerald-500 to-emerald-600",
            categoryBg: "bg-emerald-500"
        },
        {
            id: 3,
            title: "Workshop Keamanan Pangan untuk Industri UMKM",
            excerpt: "Program pelatihan komprehensif untuk meningkatkan kesadaran dan implementasi standar keamanan pangan di sektor UMKM.",
            category: "Pengumuman",
            date: "21 Juli 2025",
            readTime: "4 min",
            views: "167",
            image: "/api/placeholder/400/300",
            author: "Tim Pelatihan",
            trending: true,
            categoryColor: "from-emerald-500 to-emerald-600",
            categoryBg: "bg-emerald-500"
        },
        {
            id: 4,
            title: "Sertifikasi Halal Produk Pangan Lokal Meningkat 40%",
            excerpt: "Data menunjukkan peningkatan signifikan permintaan sertifikasi halal dari produsen lokal sebagai respons terhadap kesadaran konsumen.",
            category: "Berita Eksternal",
            date: "20 Juli 2025",
            readTime: "6 min",
            views: "312",
            image: "/api/placeholder/400/300",
            author: "Divisi Sertifikasi",
            trending: true,
            categoryColor: "from-orange-500 to-orange-600",
            categoryBg: "bg-orange-500"
        },
        {
            id: 5,
            title: "Kolaborasi Internasional dalam Penelitian Kesehatan Hewan",
            excerpt: "Kerjasama dengan institusi penelitian internasional untuk pengembangan metode deteksi dini penyakit hewan yang lebih akurat.",
            category: "Berita Internal",
            date: "19 Juli 2025",
            readTime: "7 min",
            views: "203",
            image: "/api/placeholder/400/300",
            author: "Tim Penelitian",
            trending: false,
            categoryColor: "from-blue-500 to-blue-600",
            categoryBg: "bg-blue-500"
        },
        {
            id: 6,
            title: "Implementasi Sistem Digital untuk Pelayanan Publik",
            excerpt: "Transformasi digital layanan publik dengan sistem terintegrasi untuk meningkatkan efisiensi dan kepuasan masyarakat.",
            category: "Pengumuman",
            date: "18 Juli 2025",
            readTime: "5 min",
            views: "178",
            image: "/api/placeholder/400/300",
            author: "IT Development",
            trending: false,
            categoryColor: "from-emerald-500 to-emerald-600",
            categoryBg: "bg-emerald-500"
        }
    ];

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {newsData.map((news, idx) => {
                    const isHovered = hoveredCard === idx;
                    
                    return (
                        <article key={news.id} onMouseEnter={() => setHoveredCard(idx)} onMouseLeave={() => setHoveredCard(null)}
                        className={`group cursor-pointer transition-all duration-500 transform ${
                            isHovered ? 'scale-105 -translate-y-2' : 'scale-100'
                        }`}>
                            <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100">
                                {/* Image Section */}
                                <div className="relative overflow-hidden">
                                    <div className="w-full aspect-[16/10] bg-gradient-to-br from-gray-200 to-gray-300 relative">
                                        {/* Placeholder for image */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 opacity-80"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <BookOpen className="w-16 h-16 text-white/70" />
                                        </div>
                                        
                                        {/* Overlay on hover */}
                                        <div className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${
                                            isHovered ? 'opacity-100' : 'opacity-0'
                                        }`}></div>
                                    </div>
                                    
                                    {/* Category Badge */}
                                    <div className={`absolute top-4 left-4 ${news.categoryBg} text-white text-xs font-semibold px-3 py-2 rounded-full shadow-lg flex items-center gap-2`}>
                                        <Folder className="w-3 h-3" />
                                        {news.category}
                                    </div>
                                    
                                    {/* Trending Badge */}
                                    {news.trending && (
                                        <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-2 rounded-full shadow-lg flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3" />
                                            HOT
                                        </div>
                                    )}
                                </div>

                                {/* Content Section */}
                                <div className="flex flex-col p-6 gap-1">
                                    {/* Title */}
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight line-clamp-2 group-hover:text-emerald-600 transition-colors duration-300">
                                        {news.title}
                                    </h3>
                                    
                                    {/* Excerpt */}
                                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 text-justify">
                                        {news.excerpt}
                                    </p>
                                    
                                    {/* Meta Information */}
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <div className="w-full flex justify-between pr-3">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                <span>{news.date}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Eye className="w-4 h-4" />
                                                <span>{news.views}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Read More Button */}
                                <div className={`px-6 pb-6 transition-all duration-300 cursor-pointer ${
                                    isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                                }`}>
                                    <button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 px-4 rounded-2xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg cursor-pointer">
                                        Baca Selengkapnya
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>
        </div>
    );
}