import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";

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

    return { admin, loading, error };
}