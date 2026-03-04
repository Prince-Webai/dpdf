'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Pentagon, Code, User, Settings as SettingsIcon, Search } from 'lucide-react'
import { motion } from 'framer-motion'
import { createClient } from '../utils/supabase/client'
import { useProfile } from '@/context/profile-context'

export function TopNavHeader() {
    const pathname = usePathname()
    const supabase = createClient()
    const { user, fullName } = useProfile()

    const navItems = [
        { name: 'Developer', path: '/dashboard', icon: Code },
        { name: 'Profile', path: '/dashboard/usage', icon: User },
        { name: 'Settings', path: '/dashboard/settings', icon: SettingsIcon }
    ]

    return (
        <header className="fixed w-full top-0 z-50 bg-executive-black/90 backdrop-blur-md border-b border-white/[0.02]">
            <div className="max-w-[1920px] mx-auto px-8 md:px-16 h-20 flex items-center justify-between">
                <div className="flex items-center gap-12">
                    <Link href="/" className="group flex items-center gap-3">
                        <Pentagon className="text-executive-gold w-6 h-6 stroke-[1px] group-hover:rotate-180 transition-transform duration-700" />
                        <span className="font-serif text-xl tracking-[0.15em] text-white">NEXUS</span>
                    </Link>
                    <nav className="flex items-center gap-4 md:gap-8 lg:gap-12 flex-nowrap shrink-0">
                        {navItems.map((item) => {
                            const isActive = pathname === item.path
                            return (
                                <Link
                                    key={item.name}
                                    href={item.path}
                                    className={`text-[11px] tracking-[0.25em] font-light uppercase transition-all relative py-2 flex items-center gap-2
                    ${isActive ? 'text-white' : 'text-white/40 hover:text-white'}`}
                                >
                                    {item.name}
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-underline"
                                            className="absolute -bottom-2 left-0 w-full h-[1px] bg-executive-gold"
                                        />
                                    )}
                                </Link>
                            )
                        })}
                    </nav>
                </div>
                {user && (
                    <div className="flex items-center gap-8">
                        <button className="text-white/40 hover:text-executive-gold transition-colors">
                            <Search className="w-5 h-5 stroke-[1px]" />
                        </button>
                        <div className="flex items-center gap-4 border-l border-white/[0.05] pl-8 group">
                            <div className="text-right hidden sm:block">
                                <p className="font-serif italic text-white/90 text-sm group-hover:text-executive-gold transition-colors">
                                    {fullName ? fullName.split(' ').map((n: string) => n[0]).join('.') : (user.email?.split('@')[0] || 'Strategic.Commander')}
                                </p>
                            </div>
                            <div className="h-8 w-8 rounded-full overflow-hidden ring-1 ring-white/10 p-[2px] bg-white/5 relative">
                                {user.user_metadata?.avatar_url ? (
                                    <img
                                        alt="User"
                                        className="w-full h-full object-cover rounded-full"
                                        src={user.user_metadata.avatar_url}
                                        referrerPolicy="no-referrer"
                                    />
                                ) : (
                                    <User className="w-full h-full p-1 text-white/50" />
                                )}
                            </div>
                            <button
                                onClick={async () => {
                                    await supabase.auth.signOut()
                                    window.location.href = '/login'
                                }}
                                className="ml-2 px-3 py-1.5 rounded-full border border-white/10 text-xs font-semibold text-gray-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-all flex items-center gap-1.5"
                                title="Sign out"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
                                Log out
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}
