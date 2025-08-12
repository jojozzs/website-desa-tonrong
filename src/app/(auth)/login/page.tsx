"use client";
import { JSX, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { loginAdmin } from "@/lib/auth";
import { auth } from "@/lib/firebase";

function getErrorMessage(err: unknown): string {
    if (err instanceof Error) return err.message;
    if (typeof err === "object" && err !== null && "message" in err) {
        const m = (err as { message?: unknown }).message;
        if (typeof m === "string") return m;
    }
    return "Gagal login.";
}

export default function LoginPage(): JSX.Element {
    const router = useRouter();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u: User | null) => {
            if (u) router.replace("/admin");
        });
        return unsub;
    }, [router]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            await loginAdmin(email.trim(), password);
            router.replace("/admin");
        } catch (err: unknown) {
            setError(getErrorMessage(err));
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <main style={{ maxWidth: 360, margin: "64px auto", display: "grid", gap: 16 }}>
            <h1>Login Admin</h1>

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
                <label style={{ display: "grid", gap: 4 }}>
                    <span>Email</span>
                    <input
                        type="email"
                        inputMode="email"
                        autoComplete="username"
                        value={email}
                        onChange={(e) => setEmail(e.currentTarget.value)}
                        required
                    />
                </label>

                <label style={{ display: "grid", gap: 4 }}>
                    <span>Password</span>
                    <input
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.currentTarget.value)}
                        required
                    />
                </label>

                <button type="submit" disabled={submitting}>
                    {submitting ? "Masuk..." : "Masuk"}
                </button>

                {error && (
                    <p role="alert" style={{ color: "crimson" }}>
                        {error}
                    </p>
                )}
            </form>

            <p style={{ fontSize: 12, opacity: 0.7 }}>
                * Tidak ada lupa/reset password. Hanya 1 admin aktif untuk sekarang.
            </p>
        </main>
    );
}