import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { FieldValue, Timestamp as AdminTimestamp, DocumentReference as AdminDocumentReference, QuerySnapshot, DocumentData } from "firebase-admin/firestore";

export const runtime = "nodejs";

/* ================= Types & utils ================= */
type StatusType = "pending" | "done";

interface AspirasiDoc {
    judul: string;
    nama: string;
    email?: string;
    nomor_telepon?: string;
    isi: string;
    status: StatusType;
    admin_id?: AdminDocumentReference;
    created_at?: AdminTimestamp;
    updated_at?: AdminTimestamp;
}

type ErrorWithMsg = { message?: unknown };
const emsg = (e: unknown) =>
    e instanceof Error
        ? e.message
        : typeof e === "object" && e && "message" in e && typeof (e as ErrorWithMsg).message === "string"
        ? (e as ErrorWithMsg).message!
        : "";

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isStatus = (v: string | null): v is StatusType => v === "pending" || v === "done";

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

export async function GET(request: NextRequest) {
    try {
        await verifyAdmin(request);

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        const status = searchParams.get("status");

        if (id) {
            const snap = await adminDb.doc(`aspirasi/${id}`).get();
            if (!snap.exists) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
            const raw = snap.data() as AspirasiDoc;
            const data = {
                id: snap.id,
                ...raw,
                created_at: typeof raw.created_at?.toDate === "function" ? raw.created_at.toDate() : null,
                updated_at: typeof raw.updated_at?.toDate === "function" ? raw.updated_at.toDate() : null,
                admin_uid: raw.admin_id?.id ?? null,
            };
            return NextResponse.json({ success: true, data });
        }

        let ref = adminDb.collection("aspirasi").orderBy("created_at", "desc");
        if (isStatus(status)) {
            ref = adminDb
                .collection("aspirasi")
                .where("status", "==", status)
                .orderBy("created_at", "desc");
        }

        const snap: QuerySnapshot<DocumentData> = await ref.get();
        const list = snap.docs.map((d) => {
            const raw = d.data() as AspirasiDoc;
            return {
                id: d.id,
                ...raw,
                created_at: typeof raw.created_at?.toDate === "function" ? raw.created_at.toDate() : null,
                updated_at: typeof raw.updated_at?.toDate === "function" ? raw.updated_at.toDate() : null,
                admin_uid: raw.admin_id?.id ?? null,
            };
        });

        return NextResponse.json({ success: true, data: list });
    } catch (e) {
        const msg = emsg(e);
        const status = msg === "NO_TOKEN" ? 401 : msg === "NOT_ADMIN" ? 403 : 500;
        console.error("GET aspirasi error:", e);
        return NextResponse.json({ success: false, error: msg || "Failed to fetch aspirasi" }, { status });
    }
}

export async function POST(request: NextRequest) {
    try {
        const form = await request.formData();

        const judul = String(form.get("judul") || "").trim();
        const nama = String(form.get("nama") || "").trim();
        const email = String(form.get("email") || "").trim();
        const nomor_telepon = String(form.get("nomor_telepon") || "").trim();
        const isi = String(form.get("isi") || "").trim();

        // Basic server-side validation (safety net)
        if (!judul || !nama || !isi) {
            return NextResponse.json({ 
                success: false, 
                error: "Data tidak lengkap" 
            }, { status: 400 });
        }

        const payload: AspirasiDoc = {
            judul,
            nama,
            isi,
            status: "pending",
            created_at: FieldValue.serverTimestamp() as unknown as AdminTimestamp,
            updated_at: FieldValue.serverTimestamp() as unknown as AdminTimestamp,
        };

        // Add optional fields if provided
        if (email) payload.email = email;
        if (nomor_telepon) payload.nomor_telepon = nomor_telepon;

        const docRef = await adminDb.collection("aspirasi").add(payload);
        return NextResponse.json({ 
            success: true, 
            data: { id: docRef.id },
            message: "Aspirasi Anda berhasil dikirim! Tim kami akan menindaklanjuti dalam 3-7 hari kerja."
        }, { status: 201 });
    } catch (e) {
        console.error("POST aspirasi error:", e);
        return NextResponse.json({ 
            success: false, 
            error: emsg(e) || "Gagal mengirim aspirasi. Silakan coba lagi." 
        }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const uid = await verifyAdmin(request);
        const form = await request.formData();

        const id = String(form.get("id") || "");
        if (!id) return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });

        const statusVal = (form.get("status") as string) ?? null;
        const judul = (form.get("judul") as string) ?? null;
        const nama = (form.get("nama") as string) ?? null;
        const email = (form.get("email") as string) ?? null;
        const nomor_telepon = (form.get("nomor_telepon") as string) ?? null;
        const isi = (form.get("isi") as string) ?? null;

        const update: Partial<AspirasiDoc> & { updated_at: AdminTimestamp } = {
            updated_at: FieldValue.serverTimestamp() as unknown as AdminTimestamp,
        };
        
        if (statusVal !== null) {
            if (!isStatus(statusVal)) {
                return NextResponse.json({ success: false, error: "Invalid status" }, { status: 400 });
            }
            update.status = statusVal;
        }
        if (judul !== null) update.judul = judul.trim();
        if (nama !== null) update.nama = nama.trim();
        if (email !== null) {
            const em = email.trim();
            if (em && !isEmail(em)) return NextResponse.json({ success: false, error: "Invalid email" }, { status: 400 });
            update.email = em || undefined;
        }
        if (nomor_telepon !== null) {
            update.nomor_telepon = nomor_telepon.trim() || undefined;
        }
        if (isi !== null) update.isi = isi.trim();
        update.admin_id = adminDb.doc(`admin/${uid}`);

        await adminDb.doc(`aspirasi/${id}`).update(update);
        return NextResponse.json({ success: true, message: "Aspirasi updated" });
    } catch (e) {
        const msg = emsg(e);
        const status = msg === "NO_TOKEN" ? 401 : msg === "NOT_ADMIN" ? 403 : 500;
        console.error("PATCH aspirasi error:", e);
        return NextResponse.json({ success: false, error: msg || "Failed to update aspirasi" }, { status });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        await verifyAdmin(request);
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });

        await adminDb.doc(`aspirasi/${id}`).delete();
        return NextResponse.json({ success: true, message: "Aspirasi deleted" });
    } catch (e) {
        const msg = emsg(e);
        const status = msg === "NO_TOKEN" ? 401 : msg === "NOT_ADMIN" ? 403 : 500;
        console.error("DELETE aspirasi error:", e);
        return NextResponse.json({ success: false, error: msg || "Failed to delete aspirasi" }, { status });
    }
}