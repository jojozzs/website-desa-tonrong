import { getApps, initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

const apps = getApps();
if (!apps.length) {
    initializeApp({
        credential:
            process.env.FIREBASE_PRIVATE_KEY
                ? cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
                })
                : applicationDefault(),
    });
}

export const adminAuth = getAuth();
export const adminDb = getFirestore();
export const AdminFieldValue = FieldValue;