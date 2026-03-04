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
<<<<<<< HEAD
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
                        <Link href="/pricing" className="block text-center w-full py-3 border border-executive-gold/30 text-executive-gold text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-executive-gold hover:text-black transition-all duration-500 rounded-none">
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
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${stat.percentage}%` }} transition={{ duration: 1.5, ease: "circOut", delay: 0.6 }} className="absolute top-0 left-0 h-full bg-executive-gold shadow-[0_0_10px_rgba(59,130,246,0.4)]" />
=======
        <div className="space-y-10">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold tracking-tight text-white">Utilization Intelligence</h1>
                <p className="text-white/40 text-[13px] font-medium uppercase tracking-widest">Quota & Performance monitoring</p>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                        <Card className="bg-white/5 backdrop-blur-3xl border-white/10 rounded-[2.5rem] p-8 hover:bg-white/[0.08] transition-all group relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl" />
                            <CardHeader className="p-0 mb-4">
                                <CardTitle className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Active Subscription</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="text-4xl font-black text-white capitalize tracking-tighter">{plan}</div>
                                <p className="text-xs text-blue-400/50 mt-2 font-medium">Standard enterprise grade</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/5 backdrop-blur-3xl border-white/10 rounded-[2.5rem] p-8 hover:bg-white/[0.08] transition-all group relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl" />
                            <CardHeader className="p-0 mb-4">
                                <CardTitle className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Available Credits</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="text-4xl font-black text-white tracking-tighter">
                                    {credits.toLocaleString()}
                                    <span className="text-xl text-white/10 font-medium tracking-normal ml-2">/ {creditLimit.toLocaleString()}</span>
                                </div>
                                <p className="text-xs text-emerald-400/50 mt-2 font-medium">Auto-renewing monthly</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="max-w-3xl">
                        <Card className="bg-white/5 backdrop-blur-3xl border-white/10 rounded-[3rem] p-10 overflow-hidden shadow-2xl relative">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[100px]" />
                            <CardHeader className="p-0 mb-8">
                                <CardTitle className="text-xl font-bold text-white tracking-tight">Consumption Velocity</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="flex justify-between items-end mb-4">
                                    <div className="flex flex-col">
                                        <span className="text-5xl font-black text-white tracking-tighter">{Math.max(0, creditsUsed).toLocaleString()}</span>
                                        <span className="text-[10px] text-white/30 font-bold uppercase tracking-[0.2em] mt-1">Credits Invoiced</span>
                                    </div>
                                    <span className="text-xs font-bold text-white/40 uppercase tracking-widest">{usagePercent.toFixed(1)}% Velocity</span>
                                </div>
                                <div className="w-full bg-white/5 rounded-full h-4 p-1 ring-1 ring-white/10 shadow-inner overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                                        style={{ width: `${usagePercent}%` }}
                                    />
>>>>>>> 9d56d33 (feat: redesign dashboard with realtime intelligence and fluid UI)
                                </div>
                            </motion.div>
                        ))}
                    </div>
<<<<<<< HEAD
                </div>
            </div>
        </motion.div>
    );
=======

                    <Card className="bg-white/5 backdrop-blur-3xl border-white/10 rounded-[3rem] p-10 shadow-2xl overflow-hidden relative group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <h3 className="text-xl font-bold text-white tracking-tight mb-10">Network Traffic (7D Window)</h3>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <defs>
                                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                                            <stop offset="100%" stopColor="#6366f1" stopOpacity={0.4} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="name"
                                        stroke="rgba(255,255,255,0.1)"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ fill: 'rgba(255,255,255,0.3)', fontWeight: 600 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        stroke="rgba(255,255,255,0.1)"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ fill: 'rgba(255,255,255,0.3)', fontWeight: 600 }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 8 }}
                                        contentStyle={{
                                            backgroundColor: 'rgba(10,10,10,0.8)',
                                            backdropFilter: 'blur(12px)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '16px',
                                            color: '#fff',
                                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                            padding: '12px'
                                        }}
                                        itemStyle={{ color: '#60a5fa', fontWeight: 700 }}
                                        labelStyle={{ color: 'rgba(255,255,255,0.5)', marginBottom: '4px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                                    />
                                    <Bar
                                        dataKey="calls"
                                        fill="url(#barGradient)"
                                        radius={[12, 12, 4, 4]}
                                        barSize={32}
                                        animationDuration={1500}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </>
            )}
        </div>
    )
>>>>>>> 9d56d33 (feat: redesign dashboard with realtime intelligence and fluid UI)
}
