import { Timestamp } from "firebase/firestore";
import { BeritaPengumumanKategoriEnum, ProfilKategoriEnum } from "./enums";

export interface Admin {
    id: string;
    nama: string;
    email: string;
    role: "admin";
    last_access: Timestamp;
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

export interface ProfilWithContent extends Profil {
    konten?: string 
    data_tambahan?: {
    visi?: string
    misi?: string[]
    
    informasi_wilayah?: {
      luas_wilayah?: string
      kecamatan?: string
      kabupaten?: string
      provinsi?: string
      kode_pos?: string
    }
    koordinat?: {
      latitude?: string
      longitude?: string
      ketinggian?: string
      topografi?: string
    }
    batas_wilayah?: {
      utara?: string
      selatan?: string
      timur?: string
      barat?: string
    }
    
    pimpinan?: Array<{
      nama: string
      jabatan: string
      foto?: string
      periode?: string
    }>
    perangkat?: Array<{
      jabatan: string
      nama?: string
    } | string>
    tugas_fungsi?: Array<{
      jabatan: string
      deskripsi: string
    }>

    demografi?: {
      total_penduduk?: number
      total_kk?: number
      laki_laki?: number
      perempuan?: number
    }
    mata_pencaharian?: Array<{
      kategori: string
      persen: number
      jumlah?: number
    }>
    kelompok_umur?: Array<{
      kelompok: string
      jumlah: number
      persen: number
    }>
    agama?: Record<string, {
      persentase: number
      jumlah?: number
    }>
    idm?: {
      nilai: string
      status: string
      deskripsi?: string
    }
    
    [key: string]: any
  }
}

export interface BeritaPengumuman extends BaseImageFields {
    id: string;
    judul: string;
    deskripsi: string;
    tanggal: Date;
    penulis: string;
    kategori: BeritaPengumumanKategoriEnum;
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
    slug: string;
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