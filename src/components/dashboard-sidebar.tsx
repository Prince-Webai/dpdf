'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { FileText, LayoutDashboard, Key, BarChart3, Settings, LogOut, User as UserIcon, BookOpen, ChevronRight, Zap, Database } from 'lucide-react'
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
                    </div>
                </motion.div>
            </nav>

            <motion.div variants={itemVariants} className="p-4 relative z-10 bg-gradient-to-t from-black to-transparent">
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
    )
}
