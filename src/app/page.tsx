"use client";
import Link from "next/link";

import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer";
import HeroBeranda from "@/components/MainPage/hero";
import BeritaTerkini from "@/components/MainPage/berita";
import { useRef } from 'react';
import ProfilDesa from "@/components/MainPage/profil";
import SambutanKades from "@/components/MainPage/sambutan";
import ModernAutoCarousel from "@/components/MainPage/galericarousel";

export default function Home() {
    const beritaRef = useRef<HTMLElement>(null);

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
                <HeroBeranda />
                <section className="scroll-mt-48 w-full px-6 md:px-8 lg:px-20 xl:px-40 py-16 bg-bg-green-light text-black">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4 text-center">Profil Desa Tonrong</h2>
                        <div className="w-40 h-1 bg-black mx-auto mb-4"></div>
                        <p className="text-lg text-text-secondary max-w-2xl mx-auto text-center py-6 mb-6">
                            Mengenal lebih dekat Desa Tonrong, potensi, dan keunikan yang dimiliki
                        </p>
                        <ProfilDesa/>
                    </div>
                </section>

                <section className="scroll-mt-48 w-full px-6 md:px-8 lg:px-20 xl:px-40 py-16 bg-bg-gray-light text-black">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4 text-center">Sambutan Kepala Desa</h2>
                        <div className="w-40 h-1 bg-black mx-auto mb-4"></div>
                        <p className="text-lg text-text-secondary max-w-2xl mx-auto text-center py-6 mb-6">
                            Pesan dan visi dari pimpinan desa untuk kemajuan bersama
                        </p>
                        <SambutanKades/>
                    </div>
                </section>


                <section ref={beritaRef} className="berita-terkini scroll-mt-48 w-full px-6 md:px-8 lg:px-20 xl:px-40 py-16 bg-bg-green-light text-black">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-2">Berita & Pengumuman</h2>
                        <div className="w-40 h-1 bg-black mx-auto mb-12"></div>
                        <BeritaTerkini />
                        <div className="mt-16 text-center w-full">
                            <Link href="/berita/berita-internal"
                            className="block max-w-sm mx-auto px-6 py-3 border-2 border-dark-green rounded-full font-semibold hover:bg-dark-green hover:text-button-green-hover transition duration-500">
                                Selengkapnya →
                            </Link>
                        </div>
                    </div>
                </section>
                <ModernAutoCarousel/>
            </main>
            <Footer />
        </div>
    );
}
