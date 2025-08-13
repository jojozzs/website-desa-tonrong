"use client";
import { JSX, ReactNode, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function Guard({ children }: { children: ReactNode }): JSX.Element | null {
    const [ready, setReady] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u: User | null) => {
            if (!u) {
                router.replace("/login");
                return;
            }
            setReady(true);
        });
        return () => unsub();
    }, [router]);

    if (!ready) return null;
    return <>{children}</>;
}