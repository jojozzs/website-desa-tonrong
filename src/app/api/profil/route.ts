import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { CloudinaryUploadResult } from "@/lib/cloudinary-types";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { FieldValue, DocumentReference as AdminDocumentReference, Timestamp as AdminTimestamp } from "firebase-admin/firestore";
import { ProfilKategoriEnum } from "@/lib/enums";

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

interface ProfilDocAdmin {
    judul: string;
    deskripsi: string;
    kategori: ProfilKategoriEnum;
    admin_id?: AdminDocumentReference;
    konten?: string;
    data_tambahan?: unknown;
    gambar_url: string;
    gambar_id: string;
    gambar_size: number;
    gambar_type: string;
    gambar_width?: number;
    gambar_height?: number;
    created_at?: AdminTimestamp;
    updated_at?: AdminTimestamp;
}

const isProfilKategori = (v: string | null): v is ProfilKategoriEnum =>
    v !== null && (Object.values(ProfilKategoriEnum) as string[]).includes(v);

async function verifyAdmin(req: NextRequest): Promise<string> {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
    if (!token) throw new Error("NO_TOKEN");

    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;
    const adminSnap = await adminDb.doc(`admin/${uid}`).get();
    if (!adminSnap.exists || adminSnap.get("role") !== "admin") throw new Error("NOT_ADMIN");
    return uid;
}

async function uploadToCloudinary(file: File): Promise<CloudinaryUploadResult> {
    const buf = Buffer.from(await file.arrayBuffer());
    return new Promise<CloudinaryUploadResult>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                resource_type: "image",
                folder: process.env.CLOUDINARY_BASE_FOLDER
                    ? `${process.env.CLOUDINARY_BASE_FOLDER}/profil`
                    : "profil",
                transformation: [{ width: 1200, height: 800, crop: "fill" }],
            },
            (err, out) => (err ? reject(err) : resolve(out as unknown as CloudinaryUploadResult))
        )
        .end(buf);
    });
}

/* ============== GET: list / by id / filter kategori ============== */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        const kategoriParam = searchParams.get("kategori");
        const limitOne = searchParams.get("limit") === "1";

        if (id) {
            const snap = await adminDb.doc(`profil/${id}`).get();
            if (!snap.exists) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
            const raw = snap.data() as ProfilDocAdmin;
            const data = {
                ...raw,
                id: snap.id,
                created_at: typeof raw.created_at?.toDate === "function" ? raw.created_at.toDate() : null,
                updated_at: typeof raw.updated_at?.toDate === "function" ? raw.updated_at.toDate() : null,
                admin_uid: raw.admin_id?.id ?? null,
            };
            return NextResponse.json({ success: true, data });
        }

        if (isProfilKategori(kategoriParam)) {
            // hanya kategori tertentu; TIDAK mengembalikan seluruh koleksi
            let q = adminDb.collection("profil").where("kategori", "==", kategoriParam);
            if (limitOne) q = q.limit(1);
            const snap = await q.get();

            const list = snap.docs.map((d) => {
                const raw = d.data() as ProfilDocAdmin;
                return {
                    id: d.id,
                    ...raw,
                    created_at: typeof raw.created_at?.toDate === "function" ? raw.created_at.toDate() : null,
                    updated_at: typeof raw.updated_at?.toDate === "function" ? raw.updated_at.toDate() : null,
                    admin_uid: raw.admin_id?.id ?? null,
                };
            });
            return NextResponse.json({ success: true, data: list });
        }

        // wajib salah satu: id atau kategori
        return NextResponse.json(
            { success: false, error: "Provide either 'id' or 'kategori' (enum) to fetch profil." },
            { status: 400 }
        );
    } catch (error) {
        console.error("Error fetching profil:", error);
        return NextResponse.json({ success: false, error: toErrorMessage(error) || "Failed to fetch profil" }, { status: 500 });
    }
}

/* ============== POST: create (admin only) ============== */
export async function POST(request: NextRequest) {
    try {
        const uid = await verifyAdmin(request);
        const formData = await request.formData();

        const judul = String(formData.get("judul") || "");
        const deskripsi = String(formData.get("deskripsi") || "");
        const kategori = String(formData.get("kategori") || "");
        const gambar = formData.get("gambar") as File | null;

        if (!judul || !deskripsi || !isProfilKategori(kategori) || !(gambar instanceof File) || gambar.size === 0) {
            return NextResponse.json({ success: false, error: "Missing or invalid fields" }, { status: 400 });
        }

        // CEK: sudah ada profil utk kategori ini?
        const exists = await adminDb.collection("profil").where("kategori", "==", kategori).limit(1).get();
            if (!exists.empty) {
            return NextResponse.json(
                { success: false, error: `Profil for kategori '${kategori}' already exists.` },
                { status: 409 }
            );
        }

        const up = await uploadToCloudinary(gambar);
        const adminRef = adminDb.doc(`admin/${uid}`);

        const payload: ProfilDocAdmin = {
            judul,
            deskripsi,
            kategori: kategori as ProfilKategoriEnum,
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

        const docRef = await adminDb.collection("profil").add(payload);
        return NextResponse.json({ success: true, data: { id: docRef.id, ...payload } }, { status: 201 });
    } catch (error) {
        const msg = toErrorMessage(error);
        const status = msg === "NO_TOKEN" ? 401 : msg === "NOT_ADMIN" ? 403 : 500;
        console.error("Error creating profil:", error);
        return NextResponse.json({ success: false, error: msg || "Failed to create profil" }, { status });
    }
}

/* ============== PATCH ============== */
export async function PATCH(request: NextRequest) {
    try {
        await verifyAdmin(request);
        const formData = await request.formData();

        const id = String(formData.get("id") || "");
        if (!id) return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });

        const judul = (formData.get("judul") as string) ?? null;
        const deskripsi = (formData.get("deskripsi") as string) ?? null;
        const kategori = (formData.get("kategori") as string) ?? null;
        const gambar = (formData.get("gambar") as File) ?? null;

        const updateData: Partial<ProfilDocAdmin> & { updated_at: AdminTimestamp } = {
            updated_at: FieldValue.serverTimestamp() as unknown as AdminTimestamp,
        };
        if (judul !== null) updateData.judul = judul;
        if (deskripsi !== null) updateData.deskripsi = deskripsi;

        if (kategori !== null) {
            if (!isProfilKategori(kategori)) {
                return NextResponse.json({ success: false, error: "Invalid kategori" }, { status: 400 });
            }
            // kalau ganti kategori, pastikan tidak ada doc lain dg kategori itu
            const snap = await adminDb
                .collection("profil")
                .where("kategori", "==", kategori)
                .limit(1)
                .get();
            if (!snap.empty && snap.docs[0].id !== id) {
                return NextResponse.json(
                    { success: false, error: `Profil for kategori '${kategori}' already exists.` },
                    { status: 409 }
                );
            }
            updateData.kategori = kategori as ProfilKategoriEnum;
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

        await adminDb.doc(`profil/${id}`).update(updateData);
        return NextResponse.json({ success: true, message: "Profil updated successfully" });
    } catch (error) {
        const msg = toErrorMessage(error);
        const status = msg === "NO_TOKEN" ? 401 : msg === "NOT_ADMIN" ? 403 : 500;
        console.error("Error patching profil:", error);
        return NextResponse.json({ success: false, error: msg || "Failed to patch profil" }, { status });
    }
}

/* ============== DELETE ============== */
export async function DELETE(request: NextRequest) {
    try {
        await verifyAdmin(request);
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });

        await adminDb.doc(`profil/${id}`).delete();
        return NextResponse.json({ success: true, message: "Profil deleted successfully" });
    } catch (error: unknown) {
        const msg = toErrorMessage(error);
        const status = msg === "NO_TOKEN" ? 401 : msg === "NOT_ADMIN" ? 403 : 500;
        console.error("Error deleting profil:", error);
        return NextResponse.json({ success: false, error: msg || "Failed to delete profil" }, { status });
    }
}