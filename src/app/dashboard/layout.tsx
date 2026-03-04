import { Toaster } from "@/components/ui/toaster"
import { TopNavHeader } from "@/components/top-nav-header"

export const dynamic = 'force-dynamic'


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen bg-executive-black text-white selection:bg-executive-gold selection:text-black relative flex-col">
            <div className="executive-grain" />

            <TopNavHeader />

            <main className="flex-1 pt-32 pb-24 px-8 md:px-16 max-w-[1920px] mx-auto w-full relative z-10">
                {children}
            </main>
        </div>
    )
}
