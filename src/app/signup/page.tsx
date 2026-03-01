'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { FileText, Loader2, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

import { signUpUser } from '@/lib/actions'

export const dynamic = 'force-dynamic'

function SignupForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()
    const searchParams = useSearchParams()
    const next = searchParams.get('next')
    const supabase = createClient()

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const result = await signUpUser({
                email,
                password,
                firstName,
                lastName
            })

            if (!result.success) {
                throw new Error(result.error)
            }

            // If the signup was successful, Supabase might send a confirmation email
            // or log the user in automatically depending on the settings.
            // We check if a session was created.
            const { data: { session } } = await supabase.auth.getSession()

            if (session) {
                if (next) {
                    window.location.href = next
                } else {
                    router.push('/dashboard')
                    router.refresh()
                }
            } else {
                // If no session, it likely means email confirmation is required
                router.push(`/login?message=Please check your email to confirm your account${next ? `&next=${encodeURIComponent(next)}` : ''}`)
            }
        } catch (err: any) {
            setError(err.message || "Failed to create account")
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
                        <h1 className="text-2xl font-bold text-white mb-2">Create an account</h1>
                        <p className="text-gray-400 text-sm">Start building with DocuNexu API</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-md bg-red-500/10 border border-red-500/50 text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSignup} className="space-y-6">
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName" className="text-gray-300">First name</Label>
                                    <Input
                                        id="firstName"
                                        placeholder="John"
                                        required
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="bg-black border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-indigo-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName" className="text-gray-300">Last name</Label>
                                    <Input
                                        id="lastName"
                                        placeholder="Doe"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="bg-black border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-indigo-500"
                                    />
                                </div>
                            </div>
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
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="password" className="text-gray-300">Password</Label>
                                    <Link href="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300">
                                        Forgot password?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-black border-white/10 text-white focus-visible:ring-indigo-500"
                                />
                                <p className="text-xs text-gray-500">Must be at least 8 characters.</p>
                            </div>

                        </div>

                        <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create Account'}
                        </Button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-[#0a0a0a] px-2 text-gray-500">Or sign up with</span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <Button variant="outline" className="border-white/10 hover:bg-white/5 text-gray-300">
                                <Github className="mr-2 h-4 w-4" /> Github
                            </Button>
                            <Button variant="outline" className="border-white/10 hover:bg-white/5 text-gray-300">
                                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                                Google
                            </Button>
                        </div>
                    </div>
                </div>

                <p className="text-center mt-8 text-sm text-gray-500">
                    Already have an account? <Link href={`/login${next ? `?next=${encodeURIComponent(next)}` : ''}`} className="text-indigo-400 hover:text-indigo-300 font-medium">Log in</Link>
                </p>
            </motion.div>
        </div>
    )
}

export default function SignupPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex justify-center items-center">
                <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
            </div>
        }>
            <SignupForm />
        </Suspense>
    )
}
