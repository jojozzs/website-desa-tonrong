import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import cloudinary from '@/lib/cloudinary';
import { 
    createSuccessResponse, 
    createErrorResponse, 
    validateRequiredFields, 
    validateFileUpload,
    parseFormData,
    handleApiError,
    validateAdmin,
    UPLOAD_LIMITS,
    FIRESTORE_COLLECTIONS
} from '@/lib/api-utils';
import { AdminLogHelpers } from '@/lib/admin-log';
import { ProdukUnggulan } from '@/lib/types';
import { CloudinaryUploadResult } from '@/lib/cloudinary-types';

// GET - Fetch all produk unggulan
export async function GET() {
    try {
        const q = query(
            collection(db, FIRESTORE_COLLECTIONS.PRODUK_UNGGULAN), 
            orderBy('created_at', 'desc')
        );
        const querySnapshot = await getDocs(q);
        
        const produkUnggulan: ProdukUnggulan[] = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            created_at: doc.data().created_at?.toDate(),
            updated_at: doc.data().updated_at?.toDate(),
        } as ProdukUnggulan));

        return NextResponse.json(createSuccessResponse(produkUnggulan));
    } catch (error) {
        await handleApiError(error, 'fetch produk unggulan');
        const { response, status } = createErrorResponse('Failed to fetch produk unggulan');
        return NextResponse.json(response, { status });
    }
}

// POST - Create new produk unggulan
export async function POST(request: NextRequest) {
    try {
        // Validate admin authorization
        const adminError = await validateAdmin(request);
        if (adminError) {
            const { response, status } = createErrorResponse(adminError, 401);
            return NextResponse.json(response, { status });
        }

        const formData = await request.formData();
        const data = parseFormData(formData);

        // Validate required fields
        const requiredFields = ['judul', 'deskripsi', 'nama_umkm', 'alamat_umkm', 'kontak_umkm', 'admin_id', 'admin_name'];
        const validationError = await validateRequiredFields(data as Record<string, unknown>, requiredFields);
        if (validationError) {
            const { response, status } = createErrorResponse(validationError, 400);
            return NextResponse.json(response, { status });
        }

        // Validate file upload
        const gambar = data.gambar as File;
        const fileError = await validateFileUpload(
            gambar,
            UPLOAD_LIMITS.ALLOWED_IMAGE_TYPES,
            UPLOAD_LIMITS.IMAGE_MAX_SIZE
        );
        if (fileError) {
            const { response, status } = createErrorResponse(fileError, 400);
            return NextResponse.json(response, { status });
        }

        // Upload to Cloudinary
        const buffer = Buffer.from(await gambar.arrayBuffer());
        
        const uploadResult = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    resource_type: 'image',
                    folder: 'produk-unggulan',
                },
                (error, result) => {
                    if (error) reject(error);
                    else if (result) resolve({ ...result, folder: 'produk-unggulan' });
                }
            ).end(buffer);
        });

        // Create produk unggulan document
        const produkUnggulanData = {
            judul: data.judul as string,
            deskripsi: data.deskripsi as string,
            nama_umkm: data.nama_umkm as string,
            alamat_umkm: data.alamat_umkm as string,
            kontak_umkm: data.kontak_umkm as string,
            gambar_url: uploadResult.secure_url,
            gambar_id: uploadResult.public_id,
            gambar_size: uploadResult.bytes,
            gambar_type: uploadResult.format,
            gambar_width: uploadResult.width,
            gambar_height: uploadResult.height,
            admin_id: data.admin_id as string,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
        };

        const docRef = await addDoc(collection(db, FIRESTORE_COLLECTIONS.PRODUK_UNGGULAN), produkUnggulanData);

        // Log admin activity
        await AdminLogHelpers.createProdukUnggulan(
            data.admin_id as string,
            data.admin_name as string,
            docRef.id,
            data.judul as string
        );

        return NextResponse.json(createSuccessResponse({ 
            id: docRef.id, 
            ...produkUnggulanData 
        }, 'Produk unggulan berhasil dibuat'));

    } catch (error) {
        await handleApiError(error, 'create produk unggulan');
        const { response, status } = createErrorResponse('Failed to create produk unggulan');
        return NextResponse.json(response, { status });
    }
}

// PUT - Update produk unggulan
export async function PUT(request: NextRequest) {
    try {
        // Validate admin authorization
        const adminError = await validateAdmin(request);
        if (adminError) {
            const { response, status } = createErrorResponse(adminError, 401);
            return NextResponse.json(response, { status });
        }

        const formData = await request.formData();
        const data = parseFormData(formData);

        // Validate required fields
        const requiredFields = ['id', 'judul', 'deskripsi', 'nama_umkm', 'alamat_umkm', 'kontak_umkm', 'admin_id', 'admin_name'];
        const validationError = await validateRequiredFields(data as Record<string, unknown>, requiredFields);
        if (validationError) {
            const { response, status } = createErrorResponse(validationError, 400);
            return NextResponse.json(response, { status });
        }

        const produkId = data.id as string;
        const docRef = doc(db, FIRESTORE_COLLECTIONS.PRODUK_UNGGULAN, produkId);

        // Check if document exists
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            const { response, status } = createErrorResponse('Produk unggulan tidak ditemukan', 404);
            return NextResponse.json(response, { status });
        }

        const existingData = docSnap.data();
        let updateData: Record<string, unknown> = {
            judul: data.judul as string,
            deskripsi: data.deskripsi as string,
            nama_umkm: data.nama_umkm as string,
            alamat_umkm: data.alamat_umkm as string,
            kontak_umkm: data.kontak_umkm as string,
            updated_at: serverTimestamp(),
        };

        // Handle image update if new file is provided
        const gambar = data.gambar as File;
        if (gambar && gambar.size > 0) {
            // Validate new file
            const fileError = await validateFileUpload(
                gambar,
                UPLOAD_LIMITS.ALLOWED_IMAGE_TYPES,
                UPLOAD_LIMITS.IMAGE_MAX_SIZE
            );
            if (fileError) {
                const { response, status } = createErrorResponse(fileError, 400);
                return NextResponse.json(response, { status });
            }

            // Delete old image from Cloudinary
            if (existingData.gambar_id) {
                try {
                    await cloudinary.uploader.destroy(existingData.gambar_id);
                } catch (error) {
                    console.warn('Failed to delete old image from Cloudinary:', error);
                }
            }

            // Upload new image
            const buffer = Buffer.from(await gambar.arrayBuffer());
            
            const uploadResult = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                        resource_type: 'image',
                        folder: 'produk-unggulan',
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else if (result) resolve({ ...result, folder: 'produk-unggulan' });
                    }
                ).end(buffer);
            });

            // Update image fields
            updateData = {
                ...updateData,
                gambar_url: uploadResult.secure_url,
                gambar_id: uploadResult.public_id,
                gambar_size: uploadResult.bytes,
                gambar_type: uploadResult.format,
                gambar_width: uploadResult.width,
                gambar_height: uploadResult.height,
            };
        }

        await updateDoc(docRef, updateData);

        // Log admin activity
        await AdminLogHelpers.updateProdukUnggulan(
            data.admin_id as string,
            data.admin_name as string,
            produkId,
            data.judul as string
        );

        return NextResponse.json(createSuccessResponse({ 
            id: produkId, 
            ...updateData 
        }, 'Produk unggulan berhasil diperbarui'));

    } catch (error) {
        await handleApiError(error, 'update produk unggulan');
        const { response, status } = createErrorResponse('Failed to update produk unggulan');
        return NextResponse.json(response, { status });
    }
}

// DELETE - Delete produk unggulan
export async function DELETE(request: NextRequest) {
    try {
        // Validate admin authorization
        const adminError = await validateAdmin(request);
        if (adminError) {
            const { response, status } = createErrorResponse(adminError, 401);
            return NextResponse.json(response, { status });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const admin_id = searchParams.get('admin_id');
        const admin_name = searchParams.get('admin_name');

        if (!id || !admin_id || !admin_name) {
            const { response, status } = createErrorResponse('ID, admin_id, and admin_name are required', 400);
            return NextResponse.json(response, { status });
        }

        const docRef = doc(db, FIRESTORE_COLLECTIONS.PRODUK_UNGGULAN, id);

        // Check if document exists and get data before deletion
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            const { response, status } = createErrorResponse('Produk unggulan tidak ditemukan', 404);
            return NextResponse.json(response, { status });
        }

        const data = docSnap.data();
        
        // Delete image from Cloudinary
        if (data.gambar_id) {
            try {
                await cloudinary.uploader.destroy(data.gambar_id);
            } catch (error) {
                console.warn('Failed to delete image from Cloudinary:', error);
            }
        }

        // Delete document
        await deleteDoc(docRef);

        // Log admin activity
        await AdminLogHelpers.deleteProdukUnggulan(
            admin_id,
            admin_name,
            id,
            data.judul
        );

        return NextResponse.json(createSuccessResponse(
            { id }, 
            'Produk unggulan berhasil dihapus'
        ));

    } catch (error) {
        await handleApiError(error, 'delete produk unggulan');
        const { response, status } = createErrorResponse('Failed to delete produk unggulan');
        return NextResponse.json(response, { status });
    }
}