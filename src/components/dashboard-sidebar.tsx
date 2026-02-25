'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { FileText, LayoutDashboard, Key, BarChart3, Settings, LogOut, Code, User as UserIcon, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'

export function DashboardSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const [isDevMode, setIsDevMode] = useState(false)

    const handleLogout = async () => {
        setIsLoggingOut(true)
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    const userItems = [
        { name: 'Profile Overview', href: '/dashboard', icon: UserIcon },
        { name: 'Subscription', href: '/dashboard/settings', icon: Settings },
    ]

    const devItems = [
        { name: 'Developer Overview', href: '/dashboard?view=developer', icon: LayoutDashboard },
        { name: 'API Keys', href: '/dashboard/api-keys', icon: Key },
        { name: 'Usage Logs', href: '/dashboard/usage', icon: BarChart3 },
        { name: 'Extract Sandbox', href: '/dashboard/tools/extract', icon: FileText },
        { name: 'Documentation', href: '/docs', icon: BookOpen },
    ]

    const navItems = isDevMode ? devItems : userItems

    return (
        <div className="w-64 border-r border-white/10 bg-[#0a0a0a] h-screen fixed left-0 top-0 flex flex-col">
            <div className="p-6">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white">
                    <FileText className="h-6 w-6 text-indigo-500" />
                    <span>DocuNexu</span>
                </Link>
            </div>

            <div className="px-6 mb-6">
                <button
                    onClick={() => setIsDevMode(!isDevMode)}
                    className={cn(
                        "w-full flex items-center justify-between px-4 py-2 rounded-lg border transition-all duration-200 text-xs font-bold uppercase tracking-wider",
                        isDevMode
                            ? "bg-indigo-500/10 border-indigo-500/50 text-indigo-400"
                            : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                    )}
                >
                    <div className="flex items-center gap-2">
                        {isDevMode ? <Code className="h-3 w-3" /> : <UserIcon className="h-3 w-3" />}
                        {isDevMode ? 'Developer' : 'User'}
                    </div>
                    <span>Switch</span>
                </button>
            </div>

            <nav className="flex-1 px-4 space-y-2">
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
