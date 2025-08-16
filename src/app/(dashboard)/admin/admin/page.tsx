"use client"
import { useAdminData } from "@/hooks/useAdminData";

export default function AdminPage() {
    const { admin, loading, error } = useAdminData();

  if (loading) return <p>Memuat data admin...</p>;
  if (error) return <p>{error}</p>;
  if (!admin) return <p>Anda belum login sebagai admin.</p>;

  return (
    <div>
      <h1>Selamat datang, {admin.nama}!</h1>
      <p>Email: {admin.email}</p>
      <p>Role: {admin.role}</p>
    </div>
  );
}