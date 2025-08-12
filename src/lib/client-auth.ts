"use client";
import { auth } from "@/lib/firebase";

export async function requireIdToken() {
    const u = auth.currentUser;
    if (!u) throw new Error("Belum login.");
    return u.getIdToken(/* forceRefresh */ true);
}

export function onAuth(cb: (user: import("firebase/auth").User | null) => void) {
    return auth.onAuthStateChanged(cb);
}