import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection as webCollection, getDocs, query, orderBy } from 'firebase/firestore';
import cloudinary from '@/lib/cloudinary';
import { CloudinaryUploadResult } from '@/lib/cloudinary-types';
import { adminAuth, adminDb } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { Galeri } from '@/lib/types';

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (id) {
            const snap = await adminDb.doc(`galeri/${id}`).get();
            if (!snap.exists) {
                return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
            }
            const raw = snap.data()!;
            const data = {
                ...raw,
                id: snap.id,
                created_at: raw.created_at?.toDate?.() ?? null,
                updated_at: raw.updated_at?.toDate?.() ?? null,
                admin_uid: raw.admin_id?.id ?? null,
            };
            return NextResponse.json({ success: true, data });
        }

        const galeriRef = webCollection(db, "galeri");
        const q = query(galeriRef, orderBy("created_at", "desc"));
        const snapshot = await getDocs(q);

        const galeri = snapshot.docs.map((d) => {
            const raw = d.data() as Galeri;
            return {
                ...raw,
                id: d.id,
                created_at: raw.created_at?.toDate?.() ?? null,
                updated_at: raw.updated_at?.toDate?.() ?? null,
                admin_uid: raw.admin_id ?? null,
            };
        });

        return NextResponse.json({ success: true, data: galeri });
    } catch (error) {
        console.error("Error fetching galeri:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch galeri" }, { status: 500 });
    }
}

async function verifyAdmin(req: NextRequest) {
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    if (!token) throw new Error('NO_TOKEN');

    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;

    const adminSnap = await adminDb.doc(`admin/${uid}`).get();
    if (!adminSnap.exists || adminSnap.get('role') !== 'admin') {
        throw new Error('NOT_ADMIN');
    }
    return uid;
}

export async function POST(request: NextRequest) {
	try {
		const uid = await verifyAdmin(request);
		const formData = await request.formData();
		const judul = String(formData.get('judul') || '');
		const deskripsi = String(formData.get('deskripsi') || '');
		const gambar = formData.get('gambar') as File | null;

		if (!judul || !deskripsi || !gambar) {
			return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
		}

		const buf = Buffer.from(await gambar.arrayBuffer());
		const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
			cloudinary.uploader.upload_stream(
				{
					resource_type: 'image',
					folder: process.env.CLOUDINARY_BASE_FOLDER ? `${process.env.CLOUDINARY_BASE_FOLDER}/galeri` : 'galeri',
					// transformation: [{ width: 800, height: 600, crop: 'fill' }],
                    transformation: [{ width: 1920, height: 1080, crop: 'fill' }]
				},
				(err, res) => (err ? reject(err) : resolve(res as unknown as CloudinaryUploadResult))
			).end(buf);
		});

		const adminRef = adminDb.doc(`admin/${uid}`);
		const payload = {
			judul,
			deskripsi,
			admin_id: adminRef, // ← Reference
			gambar_url: result.secure_url,
			gambar_id: result.public_id,
			gambar_size: result.bytes,
			gambar_type: result.format,
			gambar_width: result.width,
			created_at: FieldValue.serverTimestamp(),
			updated_at: FieldValue.serverTimestamp(),
		};

		// gunakan Admin SDK
		const docRef = await adminDb.collection('galeri').add(payload);

		return NextResponse.json({ success: true, data: { id: docRef.id, ...payload } }, { status: 201 });
	} catch (error: unknown) {
		const msg = String((error as Error)?.message || '');
		const status = msg === 'NO_TOKEN' ? 401 : msg === 'NOT_ADMIN' ? 403 : 500;
		console.error('Error creating galeri:', error);
		return NextResponse.json({ success: false, error: msg || 'Failed to create galeri' }, { status });
	}
}

export async function PATCH(request: NextRequest) {
    try {
        await verifyAdmin(request);
        const formData = await request.formData();

        const id = String(formData.get("id") || "");
        if (!id) {
            return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
        }

        const judul = formData.get("judul") as string | null;
        const deskripsi = formData.get("deskripsi") as string | null;
        const gambar = formData.get("gambar") as File | null;

        const updateData: Record<string, unknown> = {
            updated_at: FieldValue.serverTimestamp(),
        };
        if (judul !== null) updateData.judul = judul;
        if (deskripsi !== null) updateData.deskripsi = deskripsi;

        if (gambar && gambar.size > 0) {
            const buf = Buffer.from(await gambar.arrayBuffer());
            const res = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                        resource_type: "image",
                        folder: process.env.CLOUDINARY_BASE_FOLDER
                            ? `${process.env.CLOUDINARY_BASE_FOLDER}/galeri`
                            : "galeri",
                        // transformation: [{ width: 800, height: 600, crop: "fill" }],
                        transformation: [{ width: 1920, height: 1080, crop: 'fill' }]
                    },
                    (err, out) => (err ? reject(err) : resolve(out as unknown as CloudinaryUploadResult))
                )
                .end(buf);
            });

            Object.assign(updateData, {
                gambar_url: res.secure_url,
                gambar_id: res.public_id,
                gambar_size: res.bytes,
                gambar_type: res.format,
                gambar_width: res.width,
                gambar_height: res.height,
            });
        }

        await adminDb.doc(`galeri/${id}`).update(updateData);
        return NextResponse.json({ success: true, message: "Galeri updated successfully" });
    } catch (error: unknown) {
        const msg = String((error as Error)?.message || "");
        const status = msg === "NO_TOKEN" ? 401 : msg === "NOT_ADMIN" ? 403 : 500;
        console.error("Error patching galeri:", error);
        return NextResponse.json({ success: false, error: msg || "Failed to patch galeri" }, { status });
    }
}

export async function DELETE(request: NextRequest) {
	try {
		await verifyAdmin(request);
		const { searchParams } = new URL(request.url);
		const id = searchParams.get('id');
		if (!id) return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });

		await adminDb.doc(`galeri/${id}`).delete();
		return NextResponse.json({ success: true, message: 'Galeri deleted successfully' });
	} catch (error: unknown) {
		const msg = String((error as Error)?.message || '');
		const status = msg === 'NO_TOKEN' ? 401 : msg === 'NOT_ADMIN' ? 403 : 500;
		console.error('Error deleting galeri:', error);
		return NextResponse.json({ success: false, error: msg || 'Failed to delete galeri' }, { status });
	}
}