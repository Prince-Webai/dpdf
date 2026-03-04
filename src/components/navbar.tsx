'use client'

import Link from 'next/link'
import { Pentagon, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

import { useProfile } from '@/context/profile-context'

export function Navbar() {
    const pathname = usePathname()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { user } = useProfile()

    if (pathname?.startsWith('/admin') || pathname?.startsWith('/dashboard')) return null

    return (
        <nav className="fixed top-0 w-full z-50 border-b border-white/[0.03] bg-executive-black/80 backdrop-blur-xl transition-all duration-500 h-24 flex items-center">
            <div className="container mx-auto px-6 md:px-12 h-full flex items-center justify-between">
                <Link href="/" className="group flex items-center gap-3">
                    <div className="relative">
                        <Pentagon className="text-executive-gold w-7 h-7 stroke-[1px] group-hover:rotate-[180deg] transition-transform duration-1000 ease-in-out" />
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ repeat: Infinity, duration: 4 }}
                            className="absolute inset-0 bg-blue-500/20 blur-md rounded-none"
                        />
                    </div>
                    <span className="font-serif text-2xl tracking-[0.1em] text-white">Docu<span className="text-white/40 italic">Nexus</span></span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-16 text-[10px] tracking-[0.4em] font-bold uppercase text-white/40">
                    {['Products', 'Pricing', 'Docs'].map((item) => (
                        <Link
                            key={item}
                            href={`/${item.toLowerCase()}`}
                            className="hover:text-blue-400 transition-colors relative group py-2"
                        >
                            {item}
                            <motion.span
                                className="absolute bottom-0 left-0 w-0 h-[1px] bg-blue-500 transition-all duration-500 group-hover:w-full"
                            />
                        </Link>
                    ))}
                </div>

                <div className="hidden md:flex items-center gap-6">
                    {user ? (
                        <Button asChild className="bg-blue-500/10 backdrop-blur-md text-blue-400 hover:bg-blue-500 hover:text-white rounded-none !rounded-none font-bold text-[10px] tracking-[0.2em] uppercase h-10 px-8 transition-all duration-500 shadow-md border border-blue-500/10 group-hover:border-blue-500/20">
                            <Link href="/dashboard">Dashboard</Link>
                        </Button>
                    ) : (
                        <>
                            <Button variant="ghost" asChild className="text-white/40 hover:text-white hover:bg-white/5 rounded-none font-bold text-[10px] tracking-[0.2em] uppercase h-10 px-8 transition-all">
                                <Link href="/login">Log in</Link>
                            </Button>
                            <Link href="/signup" className="relative group">
                                <div className="absolute -inset-0.5 bg-blue-500 rounded-none blur-md opacity-40 transition duration-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]"></div>
                                <Button className="relative bg-white/10 backdrop-blur-md text-white hover:bg-white hover:text-black rounded-none !rounded-none font-bold text-[10px] tracking-[0.2em] uppercase h-10 px-8 transition-all duration-500 border border-white/20 shadow-[0_0_10px_rgba(255,255,255,0.05)]">
                                    Get Started
                                </Button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Nav Toggle */}
                <button className="md:hidden text-gray-300 p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Nav Menu */}
            {isMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden border-t border-white/[0.05] bg-executive-black/95 backdrop-blur-2xl p-8 flex flex-col gap-8 h-screen"
                >
                    <div className="flex flex-col gap-6 text-[12px] tracking-[0.4em] font-bold uppercase text-white/60">
                        <Link href="/products" onClick={() => setIsMenuOpen(false)}>Products</Link>
                        <Link href="/pricing" onClick={() => setIsMenuOpen(false)}>Pricing</Link>
                        <Link href="/docs" onClick={() => setIsMenuOpen(false)}>Docs</Link>
                    </div>
                    <div className="flex flex-col gap-4 pt-8 border-t border-white/[0.05]">
                        {user ? (
                            <Button asChild className="w-full bg-executive-gold text-black rounded-none font-bold text-[11px] tracking-[0.3em] uppercase h-14">
                                <Link href="/dashboard">Dashboard</Link>
                            </Button>
                        ) : (
                            <>
                                <Button variant="outline" asChild className="w-full border-white/10 text-white rounded-none font-bold text-[11px] tracking-[0.3em] uppercase h-14" onClick={() => setIsMenuOpen(false)}>
                                    <Link href="/login">Log in</Link>
                                </Button>
                                <Button asChild className="w-full bg-executive-gold text-black rounded-none font-bold text-[11px] tracking-[0.3em] uppercase h-14 shadow-[0_0_20px_rgba(255,255,255,0.25)] border border-white/20" onClick={() => setIsMenuOpen(false)}>
                                    <Link href="/signup">Get Started</Link>
                                </Button>
                            </>
                        )}
                    </div>
                </motion.div>
            )}
        </nav>
    )
}
