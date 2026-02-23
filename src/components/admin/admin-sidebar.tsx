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
        { name: 'Platform Overview', href: '/admin', icon: LayoutDashboard },
        { name: 'Manage Users', href: '/admin/users', icon: Users },
        { name: 'Audit API Keys', href: '/admin/api-keys', icon: Key },
    ]

    return (
        <div className="w-64 border-r border-indigo-500/20 bg-[#0a0a0a] h-screen fixed left-0 top-0 flex flex-col">
            <div className="p-6">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white">
                    <ShieldAlert className="h-6 w-6 text-red-500" />
                    <span>DocuNexu Admin</span>
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
                                    ? "bg-red-500/10 text-red-400 font-medium border border-red-500/20"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-indigo-500/20">
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
