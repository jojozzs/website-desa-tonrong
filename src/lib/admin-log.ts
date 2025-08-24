import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { AdminLogKategoriEnum } from './enums';

interface AdminLogData {
    admin_id: string;
    admin_nama: string;
    kategori: AdminLogKategoriEnum;
    deskripsi: string;
    detail?: Record<string, unknown>;
}

const kategoriToEntitasMap: Record<AdminLogKategoriEnum, string> = {
    [AdminLogKategoriEnum.CREATE_PROFIL]: "profil",
    [AdminLogKategoriEnum.UPDATE_PROFIL]: "profil",
    [AdminLogKategoriEnum.DELETE_PROFIL]: "profil",

    [AdminLogKategoriEnum.CREATE_BERITA_DAN_PENGUMUMAN]: "berita_dan_pengumuman",
    [AdminLogKategoriEnum.UPDATE_BERITA_DAN_PENGUMUMAN]: "berita_dan_pengumuman",
    [AdminLogKategoriEnum.DELETE_BERITA_DAN_PENGUMUMAN]: "berita_dan_pengumuman",

    [AdminLogKategoriEnum.CREATE_GALERI]: "galeri",
    [AdminLogKategoriEnum.UPDATE_GALERI]: "galeri",
    [AdminLogKategoriEnum.DELETE_GALERI]: "galeri",

    [AdminLogKategoriEnum.CREATE_PRODUK_UNGGULAN]: "produk_unggulan",
    [AdminLogKategoriEnum.UPDATE_PRODUK_UNGGULAN]: "produk_unggulan",
    [AdminLogKategoriEnum.DELETE_PRODUK_UNGGULAN]: "produk_unggulan",

    [AdminLogKategoriEnum.UPDATE_KONTAK_DESA]: "kontak",
    [AdminLogKategoriEnum.UPDATE_ASPIRASI_FORM]: "aspirasi",
    [AdminLogKategoriEnum.DELETE_ASPIRASI_FORM]: "aspirasi",

    [AdminLogKategoriEnum.CREATE_LINK_WEB]: "link_web",
    [AdminLogKategoriEnum.UPDATE_LINK_WEB]: "link_web",
    [AdminLogKategoriEnum.DELETE_LINK_WEB]: "link_web",
    
    [AdminLogKategoriEnum.UPDATE_ADMIN]: "admin",
    [AdminLogKategoriEnum.CREATE_ADMIN]: "admin",
    [AdminLogKategoriEnum.DELETE_ADMIN]: "admin",
    [AdminLogKategoriEnum.LOGIN]: "admin",
    [AdminLogKategoriEnum.LOGOUT]: "admin",
};

function getEntitasFromKategori(kategori: AdminLogKategoriEnum): string {
    return kategoriToEntitasMap[kategori] || "lainnya";
}

export async function createAdminLog(data: AdminLogData) {
    try {
        const entitas = getEntitasFromKategori(data.kategori);

        const entitas_id_key = `${entitas}_id`;
        const entitas_id = data.detail && entitas_id_key in data.detail
            ? String(data.detail[entitas_id_key])
            : null;

        const logData: Record<string, unknown> = {
            ...data,
            entitas,
            timestamp: serverTimestamp(),
        };

        if (entitas_id) {
            logData.entitas_id = entitas_id;
        }

        await addDoc(collection(db, 'admin-logs'), logData);
    } catch (error) {
        console.error('Error creating admin log:', error);
    }
}

export const AdminLogHelpers = {
    login: (admin_id: string, admin_name: string) => 
        createAdminLog({
            admin_id,
            admin_nama: admin_name,
            kategori: AdminLogKategoriEnum.LOGIN,
            deskripsi: `${admin_name} telah login`,
        }),

    logout: (admin_id: string, admin_name: string) => 
        createAdminLog({
            admin_id,
            admin_nama: admin_name,
            kategori: AdminLogKategoriEnum.LOGOUT,
            deskripsi: `${admin_name} telah logout`,
        }),

    createProfil: (admin_id: string, admin_name: string, profil_id: string, judul: string) => 
        createAdminLog({
            admin_id,
            admin_nama: admin_name,
            kategori: AdminLogKategoriEnum.CREATE_PROFIL,
            deskripsi: `${admin_name} membuat profil: ${judul}`,
            detail: { profil_id, judul },
        }),

    updateProfil: (admin_id: string, admin_name: string, profil_id: string, judul: string) => 
        createAdminLog({
            admin_id,
            admin_nama: admin_name,
            kategori: AdminLogKategoriEnum.UPDATE_PROFIL,
            deskripsi: `${admin_name} mengupdate profil: ${judul}`,
            detail: { profil_id, judul },
        }),

    deleteProfil: (admin_id: string, admin_name: string, profil_id: string, judul: string) => 
        createAdminLog({
            admin_id,
            admin_nama: admin_name,
            kategori: AdminLogKategoriEnum.DELETE_PROFIL,
            deskripsi: `${admin_name} menghapus profil: ${judul}`,
            detail: { profil_id, judul },
        }),

    createBerita: (admin_id: string, admin_name: string, berita_id: string, judul: string, kategori: string) => 
        createAdminLog({
            admin_id,
            admin_nama: admin_name,
            kategori: AdminLogKategoriEnum.CREATE_BERITA_DAN_PENGUMUMAN,
            deskripsi: `${admin_name} membuat ${kategori}: ${judul}`,
            detail: { berita_id, judul, kategori },
        }),

    updateBerita: (admin_id: string, admin_name: string, berita_id: string, judul: string, kategori: string) => 
        createAdminLog({
            admin_id,
            admin_nama: admin_name,
            kategori: AdminLogKategoriEnum.UPDATE_BERITA_DAN_PENGUMUMAN,
            deskripsi: `${admin_name} mengupdate ${kategori}: ${judul}`,
            detail: { berita_id, judul, kategori },
        }),

    deleteBerita: (admin_id: string, admin_name: string, berita_id: string, judul: string, kategori: string) => 
        createAdminLog({
            admin_id,
            admin_nama: admin_name,
            kategori: AdminLogKategoriEnum.DELETE_BERITA_DAN_PENGUMUMAN,
            deskripsi: `${admin_name} menghapus ${kategori}: ${judul}`,
            detail: { berita_id, judul, kategori },
        }),

    createGaleri: (admin_id: string, admin_name: string, galeri_id: string, judul: string) => 
        createAdminLog({
            admin_id,
            admin_nama: admin_name,
            kategori: AdminLogKategoriEnum.CREATE_GALERI,
            deskripsi: `${admin_name} menambah galeri: ${judul}`,
            detail: { galeri_id, judul },
        }),

    updateGaleri: (admin_id: string, admin_name: string, galeri_id: string, judul: string) => 
        createAdminLog({
            admin_id,
            admin_nama: admin_name,
            kategori: AdminLogKategoriEnum.UPDATE_GALERI,
            deskripsi: `${admin_name} mengupdate galeri: ${judul}`,
            detail: { galeri_id, judul },
        }),

    deleteGaleri: (admin_id: string, admin_name: string, galeri_id: string, judul: string) => 
        createAdminLog({
            admin_id,
            admin_nama: admin_name,
            kategori: AdminLogKategoriEnum.DELETE_GALERI,
            deskripsi: `${admin_name} menghapus galeri: ${judul}`,
            detail: { galeri_id, judul },
        }),

    createProdukUnggulan: (admin_id: string, admin_name: string, produk_id: string, judul: string) => 
        createAdminLog({
            admin_id,
            admin_nama: admin_name,
            kategori: AdminLogKategoriEnum.CREATE_PRODUK_UNGGULAN,
            deskripsi: `${admin_name} menambah produk unggulan: ${judul}`,
            detail: { produk_id, judul },
        }),

    updateProdukUnggulan: (admin_id: string, admin_name: string, produk_id: string, judul: string) => 
        createAdminLog({
            admin_id,
            admin_nama: admin_name,
            kategori: AdminLogKategoriEnum.UPDATE_PRODUK_UNGGULAN,
            deskripsi: `${admin_name} mengupdate produk unggulan: ${judul}`,
            detail: { produk_id, judul },
        }),

    deleteProdukUnggulan: (admin_id: string, admin_name: string, produk_id: string, judul: string) => 
        createAdminLog({
            admin_id,
            admin_nama: admin_name,
            kategori: AdminLogKategoriEnum.DELETE_PRODUK_UNGGULAN,
            deskripsi: `${admin_name} menghapus produk unggulan: ${judul}`,
            detail: { produk_id, judul },
        }),

    updateKontak: (admin_id: string, admin_name: string) => 
        createAdminLog({
            admin_id,
            admin_nama: admin_name,
            kategori: AdminLogKategoriEnum.UPDATE_KONTAK_DESA,
            deskripsi: `${admin_name} mengupdate kontak desa`,
        }),

    updateLinkWeb: (admin_id: string, admin_name: string, nama: string, link: string) => 
        createAdminLog({
            admin_id,
            admin_nama: admin_name,
            kategori: AdminLogKategoriEnum.UPDATE_LINK_WEB,
            deskripsi: `${admin_name} mengupdate link web: ${nama}`,
            detail: { nama, link },
        }),

    createLinkWeb: (admin_id: string, admin_name: string, nama_web: string, url: string) => 
        createAdminLog({
            admin_id,
            admin_nama: admin_name,
            kategori: AdminLogKategoriEnum.CREATE_LINK_WEB,
            deskripsi: `${admin_name} menambahkan link web: ${nama_web}`,
            detail: { nama_web, url },
        }),

    deleteLinkWeb: (admin_id: string, admin_name: string, nama_web: string) => 
        createAdminLog({
            admin_id,
            admin_nama: admin_name,
            kategori: AdminLogKategoriEnum.DELETE_LINK_WEB,
            deskripsi: `${admin_name} menghapus link web: ${nama_web}`,
            detail: { nama_web },
        }),

    updateAspirasi: (admin_id: string, admin_name: string, aspirasi_id: string, status: string) => 
        createAdminLog({
            admin_id,
            admin_nama: admin_name,
            kategori: AdminLogKategoriEnum.UPDATE_ASPIRASI_FORM,
            deskripsi: `${admin_name} mengubah status aspirasi menjadi ${status}`,
            detail: { aspirasi_id, status },
        }),

    deleteAspirasi: (admin_id: string, admin_name: string, aspirasi_id: string) => 
        createAdminLog({
            admin_id,
            admin_nama: admin_name,
            kategori: AdminLogKategoriEnum.DELETE_ASPIRASI_FORM,
            deskripsi: `${admin_name} menghapus aspirasi`,
            detail: { aspirasi_id },
        }),

    updateAdmin: (admin_id: string, admin_name: string) => 
        createAdminLog({
            admin_id,
            admin_nama: admin_name,
            kategori: AdminLogKategoriEnum.UPDATE_ADMIN,
            deskripsi: `${admin_name} mengupdate admin`,
        }),
};