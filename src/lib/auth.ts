import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";

export async function loginAdmin(email: string, password: string) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;

    const snap = await getDoc(doc(db, "admin", uid));
    if (!snap.exists() || snap.data().role !== "admin") {
        throw new Error("Bukan admin");
    }

    await updateDoc(doc(db, "admin", uid), { last_access: serverTimestamp() });

    return { uid, ...snap.data() };
}