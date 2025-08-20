import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function GET() {
    const baseUrl = "https://desa-tonrong-rijang.vercel.app";

    const beritaSnap = await adminDb.collection("berita-pengumuman").get();
    const produkSnap = await adminDb.collection("produk-unggulan").get();

    const profilKategori = [
        "sejarah",
        "letak-geografis-dan-peta-desa",
        "visi-dan-misi",
        "struktur-pemerintahan-desa",
        "jumlah-penduduk-dan-data-umum",
    ];

    const staticUrls: { loc: string; lastmod: string }[] = [
        { loc: "/", lastmod: new Date().toISOString().split("T")[0] },
        { loc: "/berita", lastmod: new Date().toISOString().split("T")[0] },
        { loc: "/galeri", lastmod: new Date().toISOString().split("T")[0] },
        { loc: "/produk-unggulan", lastmod: new Date().toISOString().split("T")[0] },
        { loc: "/kontak-aspirasi", lastmod: new Date().toISOString().split("T")[0] },
        { loc: "/profil", lastmod: new Date().toISOString().split("T")[0] },
        ...profilKategori.map((kategori) => ({
            loc: `/profil/${kategori}`,
            lastmod: new Date().toISOString().split("T")[0],
        })),
    ];

    const beritaUrls = beritaSnap.docs.map((doc) => {
        const data = doc.data();
        const slug = data.slug;
        const kategori = data.kategori;
        const date =
        data.updated_at?.toDate?.() || data.created_at?.toDate?.() || new Date();

        return {
            loc: `/berita/${kategori}/${slug}`,
            lastmod: date.toISOString().split("T")[0],
        };
    });

    const produkUrls = produkSnap.docs.map((doc) => {
        const data = doc.data();
        const slug = data.slug;
        const date =
        data.updated_at?.toDate?.() || data.created_at?.toDate?.() || new Date();

        return {
            loc: `/produk-unggulan/${slug}`,
            lastmod: date.toISOString().split("T")[0],
        };
    });

    const allUrls = [...staticUrls, ...beritaUrls, ...produkUrls];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${allUrls.map(({ loc, lastmod }) => `
                <url>
                    <loc>${baseUrl}${loc}</loc>
                    <lastmod>${lastmod}</lastmod>
                </url>`
            ).join("")}
        </urlset>`;

    return new NextResponse(xml, {
        headers: {
            "Content-Type": "application/xml",
        },
    });
}