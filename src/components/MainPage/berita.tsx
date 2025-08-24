'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useBeritaData } from '@/hooks/useBeritaData'
import { Calendar, ArrowRight, BookOpen, User, Clock } from 'lucide-react'
import { BeritaPengumumanKategoriEnum } from '@/lib/enums'
import type { OutputData } from '@editorjs/editorjs'

// Helper function untuk extract text dari EditorJS content (same as BeritaCard)
const extractTextFromEditorJS = (data: OutputData): string => {
    if (!data || !data.blocks) return ''
    
    let text = ''
    for (const block of data.blocks) {
        switch (block.type) {
            case 'paragraph':
                text += block.data.text + ' '
                break
            case 'header':
                text += block.data.text + ' '
                break
            case 'list':
                if (block.data.items) {
                    for (const item of block.data.items) {
                        if (typeof item === 'string') {
                            text += item + ' '
                        } else if (item.content) {
                            text += item.content + ' '
                        }
                    }
                }
                break
            case 'quote':
                text += block.data.text + ' '
                break
        }
    }
    
    return text.trim()
}

export default function BeritaTerkini() {
    const { data: allBeritaData, loading, error } = useBeritaData()
    const [hoveredCard, setHoveredCard] = useState<number | null>(null)

    // Take only first 6 items and mix berita & pengumuman
    const displayData = allBeritaData.slice(0, 6)

    const formatDate = (date: Date | string) => {
        const d = typeof date === 'string' ? new Date(date) : date
        return d.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }

    const formatIDDate = (date: Date | string) => {
        const d = typeof date === 'string' ? new Date(date) : date
        return d.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    }

    const formatTimeAgo = (date: Date | string) => {
        const d = typeof date === 'string' ? new Date(date) : date
        const now = new Date()
        const diffTime = Math.abs(now.getTime() - d.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        
        if (diffDays === 1) return '1 hari lalu'
        if (diffDays < 7) return `${diffDays} hari lalu`
        if (diffDays < 30) return `${Math.ceil(diffDays / 7)} minggu lalu`
        if (diffDays < 365) return `${Math.ceil(diffDays / 30)} bulan lalu`
        return `${Math.ceil(diffDays / 365)} tahun lalu`
    }

    const getCategoryConfig = (kategori: BeritaPengumumanKategoriEnum) => {
        switch (kategori) {
            case BeritaPengumumanKategoriEnum.BERITA:
                return {
                    label: 'Berita',
                    color: 'from-green-500 to-green-600',
                    bg: 'bg-green-500',
                    hoverColor: 'group-hover:text-green-600'
                }
            case BeritaPengumumanKategoriEnum.PENGUMUMAN:
                return {
                    label: 'Pengumuman',
                    color: 'from-orange-500 to-orange-600',
                    bg: 'bg-orange-500',
                    hoverColor: 'group-hover:text-orange-600'
                }
            default:
                return {
                    label: 'Lainnya',
                    color: 'from-gray-500 to-gray-600',
                    bg: 'bg-gray-500',
                    hoverColor: 'group-hover:text-gray-600'
                }
        }
    }

    // Generate excerpt from content (same logic as BeritaCard)
    const getExcerpt = (news: any): string => {
        // Extract text preview from EditorJS content, fallback to deskripsi
        const contentPreview = news.konten 
            ? extractTextFromEditorJS(news.konten)
            : news.deskripsi
        
        return contentPreview || 'Tidak ada konten preview tersedia'
    }

    // Loading state
    if (loading) {
        return (
            <div className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, idx) => (
                        <div key={idx} className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100">
                            <div className="w-full aspect-[16/10] bg-gray-200 animate-pulse"></div>
                            <div className="p-6">
                                <div className="h-6 bg-gray-200 rounded animate-pulse mb-3"></div>
                                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-4"></div>
                                <div className="flex justify-between">
                                    <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
                                    <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    // Error state
    if (error) {
        return (
            <div className="w-full text-center py-12">
                <div className="text-red-500 mb-4">
                    <BookOpen className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Gagal Memuat Berita</h3>
                <p className="text-gray-600">{error}</p>
            </div>
        )
    }

    // Empty state
    if (displayData.length === 0) {
        return (
            <div className="w-full text-center py-12">
                <div className="text-6xl mb-6">📰</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    Belum Ada Berita
                </h3>
                <p className="text-gray-600 mb-8">
                    Berita dan pengumuman akan muncul di sini setelah admin menambahkan konten.
                </p>
                <Link
                    href="/berita"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                    Lihat Semua Berita
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </div>
        )
    }

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayData.map((news, idx) => {
                    const isHovered = hoveredCard === idx
                    const categoryConfig = getCategoryConfig(news.kategori)
                    const excerpt = getExcerpt(news)
                    
                    return (
                        <Link 
                            key={news.id} 
                            href={`/berita/${news.kategori}/${news.slug}`}
                            className="block"
                        >
                            <article 
                                onMouseEnter={() => setHoveredCard(idx)} 
                                onMouseLeave={() => setHoveredCard(null)}
                                className={`group cursor-pointer transition-all duration-500 transform ${
                                    isHovered ? 'scale-105 -translate-y-2' : 'scale-100'
                                }`}
                            >
                                <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 h-140 flex flex-col">
                                    {/* Image Section */}
                                    <div className="relative overflow-hidden flex-shrink-0">
                                        <div className="w-full aspect-[16/10] relative">
                                            <Image
                                                src={news.gambar_url}
                                                alt={news.judul}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                            
                                            {/* Overlay on hover */}
                                            <div className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${
                                                isHovered ? 'opacity-100' : 'opacity-0'
                                            }`}></div>
                                        </div>
                                        
                                        {/* Category Badge */}
                                        <div className={`absolute top-4 left-4 ${categoryConfig.bg} text-white text-xs font-semibold px-3 py-2 rounded-full shadow-lg`}>
                                            {categoryConfig.label}
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="flex flex-col p-6 gap-1 flex-grow">
                                        {/* Title */}
                                        <h3 className={`text-xl font-bold text-gray-900 mb-3 leading-tight line-clamp-2 ${categoryConfig.hoverColor} transition-colors duration-300`}>
                                            {news.judul}
                                        </h3>
                                        
                                        {/* Excerpt - now using same logic as BeritaCard */}
                                        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2 flex-grow">
                                            {excerpt}
                                        </p>
                                        
                                        {/* Meta Information */}
                                        <div className="flex items-center justify-between text-xs text-gray-500 mb-2 mt-auto">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                <span>{formatIDDate(news.created_at || news.tanggal)}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                <span>{formatTimeAgo(news.created_at || news.tanggal)}</span>
                                            </div>
                                        </div>

                                        {/* Author */}
                                        <div className="flex items-center text-xs text-gray-500 mb-4">
                                            <User className="w-4 h-4 mr-1" />
                                            <span>{news.penulis}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Read More Button */}
                                    <div className={`px-6 pb-6 transition-all duration-300 ${
                                        isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                                    }`}>
                                        <div className={`w-full ${categoryConfig.color} bg-gradient-to-r text-white py-3 px-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg`}>
                                            Baca Selengkapnya
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}