import Guard from "@/components/Dashboard/Guard";
import Sidebar from "@/components/Dashboard/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <Guard>
            <div style={{display:"flex",minHeight:"100vh"}}>
                <Sidebar />
                <div style={{flex:1,padding:16}}>{children}</div>
            </div>
        </Guard>
    );
}