"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAdmin } from "@/lib/auth";
import { JSX } from "react";

type NavItem = {
    href: string;
    label: string;
};

const NAV_ITEMS: ReadonlyArray<NavItem> = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/galeri", label: "Galeri" },
    { href: "/admin/berita-dan-pengumuman", label: "Berita & Pengumuman" },
    { href: "/admin/produk-unggulan", label: "Produk Unggulan" },
    { href: "/admin/profil", label: "Profil" },
    { href: "/admin/aspirasi", label: "Aspirasi" },
    { href: "/admin/kontak-desa", label: "Kontak Desa" }
] as const;

export default function Sidebar(): JSX.Element {
    const pathname = usePathname();

    async function handleLogout(): Promise<void> {
        await logoutAdmin();
        window.location.href = "/login";
    }

    return (
        <aside>
            <nav>
                <ul>
                    {NAV_ITEMS.map((it) => (
                        <li key={it.href}>
                            <Link href={it.href} aria-current={pathname.startsWith(it.href) ? "page" : undefined}>
                                {it.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <button type="button" onClick={handleLogout}>
                Logout
            </button>
        </aside>
    );
}