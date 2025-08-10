import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, serverTimestamp, query, orderBy, limit } from 'firebase/firestore';
import { KontakDesa } from '@/lib/types';

export async function GET() {
    try {
        const kontakRef = collection(db, 'kontak_desa');
        const q = query(kontakRef, orderBy('created_at', 'desc'), limit(1));
        const snapshot = await getDocs(q);
        
        const kontak: KontakDesa[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            created_at: doc.data().created_at?.toDate(),
            updated_at: doc.data().updated_at?.toDate(),
        })) as KontakDesa[];

        return NextResponse.json({ success: true, data: kontak[0] || null });
    } catch (error) {
        console.error('Error fetching kontak desa:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch kontak desa' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { alamat, nomor_telepon, nomor_whatsapp, email_desa, admin_id } = body;

        if (!alamat || !nomor_telepon || !nomor_whatsapp || !email_desa || !admin_id) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        const newKontak = {
            alamat,
            nomor_telepon,
            nomor_whatsapp,
            email_desa,
            admin_id,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
        };

        const docRef = await addDoc(collection(db, 'kontak_desa'), newKontak);
        
        return NextResponse.json({ success: true, data: { id: docRef.id, ...newKontak } }, { status: 201 });
    } catch (error) {
        console.error('Error creating kontak desa:', error);
        return NextResponse.json({ success: false, error: 'Failed to create kontak desa' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, alamat, nomor_telepon, nomor_whatsapp, email_desa } = body;

        if (!id) {
            return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
        }

        const updateData = {
            alamat,
            nomor_telepon,
            nomor_whatsapp,
            email_desa,
            updated_at: serverTimestamp(),
        };

        await updateDoc(doc(db, 'kontak_desa', id), updateData);
        
        return NextResponse.json({ success: true, message: 'Kontak desa updated successfully' });
    } catch (error) {
        console.error('Error updating kontak desa:', error);
        return NextResponse.json({ success: false, error: 'Failed to update kontak desa' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
        }

        await deleteDoc(doc(db, 'kontak_desa', id));
        
        return NextResponse.json({ success: true, message: 'Kontak desa deleted successfully' });
    } catch (error) {
        console.error('Error deleting kontak desa:', error);
        return NextResponse.json({ success: false, error: 'Failed to delete kontak desa' }, { status: 500 });
    }
}