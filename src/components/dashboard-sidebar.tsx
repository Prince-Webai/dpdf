'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { FileText, LayoutDashboard, Key, BarChart3, Settings, LogOut, User as UserIcon, BookOpen, Menu, X, ChevronRight, Terminal, Database } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function DashboardSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const [isDevExpanded, setIsDevExpanded] = useState(true)
    const [isMobileOpen, setIsMobileOpen] = useState(false)

    const handleLogout = async () => {
        setIsLoggingOut(true)
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    const devItems = [
        { name: 'API Keys', href: '/dashboard/api-keys', icon: Key },
        { name: 'Usage Logs', href: '/dashboard/usage', icon: BarChart3 },
        { name: 'SQL Console', href: '/dashboard/sql', icon: Database },
        { name: 'Extract Sandbox', href: '/dashboard/tools/extract', icon: Terminal },
        { name: 'Documentation', href: '/docs', icon: BookOpen },
    ]

    const isAnyDevItemActive = devItems.some(item => pathname === item.href)

    const SidebarContent = () => (
        <>
            <div className="p-8">
                <Link href="/" className="flex items-center gap-3 group" onClick={() => setIsMobileOpen(false)}>
                    <div className="bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-2xl w-10 h-10 flex items-center justify-center font-bold text-lg shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                        D
                    </div>
                    <span className="font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">DocuNexu</span>
                </Link>
            </div>

            <nav className="flex-1 space-y-6 overflow-y-auto pt-2 pb-6 scrollbar-hide">
                <div className="px-4">
                    <h3 className="px-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4">Account</h3>
                    <div className="space-y-1.5">
                        <Link href="/dashboard" onClick={() => setIsMobileOpen(false)} className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group",
                            (pathname === '/dashboard')
                                ? "bg-indigo-600/10 text-indigo-400 ring-1 ring-indigo-500/20"
                                : "text-white/50 hover:bg-white/5 hover:text-white"
                        )}>
                            <UserIcon className={cn("h-4 w-4 transition-transform group-hover:scale-110", pathname === '/dashboard' ? "text-indigo-400" : "text-white/40")} />
                            <span className="text-[14px] font-medium">Overview</span>
                        </Link>
                    </div>
                </div>

                <div className="px-4">
                    <h3 className="px-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4">Management</h3>
                    <div className="space-y-1.5">
                        <Link href="/dashboard/settings" onClick={() => setIsMobileOpen(false)} className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group",
                            (pathname === '/dashboard/settings')
                                ? "bg-indigo-600/10 text-indigo-400 ring-1 ring-indigo-500/20"
                                : "text-white/50 hover:bg-white/5 hover:text-white"
                        )}>
                            <Settings className={cn("h-4 w-4 transition-transform group-hover:rotate-45", pathname === '/dashboard/settings' ? "text-indigo-400" : "text-white/40")} />
                            <span className="text-[14px] font-medium">Settings</span>
                        </Link>
                    </div>
                </div>

                <div className="px-4">
                    <button
                        onClick={() => setIsDevExpanded(!isDevExpanded)}
                        className={cn(
                            "w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300",
                            isAnyDevItemActive && !isDevExpanded
                                ? "bg-indigo-600/10 text-indigo-400 ring-1 ring-indigo-500/20"
                                : "text-white/50 hover:bg-white/5 hover:text-white"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <LayoutDashboard className="h-4 w-4" />
                            <span className="text-[14px] font-medium">Developer Tools</span>
                        </div>
                        <ChevronRight className={cn("w-4 h-4 transition-transform duration-300", isDevExpanded ? "rotate-90" : "")} />
                    </button>

                    <div className={cn(
                        "overflow-hidden transition-all duration-500 text-sm mt-1 space-y-1",
                        isDevExpanded ? "max-h-80 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                    )}>
                        {devItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-10 py-2.5 rounded-xl transition-all duration-300 group",
                                        isActive
                                            ? "text-indigo-400 bg-indigo-400/5 font-semibold"
                                            : "text-white/40 hover:text-white/80 hover:translate-x-1"
                                    )}
                                >
                                    <item.icon className={cn("h-3.5 w-3.5", isActive ? "text-indigo-400" : "text-white/20 group-hover:text-indigo-400/60")} />
                                    <span className="text-[13px]">{item.name}</span>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </nav>

            <div className="p-6 pt-4 border-t border-white/5 bg-gradient-to-b from-transparent to-white/5">
                <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex items-center justify-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-white/50 hover:bg-red-500/10 hover:text-red-400 w-full transition-all duration-300 disabled:opacity-50 ring-1 ring-transparent hover:ring-red-500/20 group"
                >
                    {isLoggingOut ? (
                        <span className="animate-pulse">Signing out...</span>
                    ) : (
                        <>
                            <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1 text-white/30 group-hover:text-red-400" />
                            Sign out
                        </>
                    )}
                </button>
            </div>
        </>
    )

    return (
        <>
            {/* Mobile Top Bar */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-20 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 z-50 flex items-center justify-between px-6">
                <Link href="/" className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-xl w-8 h-8 flex items-center justify-center font-bold text-sm">
                        D
                    </div>
                </Link>
                <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-2 text-white/70 hover:text-white transition-colors">
                    {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm animate-in fade-in"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <div className={cn(
                "lg:hidden fixed top-20 right-0 bottom-0 w-80 bg-[#0a0a0a] border-l border-white/5 z-50 shadow-2xl flex flex-col transition-transform duration-500 ease-out transform",
                isMobileOpen ? "translate-x-0" : "translate-x-full"
            )}>
                <SidebarContent />
            </div>

            {/* Desktop Floating Pill Sidebar */}
            <div className="hidden lg:flex w-64 bg-white/5 shadow-2xl backdrop-blur-3xl rounded-[2.5rem] h-[calc(100vh-3rem)] fixed left-6 top-6 flex-col overflow-hidden z-40 border border-white/10">
                <SidebarContent />
            </div>
        </>
    )
}
