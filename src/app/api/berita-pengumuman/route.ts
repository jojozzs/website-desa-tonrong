import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection as webCollection, getDocs, query, orderBy, where, DocumentReference as WebDocumentReference, Timestamp as WebTimestamp } from "firebase/firestore";
import cloudinary from "@/lib/cloudinary";
import { CloudinaryUploadResult } from "@/lib/cloudinary-types";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { FieldValue, DocumentReference as AdminDocumentReference, Timestamp as AdminTimestamp } from "firebase-admin/firestore";
import { BeritaPengumumanKategoriEnum } from "@/lib/enums";
import type { OutputData } from "@editorjs/editorjs";

export const runtime = "nodejs";

type ErrorWithOptionalMessage = { message?: unknown };

const toErrorMessage = (err: unknown): string => {
    if (err instanceof Error) return err.message;
    if (typeof err === "object" && err !== null && "message" in err) {
        const msg = (err as ErrorWithOptionalMessage).message;
        if (typeof msg === "string") return msg;
    }
    return "";
};

interface BeritaDocAdmin {
    judul: string;
    deskripsi: string;
    tanggal: Date | AdminTimestamp;
    penulis: string;
    kategori: BeritaPengumumanKategoriEnum;
    slug: string;
    admin_id?: AdminDocumentReference;
    gambar_url: string;
    gambar_id: string;
    gambar_size: number;
    gambar_type: string;
    gambar_width?: number;
    gambar_height?: number;
    created_at?: AdminTimestamp;
    updated_at?: AdminTimestamp;
    konten: OutputData;
}

interface BeritaDocWeb {
    judul: string;
    deskripsi: string;
    tanggal: WebTimestamp;
    penulis: string;
    kategori: BeritaPengumumanKategoriEnum;
    slug: string;
    admin_id?: WebDocumentReference;
    gambar_url: string;
    gambar_id: string;
    gambar_size: number;
    gambar_type: string;
    gambar_width?: number;
    gambar_height?: number;
    created_at?: WebTimestamp;
    updated_at?: WebTimestamp;
    konten: OutputData;
}

async function verifyAdmin(req: NextRequest): Promise<string> {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
    if (!token) throw new Error("NO_TOKEN");

    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;

    const adminSnap = await adminDb.doc(`admin/${uid}`).get();
    if (!adminSnap.exists || adminSnap.get("role") !== "admin") {
        throw new Error("NOT_ADMIN");
    }
    return uid;
}

async function uploadToCloudinary(file: File): Promise<CloudinaryUploadResult> {
    const buf = Buffer.from(await file.arrayBuffer());
    return new Promise<CloudinaryUploadResult>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                resource_type: "image",
                folder: process.env.CLOUDINARY_BASE_FOLDER
                    ? `${process.env.CLOUDINARY_BASE_FOLDER}/berita-pengumuman`
                    : "berita-pengumuman",
                transformation: [{ width: 800, height: 600, crop: "fill" }],
            },
            (err, out) => (err ? reject(err) : resolve(out as unknown as CloudinaryUploadResult))
        )
        .end(buf);
    });
}

const isKategori = (v: string | null): v is BeritaPengumumanKategoriEnum =>
    v !== null && (Object.values(BeritaPengumumanKategoriEnum) as string[]).includes(v);

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        const kategoriParam = searchParams.get("kategori");

        // --- GET by id (Admin SDK) ---
        if (id) {
            const snap = await adminDb.doc(`berita-pengumuman/${id}`).get();
            if (!snap.exists) {
                return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
            }
            const raw = snap.data() as BeritaDocAdmin;
            const data = {
                ...raw,
                id: snap.id,
                konten: raw.konten ?? null,
                tanggal:
                    typeof (raw.tanggal as AdminTimestamp | undefined)?.toDate === "function"
                        ? (raw.tanggal as AdminTimestamp).toDate()
                        : ((raw.tanggal as Date) ?? null),
                created_at: typeof raw.created_at?.toDate === "function" ? raw.created_at.toDate() : null,
                updated_at: typeof raw.updated_at?.toDate === "function" ? raw.updated_at.toDate() : null,
                admin_uid: raw.admin_id?.id ?? null
            };
            return NextResponse.json({ success: true, data });
        }

        // --- GET list (Web SDK) ---
        const ref = webCollection(db, "berita-pengumuman");

        if (isKategori(kategoriParam)) {
            const q = query(ref, where("kategori", "==", kategoriParam));
            const snapshot = await getDocs(q);

            const list = snapshot.docs
                .map((d) => {
                    const raw = d.data() as BeritaDocWeb;
                    return {
                        id: d.id,
                        ...raw,
                        konten: raw.konten ?? null,
                        tanggal: typeof raw.tanggal?.toDate === "function" ? raw.tanggal.toDate() : null,
                        created_at: typeof raw.created_at?.toDate === "function" ? raw.created_at.toDate() : null,
                        updated_at: typeof raw.updated_at?.toDate === "function" ? raw.updated_at.toDate() : null,
                        admin_uid: raw.admin_id?.id ?? null
                    };
                })
                .sort((a, b) => {
                    const ta = a.tanggal ? a.tanggal.getTime() : 0;
                    const tb = b.tanggal ? b.tanggal.getTime() : 0;
                    return tb - ta;
                });

            return NextResponse.json({ success: true, data: list });
        }

        {
            const q = query(ref, orderBy("tanggal", "desc"));
            const snapshot = await getDocs(q);

            const list = snapshot.docs.map((d) => {
                const raw = d.data() as BeritaDocWeb;
                return {
                    id: d.id,
                    ...raw,
                    konten: raw.konten ?? null,
                    tanggal: typeof raw.tanggal?.toDate === "function" ? raw.tanggal.toDate() : null,
                    created_at: typeof raw.created_at?.toDate === "function" ? raw.created_at.toDate() : null,
                    updated_at: typeof raw.updated_at?.toDate === "function" ? raw.updated_at.toDate() : null,
                    admin_uid: raw.admin_id?.id ?? null
                };
            });

            return NextResponse.json({ success: true, data: list });
        }
    } catch (error: unknown) {
        console.error("Error fetching berita-pengumuman:", error);
        return NextResponse.json(
            { success: false, error: toErrorMessage(error) || "Failed to fetch berita pengumuman" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const uid = await verifyAdmin(request);
        const formData = await request.formData();

        const judul = String(formData.get("judul") || "");
        const deskripsi = String(formData.get("deskripsi") || "");
        const tanggalStr = String(formData.get("tanggal") || "");
        const penulis = String(formData.get("penulis") || "");
        const kategori = String(formData.get("kategori") || "") as BeritaPengumumanKategoriEnum;
        const slug = String(formData.get("slug") || "");
        const gambar = formData.get("gambar") as File | null;

        const kontenRaw = formData.get("konten") as string;
        const konten: OutputData = JSON.parse(kontenRaw);

        if (!judul || !tanggalStr || !penulis || !kategori || !slug || !gambar) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
        }

        if (!konten || !Array.isArray(konten.blocks)) {
            return NextResponse.json({ success: false, error: "Invalid konten format" }, { status: 400 });
        }

        const tanggal = new Date(tanggalStr);
        if (Number.isNaN(tanggal.getTime())) {
            return NextResponse.json({ success: false, error: "Invalid 'tanggal' format" }, { status: 400 });
        }

        const up = await uploadToCloudinary(gambar);

        const adminRef = adminDb.doc(`admin/${uid}`);
        const payload: BeritaDocAdmin = {
            judul,
            deskripsi,
            tanggal,
            penulis,
            kategori,
            slug,
            admin_id: adminRef,
            gambar_url: up.secure_url,
            gambar_id: up.public_id,
            gambar_size: up.bytes,
            gambar_type: up.format,
            gambar_width: up.width,
            gambar_height: up.height,
            konten,
            created_at: FieldValue.serverTimestamp() as unknown as AdminTimestamp,
            updated_at: FieldValue.serverTimestamp() as unknown as AdminTimestamp,
        };

        const docRef = await adminDb.collection("berita-pengumuman").add(payload);
        return NextResponse.json({ success: true, data: { id: docRef.id, ...payload } }, { status: 201 });
    } catch (error: unknown) {
        const msg = toErrorMessage(error);
        const status = msg === "NO_TOKEN" ? 401 : msg === "NOT_ADMIN" ? 403 : 500;
        console.error("Error creating berita-pengumuman:", error);
        return NextResponse.json(
            { success: false, error: msg || "Failed to create berita pengumuman" },
            { status }
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        await verifyAdmin(request);
        const formData = await request.formData(); // id dari form-data (konsisten dgn galeri)

        const id = String(formData.get("id") || "");
        if (!id) {
            return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
        }

        const judul = (formData.get("judul") as string) ?? null;
        const deskripsi = (formData.get("deskripsi") as string) ?? null;
        const tanggalStr = (formData.get("tanggal") as string) ?? null;
        const penulis = (formData.get("penulis") as string) ?? null;
        const kategori = (formData.get("kategori") as string) as BeritaPengumumanKategoriEnum | null;
        const slug = (formData.get("slug") as string) ?? null;
        const gambar = (formData.get("gambar") as File) ?? null;
        const kontenRaw = formData.get("konten") as string | null;

        const updateData: Partial<BeritaDocAdmin> & { updated_at: AdminTimestamp } = {
            updated_at: FieldValue.serverTimestamp() as unknown as AdminTimestamp,
        };
        if (judul !== null) updateData.judul = judul;
        if (deskripsi !== null) updateData.deskripsi = deskripsi;
        if (penulis !== null) updateData.penulis = penulis;
        if (kategori !== null) updateData.kategori = kategori;
        if (slug !== null) updateData.slug = slug;
        if (tanggalStr !== null) {
            const t = new Date(tanggalStr);
            if (Number.isNaN(t.getTime())) {
                return NextResponse.json({ success: false, error: "Invalid 'tanggal' format" }, { status: 400 });
            }
            updateData.tanggal = t;
        }

        if (kontenRaw) {
            try {
                const parsed = JSON.parse(kontenRaw);
                if (parsed && Array.isArray(parsed.blocks)) {
                    updateData.konten = parsed;
                } else {
                    return NextResponse.json({ success: false, error: "Invalid konten format" }, { status: 400 });
                }
            } catch {
                return NextResponse.json({ success: false, error: "Failed to parse konten" }, { status: 400 });
            }
        }

        if (gambar && gambar.size > 0) {
            const up = await uploadToCloudinary(gambar);
            updateData.gambar_url = up.secure_url;
            updateData.gambar_id = up.public_id;
            updateData.gambar_size = up.bytes;
            updateData.gambar_type = up.format;
            updateData.gambar_width = up.width;
            updateData.gambar_height = up.height;
        }

        await adminDb.doc(`berita-pengumuman/${id}`).update(updateData);
        return NextResponse.json({ success: true, message: "Berita pengumuman updated successfully" });
    } catch (error: unknown) {
        const msg = toErrorMessage(error);
        const status = msg === "NO_TOKEN" ? 401 : msg === "NOT_ADMIN" ? 403 : 500;
        console.error("Error patching berita-pengumuman:", error);
        return NextResponse.json(
            { success: false, error: msg || "Failed to patch berita pengumuman" },
            { status }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        await verifyAdmin(request);
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        if (!id) {
            return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
        }
        await adminDb.doc(`berita-pengumuman/${id}`).delete();
        return NextResponse.json({ success: true, message: "Berita pengumuman deleted successfully" });
    } catch (error: unknown) {
        const msg = toErrorMessage(error);
        const status = msg === "NO_TOKEN" ? 401 : msg === "NOT_ADMIN" ? 403 : 500;
        console.error("Error deleting berita-pengumuman:", error);
        return NextResponse.json(
            { success: false, error: msg || "Failed to delete berita pengumuman" },
            { status }
        );
    }
}