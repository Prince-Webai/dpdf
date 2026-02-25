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
    const [isDevExpanded, setIsDevExpanded] = useState(true)

    const handleLogout = async () => {
        setIsLoggingOut(true)
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    const devItems = [
        { name: 'API Keys', href: '/dashboard/api-keys', icon: Key },
        { name: 'Usage Logs', href: '/dashboard/usage', icon: BarChart3 },
        { name: 'Extract Sandbox', href: '/dashboard/tools/extract', icon: FileText },
        { name: 'Documentation', href: '/docs', icon: BookOpen },
    ]

    // Determine if any nested developer item is active
    const isAnyDevItemActive = devItems.some(item => pathname === item.href)

    return (
        <div className="w-64 border-r border-white/5 bg-[#12121f] h-screen fixed left-0 top-0 flex flex-col">
            <div className="p-6">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white">
                    <FileText className="h-6 w-6 text-indigo-500" />
                    <span>DocuNexu</span>
                </Link>
            </div>

            <nav className="flex-1 space-y-6 overflow-y-auto pt-4 pb-6">
                <div>
                    <h3 className="px-6 text-[11px] font-semibold text-[#6b7280] uppercase tracking-[0.15em] mb-3">User Section</h3>
                    <div className="space-y-1">

                        {/* 1. Profile Overview */}
                        <div className="px-3">
                            <Link href="/dashboard" className={cn(
                                "flex items-center gap-3 px-[20px] py-[10px] rounded-md transition-colors font-medium",
                                (pathname === '/dashboard')
                                    ? "bg-[rgba(99,102,241,0.15)] text-[#818cf8]"
                                    : "text-[#c4c9d4] hover:bg-white/5 hover:text-white"
                            )}>
                                <UserIcon className="h-4 w-4" />
                                <span className="text-[14px]">Profile Overview</span>
                            </Link>
                        </div>

                        {/* 2. Settings */}
                        <div className="px-3">
                            <Link href="/dashboard/settings" className={cn(
                                "flex items-center gap-3 px-[20px] py-[10px] rounded-md transition-colors font-medium",
                                (pathname === '/dashboard/settings')
                                    ? "bg-[rgba(99,102,241,0.15)] text-[#818cf8]"
                                    : "text-[#c4c9d4] hover:bg-white/5 hover:text-white"
                            )}>
                                <Settings className="h-4 w-4" />
                                <span className="text-[14px]">Settings</span>
                            </Link>
                        </div>

                        {/* 3. Developer Settings (Collapsible Parent) */}
                        <div className="px-3">
                            <button
                                onClick={() => setIsDevExpanded(!isDevExpanded)}
                                className={cn(
                                    "w-full flex items-center justify-between px-[20px] py-[10px] rounded-md transition-colors font-medium",
                                    isAnyDevItemActive && !isDevExpanded
                                        ? "bg-white/5 text-[#818cf8]"
                                        : "text-[#c4c9d4] hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <LayoutDashboard className="h-4 w-4" />
                                    <span className="text-[14px]">Developer Settings</span>
                                </div>
                                <svg
                                    className={cn("w-4 h-4 transition-transform duration-200", isDevExpanded ? "rotate-180" : "")}
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Nested Children */}
                            <div className={cn(
                                "overflow-hidden transition-all text-sm mt-1",
                                isDevExpanded ? "block" : "hidden"
                            )}>
                                <div className="space-y-1 py-1">
                                    {devItems.map((item) => {
                                        const isActive = pathname === item.href
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={cn(
                                                    "flex items-center gap-3 py-[8px] pr-[20px] transition-colors",
                                                    // Indent of ~16px inside the active border
                                                    "pl-[36px]",
                                                    isActive
                                                        ? "bg-[rgba(99,102,241,0.15)] text-[#818cf8] border-l-2 border-[#6366f1]"
                                                        : "text-[#a0a6b3] hover:bg-white/5 hover:text-white border-l-2 border-transparent"
                                                )}
                                            >
                                                <item.icon className="h-3.5 w-3.5" />
                                                <span className="text-[13px]">{item.name}</span>
                                            </Link>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </nav>

            <div className="p-4 border-t border-white/5">
                <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex items-center gap-3 px-5 py-2.5 rounded-md text-sm text-[#c4c9d4] hover:bg-white/5 hover:text-white w-full transition-colors disabled:opacity-50"
                >
                    <LogOut className="h-4 w-4" />
                    {isLoggingOut ? 'Signing out...' : 'Sign out'}
                </button>
            </div>
        </div>
    )
}
