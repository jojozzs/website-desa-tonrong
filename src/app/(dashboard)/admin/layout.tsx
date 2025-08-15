import { ReactNode } from "react";
import Guard from "@/components/Dashboard/Guard";
import Sidebar from "@/components/Dashboard/Sidebar";

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <Guard>
            <div className="min-h-screen bg-green-50">
                <Sidebar />
                <main className="ml-64 p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </Guard>
    );
}