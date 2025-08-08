"use client";
import Link from "next/link";

import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer";
import HeroBeranda from "@/components/MainPage/hero";

export default function Home() {
   return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <HeroBeranda />
      </main>
      <Footer />
    </div>
  );
}
