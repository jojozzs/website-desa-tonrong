import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import React from 'react';

export default function KontakAspirasiLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar/>
            <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-gray-light)' }}>
                {children}
            </div>
            <Footer />
        </>
    );
}