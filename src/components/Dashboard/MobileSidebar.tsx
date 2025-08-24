"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAdmin } from "@/lib/auth";
import { JSX, useState } from "react";
import { X } from "lucide-react";

interface NavItem {
    href: string;
    label: string;
    icon: JSX.Element;
}

const NAV_ITEMS: ReadonlyArray<NavItem> = [
    { 
        href: "/admin", 
        label: "Dashboard",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h2a2 2 0 012 2v6a2 2 0 01-2 2H10a2 2 0 01-2-2V5z" />
            </svg>
        )
    },
    { 
        href: "/admin/galeri", 
        label: "Galeri",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        )
    },
    { 
        href: "/admin/berita-dan-pengumuman", 
        label: "Berita & Pengumuman",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
        )
    },
    { 
        href: "/admin/produk-unggulan", 
        label: "Produk Unggulan",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
        )
    },
    { 
        href: "/admin/profil", 
        label: "Profil",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        )
    },
    { 
        href: "/admin/aspirasi", 
        label: "Aspirasi",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
        )
    },
    { 
        href: "/admin/kontak-desa", 
        label: "Kontak Desa",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
        )
    },
    { 
        href: "/admin/admin", 
        label: "Admin",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
        )
    },
    { 
        href: "/admin/logs", 
        label: "Admin Logs",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        )
    },
    { 
        href: "/admin/link-web", 
        label: "Link Website",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m0-16a8 8 0 100 16 8 8 0 000-16zm0 0c2.21 0 4 3.58 4 8s-1.79 8-4 8-4-3.58-4-8 1.79-8 4-8z" />
            </svg>
        )
    }
] as const;

interface MobileSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

function LogoutModal({
    onCancel,
    onConfirm,
}: {
    onCancel: () => void;
    onConfirm: () => void;
}) {
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm space-y-6 animate-fadeIn">
                {/* Icon & Judul */}
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5m-4 2H5a2 2 0 00-2 2v8a2 2 0 002 2h4"/>
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 text-center">
                        Konfirmasi Logout
                    </h2>
                    <p className="text-center text-gray-600 text-sm">
                        Apakah Anda yakin ingin keluar dari Dashboard Admin?
                    </p>
                </div>

                {/* Tombol Aksi */}
                <div className="flex flex-col gap-3">
                    <button 
                        onClick={onConfirm}
                        className="w-full px-4 py-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-all cursor-pointer"
                    >
                        Ya, Logout
                    </button>
                    <button 
                        onClick={onCancel}
                        className="w-full px-4 py-3 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all cursor-pointer"
                    >
                        Batal
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps): JSX.Element {
    const pathname = usePathname();
    const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
    const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);

    async function handleLogout(): Promise<void> {
        try {
            setIsLoggingOut(true);
            await logoutAdmin();
            window.location.href = "/login";
        } catch (error) {
            console.error("Logout failed:", error);
            setIsLoggingOut(false);
        }
    }

    const handleLogoutClick = (): void => {
        setShowLogoutModal(true);
    };

    const handleModalCancel = (): void => {
        setShowLogoutModal(false);
    };

    const handleModalConfirm = (): void => {
        setShowLogoutModal(false);
        handleLogout();
    };

    const isActiveLink = (href: string): boolean => {
        if (href === "/admin") {
            return pathname === href;
        }
        return pathname.startsWith(href);
    };

    return (
        <>
            {/* Mobile Sidebar */}
            <div className={`
                lg:hidden fixed inset-y-0 left-0 z-50 w-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex flex-col h-full">
                    {/* Header with Close Button */}
                    <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-green-500 to-orange-500 border-b border-green-200">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-lg">
                                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span className="text-lg font-bold text-white">Admin Panel</span>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                            aria-label="Close menu"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className={`
                                    flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
                                    ${isActiveLink(item.href)
                                        ? "bg-gradient-to-r from-green-50 to-orange-50 text-green-700 border-l-4 border-green-600 shadow-sm"
                                        : "text-gray-600 hover:bg-gradient-to-r hover:from-green-50 hover:to-orange-50 hover:text-green-800"
                                    }
                                `}
                                aria-current={isActiveLink(item.href) ? "page" : undefined}
                            >
                                <span className={`
                                    mr-4 transition-colors duration-200
                                    ${isActiveLink(item.href) ? "text-orange-600" : "text-gray-400"}
                                `}>
                                    {item.icon}
                                </span>
                                <span className="truncate">{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* Logout Button */}
                    <div className="p-4 border-t border-green-200 bg-gray-50">
                        <button
                            type="button"
                            onClick={handleLogoutClick}
                            disabled={isLoggingOut}
                            className="
                                w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-white
                                bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl hover:from-orange-700 hover:to-orange-800 
                                focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 
                                transition-all duration-200 shadow-lg hover:shadow-xl
                                disabled:opacity-50 disabled:cursor-not-allowed
                            "
                        >
                            {isLoggingOut ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Logging out...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3V6a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Logout
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Desktop Sidebar - Hidden on Mobile */}
            <aside className="hidden lg:block fixed left-0 top-0 z-40 w-64 h-screen bg-white shadow-lg border-r border-green-200">
                <div className="flex flex-col h-full">
                    {/* Logo/Header */}
                    <div className="flex items-center justify-center h-16 py-10 px-4 border-b border-green-200 bg-gradient-to-r from-green-500 to-orange-500">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-lg">
                                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-white">Admin Panel</span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`
                                    flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200
                                    ${isActiveLink(item.href)
                                        ? "bg-gradient-to-r from-green-50 to-orange-50 text-green-700 border-r-4 border-green-600 shadow-sm"
                                        : "text-gray-600 hover:bg-gradient-to-r hover:from-green-50 hover:to-orange-50 hover:text-green-800"
                                    }
                                `}
                                aria-current={isActiveLink(item.href) ? "page" : undefined}
                            >
                                <span className={`
                                    mr-3 transition-colors duration-200
                                    ${isActiveLink(item.href) ? "text-orange-600" : "text-gray-400 group-hover:text-green-600"}
                                `}>
                                    {item.icon}
                                </span>
                                <span className="truncate">{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* Logout Button */}
                    <div className="p-4 border-t border-green-200">
                        <button
                            type="button"
                            onClick={handleLogoutClick}
                            disabled={isLoggingOut}
                            className="
                                w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-white
                                bg-gradient-to-r from-orange-600 to-orange-700 rounded-lg hover:from-orange-700 hover:to-orange-800 
                                focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 
                                transition-all duration-200 shadow-lg hover:shadow-xl
                                disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
                            "
                        >
                            {isLoggingOut ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Logging out...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3V6a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Logout
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Logout Modal */}
            {showLogoutModal && (
                <LogoutModal
                    onCancel={handleModalCancel}
                    onConfirm={handleModalConfirm}
                />
            )}
        </>
    );
}