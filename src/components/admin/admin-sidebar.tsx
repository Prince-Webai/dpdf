'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { FileText, LayoutDashboard, Users, Key, LogOut, ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { motion } from 'framer-motion'

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
        { name: 'Overview', href: '/admin', icon: LayoutDashboard },
        { name: 'Users', href: '/admin/users', icon: Users },
        { name: 'API Keys', href: '/admin/api-keys', icon: Key },
    ]

    return (
        <div className="w-64 border-r border-white/5 bg-[#050505]/95 backdrop-blur-xl h-screen fixed left-0 top-0 flex flex-col z-50 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-40 bg-blue-900/10 blur-3xl pointer-events-none" />

            <div className="p-6 relative z-10 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 font-bold text-xl text-white group">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/20 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                        <ShieldAlert className="h-4 w-4 text-blue-400" />
                    </div>
                    <span className="tracking-tight">Admin Console</span>
                </Link>
            </div>

            <nav className="flex-1 space-y-8 overflow-y-auto px-4 py-4 relative z-10 scrollbar-hide">
                <div>
                    <h3 className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Platform Admin</h3>
                    <div className="space-y-1 relative">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="block relative"
                                >
                                    <div className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm relative z-10 group",
                                        isActive ? "text-blue-50" : "text-gray-400 hover:text-white"
                                    )}>
                                        <item.icon className={cn("h-4 w-4 transition-colors", isActive ? "text-blue-400" : "text-gray-500 group-hover:text-gray-300")} />
                                        <span>{item.name}</span>
                                    </div>
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-sidebar-pill-admin"
                                            className="absolute inset-0 bg-blue-500/10 border border-blue-500/20 rounded-xl z-0 pointer-events-none shadow-[0_0_15px_rgba(59,130,246,0.05)]"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </nav>

            <div className="p-4 relative z-10 bg-gradient-to-t from-black to-transparent">
                <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white border border-transparent hover:border-white/10 w-full transition-all disabled:opacity-50 group hover:shadow-lg"
                >
                    {isLoggingOut ? (
                        <span className="animate-pulse">Signing out...</span>
                    ) : (
                        <>
                            <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1 text-gray-500 group-hover:text-red-400" />
                            Sign out
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}
