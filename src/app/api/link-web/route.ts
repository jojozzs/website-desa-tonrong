import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export async function GET() {
    try {
        const snap = await adminDb.doc(`link-web/main`).get();
        if (!snap.exists) {
            return NextResponse.json({ success: true, data: null });
        }

        const data = snap.data();
        if (!data) {
            return NextResponse.json({ success: true, data: null });
        }
        
        return NextResponse.json({
            success: true,
            data: {
                id: snap.id,
                link: data.link ?? "",
                nama: data.nama ?? "",
                created_at: data.created_at?.toDate?.() ?? null,
                updated_at: data.updated_at?.toDate?.() ?? null,
                admin_uid: data.admin_id?.id ?? null,
            },
        });
    } catch (error) {
        console.error("Gagal memuat link web:", error);
        return NextResponse.json({ success: false, error: "Gagal memuat link web" }, { status: 500 });
    }
}

export async function POST() {
    return NextResponse.json(
        { success: false, error: "Metode POST tidak diizinkan" },
        { status: 405 }
    );
}

export async function PATCH(request: NextRequest) {
    try {
        const token = request.headers.get("authorization")?.replace("Bearer ", "");
        if (!token) throw new Error("NO_TOKEN");

        const decoded = await adminAuth.verifyIdToken(token);
        const uid = decoded.uid;

        const adminSnap = await adminDb.doc(`admin/${uid}`).get();
            if (!adminSnap.exists || adminSnap.get("role") !== "admin") {
            throw new Error("NOT_ADMIN");
        }

        const formData = await request.formData();
        const newLink = formData.get("link")?.toString()?.trim() || "";
        const newNama = formData.get("nama")?.toString()?.trim() || "";

        if (!newLink || !newNama) {
            return NextResponse.json(
                { success: false, error: "Link dan nama wajib diisi" },
                { status: 400 }
            );
        }

        try {
            new URL(newLink);
        } catch {
            return NextResponse.json(
                {
                    success: false,
                    error: "Format link tidak valid. Harus dimulai dengan http:// atau https://",
                },
                { status: 400 }
            );
        }

        const now = FieldValue.serverTimestamp();
        const docRef = adminDb.doc("link-web/main");

        await docRef.set(
            {
                link: newLink,
                nama: newNama,
                updated_at: now,
                admin_id: adminDb.doc(`admin/${uid}`),
            },
            { merge: true }
        );

        return NextResponse.json({
            success: true,
            message: "Link berhasil diperbarui",
            data: { link: newLink, nama: newNama },
        });
    } catch (error) {
        console.error("PATCH link-web error:", error);
        const msg = typeof error === "object" && error && "message" in error
            ? (error as { message?: string }).message
            : "Internal server error";

        const status = msg === "NO_TOKEN" ? 401 : msg === "NOT_ADMIN" ? 403 : 500;

        return NextResponse.json(
            { success: false, error: msg || "Gagal update link web" },
            { status }
        );
    }
}