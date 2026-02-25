'use client'

import Link from 'next/link'
import { FileText, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'
import { usePathname } from 'next/navigation'

export function Navbar() {
    const pathname = usePathname()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const supabase = createClient()

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        getUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [supabase.auth])

    if (pathname?.startsWith('/admin') || pathname?.startsWith('/dashboard')) return null

    return (
        <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-lg">
            <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white">
                    <FileText className="h-6 w-6 text-indigo-500" />
                    <span>DocuNexu</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
                    <Link href="/products" className="hover:text-white transition-colors">Products</Link>
                    <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
                    <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
                </div>

                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        <Button asChild className="bg-white text-black hover:bg-gray-200">
                            <Link href="/dashboard">Dashboard</Link>
                        </Button>
                    ) : (
                        <>
                            <Button variant="ghost" asChild className="text-gray-300 hover:text-white hover:bg-white/10">
                                <Link href="/login">Log in</Link>
                            </Button>
                            <Button asChild className="bg-white text-black hover:bg-gray-200">
                                <Link href="/signup">Get Started</Link>
                            </Button>
                        </>
                    )}
                </div>

                {/* Mobile Nav Toggle */}
                <button className="md:hidden text-gray-300" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Nav Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-white/10 bg-black p-4 flex flex-col gap-4">
                    <Link href="/products" className="text-gray-300 hover:text-white px-2 py-1">Products</Link>
                    <Link href="/pricing" className="text-gray-300 hover:text-white px-2 py-1">Pricing</Link>
                    <Link href="/docs" className="text-gray-300 hover:text-white px-2 py-1">Docs</Link>
                    <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/10">
                        {user ? (
                            <Button asChild className="w-full bg-white text-black hover:bg-gray-200">
                                <Link href="/dashboard">Dashboard</Link>
                            </Button>
                        ) : (
                            <>
                                <Button variant="outline" asChild className="w-full border-white/20 text-white hover:bg-white/10">
                                    <Link href="/login">Log in</Link>
                                </Button>
                                <Button asChild className="w-full bg-indigo-600 text-white hover:bg-indigo-700">
                                    <Link href="/signup">Get Started</Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}
