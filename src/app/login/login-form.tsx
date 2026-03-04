'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Pentagon, Loader2, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export function LoginForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const searchParams = useSearchParams()
    const next = searchParams.get('next')
    const message = searchParams.get('message')
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password })

            if (error) throw error

            if (data.user) {
                if (next) {
                    window.location.href = next
                } else if (data.user?.app_metadata?.role === 'admin' || data.user?.email === 'devashishbhavsar1@duck.com') {
                    window.location.href = '/admin'
                } else {
                    window.location.href = '/dashboard'
                }
            }
        } catch (err: any) {
            setError(err.message || 'Failed to sign in')
            setIsLoading(false)
        }
    }

    const handleOAuthLogin = async (provider: 'google' | 'github') => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${window.location.origin}/auth/callback${next ? `?next=${encodeURIComponent(next)}` : ''}`,
                },
            })
            if (error) throw error
        } catch (err: any) {
            setError(err.message || `Failed to sign in with ${provider}`)
        }
    }

    return (
        <div className="min-h-screen bg-executive-black flex relative overflow-hidden">
            <div className="executive-grain" />

            {/* Background glows */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-executive-gold/6 blur-[140px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/6 blur-[140px]" />
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(156,130,74,0.8) 1px, transparent 0)`,
                        backgroundSize: '40px 40px',
                    }}
                />
            </div>

            {/* ── LEFT PANEL — form ─────────────────────────── */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative z-10">
                {/* Mobile logo */}
                <Link href="/" className="flex lg:hidden items-center gap-3 mb-10">
                    <Pentagon className="text-executive-gold w-6 h-6 stroke-[1px]" />
                    <span className="font-serif text-xl tracking-[0.08em] text-white">Docu<span className="text-white/35 italic">Nexus</span></span>
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-md"
                >
                    {/* Header */}
                    <div className="mb-10">
                        <p className="text-executive-gold text-[10px] tracking-[0.4em] uppercase font-bold mb-3">Secure Access</p>
                        <h1 className="text-4xl font-serif text-white mb-2 tracking-tight">Welcome back</h1>
                        <p className="text-white/30 text-sm font-light">
                            Don&apos;t have an account?{' '}
                            <Link href={`/signup${next ? `?next=${encodeURIComponent(next)}` : ''}`} className="text-executive-gold hover:text-white transition-colors font-medium underline underline-offset-4">
                                Get started
                            </Link>
                        </p>
                    </div>

                    {/* Success message (e.g. email confirmation) */}
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 border border-executive-gold/25 bg-executive-gold/5 text-executive-gold text-sm"
                        >
                            {message}
                        </motion.div>
                    )}

                    {/* Error */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 border border-red-500/30 bg-red-500/8 text-red-400 text-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-[10px] tracking-[0.2em] uppercase text-white/35 font-bold mb-2">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="name@company.com"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full bg-executive-panel/50 border border-white/8 text-white placeholder:text-white/15 focus:outline-none focus:border-executive-gold/50 focus:bg-executive-panel/80 transition-all duration-300 px-4 py-3 text-sm font-light"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label htmlFor="password" className="block text-[10px] tracking-[0.2em] uppercase text-white/35 font-bold">Password</label>
                                <Link href="/forgot-password" className="text-[10px] tracking-wider text-executive-gold/60 hover:text-executive-gold transition-colors uppercase font-bold">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full bg-executive-panel/50 border border-white/8 text-white placeholder:text-white/15 focus:outline-none focus:border-executive-gold/50 focus:bg-executive-panel/80 transition-all duration-300 px-4 py-3 pr-11 text-sm font-light"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-executive-gold transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="pt-2">
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-executive-gold blur-md opacity-40 transition duration-500 shadow-[0_0_15px_rgba(203,178,106,0.3)]" />
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="relative w-full py-3.5 bg-executive-gold text-black text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-500 hover:bg-white flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_0_10px_rgba(203,178,106,0.2)]"
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <>Log In <ArrowRight className="w-4 h-4" /></>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/5" />
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-executive-black px-4 text-[9px] tracking-[0.3em] uppercase text-white/20">
                                or continue with
                            </span>
                        </div>
                    </div>

                    {/* OAuth */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => handleOAuthLogin('github')}
                            className="flex items-center justify-center gap-2 border border-white/8 bg-white/[0.02] hover:bg-white/5 hover:border-white/15 text-white/40 hover:text-white/70 transition-all duration-300 py-3 text-[10px] tracking-[0.15em] uppercase font-bold"
                        >
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" /></svg>
                            GitHub
                        </button>
                        <button
                            type="button"
                            onClick={() => handleOAuthLogin('google')}
                            className="flex items-center justify-center gap-2 border border-white/8 bg-white/[0.02] hover:bg-white/5 hover:border-white/15 text-white/40 hover:text-white/70 transition-all duration-300 py-3 text-[10px] tracking-[0.15em] uppercase font-bold"
                        >
                            <svg className="h-4 w-4" viewBox="0 0 488 512" fill="currentColor"><path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" /></svg>
                            Google
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* ── RIGHT PANEL — branding ────────────────────── */}
            <div className="hidden lg:flex flex-col justify-between w-[44%] border-l border-white/5 p-16 relative z-10 bg-executive-panel/20">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group justify-end">
                    <span className="font-serif text-2xl tracking-[0.08em] text-white">
                        Docu<span className="text-white/35 italic">Nexus</span>
                    </span>
                    <div className="relative">
                        <Pentagon className="text-executive-gold w-7 h-7 stroke-[1px] group-hover:rotate-180 transition-transform duration-700 ease-in-out" />
                        <motion.div
                            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
                            transition={{ repeat: Infinity, duration: 4 }}
                            className="absolute inset-0 bg-executive-gold/20 blur-md"
                        />
                    </div>
                </Link>

                {/* Big central stat */}
                <div className="text-right">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.9 }}
                    >
                        <div className="inline-flex items-center gap-2 border border-executive-gold/20 bg-executive-gold/5 px-3 py-1.5 text-[9px] tracking-[0.4em] uppercase text-executive-gold mb-10">
                            <Sparkles className="w-3 h-3" />
                            Live Platform
                        </div>

                        <div className="space-y-10 text-right">
                            {[
                                { value: "10M+", label: "API Calls / Day" },
                                { value: "99.9%", label: "Uptime SLA" },
                                { value: "<400ms", label: "Avg Response Time" },
                            ].map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + i * 0.15 }}
                                >
                                    <div className="text-5xl font-serif text-white mb-1">{stat.value}</div>
                                    <div className="text-[10px] tracking-[0.35em] uppercase text-white/25 font-bold">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Bottom quote */}
                <div className="border-r-2 border-executive-gold/20 pr-5 text-right">
                    <p className="text-white/25 text-sm italic font-serif leading-relaxed">
                        "The most reliable PDF API we've integrated — bar none."
                    </p>
                    <p className="text-executive-gold/50 text-[10px] tracking-[0.2em] uppercase mt-2 font-bold">— Enterprise Client</p>
                </div>
            </div>
        </div>
    )
}
