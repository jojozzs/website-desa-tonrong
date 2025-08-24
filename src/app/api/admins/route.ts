import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebaseAdmin';
import { AdminLogHelpers } from '@/lib/admin-log';

interface CreateAdminRequest {
    email: string;
    password: string;
    nama: string;
    role: 'admin';
}

interface AdminData {
    uid: string;
    email: string;
    nama: string;
    role: "admin";
    created_at?: Date;
    created_by?: string;
    last_access?: Date | null;
    updated_at?: Date;
}

interface UpdatePasswordRequest {
    targetUid: string;
    newPassword: string;
    currentPasswordConfirmed?: boolean;
}

async function verifyAdminToken(request: NextRequest): Promise<AdminData> {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        throw new Error('Token tidak valid');
    }

    const token = authHeader.substring(7);
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    const adminDoc = await adminDb.collection('admin').doc(decodedToken.uid).get();
    if (!adminDoc.exists) {
        throw new Error('Bukan admin');
    }

    const adminData = adminDoc.data();
    if (!adminData || adminData.role !== 'admin') {
        throw new Error('Tidak memiliki akses admin');
    }

    return {
        uid: decodedToken.uid,
        email: decodedToken.email!,
        nama: adminData.nama,
        role: adminData.role,
        created_at: adminData.created_at,
        created_by: adminData.created_by,
        last_access: adminData.last_access,
        updated_at: adminData.updated_at
    };
}

function validatePasswordStrength(password: string): { isValid: boolean; message?: string } {
    if (password.length < 8) {
        return { isValid: false, message: 'Password minimal 8 karakter' };
    }
    
    if (!/[a-z]/.test(password)) {
        return { isValid: false, message: 'Password harus mengandung huruf kecil' };
    }
    
    if (!/[A-Z]/.test(password)) {
        return { isValid: false, message: 'Password harus mengandung huruf besar' };
    }
    
    if (!/\d/.test(password)) {
        return { isValid: false, message: 'Password harus mengandung angka' };
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?]/.test(password)) {
        return { isValid: false, message: 'Password harus mengandung karakter khusus (!@#$%^&*)' };
    }
    
    return { isValid: true };
}

// GET
export async function GET(request: NextRequest) {
    try {
        await verifyAdminToken(request);
        
        const adminsSnapshot = await adminDb.collection('admin').get();
        const admins = adminsSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                uid: doc.id,
                nama: data.nama,
                email: data.email,
                role: data.role,
                last_access: data.last_access?.toDate?.()?.toISOString() || null,
                created_at: data.created_at?.toDate?.()?.toISOString() || null,
            };
        });

        return NextResponse.json({
            success: true,
            data: admins
        });

    } catch (error) {
        console.error('Error getting admins:', error);
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : 'Gagal mengambil data admin'
            },
            { status: 401 }
        );
    }
}

// POST
export async function POST(request: NextRequest) {
    try {
        const admin = await verifyAdminToken(request);
        const body: CreateAdminRequest = await request.json();

        if (!body.email || !body.password || !body.nama || !body.role) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Email, password, nama, dan role harus diisi'
                },
                { status: 400 }
            );
        }

        if (body.role !== 'admin') {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Role harus admin'
                },
                { status: 400 }
            );
        }

        if (body.password.length < 6) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Password minimal 6 karakter'
                },
                { status: 400 }
            );
        }

        try {
            await adminAuth.getUserByEmail(body.email);
            return NextResponse.json(
                {
                    success: false,
                    message: 'Email sudah terdaftar'
                },
                { status: 400 }
            );
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'code' in error && error.code !== 'auth/user-not-found') {
                throw error;
            }
        }

        const newUser = await adminAuth.createUser({
            email: body.email,
            password: body.password,
            displayName: body.nama,
        });

        const adminData = {
            nama: body.nama,
            email: body.email,
            role: body.role,
            created_at: new Date(),
            created_by: admin.uid,
            last_access: null,
        };

        await adminDb.collection('admin').doc(newUser.uid).set(adminData);

        await AdminLogHelpers.createAdmin(
            admin.uid,
            admin.nama,
            newUser.uid,
            body.nama
        );

        return NextResponse.json({
            success: true,
            message: 'Admin berhasil dibuat',
            data: {
                uid: newUser.uid,
                nama: body.nama,
                email: body.email,
                role: body.role,
            }
        });

    } catch (error) {
        console.error('Error creating admin:', error);
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : 'Gagal membuat admin'
            },
            { status: 500 }
        );
    }
}

// PUT
export async function PUT(request: NextRequest) {
    try {
        const admin = await verifyAdminToken(request);
        const body: UpdatePasswordRequest = await request.json();

        if (!body.targetUid || !body.newPassword) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Target UID dan password baru harus diisi'
                },
                { status: 400 }
            );
        }

        if (admin.uid !== body.targetUid) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Anda hanya bisa mengubah password sendiri'
                },
                { status: 403 }
            );
        }

        const passwordValidation = validatePasswordStrength(body.newPassword);
        if (!passwordValidation.isValid) {
            return NextResponse.json(
                {
                    success: false,
                    message: passwordValidation.message
                },
                { status: 400 }
            );
        }

        await adminAuth.updateUser(body.targetUid, {
            password: body.newPassword
        });

        await adminDb.collection('admin').doc(body.targetUid).update({
            updated_at: new Date(),
            password_changed_at: new Date()
        });

        try {
            await AdminLogHelpers.updateAdmin(admin.uid, admin.nama);
        } catch (logError) {
            console.warn('Failed to log password change:', logError);
        }

        return NextResponse.json({
            success: true,
            message: 'Password berhasil diubah'
        });

    } catch (error) {
        console.error('Error updating password:', error);
        
        if (error instanceof Error) {
            if (error.message.includes('user-not-found')) {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'Admin tidak ditemukan'
                    },
                    { status: 404 }
                );
            }
            
            if (error.message.includes('invalid-password')) {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'Format password tidak valid'
                    },
                    { status: 400 }
                );
            }
            
            return NextResponse.json(
                {
                    success: false,
                    message: error.message
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                message: 'Gagal mengubah password'
            },
            { status: 500 }
        );
    }
}

// DELETE
export async function DELETE(request: NextRequest) {
    try {
        const admin = await verifyAdminToken(request);
        const { searchParams } = new URL(request.url);
        const targetUid = searchParams.get('uid');

        if (!targetUid) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'UID admin harus diisi'
                },
                { status: 400 }
            );
        }

        if (admin.uid !== targetUid) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Anda hanya bisa menghapus akun sendiri'
                },
                { status: 403 }
            );
        }

        const adminDoc = await adminDb.collection('admin').doc(targetUid).get();
        const adminToDelete = adminDoc.data();
        await adminAuth.deleteUser(targetUid);
        await adminDb.collection('admin').doc(targetUid).delete();

        if (adminToDelete) {
            await AdminLogHelpers.deleteAdmin(
                admin.uid,
                admin.nama,
                targetUid,
                adminToDelete.nama
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Admin berhasil dihapus'
        });

    } catch (error) {
        console.error('Error deleting admin:', error);
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : 'Gagal menghapus admin'
            },
            { status: 500 }
        );
    }
}