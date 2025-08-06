export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <main className="bg-[#344532] min-h-screen flex flex-col items-center justify-center p-4 text-center font-bold text-2xl">
                {children}
            </main>
        </div>
    );
}