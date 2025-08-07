"use client";
import Link from "next/link";

import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer";

export default function Home() {
    return (
        <>
            <Navbar />
            <main className="h-screen w-full bg-gradient-to-br from-orange-300 via-yellow-100 to-green-200 flex items-center justify-center p-6">
                <section className="bg-white bg-opacity-80 shadow-lg rounded-xl p-10 max-w-xl text-center">
                <h1 className="text-4xl font-bold text-green-800 mb-4">
                    Selamat Datang di Desa Tonrong
                </h1>
                <p className="text-gray-700 text-lg">
                    Website Resmi Desa Tonrong.
                </p>
                </section>
            </main>
            <Footer />
        </>
    );
}
