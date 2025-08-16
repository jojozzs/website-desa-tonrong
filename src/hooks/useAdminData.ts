import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { EmailAuthProvider, onAuthStateChanged, reauthenticateWithCredential, updatePassword, User } from "firebase/auth";

export interface AdminData {
    uid: string;
    nama: string;
    email: string;
    role: "admin" | "superadmin";
    last_access?: Date | null;
}

export function useAdminData() {
    const [admin, setAdmin] = useState<AdminData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user: User | null) => {
            if (!user) {
                setAdmin(null);
                setLoading(false);
                return;
            }

            try {
                const ref = doc(db, "admin", user.uid);
                const snap = await getDoc(ref);

                if (!snap.exists()) {
                    setError("Data admin tidak ditemukan.");
                    setAdmin(null);
                } else {
                    const data = snap.data();
                    setAdmin({
                        uid: user.uid,
                        nama: data.nama,
                        email: data.email,
                        role: data.role,
                        last_access: data.last_access?.toDate?.() ?? null,
                    });
                }
            } catch (err) {
                console.error("Gagal mengambil data admin:", err);
                setError("Gagal mengambil data admin.");
                setAdmin(null);
            } finally {
                setLoading(false);
            }
        });

        return () => unsub();
    }, []);

    const updateAdminProfile = async (nama: string) => {
        if (!admin) throw new Error('User tidak terautentikasi');
        
        try {
            const adminDocRef = doc(db, 'admin', admin.uid);
            await updateDoc(adminDocRef, {
                nama: nama,
                last_access: serverTimestamp()
            });
            
            return { success: true, message: 'Profil berhasil diperbarui!' };
        } catch (error) {
            console.error('Error updating profile:', error);
            throw new Error('Gagal memperbarui profil');
        }
    };

    const changePassword = async (currentPassword: string, newPassword: string) => {
        const user = auth.currentUser;
        if (!user) throw new Error('User tidak terautentikasi');
        
        try {
            // Re-authenticate user terlebih dahulu
            const credential = EmailAuthProvider.credential(user.email!, currentPassword);
            await reauthenticateWithCredential(user, credential);
            
            // Update password
            await updatePassword(user, newPassword);
            
            // Update timestamp di Firestore
            const adminDocRef = doc(db, 'admin', user.uid);
            await updateDoc(adminDocRef, {
                last_access: serverTimestamp()
            });
            
            return { success: true, message: 'Password berhasil diubah!' };
        } catch (error: unknown) {
            console.error('Error changing password:', error);
            if (error && typeof error === 'object' && 'code' in error) {
                const firebaseError = error as { code: string };
                if (firebaseError.code === 'auth/wrong-password') {
                    throw new Error('Password lama tidak benar');
                } else if (firebaseError.code === 'auth/weak-password') {
                    throw new Error('Password terlalu lemah');
                } else {
                    throw new Error('Gagal mengubah password');
                }
            } else {
                throw new Error('Gagal mengubah password');
            }
        }
    };

    return { admin, loading, error, updateAdminProfile, changePassword };
}