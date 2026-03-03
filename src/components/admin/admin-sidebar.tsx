'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { FileText, LayoutDashboard, Users, Key, LogOut, ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'

export function AdminSidebar() {
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
        { name: 'PLATFORM OVERVIEW', href: '/admin', icon: LayoutDashboard },
        { name: 'MANAGE USERS', href: '/admin/users', icon: Users },
        { name: 'AUDIT API KEYS', href: '/admin/api-keys', icon: Key },
    ]

    return (
        <div className="w-64 border-r border-white/[0.05] bg-executive-black h-screen fixed left-0 top-0 flex flex-col font-mono uppercase tracking-widest text-[10px] z-50">
            <div className="p-8 border-b border-white/[0.05]">
                <Link href="/" className="flex items-center gap-2 group font-serif normal-case tracking-normal">
                    <ShieldAlert className="text-red-500 w-6 h-6 stroke-[1px] group-hover:rotate-12 transition-transform duration-700" />
                    <span className="text-xl font-medium text-white tracking-tight group-hover:text-red-500 transition-colors">docunexusS ADMIN</span>
                </Link>
            </div>

            <nav className="flex-1 overflow-y-auto py-8">
                <div className="space-y-8">
                    <div>
                        <h3 className="px-8 text-white/40 text-[9px] font-bold mb-4">ADMINISTRATIVE PROTOCOLS</h3>
                        <div className="space-y-px">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-4 px-8 py-3 transition-all relative group",
                                            isActive
                                                ? "bg-white/[0.05] text-red-500"
                                                : "text-white/60 hover:bg-white/[0.02] hover:text-white"
                                        )}
                                    >
                                        {isActive && (
                                            <div className="absolute right-0 top-0 h-full w-[2px] bg-red-500" />
                                        )}
                                        <item.icon className="h-3.5 w-3.5" />
                                        <span>{item.name}</span>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </nav>

            <div className="p-8 border-t border-white/[0.05]">
                <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex items-center gap-4 text-white/40 hover:text-red-500 transition-colors disabled:opacity-50"
                >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>{isLoggingOut ? 'TERMINATING...' : 'TERMINATE SYSTEM ACCESS'}</span>
                </button>
            </div>
        </div>
    )
}
