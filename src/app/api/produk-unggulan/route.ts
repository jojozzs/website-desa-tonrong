import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection as webCollection, getDocs, query, orderBy, DocumentReference as WebDocumentReference, Timestamp as WebTimestamp } from "firebase/firestore";
import cloudinary from "@/lib/cloudinary";
import { CloudinaryUploadResult } from "@/lib/cloudinary-types";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { FieldValue, DocumentReference as AdminDocumentReference, Timestamp as AdminTimestamp, QuerySnapshot, DocumentData } from "firebase-admin/firestore";

export const runtime = "nodejs";

/* ============== Types & utils ============== */
type ErrorWithOptionalMessage = { message?: unknown };
const toErrorMessage = (err: unknown): string => {
    if (err instanceof Error) return err.message;
    if (typeof err === "object" && err !== null && "message" in err) {
        const msg = (err as ErrorWithOptionalMessage).message;
        if (typeof msg === "string") return msg;
    }
    return "";
};

interface ProdukDocAdmin {
    judul: string;
    deskripsi: string;
    nama_umkm: string;
    alamat_umkm: string;
    kontak_umkm: string;
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
}

interface ProdukDocWeb {
    judul: string;
    deskripsi: string;
    nama_umkm: string;
    alamat_umkm: string;
    kontak_umkm: string;
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
                    ? `${process.env.CLOUDINARY_BASE_FOLDER}/produk-unggulan`
                    : "produk-unggulan",
                transformation: [{ width: 800, height: 600, crop: "fill" }],
            },
            (err, out) => (err ? reject(err) : resolve(out as unknown as CloudinaryUploadResult))
        )
        .end(buf);
    });
}

const slugify = (text: string): string =>
    text
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .replace(/-+/g, "-");

async function slugExists(slug: string): Promise<boolean> {
    const snap: QuerySnapshot<DocumentData> = await adminDb
        .collection("produk-unggulan")
        .where("slug", "==", slug)
        .limit(1)
        .get();
    return !snap.empty;
}

async function slugExistsForOther(slug: string, excludeId: string): Promise<boolean> {
    const snap = await adminDb
        .collection("produk-unggulan")
        .where("slug", "==", slug)
        .limit(1)
        .get();
    if (snap.empty) return false;
    const doc = snap.docs[0];
    return doc.id !== excludeId;
}

async function ensureUniqueSlug(base: string, excludeId?: string): Promise<string> {
    let candidate = base || "item";
    let i = 1;
    while (true) {
        const exists = excludeId
            ? await slugExistsForOther(candidate, excludeId)
            : await slugExists(candidate);
        if (!exists) return candidate;
        i += 1;
        candidate = `${base}-${i}`;
        // optional: break safety
        if (i > 100) throw new Error("Slug generation exceeded 100 attempts");
    }
}

/* ============== GET: list / by id / by slug ============== */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        const slug = searchParams.get("slug");

        if (id) {
            const snap = await adminDb.doc(`produk-unggulan/${id}`).get();
            if (!snap.exists) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
            const raw = snap.data() as ProdukDocAdmin;
            const data = {
                ...raw,
                id: snap.id,
                created_at: typeof raw.created_at?.toDate === "function" ? raw.created_at.toDate() : null,
                updated_at: typeof raw.updated_at?.toDate === "function" ? raw.updated_at.toDate() : null,
                admin_uid: raw.admin_id?.id ?? null,
            };
            return NextResponse.json({ success: true, data });
        }

        if (slug) {
            const q = await adminDb.collection("produk-unggulan").where("slug", "==", slug).limit(1).get();
            if (q.empty) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
            const d = q.docs[0];
            const raw = d.data() as ProdukDocAdmin;
            const data = {
                ...raw,
                id: d.id,
                created_at: typeof raw.created_at?.toDate === "function" ? raw.created_at.toDate() : null,
                updated_at: typeof raw.updated_at?.toDate === "function" ? raw.updated_at.toDate() : null,
                admin_uid: raw.admin_id?.id ?? null,
            };
            return NextResponse.json({ success: true, data });
        }

        const ref = webCollection(db, "produk-unggulan");
        const qList = query(ref, orderBy("created_at", "desc"));
        const snapshot = await getDocs(qList);

        const list = snapshot.docs.map((d) => {
            const raw = d.data() as ProdukDocWeb;
            return {
                id: d.id,
                ...raw,
                created_at: typeof raw.created_at?.toDate === "function" ? raw.created_at.toDate() : null,
                updated_at: typeof raw.updated_at?.toDate === "function" ? raw.updated_at.toDate() : null,
                admin_uid: raw.admin_id?.id ?? null,
            };
        });

        return NextResponse.json({ success: true, data: list });
    } catch (error: unknown) {
        console.error("Error fetching produk-unggulan:", error);
        return NextResponse.json(
            { success: false, error: toErrorMessage(error) || "Failed to fetch produk unggulan" },
            { status: 500 }
        );
    }
}

/* ============== POST ============== */
export async function POST(request: NextRequest) {
    try {
        const uid = await verifyAdmin(request);
        const formData = await request.formData();

        const judul = String(formData.get("judul") || "");
        const deskripsi = String(formData.get("deskripsi") || "");
        const nama_umkm = String(formData.get("nama_umkm") || "");
        const alamat_umkm = String(formData.get("alamat_umkm") || "");
        const kontak_umkm = String(formData.get("kontak_umkm") || "");
        const slugRaw = (formData.get("slug") as string | null) ?? null; // ← opsional kirim slug
        const gambar = formData.get("gambar") as File | null;

        if (!judul || !deskripsi || !nama_umkm || !alamat_umkm || !kontak_umkm) {
            return NextResponse.json({ success: false, error: "Missing required text fields" }, { status: 400 });
        }

        if (!(gambar instanceof File) || gambar.size === 0) {
            return NextResponse.json({ success: false, error: "Missing or invalid image file" }, { status: 400 });
        }

        const base = slugify(slugRaw && slugRaw.length > 0 ? slugRaw : judul);
        const slug = await ensureUniqueSlug(base);

        const up = await uploadToCloudinary(gambar);
        const adminRef = adminDb.doc(`admin/${uid}`);

        const payload: ProdukDocAdmin = {
            judul,
            deskripsi,
            nama_umkm,
            alamat_umkm,
            kontak_umkm,
            slug,
            admin_id: adminRef,
            gambar_url: up.secure_url,
            gambar_id: up.public_id,
            gambar_size: up.bytes,
            gambar_type: up.format,
            gambar_width: up.width,
            gambar_height: up.height,
            created_at: FieldValue.serverTimestamp() as unknown as AdminTimestamp,
        updated_at: FieldValue.serverTimestamp() as unknown as AdminTimestamp,
        };

        const docRef = await adminDb.collection("produk-unggulan").add(payload);
        return NextResponse.json({ success: true, data: { id: docRef.id, ...payload } }, { status: 201 });
    } catch (error: unknown) {
        const msg = toErrorMessage(error);
        const status = msg === "NO_TOKEN" ? 401 : msg === "NOT_ADMIN" ? 403 : 500;
        console.error("Error creating produk-unggulan:", error);
        return NextResponse.json(
            { success: false, error: msg || "Failed to create produk unggulan" },
            { status }
        );
    }
}

/* ============== PATCH ============== */
export async function PATCH(request: NextRequest) {
    try {
        await verifyAdmin(request);
        const formData = await request.formData();

        const id = String(formData.get("id") || "");
        if (!id) {
            return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
        }

        const judul = (formData.get("judul") as string) ?? null;
        const deskripsi = (formData.get("deskripsi") as string) ?? null;
        const nama_umkm = (formData.get("nama_umkm") as string) ?? null;
        const alamat_umkm = (formData.get("alamat_umkm") as string) ?? null;
        const kontak_umkm = (formData.get("kontak_umkm") as string) ?? null;
        const slugRaw = (formData.get("slug") as string) ?? null;
        const gambar = (formData.get("gambar") as File) ?? null;

        const existing = await adminDb.doc(`produk-unggulan/${id}`).get();
        if (!existing.exists) {
            return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
        }
        const oldData = existing.data() as ProdukDocAdmin;

        const updateData: Partial<ProdukDocAdmin> & { updated_at: AdminTimestamp } = {
            updated_at: FieldValue.serverTimestamp() as unknown as AdminTimestamp,
        };
        if (judul !== null) updateData.judul = judul;
        if (deskripsi !== null) updateData.deskripsi = deskripsi;
        if (nama_umkm !== null) updateData.nama_umkm = nama_umkm;
        if (alamat_umkm !== null) updateData.alamat_umkm = alamat_umkm;
        if (kontak_umkm !== null) updateData.kontak_umkm = kontak_umkm;

        if (slugRaw !== null || judul !== null) {
            const base = slugify(slugRaw && slugRaw.length > 0 ? slugRaw : (judul ?? oldData.judul));
            const newSlug = await ensureUniqueSlug(base, id);
            if (newSlug !== oldData.slug) updateData.slug = newSlug;
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

        await adminDb.doc(`produk-unggulan/${id}`).update(updateData);
        return NextResponse.json({ success: true, message: "Produk unggulan updated successfully" });
    } catch (error: unknown) {
        const msg = toErrorMessage(error);
        const status = msg === "NO_TOKEN" ? 401 : msg === "NOT_ADMIN" ? 403 : 500;
        console.error("Error patching produk-unggulan:", error);
        return NextResponse.json(
            { success: false, error: msg || "Failed to patch produk unggulan" },
            { status }
        );
    }
}

/* ============== DELETE ============== */
export async function DELETE(request: NextRequest) {
    try {
        await verifyAdmin(request);
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        if (!id) {
            return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
        }
        await adminDb.doc(`produk-unggulan/${id}`).delete();
        return NextResponse.json({ success: true, message: "Produk unggulan deleted successfully" });
    } catch (error: unknown) {
        const msg = toErrorMessage(error);
        const status = msg === "NO_TOKEN" ? 401 : msg === "NOT_ADMIN" ? 403 : 500;
        console.error("Error deleting produk-unggulan:", error);
        return NextResponse.json({ success: false, error: msg || "Failed to delete produk unggulan" },{ status });
    }
}