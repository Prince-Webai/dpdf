'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, CreditCard, Shield, Trash2, ArrowUpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useProfile } from '@/context/profile-context';
import { createClient } from '@/utils/supabase/client';
import { deleteSelfAccount } from '@/lib/actions';
import { toast } from '@/hooks/use-toast';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function SettingsPage() {
    const { user, plan, fullName, loading } = useProfile();
    const router = useRouter();
    const supabase = createClient();

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [confirmText, setConfirmText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);




    const handleDeleteAccount = async () => {
        if (confirmText !== 'DELETE') return;
        setIsDeleting(true);
        try {
            const result = await deleteSelfAccount();
            if (!result.success) {
                toast({ title: 'Deletion failed', description: result.error || 'Something went wrong.', variant: 'destructive' });
                setIsDeleting(false);
                return;
            }
            await supabase.auth.signOut();
            toast({ title: 'Account deleted' });
            router.push('/');
            router.refresh();
        } catch (err: any) {
            toast({ title: 'Error', description: err.message, variant: 'destructive' });
            setIsDeleting(false);
        }
    };

    if (loading) return <div className="flex items-center justify-center p-24 font-mono text-[10px] tracking-widest text-white/40 animate-pulse uppercase">SYNCHRONIZING PROTOCOLS...</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-4xl mx-auto space-y-24">
            <div className="border-b border-white/[0.05] pb-8">
                <h1 className="font-serif text-5xl text-white mb-4">Settings</h1>
                <p className="text-white/30 font-light tracking-wide">Configure your strategic environment and account preferences.</p>
            </div>

            <section className="space-y-12">
                <h2 className="font-serif text-2xl text-white flex items-center gap-4"><User className="text-executive-gold w-5 h-5 stroke-[1px]" /> Profile Configuration</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-2">
                        <label className="text-[10px] tracking-[0.2em] uppercase text-white/30">Full Name</label>
                        <div className="bg-white/[0.02] border border-white/[0.05] p-4 text-white font-light font-sans">{fullName || 'Unspecified'}</div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] tracking-[0.2em] uppercase text-white/30">Email Address</label>
                        <div className="bg-white/[0.02] border border-white/[0.05] p-4 text-white font-light font-sans">{user?.email || 'Unspecified'}</div>
                    </div>
                </div>
            </section>

            <section className="space-y-12">
                <h2 className="font-serif text-2xl text-white flex items-center gap-4"><CreditCard className="text-executive-gold w-5 h-5 stroke-[1px]" /> Billing & Subscription</h2>
                <div className="bg-executive-panel border border-white/[0.05] p-8 abstract-texture flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="space-y-2">
                        <p className="text-[10px] tracking-[0.2em] uppercase text-white/30">Active Plan</p>
                        <p className="font-serif text-3xl text-white capitalize">{plan} Elite</p>
                        <p className="text-white/50 text-sm font-light">Billed annually.</p>
                    </div>
                    <Link href="/pricing" className="px-8 py-4 border border-executive-gold/30 text-executive-gold text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-executive-gold hover:text-black transition-all duration-500 flex items-center gap-3">
                        <ArrowUpCircle className="w-4 h-4" />
                        Upgrade Plan
                    </Link>
                </div>
            </section>

            <section className="space-y-12 pt-12 border-t border-white/[0.05]">
                <h2 className="font-serif text-2xl text-white flex items-center gap-4"><Shield className="text-red-500/50 w-5 h-5 stroke-[1px]" /> Account Management</h2>
                <div className="bg-red-500/[0.02] border border-red-500/10 p-8 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="space-y-2">
                        <p className="text-white font-sans font-medium">Delete Account</p>
                        <p className="text-white/40 text-sm font-light">Permanently remove your account and all associated strategic data. This action is irreversible.</p>
                    </div>
                    <button onClick={() => { setConfirmText(''); setIsDeleteDialogOpen(true) }} className="px-8 py-4 border border-red-500/30 text-red-500/70 text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-red-500 hover:text-white transition-all duration-500 flex items-center gap-3">
                        <Trash2 className="w-4 h-4" />
                        Delete My Account
                    </button>
                </div>
            </section>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => { if (!isDeleting) setIsDeleteDialogOpen(open) }}>
                <DialogContent className="bg-executive-panel border border-white/[0.05] text-white rounded-none p-12 max-w-lg">
                    <DialogHeader className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Shield className="h-5 w-5 text-red-500" />
                            <DialogTitle className="text-3xl font-serif text-white">Critical Protocol</DialogTitle>
                        </div>
                        <DialogDescription className="font-mono text-[10px] text-white/40 uppercase tracking-widest leading-loose">
                            TYPE <span className="text-white">DELETE</span> TO AUTHORIZE PERMANENT SYSTEM PURGE. ALL DATA WILL BE ZEROED.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-8 space-y-6">
                        <Input
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            placeholder="AUTHORIZATION_CODE"
                            className="bg-executive-black border-white/10 text-white font-mono text-center tracking-[0.5em] rounded-none py-8 focus:border-red-500 uppercase transition-all"
                            disabled={isDeleting}
                        />

                        <div className="flex gap-4">
                            <Button
                                variant="ghost"
                                onClick={() => setIsDeleteDialogOpen(false)}
                                disabled={isDeleting}
                                className="flex-1 border border-white/10 rounded-none font-mono text-[10px] uppercase tracking-widest hover:bg-white/5"
                            >
                                ABORT
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDeleteAccount}
                                disabled={confirmText !== 'DELETE' || isDeleting}
                                className="flex-1 bg-red-500/80 text-white rounded-none font-mono text-[10px] uppercase tracking-widest hover:bg-red-600 disabled:opacity-20"
                            >
                                {isDeleting ? 'PURGING...' : 'AUTHORIZE PURGE'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
}
