export interface CloudinaryUploadResult {
    public_id: string;
    version: number;
    signature: string;
    width: number;
    height: number;
    format: string;
    resource_type: string;
    created_at: string;
    tags: string[];
    bytes: number;
    type: string;
    etag: string;
    placeholder: boolean;
    url: string;
    secure_url: string;
    folder: string;
    access_mode: string;
    original_filename: string;
}

export interface CloudinaryUploadOptions {
    resource_type?: string;
    folder?: string;
    transformation?: Array<{
        width?: number;
        height?: number;
        crop?: string;
    }>;
}