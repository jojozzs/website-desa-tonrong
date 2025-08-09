import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { Galeri } from '@/lib/types';
import cloudinary from '@/lib/cloudinary';
import { CloudinaryUploadResult } from '@/lib/cloudinary-types';

export async function GET() {
    try {
        const galeriRef = collection(db, 'galeri');
        const q = query(galeriRef, orderBy('created_at', 'desc'));
        const snapshot = await getDocs(q);
        
        const galeri: Galeri[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            created_at: doc.data().created_at?.toDate(),
            updated_at: doc.data().updated_at?.toDate(),
        })) as Galeri[];

        return NextResponse.json({ success: true, data: galeri });
    } catch (error) {
        console.error('Error fetching galeri:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch galeri' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const judul = formData.get('judul') as string;
        const deskripsi = formData.get('deskripsi') as string;
        const admin_id = formData.get('admin_id') as string;
        const gambar = formData.get('gambar') as File;

        if (!judul || !deskripsi || !admin_id || !gambar) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        // Upload image to Cloudinary
        const buffer = await gambar.arrayBuffer();
        const uploadResponse = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    resource_type: 'image',
                    folder: 'galeri',
                    transformation: [{ width: 800, height: 600, crop: 'fill' }]
                },
                (error, result) => {
                    if (error) reject(error);
                    else if (result) resolve({ ...result, folder: 'galeri' });
                }
            ).end(Buffer.from(buffer));
        });

        const uploadResult = uploadResponse;

        const newGaleri = {
            judul,
            deskripsi,
            admin_id,
            gambar_url: uploadResult.secure_url,
            gambar_id: uploadResult.public_id,
            gambar_size: uploadResult.bytes,
            gambar_type: uploadResult.format,
            gambar_width: uploadResult.width,
            gambar_height: uploadResult.height,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
        };

        const docRef = await addDoc(collection(db, 'galeri'), newGaleri);
        
        return NextResponse.json({ success: true, data: { id: docRef.id, ...newGaleri } }, { status: 201 });
    } catch (error) {
        console.error('Error creating galeri:', error);
        return NextResponse.json({ success: false, error: 'Failed to create galeri' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const formData = await request.formData();
        const id = formData.get('id') as string;
        const judul = formData.get('judul') as string;
        const deskripsi = formData.get('deskripsi') as string;
        const gambar = formData.get('gambar') as File | null;

        if (!id) {
            return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
        }

        let updateData: Record<string, unknown> = {
            judul,
            deskripsi,
            updated_at: serverTimestamp(),
        };

        // If new image is provided, upload to Cloudinary
        if (gambar && gambar.size > 0) {
            const buffer = await gambar.arrayBuffer();
            const uploadResponse = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                        resource_type: 'image',
                        folder: 'galeri',
                        transformation: [{ width: 800, height: 600, crop: 'fill' }]
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else if (result) resolve({ ...result, folder: 'galeri' });
                    }
                ).end(Buffer.from(buffer));
            });

            const uploadResult = uploadResponse;
            
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

        await updateDoc(doc(db, 'galeri', id), updateData);
        
        return NextResponse.json({ success: true, message: 'Galeri updated successfully' });
    } catch (error) {
        console.error('Error updating galeri:', error);
        return NextResponse.json({ success: false, error: 'Failed to update galeri' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
        }

        await deleteDoc(doc(db, 'galeri', id));
        
        return NextResponse.json({ success: true, message: 'Galeri deleted successfully' });
    } catch (error) {
        console.error('Error deleting galeri:', error);
        return NextResponse.json({ success: false, error: 'Failed to delete galeri' }, { status: 500 });
    }
}