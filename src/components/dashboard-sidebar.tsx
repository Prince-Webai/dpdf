'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { FileText, LayoutDashboard, Key, BarChart3, Settings, LogOut, Code, User as UserIcon, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { Pentagon } from 'lucide-react'

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

    const devItems = [
        { name: 'API KEYS', href: '/dashboard/api-keys', icon: Key },
        { name: 'USAGE LOGS', href: '/dashboard/usage', icon: BarChart3 },
        { name: 'EXTRACT SANDBOX', href: '/dashboard/tools/extract', icon: FileText },
        { name: 'DOCUMENTATION', href: '/docs', icon: BookOpen },
    ]

    return (
        <div className="w-64 border-r border-white/[0.05] bg-executive-black h-screen fixed left-0 top-0 flex flex-col font-mono uppercase tracking-widest text-[10px] z-50">
            <div className="p-8 border-b border-white/[0.05]">
                <Link href="/" className="flex items-center gap-2 group font-serif normal-case tracking-normal">
                    <Pentagon className="text-executive-gold w-6 h-6 stroke-[1px] group-hover:rotate-180 transition-transform duration-700" />
                    <span className="text-xl font-medium text-white tracking-tight group-hover:text-executive-gold transition-colors">docunexusS</span>
                </Link>
            </div>

            <nav className="flex-1 overflow-y-auto py-8">
                <div className="space-y-8">
                    <div>
                        <h3 className="px-8 text-white/40 text-[9px] font-bold mb-4">SYSTEM ARCHITECTURE</h3>
                        <div className="space-y-px">
                            <Link href="/dashboard" className={cn(
                                "flex items-center gap-4 px-8 py-3 transition-all relative group",
                                pathname === '/dashboard'
                                    ? "bg-white/[0.05] text-executive-gold"
                                    : "text-white/60 hover:bg-white/[0.02] hover:text-white"
                            )}>
                                {pathname === '/dashboard' && (
                                    <div className="absolute right-0 top-0 h-full w-[2px] bg-executive-gold" />
                                )}
                                <UserIcon className="h-3.5 w-3.5" />
                                <span>STRATEGIC OVERVIEW</span>
                            </Link>

                            <Link href="/dashboard/settings" className={cn(
                                "flex items-center gap-4 px-8 py-3 transition-all relative group",
                                pathname === '/dashboard/settings'
                                    ? "bg-white/[0.05] text-executive-gold"
                                    : "text-white/60 hover:bg-white/[0.02] hover:text-white"
                            )}>
                                {pathname === '/dashboard/settings' && (
                                    <div className="absolute right-0 top-0 h-full w-[2px] bg-executive-gold" />
                                )}
                                <Settings className="h-3.5 w-3.5" />
                                <span>PROTOCOL SETTINGS</span>
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="px-8 text-white/40 text-[9px] font-bold mb-4">DEVELOPER CONTROL</h3>
                        <div className="space-y-px">
                            {devItems.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-4 px-8 py-3 transition-all relative group",
                                            isActive
                                                ? "bg-white/[0.05] text-executive-gold"
                                                : "text-white/60 hover:bg-white/[0.02] hover:text-white"
                                        )}
                                    >
                                        {isActive && (
                                            <div className="absolute right-0 top-0 h-full w-[2px] bg-executive-gold" />
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
                    <span>{isLoggingOut ? 'TERMINATING...' : 'TERMINATE SESSION'}</span>
                </button>
            </div>
        </div>
    )
}
