// app/api/berita-pengumuman/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, serverTimestamp, query, orderBy, where } from 'firebase/firestore';
import { BeritaPengumuman } from '@/lib/types';
import { BeritaKategoriEnum } from '@/lib/enums';
import cloudinary from '@/lib/cloudinary';
import { CloudinaryUploadResult } from '@/lib/cloudinary-types';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const kategori = searchParams.get('kategori') as BeritaKategoriEnum | null;
        
        const beritaRef = collection(db, 'berita_pengumuman');
        let q = query(beritaRef, orderBy('tanggal', 'desc'));
        
        if (kategori && Object.values(BeritaKategoriEnum).includes(kategori)) {
            q = query(beritaRef, where('kategori', '==', kategori), orderBy('tanggal', 'desc'));
        }
        
        const snapshot = await getDocs(q);
        
        const berita: BeritaPengumuman[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            tanggal: doc.data().tanggal?.toDate(),
            created_at: doc.data().created_at?.toDate(),
            updated_at: doc.data().updated_at?.toDate(),
        })) as BeritaPengumuman[];

        return NextResponse.json({ success: true, data: berita });
    } catch (error) {
        console.error('Error fetching berita pengumuman:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch berita pengumuman' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const judul = formData.get('judul') as string;
        const deskripsi = formData.get('deskripsi') as string;
        const tanggal = formData.get('tanggal') as string;
        const penulis = formData.get('penulis') as string;
        const kategori = formData.get('kategori') as BeritaKategoriEnum;
        const slug = formData.get('slug') as string;
        const admin_id = formData.get('admin_id') as string;
        const gambar = formData.get('gambar') as File;

        if (!judul || !deskripsi || !tanggal || !penulis || !kategori || !slug || !admin_id || !gambar) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        // Upload image to Cloudinary
        const buffer = await gambar.arrayBuffer();
        const uploadResponse = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    resource_type: 'image',
                    folder: 'berita-pengumuman',
                    transformation: [{ width: 800, height: 600, crop: 'fill' }]
                },
                (error, result) => {
                    if (error) reject(error);
                    else if (result) resolve({ ...result, folder: 'berita-pengumuman' });
                }
            ).end(Buffer.from(buffer));
        });

        const uploadResult = uploadResponse;

        const newBerita = {
            judul,
            deskripsi,
            tanggal: new Date(tanggal),
            penulis,
            kategori,
            slug,
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

        const docRef = await addDoc(collection(db, 'berita_pengumuman'), newBerita);
        
        return NextResponse.json({ success: true, data: { id: docRef.id, ...newBerita } }, { status: 201 });
    } catch (error) {
        console.error('Error creating berita pengumuman:', error);
        return NextResponse.json({ success: false, error: 'Failed to create berita pengumuman' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const formData = await request.formData();
        const id = formData.get('id') as string;
        const judul = formData.get('judul') as string;
        const deskripsi = formData.get('deskripsi') as string;
        const tanggal = formData.get('tanggal') as string;
        const penulis = formData.get('penulis') as string;
        const kategori = formData.get('kategori') as BeritaKategoriEnum;
        const slug = formData.get('slug') as string;
        const gambar = formData.get('gambar') as File | null;

        if (!id) {
            return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
        }

        let updateData: Record<string, unknown> = {
            judul,
            deskripsi,
            tanggal: new Date(tanggal),
            penulis,
            kategori,
            slug,
            updated_at: serverTimestamp(),
        };

        // If new image is provided, upload to Cloudinary
        if (gambar && gambar.size > 0) {
            const buffer = await gambar.arrayBuffer();
            const uploadResponse = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                        resource_type: 'image',
                        folder: 'berita-pengumuman',
                        transformation: [{ width: 800, height: 600, crop: 'fill' }]
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else if (result) resolve({ ...result, folder: 'berita-pengumuman' });
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

        await updateDoc(doc(db, 'berita_pengumuman', id), updateData);
        
        return NextResponse.json({ success: true, message: 'Berita pengumuman updated successfully' });
    } catch (error) {
        console.error('Error updating berita pengumuman:', error);
        return NextResponse.json({ success: false, error: 'Failed to update berita pengumuman' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
        }

        await deleteDoc(doc(db, 'berita_pengumuman', id));
        
        return NextResponse.json({ success: true, message: 'Berita pengumuman deleted successfully' });
    } catch (error) {
        console.error('Error deleting berita pengumuman:', error);
        return NextResponse.json({ success: false, error: 'Failed to delete berita pengumuman' }, { status: 500 });
    }
}