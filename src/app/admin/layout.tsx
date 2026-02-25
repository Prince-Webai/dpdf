import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Toaster } from "@/components/ui/toaster"
export const dynamic = 'force-dynamic'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen bg-black text-white">
            <AdminSidebar />
            <main className="flex-1 ml-64 p-8 relative">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
                <Toaster />
            </main>
        </div>
    )
}
