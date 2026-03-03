'use client'

import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Calendar, Network, Database, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useProfile } from '@/context/profile-context';
import { useRouter } from 'next/navigation';

export default function UsagePage() {
    const router = useRouter();
    const { user, profile, plan, fullName, credits, creditLimit, loading } = useProfile();

    const creditPercentage = Math.min(100, Math.max(0, ((creditLimit - credits) / Math.max(creditLimit, 1)) * 100));

    const usageStats = [
        { label: 'API Extracts', current: (creditLimit - credits).toLocaleString(), total: creditLimit.toLocaleString(), percentage: creditPercentage, icon: Network },
        { label: 'Cloud Storage', current: '0 MB', total: '1 GB', percentage: 0, icon: Database },
        { label: 'Compute Power', current: '0h', total: 'Unlimited', percentage: 0, icon: Cpu },
    ];

    if (loading) return <div className="flex items-center justify-center p-24 font-mono text-[10px] tracking-widest text-white/40 animate-pulse uppercase">SYNCHRONIZING REPOSITORY...</div>;

    const getFirstName = () => fullName ? fullName.split(' ')[0] : 'Strategic';
    const getLastName = () => {
        const parts = fullName ? fullName.split(' ') : [];
        return parts.length > 1 ? parts.slice(1).join(' ') : 'Commander';
    };

    const accountId = user?.id ? `NEX-${user.id.slice(0, 8).toUpperCase()}` : 'NEX-8829-XQ-01';
    const joinedDate = profile?.created_at ? new Date(profile.created_at).toLocaleDateString(undefined, { month: 'long', day: '2-digit', year: 'numeric' }) : 'March 02, 2024';

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-24">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
                <div className="max-w-2xl">
                    <p className="text-[10px] tracking-[0.4em] uppercase text-executive-gold mb-6 flex items-center gap-3">
                        <span className="w-8 h-[1px] bg-executive-gold"></span> Account Identity
                    </p>
                    <h1 className="font-serif text-5xl md:text-7xl text-white font-normal leading-tight tracking-tight">
                        {getFirstName()} <br /><span className="text-white/20 italic">{getLastName()}</span>
                    </h1>
                </div>
                <div className="bg-executive-panel border border-white/[0.05] p-8 min-w-[320px] abstract-texture">
                    <div className="flex items-center justify-between mb-8">
                        <span className="text-[10px] tracking-[0.2em] uppercase text-white/30">Current Tier</span>
                        <span className="px-3 py-1 bg-executive-gold/10 text-executive-gold text-[9px] tracking-[0.2em] uppercase border border-executive-gold/20 capitalize">{plan} Elite</span>
                    </div>
                    <div className="space-y-4">
                        <p className="text-white/50 text-sm font-light leading-relaxed">Your account is currently operating at maximum strategic capacity.</p>
                        <Link href="/pricing" className="block text-center w-full py-3 border border-executive-gold/30 text-executive-gold text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-executive-gold hover:text-black transition-all duration-500">
                            Upgrade Plan
                        </Link>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div className="lg:col-span-7 space-y-12">
                    <div className="border-b border-white/[0.05] pb-6">
                        <h2 className="font-serif text-3xl text-white mb-2">Account Details</h2>
                        <p className="text-white/30 font-light text-sm tracking-wide">Verified administrative credentials.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-16">
                        {[
                            { label: 'Full Name', value: fullName || 'Unspecified', icon: User },
                            { label: 'Email Address', value: user?.email || 'Unspecified', icon: Mail },
                            { label: 'Account ID', value: accountId, icon: Shield },
                            { label: 'Joined Date', value: joinedDate, icon: Calendar },
                        ].map((item, i) => (
                            <motion.div
                                key={item.label}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="space-y-3 group"
                            >
                                <div className="flex items-center gap-3 text-white/20 group-hover:text-executive-gold transition-colors">
                                    <item.icon className="w-4 h-4 stroke-[1px]" />
                                    <span className="text-[9px] tracking-[0.2em] uppercase">{item.label}</span>
                                </div>
                                <p className="text-white font-sans font-light tracking-wide">{item.value}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
                <div className="lg:col-span-5 space-y-12">
                    <div className="border-b border-white/[0.05] pb-6">
                        <h2 className="font-serif text-3xl text-white mb-2">Usage Summary</h2>
                        <p className="text-white/30 font-light text-sm tracking-wide">Monthly resource allocation.</p>
                    </div>

                    <div className="space-y-10">
                        {usageStats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + (i * 0.1) }}
                                className="space-y-4"
                            >
                                <div className="flex justify-between items-end">
                                    <div className="flex items-center gap-3">
                                        <stat.icon className="w-4 h-4 text-executive-gold stroke-[1px]" />
                                        <span className="text-[10px] tracking-[0.2em] uppercase text-white/50">{stat.label}</span>
                                    </div>
                                    <span className="text-[11px] font-sans text-white/80 tracking-wider">
                                        {stat.current} <span className="text-white/20 mx-1">/</span> {stat.total}
                                    </span>
                                </div>
                                <div className="h-[2px] bg-white/[0.05] w-full relative">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${stat.percentage}%` }} transition={{ duration: 1.5, ease: "circOut", delay: 0.6 }} className="absolute top-0 left-0 h-full bg-executive-gold shadow-[0_0_10px_rgba(156,130,74,0.4)]" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
