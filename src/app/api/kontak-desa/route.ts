import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { FieldValue, Timestamp as AdminTimestamp, DocumentReference as AdminDocumentReference } from "firebase-admin/firestore";

export const runtime = "nodejs";

/* Types */
interface KontakDocAdmin {
    alamat: string;
    nomor_telepon: string;
    nomor_whatsapp: string;
    email_desa: string;
    admin_id?: AdminDocumentReference;
    created_at?: AdminTimestamp;
    updated_at?: AdminTimestamp;
}

type ErrorWithOptionalMessage = { message?: unknown };
const msgOf = (e: unknown) =>
    e instanceof Error
        ? e.message
        : typeof e === "object" && e && "message" in e && typeof (e as ErrorWithOptionalMessage).message === "string"
        ? (e as ErrorWithOptionalMessage).message!
        : "";

/* Helpers */
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

async function verifyAdmin(req: NextRequest): Promise<string> {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
    if (!token) throw new Error("NO_TOKEN");
    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;
    const asnap = await adminDb.doc(`admin/${uid}`).get();
    if (!asnap.exists || asnap.get("role") !== "admin") throw new Error("NOT_ADMIN");
    return uid;
}

/* ============== GET ============== */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (id) {
            const snap = await adminDb.doc(`kontak-desa/${id}`).get();
            if (!snap.exists) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
            const raw = snap.data() as KontakDocAdmin;
            const data = {
                id: snap.id,
                ...raw,
                created_at: typeof raw.created_at?.toDate === "function" ? raw.created_at.toDate() : null,
                updated_at: typeof raw.updated_at?.toDate === "function" ? raw.updated_at.toDate() : null,
                admin_uid: raw.admin_id?.id ?? null,
            };
            return NextResponse.json({ success: true, data });
        }

        const q = await adminDb
            .collection("kontak-desa")
            .orderBy("updated_at", "desc")
            .limit(1)
            .get();

        if (q.empty) {
            return NextResponse.json({ success: true, data: null }); // belum ada
        }

        const d = q.docs[0];
        const raw = d.data() as KontakDocAdmin;
        const data = {
            id: d.id,
            ...raw,
            created_at: typeof raw.created_at?.toDate === "function" ? raw.created_at.toDate() : null,
            updated_at: typeof raw.updated_at?.toDate === "function" ? raw.updated_at.toDate() : null,
            admin_uid: raw.admin_id?.id ?? null,
        };
        return NextResponse.json({ success: true, data });
    } catch (e) {
        console.error("GET kontak-desa error:", e);
        return NextResponse.json({ success: false, error: msgOf(e) || "Failed to fetch kontak-desa" }, { status: 500 });
    }
}

/* ============== POST/DELETE ============== */
export async function POST() {
    return NextResponse.json(
        { success: false, error: "Method not allowed. Use PATCH to update the single kontak-desa document." },
        { status: 405 }
    );
}
export async function DELETE() {
    return NextResponse.json(
        { success: false, error: "Method not allowed. Deleting kontak-desa is disabled." },
        { status: 405 }
    );
}

/* ============== PATCH ============== */
export async function PATCH(request: NextRequest) {
    try {
        const uid = await verifyAdmin(request);
        const formData = await request.formData();

        let id = (formData.get("id") as string) || "";

        if (!id) {
            const q = await adminDb
                .collection("kontak-desa")
                .orderBy("updated_at", "desc")
                .limit(1)
                .get();
            if (q.empty) {
                return NextResponse.json(
                { success: false, error: "Kontak-desa not found. Creation is disabled." },
                { status: 404 }
                );
            }
            id = q.docs[0].id;
        }

        const alamat = (formData.get("alamat") as string) ?? null;
        const nomor_telepon = (formData.get("nomor_telepon") as string) ?? null;
        const nomor_whatsapp = (formData.get("nomor_whatsapp") as string) ?? null;
        const email_desa = (formData.get("email_desa") as string) ?? null;

        const updateData: Partial<KontakDocAdmin> & { updated_at: AdminTimestamp } = {
            updated_at: FieldValue.serverTimestamp() as unknown as AdminTimestamp,
        };

        if (alamat !== null) updateData.alamat = alamat.trim();
        if (nomor_telepon !== null) updateData.nomor_telepon = nomor_telepon.trim();
        if (nomor_whatsapp !== null) updateData.nomor_whatsapp = nomor_whatsapp.trim();
        if (email_desa !== null) {
            const email = email_desa.trim();
            if (!isEmail(email)) {
                return NextResponse.json({ success: false, error: "Invalid email_desa" }, { status: 400 });
            }
            updateData.email_desa = email;
        }

        const adminRef = adminDb.doc(`admin/${uid}`);
        updateData.admin_id = adminRef;

        await adminDb.doc(`kontak-desa/${id}`).update(updateData);
        return NextResponse.json({ success: true, message: "Kontak-desa updated successfully" });
    } catch (e) {
        const msg = msgOf(e);
        const status = msg === "NO_TOKEN" ? 401 : msg === "NOT_ADMIN" ? 403 : 500;
        console.error("PATCH kontak-desa error:", e);
        return NextResponse.json({ success: false, error: msg || "Failed to update kontak-desa" }, { status });
    }
}