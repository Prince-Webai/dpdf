'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FileText, Loader2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { motion } from 'framer-motion'
import { createClient } from '@/utils/supabase/client'

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)
    const [email, setEmail] = useState('')
    const supabase = createClient()

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)
        setMessage(null)

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            })
            if (error) throw error
            setMessage("Check your email for the password reset link.")
        } catch (err: any) {
            setError(err.message || "Failed to send reset email")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-black flex flex-col justify-center items-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-black to-black -z-10" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-md"
            >
                <Link href="/" className="flex items-center justify-center gap-2 font-bold text-2xl text-white mb-8 hover:opacity-80 transition-opacity">
                    <FileText className="h-8 w-8 text-indigo-500" />
                    <span>DocuNexu</span>
                </Link>

                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
                        <p className="text-gray-400 text-sm">We'll send a recovery link to your email</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-md bg-red-500/10 border border-red-500/50 text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="mb-6 p-4 rounded-md bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 text-sm text-center">
                            {message}
                        </div>
                    )}

                    {!message ? (
                        <form onSubmit={handleReset} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-gray-300">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@company.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-black border-white/10 text-white"
                                />
                            </div>

                            <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Send Reset Link'}
                            </Button>
                        </form>
                    ) : (
                        <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 text-white" asChild>
                            <Link href="/login">Back to Login</Link>
                        </Button>
                    )}

                    <div className="mt-8 text-center">
                        <Link href="/login" className="text-sm text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" /> Back to Log in
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
