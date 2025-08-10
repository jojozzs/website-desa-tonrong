import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { AspirasiForm } from '@/lib/types';

export async function GET() {
    try {
        const aspirasiRef = collection(db, 'aspirasi');
        const q = query(aspirasiRef, orderBy('created_at', 'desc'));
        const snapshot = await getDocs(q);
        
        const aspirasi: AspirasiForm[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            created_at: doc.data().created_at?.toDate(),
            updated_at: doc.data().updated_at?.toDate(),
        })) as AspirasiForm[];

        return NextResponse.json({ success: true, data: aspirasi });
    } catch (error) {
        console.error('Error fetching aspirasi:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch aspirasi' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { judul, nama, email, isi } = body;

        if (!judul || !nama || !email || !isi) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        const newAspirasi = {
            judul,
            nama,
            email,
            isi,
            status: 'pending' as const,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
        };

        const docRef = await addDoc(collection(db, 'aspirasi'), newAspirasi);
        
        return NextResponse.json({ success: true, data: { id: docRef.id, ...newAspirasi } }, { status: 201 });
    } catch (error) {
        console.error('Error creating aspirasi:', error);
        return NextResponse.json({ success: false, error: 'Failed to create aspirasi' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, status, admin_id } = body;

        if (!id || !status) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        const updateData = {
            status,
            updated_at: serverTimestamp(),
            ...(admin_id && { admin_id }),
        };

        await updateDoc(doc(db, 'aspirasi', id), updateData);
        
        return NextResponse.json({ success: true, message: 'Aspirasi updated successfully' });
    } catch (error) {
        console.error('Error updating aspirasi:', error);
        return NextResponse.json({ success: false, error: 'Failed to update aspirasi' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
        }

        await deleteDoc(doc(db, 'aspirasi', id));
        
        return NextResponse.json({ success: true, message: 'Aspirasi deleted successfully' });
    } catch (error) {
        console.error('Error deleting aspirasi:', error);
        return NextResponse.json({ success: false, error: 'Failed to delete aspirasi' }, { status: 500 });
    }
}