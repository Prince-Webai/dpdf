'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { FileText, LayoutDashboard, Key, BarChart3, Settings, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'

export function DashboardSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    const handleLogout = async () => {
        setIsLoggingOut(true)
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    const navItems = [
        { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
        { name: 'API Keys', href: '/dashboard/api-keys', icon: Key },
        { name: 'Usage', href: '/dashboard/usage', icon: BarChart3 },
        { name: 'Extract Sandbox', href: '/dashboard/tools/extract', icon: FileText },
        { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    ]

    return (
        <div className="w-64 border-r border-white/10 bg-[#0a0a0a] h-screen fixed left-0 top-0 flex flex-col">
            <div className="p-6">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white">
                    <FileText className="h-6 w-6 text-indigo-500" />
                    <span>DocuNexu</span>
                </Link>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                                isActive
                                    ? "bg-indigo-500/10 text-indigo-400 font-medium"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-white/10">
                <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-400 hover:bg-white/5 hover:text-white w-full transition-colors disabled:opacity-50"
                >
                    <LogOut className="h-4 w-4" />
                    {isLoggingOut ? 'Signing out...' : 'Sign out'}
                </button>
            </div>
        </div>
    )
}
