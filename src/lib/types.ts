import { Timestamp } from "firebase/firestore";
import { BeritaKategoriEnum, ProfilKategoriEnum } from "./enums";

export interface Admin {
    id: string;
    nama: string;
    email: string;
    last_access: Date;
    profil: Profil[];
    beritaPengumuman: BeritaPengumuman[];
    galeri: Galeri[];
    produkUnggulan: ProdukUnggulan[];
    kontak: KontakDesa[];
    aspirasiForm: AspirasiForm[];
}

export interface BaseImageFields {
    gambar_url: string;
    gambar_id: string;
    gambar_size: number;
    gambar_type: string;
    gambar_width?: number;
    gambar_height?: number;
}

export interface Profil extends BaseImageFields {
    id: string;
    judul: string;
    deskripsi: string;
    kategori: ProfilKategoriEnum;
    created_at: Timestamp;
    updated_at: Timestamp;
    admin_id: string;
}

export interface BeritaPengumuman extends BaseImageFields {
    id: string;
    judul: string;
    deskripsi: string;
    tanggal: Date;
    penulis: string;
    kategori: BeritaKategoriEnum;
    slug: string;
    created_at: Timestamp;
    updated_at: Timestamp;
    admin_id: string;
}

export interface Galeri extends BaseImageFields {
    id: string;
    judul: string;
    deskripsi: string;
    created_at: Timestamp;
    updated_at: Timestamp;
    admin_id: string;
}

export interface ProdukUnggulan extends BaseImageFields {
    id: string;
    judul: string;
    deskripsi: string;
    nama_umkm: string;
    alamat_umkm: string;
    kontak_umkm: string;
    created_at: Timestamp;
    updated_at: Timestamp;
    admin_id: string;
}

export interface KontakDesa {
    id: string;
    alamat: string;
    nomor_telepon: string;
    nomor_whatsapp: string;
    email_desa: string;
    created_at: Timestamp;
    updated_at: Timestamp;
    admin_id: string;
}

export interface AspirasiForm {
    id: string;
    judul: string;
    nama: string;
    email: string;
    isi: string;
    status: 'pending' | 'done';
    created_at: Timestamp;
    updated_at: Timestamp;
    admin_id?: string;
}