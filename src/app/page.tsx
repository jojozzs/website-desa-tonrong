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
                        <div className="w-40 h-1 bg-black mx-auto mb-10"></div>
                        <ProfilDesa/>
                    </div>
                </section>

                <section className="scroll-mt-48 w-full px-6 md:px-8 lg:px-20 xl:px-40 py-16 bg-bg-gray-light text-black">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4 text-center">Sambutan Kepala Desa</h2>
                        <div className="w-40 h-1 bg-black mx-auto mb-10"></div>
                        <SambutanKades/>
                    </div>
                </section>


                <section ref={beritaRef} className="berita-terkini scroll-mt-48 w-full px-6 md:px-8 lg:px-20 xl:px-40 py-16 bg-bg-green-light text-black">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-2">Berita & Pengumuman</h2>
                        <div className="w-40 h-1 bg-black mx-auto mb-12"></div>
                        <BeritaTerkini />
                        <div className="mt-16 text-center w-full">
                            <Link href="/berita"
                            className="group inline-flex items-center px-10 py-4 bg-button-green hover:bg-button-green-hover text-white font-semibold rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-300">
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
