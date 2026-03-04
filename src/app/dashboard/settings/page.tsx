'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useProfile } from '@/context/profile-context'
<<<<<<< HEAD
import { Loader2, AlertTriangle, CreditCard, Zap, User as UserIcon, Settings2, Trash2, ArrowUpRight } from "lucide-react"
=======
import { Loader2, AlertTriangle, CreditCard, Zap, Shield } from "lucide-react"
>>>>>>> 9d56d33 (feat: redesign dashboard with realtime intelligence and fluid UI)
import { createClient } from '@/utils/supabase/client'
import { deleteSelfAccount } from '@/lib/actions'
import { toast } from '@/hooks/use-toast'
import { motion } from 'framer-motion'
import Link from 'next/link'

const PLAN_DISPLAY: Record<string, { label: string; description: string; color: string; bg: string; border: string }> = {
    'free': { label: 'Free', description: '100 API credits per month', color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20' },
    'Hobby': { label: 'Hobby', description: '17,000 PDF pages / month', color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
    'Basic': { label: 'Developer', description: '37,000 PDF pages / month', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
    'Personal': { label: 'Developer', description: '37,000 PDF pages / month', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    'Business': { label: 'Enterprise', description: 'Massive scale and dedicated architecture.', color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
}

export default function SettingsPage() {
    const { user, plan, fullName, loading } = useProfile()
    const planInfo = PLAN_DISPLAY[plan] || PLAN_DISPLAY['free']
    const router = useRouter()
    const supabase = createClient()

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [confirmText, setConfirmText] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDeleteAccount = async () => {
        if (confirmText !== 'DELETE') return

        setIsDeleting(true)
        try {
            const result = await deleteSelfAccount()

            if (!result.success) {
                toast({
                    title: 'Deletion failed',
                    description: result.error || 'Something went wrong. Please try again.',
                    variant: 'destructive',
                })
                setIsDeleting(false)
                return
            }

            await supabase.auth.signOut()

            toast({
                title: 'Account deleted',
                description: 'Your account has been permanently deleted.',
            })

            router.push('/')
            router.refresh()
        } catch (err: any) {
            toast({
                title: 'Error',
                description: err.message || 'An unexpected error occurred.',
                variant: 'destructive',
            })
            setIsDeleting(false)
        }
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
    }

    return (
<<<<<<< HEAD
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="max-w-4xl space-y-8"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-md bg-indigo-500/20 border border-indigo-500/30">
                        <Settings2 className="h-4 w-4 text-indigo-400" />
                    </div>
                    <span className="text-sm font-medium text-indigo-400 tracking-wide uppercase">Preferences</span>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Account Settings</h1>
                <p className="text-gray-400 text-lg">Manage your personal information, billing, and security preferences.</p>
            </motion.div>

            <motion.div variants={itemVariants}>
                {/* Profile Card */}
                <Card className="bg-[#050505] border-white/5 relative overflow-hidden group shadow-2xl">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-transparent opacity-50" />
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                                <UserIcon className="h-5 w-5 text-gray-300" />
                            </div>
                            <div>
                                <CardTitle className="text-xl text-white">Profile Details</CardTitle>
                                <CardDescription className="text-gray-400">Information identifying your account.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex items-center gap-3 text-indigo-400 bg-indigo-500/10 p-4 rounded-xl border border-indigo-500/20">
                                <Loader2 className="h-5 w-5 animate-spin" /> Loading your profile context...
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl bg-white/[0.02] border border-white/5 shadow-inner">
                                <div className="space-y-2">
                                    <Label className="text-gray-400 ml-1 text-xs uppercase tracking-wider font-semibold">Full Name</Label>
                                    <Input
                                        defaultValue={fullName}
                                        className="h-12 bg-[#0a0a0a] border-white/10 text-white font-medium focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
                                        disabled
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-400 ml-1 text-xs uppercase tracking-wider font-semibold">Email Address</Label>
                                    <Input
                                        type="email"
                                        defaultValue={user?.email || ''}
                                        className="h-12 bg-[#0a0a0a] border-white/10 text-white font-medium focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
                                        disabled
                                    />
                                    <p className="text-xs text-gray-500 ml-1">To change your email verification, contact support.</p>
=======
        <div className="space-y-10 max-w-5xl">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold tracking-tight text-white">System Preferences</h1>
                <p className="text-white/40 text-[13px] font-medium uppercase tracking-widest">Account & Subscription Configuration</p>
            </div>

            <Separator className="bg-white/10" />

            {/* Profile Card */}
            <Card className="bg-white/5 backdrop-blur-3xl border-white/10 rounded-[3rem] p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="p-0 mb-10">
                    <CardTitle className="text-2xl font-bold text-white tracking-tight">Identity Meta</CardTitle>
                    <CardDescription className="text-white/30 text-sm">Personal access and profile credentials.</CardDescription>
                </CardHeader>
                <CardContent className="p-0 space-y-8">
                    {loading ? (
                        <div className="flex items-center gap-3 text-white/20 font-medium">
                            <Loader2 className="h-5 w-5 animate-spin text-blue-500" /> Authenticating profile...
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-3">
                                <Label className="text-[10px] text-white/20 font-bold uppercase tracking-[0.2em] ml-1">Full Identity</Label>
                                <Input defaultValue={fullName} className="bg-white/[0.03] border-white/5 text-white h-12 rounded-xl focus:ring-1 focus:ring-blue-500/50" disabled />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] text-white/20 font-bold uppercase tracking-[0.2em] ml-1">Verified Email</Label>
                                <Input type="email" defaultValue={user?.email || ''} className="bg-white/[0.03] border-white/5 text-white h-12 rounded-xl focus:ring-1 focus:ring-blue-500/50" disabled />
                                <p className="text-[10px] text-white/20 font-medium flex items-center gap-1.5 ml-1">
                                    <Shield className="h-3 w-3 text-emerald-400/50" /> Email modification requires security verification via support.
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Billing Card */}
            <Card className="bg-white/5 backdrop-blur-3xl border-white/10 rounded-[3rem] p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="p-0 mb-10">
                    <div className="flex items-center gap-3">
                        <CreditCard className="h-6 w-6 text-indigo-400" />
                        <CardTitle className="text-2xl font-bold text-white tracking-tight">Billing & Quota</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="p-0 space-y-4">
                    {loading ? (
                        <div className="flex items-center gap-3 text-white/20 font-medium">
                            <Loader2 className="h-5 w-5 animate-spin text-indigo-500" /> Synchronizing billing data...
                        </div>
                    ) : (
                        <div className="bg-white/[0.03] border border-white/5 rounded-[2rem] p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden group/plan">
                            <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover/plan:opacity-100 transition-opacity" />
                            <div className="flex items-center gap-6 relative">
                                <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center shadow-inner">
                                    <Zap className="h-8 w-8 text-indigo-400" />
                                </div>
                                <div className="space-y-1">
                                    <p className={`font-black text-3xl capitalize tracking-tighter ${planInfo.color}`}>{planInfo.label} Layer</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <p className="text-xs font-bold text-white/30 uppercase tracking-widest">{planInfo.description}</p>
                                    </div>
>>>>>>> 9d56d33 (feat: redesign dashboard with realtime intelligence and fluid UI)
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
                {/* Billing Card */}
                <Card className="bg-[#050505] border-white/5 relative overflow-hidden group shadow-2xl">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                                <CreditCard className="h-5 w-5 text-gray-300" />
                            </div>
                            <div>
                                <CardTitle className="text-xl text-white">Subscription & Limits</CardTitle>
                                <CardDescription className="text-gray-400">Control your billing lifecycle and throughput.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex items-center gap-3 text-gray-500">
                                <Loader2 className="h-4 w-4 animate-spin" /> Retrieving plan data...
                            </div>
                        ) : (
                            <div className="bg-gradient-to-r from-white/[0.03] to-transparent border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-white/20 transition-all">
                                <div className="flex items-center gap-5">
                                    <div className={`w-14 h-14 rounded-2xl ${planInfo.bg} ${planInfo.border} border flex items-center justify-center shadow-inner`}>
                                        <Zap className={`h-6 w-6 ${planInfo.color}`} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <p className="font-bold text-2xl text-white capitalize tracking-tight">{planInfo.label}</p>
                                            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm ${planInfo.bg} ${planInfo.color}`}>Active</span>
                                        </div>
                                        <p className="text-sm font-medium text-gray-400">{planInfo.description}</p>
                                    </div>
                                </div>
                                <Button
                                    asChild
                                    className="bg-white text-black hover:bg-gray-200 font-bold px-8 h-12 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-transform hover:scale-105 w-full md:w-auto"
                                >
                                    <Link href="/pricing">
                                        Upgrade Architecture
                                        <ArrowUpRight className="w-4 h-4 ml-2 opacity-50" />
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
                {/* Danger Zone Card */}
                <Card className="bg-red-950/10 border-red-900/30 relative overflow-hidden group shadow-lg">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none transition-opacity duration-1000 group-hover:opacity-100 opacity-0" />

                    <CardHeader className="pb-4 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20">
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                            </div>
                            <div>
                                <CardTitle className="text-xl text-red-500">Danger Zone</CardTitle>
                                <CardDescription className="text-red-400/70">Irreversible, destructive operations.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="flex flex-col md:flex-row items-center justify-between bg-black/40 border border-red-900/30 rounded-2xl p-6 gap-6">
                            <div>
                                <p className="font-bold text-red-400 text-lg mb-1">Eradicate Account</p>
                                <p className="text-sm text-red-400/60 leading-relaxed max-w-xl">
                                    Instantly remove your profile, revoke all API keys, dissolve active pipelines, and permanently purge historical usage logs. This action bypasses the trash and is absolute.
                                </p>
                            </div>
                            <Button
<<<<<<< HEAD
                                variant="destructive"
                                className="bg-red-600/20 text-red-500 border border-red-500/30 hover:bg-red-600 hover:text-white h-12 px-6 rounded-xl font-bold transition-all w-full md:w-auto shrink-0"
                                onClick={() => { setConfirmText(''); setIsDeleteDialogOpen(true) }}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Initiate Deletion
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => { if (!isDeleting) setIsDeleteDialogOpen(open) }}>
                <DialogContent className="bg-[#050505] border-red-900/50 shadow-[0_0_100px_rgba(220,38,38,0.15)] text-white max-w-lg p-0 overflow-hidden">
                    <div className="h-2 w-full bg-gradient-to-r from-red-600 to-red-900" />

                    <div className="p-6 md:p-8">
                        <DialogHeader className="mb-6 text-left">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0 animate-pulse">
                                    <AlertTriangle className="h-7 w-7 text-red-500" />
                                </div>
                                <div>
                                    <DialogTitle className="text-red-500 text-2xl font-bold tracking-tight mb-1">Final Warning</DialogTitle>
                                    <DialogDescription className="text-red-400/80 font-medium">
                                        You are about to eradicate your DocuNexu instance.
                                    </DialogDescription>
                                </div>
                            </div>
                            <div className="text-gray-300 text-sm leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                                Entering the confirmation code below will <span className="text-white font-bold underline decoration-red-500 underline-offset-4">permanently</span> vaporize:
                                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-400 ml-1">
                                    <li>Your profile and billing entity</li>
                                    <li>All active and rotated API keys</li>
                                    <li>Historical telemetry and extraction logs</li>
                                </ul>
                            </div>
                        </DialogHeader>

                        <div className="space-y-3 mb-8">
                            <Label className="text-gray-400 text-sm ml-1 font-medium">
                                Type <code className="font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded font-mono">DELETE</code> below to authorize execution:
                            </Label>
                            <Input
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value)}
                                placeholder=""
                                className="h-14 text-center text-xl tracking-widest bg-black border-red-900/50 text-white placeholder:text-red-900/30 focus:border-red-500 font-mono transition-colors"
                                disabled={isDeleting}
                                autoCapitalize='off'
                                autoComplete='off'
                            />
                        </div>

                        <DialogFooter className="gap-3 sm:gap-2">
                            <Button
                                variant="ghost"
                                onClick={() => setIsDeleteDialogOpen(false)}
                                disabled={isDeleting}
                                className="text-gray-400 hover:text-white h-12 px-6 rounded-xl hover:bg-white/5 transition-colors"
                            >
                                Abort
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDeleteAccount}
                                disabled={confirmText !== 'DELETE' || isDeleting}
                                className="bg-red-600 hover:bg-red-500 text-white font-bold h-12 px-8 rounded-xl disabled:opacity-30 disabled:hover:bg-red-600 transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] disabled:shadow-none min-w-[140px]"
                            >
                                {isDeleting ? (
                                    <><Loader2 className="h-5 w-5 animate-spin" /></>
                                ) : (
                                    'Eradicate'
                                )}
                            </Button>
                        </DialogFooter>
                    </div>
=======
                                onClick={handleUpgradeClick}
                                className="w-full md:w-auto bg-white text-black hover:bg-white/90 font-bold px-10 py-7 rounded-2xl shadow-xl active:scale-95 transition-all text-sm relative"
                            >
                                Upgrade
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Danger Zone Card */}
            <Card className="bg-red-500/[0.02] border-red-500/10 rounded-[3rem] p-8 shadow-2xl relative overflow-hidden">
                <CardHeader className="p-0 mb-10">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="h-6 w-6 text-red-500/50" />
                        <CardTitle className="text-2xl font-bold text-red-500 tracking-tight">Destructive Protocol</CardTitle>
                    </div>
                    <CardDescription className="text-red-500/30 text-sm mt-1">
                        Permanent removal of all neural fingerprints and data associations.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-red-500/[0.03] border border-red-500/10 rounded-[2rem] p-8 gap-6">
                        <div className="space-y-1">
                            <p className="font-bold text-red-500/80 tracking-tight">Deactivate Account</p>
                            <p className="text-xs text-red-500/40 font-medium leading-relaxed max-w-md">
                                This will purge your profile, API history, and encryption keys from the global mesh. This cannot be reversed.
                            </p>
                        </div>
                        <Button
                            variant="destructive"
                            className="w-full md:w-auto bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white border border-red-500/20 px-8 py-6 rounded-2xl font-bold text-sm transition-all"
                            onClick={() => { setConfirmText(''); setIsDeleteDialogOpen(true) }}
                        >
                            Execute Deletion
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => { if (!isDeleting) setIsDeleteDialogOpen(open) }}>
                <DialogContent className="bg-[#050505] border-white/10 text-white max-w-md rounded-[2.5rem] p-10 overflow-hidden relative shadow-[0_0_100px_rgba(239,68,68,0.1)]">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
                    <DialogHeader>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 rounded-3xl bg-red-600/10 flex items-center justify-center flex-shrink-0 border border-red-500/20">
                                <AlertTriangle className="h-6 w-6 text-red-500" />
                            </div>
                            <DialogTitle className="text-white text-2xl font-black tracking-tighter">Terminate Account?</DialogTitle>
                        </div>
                        <DialogDescription className="text-white/40 text-[13px] leading-relaxed">
                            This operation results in <span className="text-white font-bold">permanent data loss</span>.
                            Your environment, keys, and subscription record will be immediately purged.
                            <br /><br />
                            <span className="text-red-500/80 font-bold uppercase tracking-widest text-[10px]">Action required: Type below to confirm security override.</span>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3 py-6 relative">
                        <Label className="text-[10px] text-white/20 font-bold uppercase tracking-[0.2em] ml-1">
                            Confirmation Token: <span className="text-white">DELETE</span>
                        </Label>
                        <Input
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            placeholder="Type confirmation..."
                            className="bg-white/[0.03] border-white/5 text-white h-12 rounded-xl focus:ring-1 focus:ring-red-500 placeholder:text-white/10 font-bold"
                            disabled={isDeleting}
                        />
                    </div>

                    <DialogFooter className="gap-3 mt-4">
                        <Button
                            variant="ghost"
                            onClick={() => setIsDeleteDialogOpen(false)}
                            disabled={isDeleting}
                            className="flex-1 text-white/30 hover:text-white hover:bg-white/5 rounded-2xl py-6 font-bold"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteAccount}
                            disabled={confirmText !== 'DELETE' || isDeleting}
                            className="flex-1 bg-red-600 text-white hover:bg-red-500 rounded-2xl py-6 font-bold shadow-xl shadow-red-500/20 active:scale-95 transition-all"
                        >
                            {isDeleting ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Purging...</>
                            ) : (
                                'Confirm Deletion'
                            )}
                        </Button>
                    </DialogFooter>
>>>>>>> 9d56d33 (feat: redesign dashboard with realtime intelligence and fluid UI)
                </DialogContent>
            </Dialog>
        </motion.div>
    )
}
