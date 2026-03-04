<<<<<<< HEAD
import { Toaster } from "@/components/ui/toaster"
import { ProfileProvider } from "@/context/profile-context"
import { TopNavHeader } from "@/components/top-nav-header"

export const dynamic = 'force-dynamic'
=======
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { ProfileProvider } from "@/context/profile-context"
export const revalidate = 0
>>>>>>> 9d56d33 (feat: redesign dashboard with realtime intelligence and fluid UI)

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
<<<<<<< HEAD
        <div className="flex min-h-screen bg-executive-black text-white selection:bg-executive-gold selection:text-black relative flex-col">
            <div className="executive-grain" />

            <TopNavHeader />

            <main className="flex-1 pt-32 pb-24 px-8 md:px-16 max-w-[1920px] mx-auto w-full relative z-10">
                {children}
            </main>
            <Toaster />
        </div>
=======
        <ProfileProvider>
            <div className="flex min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30">
                {/* Subtle gradient overlay */}
                <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.05),transparent_50%)] pointer-events-none" />
                
                <DashboardSidebar />
                
                <main className="flex-1 lg:ml-72 p-4 md:p-8 relative w-full pt-24 lg:pt-10 transition-all duration-300">
                    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {children}
                    </div>
                </main>
            </div>
        </ProfileProvider>
>>>>>>> 9d56d33 (feat: redesign dashboard with realtime intelligence and fluid UI)
    )
}
