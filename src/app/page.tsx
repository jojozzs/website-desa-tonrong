"use client";
import Link from "next/link";

import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer";
import HeroBeranda from "@/components/MainPage/hero";
import BeritaTerkini from "@/components/MainPage/berita";
import { useRef } from 'react';

export default function Home() {
  const beritaRef = useRef<HTMLElement>(null);

   return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <HeroBeranda />
         <section ref={beritaRef} className="berita-terkini scroll-mt-48 w-full px-6 md:px-8 lg:px-20 xl:px-40 py-16 bg-bg-green-light text-black">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-2">Berita & Pengumuman</h2>
                        <div className="w-80 h-1 bg-black mx-auto mb-12"></div>

                        <BeritaTerkini />

                        <div className="mt-16 text-center w-full">
                            <Link href="/berita/berita-internal"
                            className="block max-w-sm mx-auto px-6 py-3 border-2 border-dark-green rounded-full font-semibold hover:bg-dark-green hover:text-button-green-hover transition duration-500">
                                Selengkapnya →
                            </Link>
                        </div>
                    </div>
                </section>
      </main>
      <Footer />
    </div>
  );
}
