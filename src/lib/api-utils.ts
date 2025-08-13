import { NextRequest } from 'next/server';

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export function createSuccessResponse<T>(data: T, message?: string): ApiResponse<T> {
    return {
        success: true,
        data,
        ...(message && { message })
    };
}

export function createErrorResponse(error: string, statusCode?: number): { response: ApiResponse; status: number } {
    return {
        response: {
            success: false,
            error
        },
        status: statusCode || 500
    };
}

export async function validateRequiredFields(body: Record<string, unknown>, requiredFields: string[]): Promise<string | null> {
    for (const field of requiredFields) {
        if (!body[field]) {
            return `Field '${field}' is required`;
        }
    }
    return null;
}

export async function validateFileUpload(file: File, allowedTypes: string[], maxSize: number): Promise<string | null> {
    if (!file) {
        return 'File is required';
    }

    if (file.size > maxSize) {
        return `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`;
    }

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !allowedTypes.includes(fileExtension)) {
        return `File type must be one of: ${allowedTypes.join(', ')}`;
    }

    return null;
}

export function parseFormData(formData: FormData): Record<string, string | File> {
    const data: Record<string, string | File> = {};
    
    for (const [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    return data;
}

export async function handleApiError(error: unknown, context: string): Promise<never> {
    console.error(`Error in ${context}:`, error);
    
    // Type guard untuk Firebase error
    if (typeof error === 'object' && error !== null && 'code' in error) {
        const firebaseError = error as { code: string };
        
        if (firebaseError.code === 'permission-denied') {
            throw new Error('Permission denied');
        }
        
        if (firebaseError.code === 'not-found') {
            throw new Error('Resource not found');
        }
    }
    
    throw new Error(`Failed to ${context.toLowerCase()}`);
}

// Middleware untuk validasi admin
export async function validateAdmin(request: NextRequest): Promise<string | null> {
    try {
        const authHeader = request.headers.get('authorization');
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return 'Authorization header is required';
        }

        // const token = authHeader.split(' ')[1];
        // Di sini Anda bisa menambahkan validasi token Firebase
        // const decodedToken = await admin.auth().verifyIdToken(token);
        // return decodedToken.uid;

        // Untuk sementara return null jika tidak ada error
        return null;
    } catch {
        return 'Invalid token';
    }
}

// Helper untuk slug generation
export function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
        .trim();
}

// Helper untuk format tanggal
export function formatDateForFirestore(dateString: string): Date {
    return new Date(dateString);
}

// Constants
export const UPLOAD_LIMITS = {
    IMAGE_MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_IMAGE_TYPES: ['jpg', 'jpeg', 'png', 'webp'],
};

export const FIRESTORE_COLLECTIONS = {
    ADMIN: 'admin',
    ADMIN_LOGS: 'admin_logs',
    PROFIL: 'profil',
    BERITA_PENGUMUMAN: 'berita_pengumuman',
    GALERI: 'galeri',
    PRODUK_UNGGULAN: 'produk_unggulan',
    KONTAK_DESA: 'kontak_desa',
    ASPIRASI: 'aspirasi',
} as const;