import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Toaster } from "@/components/ui/toaster"
import { ProfileProvider } from "@/context/profile-context"
export const dynamic = 'force-dynamic'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ProfileProvider>
            <div className="flex min-h-screen bg-black text-white">
                <DashboardSidebar />
                <main className="flex-1 ml-64 p-8 relative">
                    <div className="max-w-5xl mx-auto">
                        {children}
                    </div>
                    <Toaster />
                </main>
            </div>
        </ProfileProvider>
    )
}
