'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useProfile } from '@/context/profile-context'
import { Loader2, AlertTriangle, CreditCard, Zap } from "lucide-react"
import { createClient } from '@/utils/supabase/client'
import { deleteSelfAccount } from '@/lib/actions'
import { toast } from '@/hooks/use-toast'

const PLAN_DISPLAY: Record<string, { label: string; description: string; color: string }> = {
    'free': { label: 'Free', description: '100 credits / month', color: 'text-gray-400' },
    'Hobby': { label: 'Hobby', description: '100 credits / month', color: 'text-gray-400' },
    'Basic': { label: 'Basic', description: '17,000 credits / month', color: 'text-blue-400' },
    'Personal': { label: 'Personal', description: '37,000 credits / month', color: 'text-indigo-400' },
    'Business': { label: 'Business', description: '81,000 credits / month', color: 'text-purple-400' },
}

export default function SettingsPage() {
    const { user, plan, fullName, loading } = useProfile()
    const planInfo = PLAN_DISPLAY[plan] || PLAN_DISPLAY['free']
    const router = useRouter()
    const supabase = createClient()

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [confirmText, setConfirmText] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)

    const handleUpgradeClick = () => {
        router.push('/pricing')
    }

    const handleDeleteAccount = async () => {
        if (confirmText !== 'DELETE') return

        setIsDeleting(true)
        try {
            // 1. Call server action to delete from backend (auth.users + all cascaded data)
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

            // 2. Sign out from the Supabase client session on the frontend
            await supabase.auth.signOut()

            toast({
                title: 'Account deleted',
                description: 'Your account has been permanently deleted.',
            })

            // 3. Redirect to the home page
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

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold mb-2">Settings</h1>
                <p className="text-gray-400">Manage your account settings and preferences.</p>
            </div>

            <Separator className="bg-white/10" />

            {/* Profile Card */}
            <Card className="bg-[#0a0a0a] border-white/10">
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription className="text-gray-400">Your personal information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {loading ? (
                        <div className="flex items-center gap-2 text-gray-500">
                            <Loader2 className="h-4 w-4 animate-spin" /> Loading profile...
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Full Name</Label>
                                <Input defaultValue={fullName} className="bg-black border-white/10 text-white" disabled />
                            </div>
                            <div className="space-y-2">
                                <Label>Email Address</Label>
                                <Input type="email" defaultValue={user?.email || ''} className="bg-black border-white/10 text-white" disabled />
                                <p className="text-xs text-gray-500">To change your email, please contact support.</p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Billing Card */}
            <Card className="bg-[#0a0a0a] border-white/10">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-indigo-400" />
                        <CardTitle>Billing & Plan</CardTitle>
                    </div>
                    <CardDescription className="text-gray-400">Your current subscription plan.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {loading ? (
                        <div className="flex items-center gap-2 text-gray-500">
                            <Loader2 className="h-4 w-4 animate-spin" /> Loading plan...
                        </div>
                    ) : (
                        <div className="bg-white/5 border border-white/10 rounded-lg p-5 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                                    <Zap className="h-5 w-5 text-indigo-400" />
                                </div>
                                <div>
                                    <p className={`font-semibold text-lg capitalize ${planInfo.color}`}>{planInfo.label} Plan</p>
                                    <p className="text-sm text-gray-400">{planInfo.description}</p>
                                </div>
                            </div>
                            <Button
                                onClick={handleUpgradeClick}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6"
                            >
                                Upgrade Plan
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Danger Zone Card */}
            <Card className="bg-red-950/20 border-red-900/50">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        <CardTitle className="text-red-500">Danger Zone</CardTitle>
                    </div>
                    <CardDescription className="text-red-400/80">
                        Permanently delete your account and all associated data. This action is irreversible.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between bg-red-900/10 border border-red-900/30 rounded-lg p-4">
                        <div>
                            <p className="font-medium text-red-400">Delete My Account</p>
                            <p className="text-xs text-red-400/60 mt-0.5">
                                Removes your profile, API keys, and all usage data permanently.
                            </p>
                        </div>
                        <Button
                            variant="destructive"
                            className="bg-red-600 hover:bg-red-700 text-white ml-4"
                            onClick={() => { setConfirmText(''); setIsDeleteDialogOpen(true) }}
                        >
                            Delete Account
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => { if (!isDeleting) setIsDeleteDialogOpen(open) }}>
                <DialogContent className="bg-[#0d0d0d] border-red-900/50 text-white max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                            </div>
                            <DialogTitle className="text-red-500 text-xl">Delete Your Account</DialogTitle>
                        </div>
                        <DialogDescription className="text-gray-400 text-sm leading-relaxed">
                            This will <span className="text-white font-semibold">permanently delete</span> your account,
                            all API keys, usage logs, and profile data. <br /><br />
                            <span className="text-red-400 font-medium">This cannot be undone.</span>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3 py-2">
                        <Label className="text-gray-300 text-sm">
                            Type <span className="font-bold text-white font-mono bg-white/5 px-1.5 py-0.5 rounded">DELETE</span> to confirm
                        </Label>
                        <Input
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            placeholder="Type DELETE here"
                            className="bg-black border-red-900/50 text-white placeholder:text-gray-600 focus:border-red-500"
                            disabled={isDeleting}
                        />
                    </div>

                    <DialogFooter className="gap-2 mt-2">
                        <Button
                            variant="ghost"
                            onClick={() => setIsDeleteDialogOpen(false)}
                            disabled={isDeleting}
                            className="text-gray-400 hover:text-white"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteAccount}
                            disabled={confirmText !== 'DELETE' || isDeleting}
                            className="bg-red-600 hover:bg-red-700 disabled:opacity-40"
                        >
                            {isDeleting ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...</>
                            ) : (
                                'Permanently Delete Account'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
