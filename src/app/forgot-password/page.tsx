'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FileText, Loader2, ArrowLeft, MailCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { motion, AnimatePresence } from 'framer-motion'
import { forgotPassword } from '@/lib/actions'

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [email, setEmail] = useState('')
    const [sent, setSent] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        const result = await forgotPassword(email)

        if (!result.success) {
            setError(result.error || 'Something went wrong. Please try again.')
            setIsLoading(false)
        } else {
            setSent(true)
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-black flex flex-col justify-center items-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-black to-black -z-10" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-md"
            >
                <Link href="/" className="flex items-center justify-center gap-2 font-bold text-2xl text-white mb-8 hover:opacity-80 transition-opacity">
                    <FileText className="h-8 w-8 text-indigo-500" />
                    <span>DocuNexu</span>
                </Link>

                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
                    <AnimatePresence mode="wait">
                        {!sent ? (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <div className="text-center mb-8">
                                    <h1 className="text-2xl font-bold text-white mb-2">Forgot your password?</h1>
                                    <p className="text-gray-400 text-sm">Enter your email and we'll send you a reset link.</p>
                                </div>

                                {error && (
                                    <div className="mb-6 p-4 rounded-md bg-red-500/10 border border-red-500/50 text-red-500 text-sm text-center">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-gray-300">Email address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="name@company.com"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="bg-black border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-indigo-500"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Send Reset Link'}
                                    </Button>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-4"
                            >
                                <div className="flex justify-center mb-5">
                                    <div className="h-16 w-16 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
                                        <MailCheck className="h-8 w-8 text-indigo-400" />
                                    </div>
                                </div>
                                <h2 className="text-xl font-bold text-white mb-2">Check your inbox</h2>
                                <p className="text-gray-400 text-sm mb-6">
                                    We've sent a password reset link to <span className="text-indigo-400 font-medium">{email}</span>. Check your spam folder if you don't see it.
                                </p>
                                <Button
                                    variant="outline"
                                    className="border-white/10 hover:bg-white/5 text-gray-300 w-full"
                                    onClick={() => { setSent(false); setEmail('') }}
                                >
                                    Send again
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <p className="text-center mt-8 text-sm text-gray-500">
                    <Link href="/login" className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium">
                        <ArrowLeft className="h-3 w-3" /> Back to login
                    </Link>
                </p>
            </motion.div>
        </div>
    )
}
