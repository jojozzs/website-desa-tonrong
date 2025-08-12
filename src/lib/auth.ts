import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { Admin } from "./types";

export async function loginAdmin(email: string, password: string) {
    try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const uid = cred.user.uid;
        const ref = doc(db, "admin", uid);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
            await signOut(auth);
            throw new Error("Akun belum terdaftar sebagai admin.");
        }

        const admin = snap.data() as Admin;
        if (admin.role !== "admin") {
            await signOut(auth);
            throw new Error("Bukan admin.");
        }
        await updateDoc(ref, { last_access: serverTimestamp() });
        
        return {
            uid,
            nama: admin.nama,
            email: admin.email,
            role: admin.role,
        };
    } catch (err: unknown) {
        const code = err && typeof err === 'object' && 'code' in err ? (err as { code: string }).code : "";
        if (code === "auth/invalid-credential" || code === "auth/wrong-password") {
            throw new Error("Email atau password salah.");
        }
        if (code === "auth/user-not-found") {
            throw new Error("Akun tidak ditemukan.");
        }
        const message = err && typeof err === 'object' && 'message' in err ? (err as { message: string }).message : "Gagal login.";
        throw new Error(message || "Gagal login.");
    }
}

export async function logoutAdmin() {
    await signOut(auth);
}