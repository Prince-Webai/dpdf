'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
<<<<<<< HEAD
import { FileText, LayoutDashboard, Key, BarChart3, Settings, LogOut, User as UserIcon, BookOpen, ChevronRight, Zap, Database } from 'lucide-react'
=======
import { FileText, LayoutDashboard, Key, BarChart3, Settings, LogOut, User as UserIcon, BookOpen, Menu, X } from 'lucide-react'
>>>>>>> 9d56d33 (feat: redesign dashboard with realtime intelligence and fluid UI)
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
        { name: 'Extract Sandbox', href: '/dashboard/tools/extract', icon: Zap },
        { name: 'Documentation', href: '/docs', icon: BookOpen },
    ]

    const isAnyDevItemActive = devItems.some(item => pathname === item.href)

<<<<<<< HEAD
    const sidebarVariants = {
        hidden: { x: -250, opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                bounce: 0,
                duration: 0.4,
                staggerChildren: 0.1
            } as any
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={sidebarVariants}
            className="w-64 border-r border-white/5 bg-[#050505]/95 backdrop-blur-xl h-screen fixed left-0 top-0 flex flex-col z-50 overflow-hidden"
        >
            {/* Ambient background glow inside sidebar */}
            <div className="absolute top-0 left-0 w-full h-40 bg-indigo-900/10 blur-3xl pointer-events-none" />

            <div className="p-6 relative z-10 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 font-bold text-xl text-white group">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/20 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                        <FileText className="h-4 w-4 text-indigo-400" />
                    </div>
                    <span className="tracking-tight">DocuNexu</span>
                </Link>
            </div>

            <nav className="flex-1 space-y-8 overflow-y-auto px-4 py-4 relative z-10 scrollbar-hide">
                <motion.div variants={itemVariants}>
                    <h3 className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">User Section</h3>
                    <div className="space-y-1 relative">

                        {/* Profile Overview */}
                        <SidebarLink href="/dashboard" icon={UserIcon} label="Profile Overview" isActive={pathname === '/dashboard'} />

                        {/* Settings */}
                        <SidebarLink href="/dashboard/settings" icon={Settings} label="Settings" isActive={pathname === '/dashboard/settings'} />
                    </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <h3 className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Developer Tools</h3>
                    <div className="space-y-1">
                        <button
                            onClick={() => setIsDevExpanded(!isDevExpanded)}
                            className={cn(
                                "w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all font-medium text-sm group",
                                isAnyDevItemActive && !isDevExpanded
                                    ? "bg-white/5 text-indigo-400"
                                    : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <LayoutDashboard className={cn("h-4 w-4 transition-colors", isAnyDevItemActive && !isDevExpanded ? "text-indigo-400" : "text-gray-500 group-hover:text-gray-300")} />
                                <span>Core API</span>
                            </div>
                            <motion.div
                                animate={{ rotate: isDevExpanded ? 90 : 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <ChevronRight className="w-4 h-4 text-gray-500" />
                            </motion.div>
                        </button>

                        <AnimatePresence initial={false}>
                            {isDevExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                    animate={{ height: "auto", opacity: 1, marginTop: 4 }}
                                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                    transition={{ duration: 0.2, ease: "easeInOut" }}
                                    className="overflow-hidden"
                                >
                                    <div className="space-y-1 ml-4 border-l border-white/5 pl-2 py-1 relative">
                                        {devItems.map((item) => (
                                            <NestedSidebarLink
                                                key={item.href}
                                                href={item.href}
                                                icon={item.icon}
                                                label={item.name}
                                                isActive={pathname === item.href}
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
=======
    const SidebarContent = () => (
        <>
            <div className="p-8">
                <Link href="/" className="flex items-center gap-3 group" onClick={() => setIsMobileOpen(false)}>
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl w-10 h-10 flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                        N
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
                                ? "bg-blue-600/10 text-blue-400 ring-1 ring-blue-500/20"
                                : "text-white/50 hover:bg-white/5 hover:text-white"
                        )}>
                            <UserIcon className={cn("h-4 w-4 transition-transform group-hover:scale-110", pathname === '/dashboard' ? "text-blue-400" : "text-white/40")} />
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
                                ? "bg-blue-600/10 text-blue-400 ring-1 ring-blue-500/20"
                                : "text-white/50 hover:bg-white/5 hover:text-white"
                        )}>
                            <Settings className={cn("h-4 w-4 transition-transform group-hover:rotate-45", pathname === '/dashboard/settings' ? "text-blue-400" : "text-white/40")} />
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
                                ? "bg-blue-600/10 text-blue-400 ring-1 ring-blue-500/20"
                                : "text-white/50 hover:bg-white/5 hover:text-white"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <LayoutDashboard className="h-4 w-4" />
                            <span className="text-[14px] font-medium">Developer Tools</span>
                        </div>
                        <svg
                            className={cn("w-4 h-4 transition-transform duration-300", isDevExpanded ? "rotate-180" : "")}
                            fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    <div className={cn(
                        "overflow-hidden transition-all duration-500 text-sm mt-1 space-y-1",
                        isDevExpanded ? "max-h-64 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
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
                                            ? "text-blue-400 bg-blue-400/5 font-semibold"
                                            : "text-white/40 hover:text-white/80 hover:translate-x-1"
                                    )}
                                >
                                    <item.icon className={cn("h-3.5 w-3.5", isActive ? "text-blue-400" : "text-white/20 group-hover:text-blue-400/60")} />
                                    <span className="text-[13px]">{item.name}</span>
                                </Link>
                            )
                        })}
>>>>>>> 9d56d33 (feat: redesign dashboard with realtime intelligence and fluid UI)
                    </div>
                </motion.div>
            </nav>

<<<<<<< HEAD
            <motion.div variants={itemVariants} className="p-4 relative z-10 bg-gradient-to-t from-black to-transparent">
                <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white border border-transparent hover:border-white/10 w-full transition-all disabled:opacity-50 group hover:shadow-lg"
=======
            <div className="p-6 pt-4 border-t border-white/5 bg-gradient-to-b from-transparent to-white/5">
                <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex items-center justify-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-white/50 hover:bg-red-500/10 hover:text-red-400 w-full transition-all duration-300 disabled:opacity-50 ring-1 ring-transparent hover:ring-red-500/20"
>>>>>>> 9d56d33 (feat: redesign dashboard with realtime intelligence and fluid UI)
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
<<<<<<< HEAD
            </motion.div>
        </motion.div>
    )
}

function SidebarLink({ href, icon: Icon, label, isActive }: { href: string; icon: any; label: string; isActive: boolean }) {
    return (
        <Link href={href} className="block relative">
            <div className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm relative z-10 group",
                isActive ? "text-indigo-50" : "text-gray-400 hover:text-white"
            )}>
                <Icon className={cn("h-4 w-4 transition-colors", isActive ? "text-indigo-400" : "text-gray-500 group-hover:text-gray-300")} />
                <span>{label}</span>
            </div>
            {isActive && (
                <motion.div
                    layoutId="active-sidebar-pill"
                    className="absolute inset-0 bg-indigo-500/10 border border-indigo-500/20 rounded-xl z-0 pointer-events-none shadow-[0_0_15px_rgba(99,102,241,0.05)]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
            )}
        </Link>
    )
}

function NestedSidebarLink({ href, icon: Icon, label, isActive }: { href: string; icon: any; label: string; isActive: boolean }) {
    return (
        <Link href={href} className="block relative group">
            <div className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all font-medium text-sm relative z-10",
                isActive ? "text-indigo-300" : "text-gray-500 hover:text-gray-300"
            )}>
                <Icon className={cn("h-3.5 w-3.5 transition-transform duration-300", isActive ? "scale-110 text-indigo-400" : "group-hover:scale-110")} />
                <span>{label}</span>
            </div>
            {isActive && (
                <motion.div
                    layoutId="active-nested-pill"
                    className="absolute inset-0 bg-white/5 rounded-lg z-0 pointer-events-none"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
            )}
            {/* Active Indicator Line */}
            {isActive && (
                <motion.div
                    layoutId="active-nested-line"
                    className="absolute left-[-9px] top-1/2 -translate-y-1/2 w-[2px] h-4 bg-indigo-500 rounded-r-full"
                />
            )}
        </Link>
=======
            </div>
        </>
    )

    return (
        <>
            {/* Mobile Top Bar */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-20 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 z-50 flex items-center justify-between px-6">
                <Link href="/" className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl w-8 h-8 flex items-center justify-center font-bold text-sm">
                        N
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
>>>>>>> 9d56d33 (feat: redesign dashboard with realtime intelligence and fluid UI)
    )
}
