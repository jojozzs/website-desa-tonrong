"use client"
import { ReactNode, useState, useEffect } from "react";
import Guard from "@/components/Dashboard/Guard";
import MobileSidebar from "@/components/Dashboard/MobileSidebar";

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <Guard>
            <div className="min-h-screen bg-gray-50">
                {/* Mobile Header */}
                <div className="lg:hidden bg-white shadow-sm border-b border-green-200 sticky top-0 z-50">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-orange-500 rounded-lg flex items-center justify-center shadow-lg">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-bold text-gray-800">Admin Panel</span>
                                <span className="text-xs text-gray-500">Dashboard Desa</span>
                            </div>
                        </div>
                        
                        {/* Mobile menu button */}
                        <button
                            onClick={toggleMobileMenu}
                            className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-200 active:scale-95"
                            aria-label="Toggle mobile menu"
                        >
                            <svg 
                                className={`w-6 h-6 text-gray-600 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-180' : ''}`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                <MobileSidebar 
                    isOpen={isMobileMenuOpen} 
                    onClose={closeMobileMenu}
                />

                <main className="lg:ml-64 transition-all duration-300 ease-in-out">
                    <div className="min-h-screen">
                        {children}
                    </div>
                </main>

                {isMobileMenuOpen && (
                    <div 
                        className="lg:hidden fixed inset-0 bg-black/50 z-30 transition-opacity duration-300 backdrop-blur-sm"
                        onClick={closeMobileMenu}
                        aria-hidden="true"
                    />
                )}
            </div>
        </Guard>
    );
}