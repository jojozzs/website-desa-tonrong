import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, serverTimestamp, query, orderBy, where } from 'firebase/firestore';
import { Profil } from '@/lib/types';
import { ProfilKategoriEnum } from '@/lib/enums';
import cloudinary from '@/lib/cloudinary';
import { CloudinaryUploadResult } from '@/lib/cloudinary-types';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const kategori = searchParams.get('kategori') as ProfilKategoriEnum | null;
        
        const profilRef = collection(db, 'profil');
        let q = query(profilRef, orderBy('created_at', 'desc'));
        
        if (kategori && Object.values(ProfilKategoriEnum).includes(kategori)) {
            q = query(profilRef, where('kategori', '==', kategori), orderBy('created_at', 'desc'));
        }
        
        const snapshot = await getDocs(q);
        
        const profil: Profil[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            created_at: doc.data().created_at?.toDate(),
            updated_at: doc.data().updated_at?.toDate(),
        })) as Profil[];

        return NextResponse.json({ success: true, data: profil });
    } catch (error) {
        console.error('Error fetching profil:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch profil' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const judul = formData.get('judul') as string;
        const deskripsi = formData.get('deskripsi') as string;
        const kategori = formData.get('kategori') as ProfilKategoriEnum;
        const admin_id = formData.get('admin_id') as string;
        const gambar = formData.get('gambar') as File;

        if (!judul || !deskripsi || !kategori || !admin_id || !gambar) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        // Validate kategori
        if (!Object.values(ProfilKategoriEnum).includes(kategori)) {
            return NextResponse.json({ success: false, error: 'Invalid kategori' }, { status: 400 });
        }

        // Upload image to Cloudinary
        const buffer = await gambar.arrayBuffer();
        const uploadResponse = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    resource_type: 'image',
                    folder: 'profil',
                    transformation: [{ width: 800, height: 600, crop: 'fill' }]
                },
                (error, result) => {
                    if (error) reject(error);
                    else if (result) resolve({ ...result, folder: 'profil' });
                }
            ).end(Buffer.from(buffer));
        });

        const uploadResult = uploadResponse;

        const newProfil = {
            judul,
            deskripsi,
            kategori,
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

        const docRef = await addDoc(collection(db, 'profil'), newProfil);
        
        return NextResponse.json({ success: true, data: { id: docRef.id, ...newProfil } }, { status: 201 });
    } catch (error) {
        console.error('Error creating profil:', error);
        return NextResponse.json({ success: false, error: 'Failed to create profil' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const formData = await request.formData();
        const id = formData.get('id') as string;
        const judul = formData.get('judul') as string;
        const deskripsi = formData.get('deskripsi') as string;
        const kategori = formData.get('kategori') as ProfilKategoriEnum;
        const gambar = formData.get('gambar') as File | null;

        if (!id) {
            return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
        }

        // Validate kategori if provided
        if (kategori && !Object.values(ProfilKategoriEnum).includes(kategori)) {
            return NextResponse.json({ success: false, error: 'Invalid kategori' }, { status: 400 });
        }

        let updateData: Record<string, unknown> = {
            judul,
            deskripsi,
            kategori,
            updated_at: serverTimestamp(),
        };

        // If new image is provided, upload to Cloudinary
        if (gambar && gambar.size > 0) {
            const buffer = await gambar.arrayBuffer();
            const uploadResponse = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                        resource_type: 'image',
                        folder: 'profil',
                        transformation: [{ width: 800, height: 600, crop: 'fill' }]
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else if (result) resolve({ ...result, folder: 'profil' });
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

        await updateDoc(doc(db, 'profil', id), updateData);
        
        return NextResponse.json({ success: true, message: 'Profil updated successfully' });
    } catch (error) {
        console.error('Error updating profil:', error);
        return NextResponse.json({ success: false, error: 'Failed to update profil' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
        }

        await deleteDoc(doc(db, 'profil', id));
        
        return NextResponse.json({ success: true, message: 'Profil deleted successfully' });
    } catch (error) {
        console.error('Error deleting profil:', error);
        return NextResponse.json({ success: false, error: 'Failed to delete profil' }, { status: 500 });
    }
}