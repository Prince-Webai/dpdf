import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
export const revalidate = 0

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.app_metadata?.role !== 'admin') {
        redirect('/dashboard')
    }

    return (
        <div className="flex min-h-screen bg-black text-white relative flex-col md:flex-row">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[120px]" />
            </div>
            <AdminSidebar />
            <main className="flex-1 ml-64 p-8 md:p-12 relative z-10">
                <div className="max-w-[1920px] mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    )
}
