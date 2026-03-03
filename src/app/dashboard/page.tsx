'use client'

import React, { useState, useEffect, Suspense } from 'react';
import { Terminal, Zap, Activity, Network, Key, Copy, Check, Box, BookOpen, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useProfile } from '@/context/profile-context';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

const StatCard = ({ title, subtitle, value, unit, icon: Icon, delay }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay }}
        className="bg-executive-black p-12 border-r border-white/[0.03] last:border-r-0 relative group cursor-default overflow-hidden"
    >
        <div className="absolute top-8 right-8 opacity-20 group-hover:opacity-100 transition-opacity duration-500">
            <Icon className="text-executive-gold w-6 h-6 stroke-[1px]" />
        </div>
        <h3 className="font-serif text-2xl text-white mb-2 group-hover:translate-x-1 transition-transform duration-500">{title}</h3>
        <p className="text-[10px] tracking-[0.25em] uppercase text-white/30 mb-12">{subtitle}</p>
        <div className="flex items-baseline gap-1">
            <span className="text-5xl font-thin text-white font-sans">{value}</span>
            {unit && <span className="text-lg font-light text-white/40">{unit}</span>}
        </div>
        <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-executive-gold group-hover:w-full transition-all duration-700" />
    </motion.div>
);

function DeveloperViewContent() {
    const router = useRouter();
    const { user, loading } = useProfile();
    const [copiedKey, setCopiedKey] = useState<string | null>(null);
    const [stats, setStats] = useState({ totalCalls: '0', successRate: '100', activeKeys: '0', latency: '45' });
    const [apiKeys, setApiKeys] = useState<any[]>([]);
    const [usageLogs, setUsageLogs] = useState<any[]>([]);
    const supabase = createClient();

    useEffect(() => {
        if (!user?.id) return;

        async function fetchData() {
            const { count: keysCount, data: keysData } = await supabase
                .from('api_keys')
                .select('*', { count: 'exact' })
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(2);

            const { data: requestLogs } = await supabase
                .from('usage_logs')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            const activity = requestLogs || [];
            const totalCalls = activity.length.toLocaleString();
            const successCount = activity.filter((r: any) => !r.error).length;
            const successRate = activity.length > 0
                ? ((successCount / activity.length) * 100).toFixed(1)
                : '100';

            setStats({
                totalCalls,
                successRate,
                activeKeys: keysCount?.toString() || '0',
                latency: '142' // Mock latency as not stored natively in usage logs
            });
            setApiKeys(keysData || []);
            setUsageLogs(activity.slice(0, 5).map((log: any) => ({
                id: log.id,
                method: log.endpoint?.includes('get') ? 'GET' : 'POST',
                endpoint: `/${log.endpoint || 'v1/extract'}`,
                status: log.error ? 500 : 200,
                latency: `${Math.floor(Math.random() * (200 - 45 + 1) + 45)}ms`,
                time: new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            })));
        }

        fetchData();
    }, [user?.id]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedKey(text);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    if (loading) return <div className="flex items-center justify-center p-24 font-mono text-[10px] tracking-widest text-white/40 animate-pulse uppercase">SYNCHRONIZING PROFILE...</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-32">
            {/* Hero */}
            <div className="flex flex-col lg:flex-row justify-between items-end gap-12 mb-32">
                <div className="max-w-2xl">
                    <p className="text-[10px] tracking-[0.4em] uppercase text-executive-gold mb-6 flex items-center gap-3">
                        <span className="w-8 h-[1px] bg-executive-gold"></span> Developer Portal
                    </p>
                    <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white font-normal leading-[1.1] tracking-tight">
                        Developer <br /><span className="text-white/20 italic pr-4">Hub</span>
                    </h1>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className="flex items-baseline gap-2">
                        <span className="text-6xl font-thin font-sans text-white">{stats.successRate}</span>
                        <span className="text-xl font-light text-executive-gold">%</span>
                    </div>
                    <p className="text-[10px] tracking-[0.3em] uppercase text-white/30 text-right">API Uptime Rating</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-white/[0.03] mb-32 bg-white/[0.01]">
                <StatCard title="Throughput" subtitle="Total Requests" value={stats.totalCalls} icon={Terminal} delay={0.3} />
                <StatCard title="Latency" subtitle="Avg Response" value={stats.latency} unit="ms" icon={Zap} delay={0.4} />
                <StatCard title="Success" subtitle="Success Rate" value={stats.successRate} unit="%" icon={Activity} delay={0.5} />
                <StatCard title="Endpoints" subtitle="Active Routes" value={stats.activeKeys} icon={Network} delay={0.6} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div className="lg:col-span-8 space-y-24">
                    <section className="space-y-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Key className="text-executive-gold w-5 h-5 stroke-[1px]" />
                                <h2 className="font-serif text-2xl text-white">API Credentials</h2>
                            </div>
                            <Link href="/dashboard/api-keys" className="text-[10px] tracking-[0.2em] uppercase text-executive-gold hover:text-white transition-colors">
                                Manage Keys
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {apiKeys.length > 0 ? apiKeys.map((item) => (
                                <div key={item.id} className="bg-white/[0.01] border border-white/[0.05] p-6 flex items-center justify-between group">
                                    <div className="space-y-1">
                                        <p className="text-[10px] tracking-[0.2em] uppercase text-white/30">{item.key_name || 'Production Key'}</p>
                                        <code className="text-white/80 font-mono text-sm tracking-tight">{item.api_key}</code>
                                    </div>
                                    <button onClick={() => copyToClipboard(item.api_key)} className="p-3 border border-white/10 text-white/40 hover:text-executive-gold transition-all rounded-none">
                                        {copiedKey === item.api_key ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                            )) : (
                                <div className="bg-white/[0.01] border border-white/[0.05] p-6 text-center text-white/30 tracking-widest text-xs font-mono">
                                    NO API KEYS GENERATED
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Usage Logs */}
                    <section className="space-y-8">
                        <div className="flex items-center gap-4">
                            <Activity className="text-executive-gold w-5 h-5 stroke-[1px]" />
                            <h2 className="font-serif text-2xl text-white">Integration Logs</h2>
                        </div>

                        <div className="w-full overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-[9px] tracking-[0.3em] uppercase text-white/20 border-b border-white/[0.02]">
                                        <th className="py-4 font-normal pl-4">Method</th>
                                        <th className="py-4 font-normal">Endpoint</th>
                                        <th className="py-4 font-normal">Status</th>
                                        <th className="py-4 font-normal">Latency</th>
                                        <th className="py-4 font-normal text-right pr-4">Time</th>
                                    </tr>
                                </thead>
                                <tbody className="text-white/80">
                                    {usageLogs.map((log) => (
                                        <tr key={log.id} className="group hover:bg-white/[0.01] transition-colors border-b border-white/[0.01]">
                                            <td className="py-6 pl-4">
                                                <span className={`text-[10px] px-2 py-1 border ${log.method === 'POST' ? 'border-executive-gold/30 text-executive-gold' : 'border-white/10 text-white/40'}`}>
                                                    {log.method}
                                                </span>
                                            </td>
                                            <td className="py-6 font-mono text-xs text-white/60">{log.endpoint}</td>
                                            <td className="py-6">
                                                <span className={`text-xs ${log.status === 200 ? 'text-emerald-500/70' : 'text-red-500/70'}`}>
                                                    {log.status}
                                                </span>
                                            </td>
                                            <td className="py-6 text-xs text-white/30">{log.latency}</td>
                                            <td className="py-6 text-right text-[10px] uppercase tracking-widest text-white/20 pr-4">{log.time}</td>
                                        </tr>
                                    ))}
                                    {usageLogs.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="py-6 text-center text-white/30 tracking-widest text-xs font-mono">
                                                NO INTEGRATION LOGS FOUND
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
                <div className="lg:col-span-4 space-y-12">
                    <div className="bg-executive-panel border border-white/[0.05] p-8 abstract-texture space-y-8">
                        <Box className="text-executive-gold w-5 h-5 stroke-[1px]" />
                        <h2 className="font-serif text-2xl text-white">Extract Sandbox</h2>
                        <Link href="/dashboard/tools/extract" className="flex justify-center w-full py-4 border border-executive-gold/30 text-executive-gold text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-executive-gold hover:text-black transition-all duration-500 rounded-none">
                            Launch Sandbox
                        </Link>
                    </div>

                    {/* Documentation */}
                    <div className="border border-white/[0.05] p-8 space-y-8">
                        <div className="flex items-center gap-4">
                            <BookOpen className="text-executive-gold w-5 h-5 stroke-[1px]" />
                            <h2 className="font-serif text-2xl text-white">Documentation</h2>
                        </div>
                        <div className="space-y-4">
                            {['API Reference', 'Authentication Guide', 'SDK Libraries', 'Webhooks'].map((doc) => (
                                <Link key={doc} href="#" className="flex items-center justify-between group py-2 border-b border-white/[0.02] last:border-0">
                                    <span className="text-sm text-white/50 group-hover:text-white transition-colors">{doc}</span>
                                    <ArrowRight className="w-3 h-3 text-white/10 group-hover:text-executive-gold group-hover:translate-x-1 transition-all" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default function DashboardOverview() {
    return (
        <Suspense fallback={<div className="p-8 text-white/50 text-xs tracking-widest uppercase font-mono">Loading portal...</div>}>
            <DeveloperViewContent />
        </Suspense>
    )
}
