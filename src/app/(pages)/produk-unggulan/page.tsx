// src/app/produk-unggulan/page.tsx
'use client';

import React, { useState } from 'react';
import { useProdukData, type ProdukData } from '@/hooks/useProdukData';
import ProdukCard from '@/components/ProdukUnggulan/ProdukCard';
import Pagination from '@/components/Berita/Pagination';
import { AlertCircle, RefreshCw, Package } from 'lucide-react';

const ITEMS_PER_PAGE = 6;

// Loading skeleton component
function ProdukCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200"></div>
      <div className="p-5">
        <div className="h-6 bg-gray-200 rounded mb-3"></div>
        <div className="h-4 bg-gray-200 rounded mb-4 w-full"></div>
        <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
        <div className="space-y-3 mb-4">
          <div className="h-10 bg-gray-200 rounded-lg"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>
  );
}

export default function ProdukUnggulanPage() {
  const { data, loading, error, refetch } = useProdukData();
  const [currentPage, setCurrentPage] = useState(1);

  // Ensure data is array
  const produkData = Array.isArray(data) ? data : [];

  // Pagination logic
  const totalPages = Math.ceil(produkData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = produkData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="relative bg-gradient-to-br from-orange-50 via-white to-orange-50 rounded-2xl p-8 mb-12 overflow-hidden lg:min-h-100">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-4 left-4 w-16 h-16 border-2 border-orange-400 rounded-full"></div>
            <div className="absolute top-8 right-8 w-8 h-8 bg-orange-300 rounded-full"></div>
            <div className="absolute bottom-6 left-12 w-12 h-12 border border-orange-300 rotate-45"></div>
            <div className="absolute bottom-4 right-16 w-6 h-6 bg-orange-400 rounded-full"></div>
          </div>

          {/* Content */}
          <div className="relative text-center max-w-4xl mx-auto">
            {/* Icon and Badge */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-2xl shadow-lg">
                  <Package className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 bg-clip-text text-transparent mb-4 py-1">
              Produk Unggulan UMKM
            </h1>

            {/* Subtitle */}
            <p className="text-gray-600 text-lg lg:text-xl mb-6 max-w-2xl mx-auto leading-relaxed">
              Temukan berbagai produk unggulan dari UMKM
              <span className="font-semibold text-orange-700"> Desa Tonrong Rijang</span> yang berkualitas dan inovatif
            </p>

            {/* Stats Cards */}
            {!loading && !error && (
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                <div className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-xl px-6 py-3 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                    <span className="text-orange-800 font-semibold text-sm">
                      {produkData.length} produk tersedia
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Decorative Line */}
            <div className="flex items-center justify-center space-x-4">
              <div className="h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent flex-1 max-w-32"></div>
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <div className="w-1 h-1 bg-orange-300 rounded-full"></div>
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <div className="h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent flex-1 max-w-32"></div>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          /* Loading State */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, index) => (
              <ProdukCardSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          /* Error State */
          <div className="text-center py-16">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Terjadi Kesalahan
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {error}
            </p>
            <button
              onClick={refetch}
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-md"
            >
              <RefreshCw className="w-4 h-4" />
              Coba Lagi
            </button>
          </div>
        ) : produkData.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Belum Ada Produk
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Produk unggulan UMKM akan ditampilkan di sini ketika sudah tersedia.
            </p>
          </div>
        ) : (
          /* Products Grid */
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {paginatedData.map((produk: ProdukData) => (
                <ProdukCard key={produk.id} item={produk} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="w-full ">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={produkData.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}