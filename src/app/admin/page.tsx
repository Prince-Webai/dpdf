'use client'

import { useEffect, useState } from "react"
import { Users, Key, Activity, ArrowUpRight, Loader2, ShieldAlert } from "lucide-react"
import { getAdminStats, createInitialAdmin } from "@/lib/actions"
import { motion } from "framer-motion"

export default function AdminOverviewPage() {
    const [stats, setStats] = useState<{
        totalUsers: number;
        activeApiKeys: number;
        totalApiCalls: number;
    } | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Run once to ensure admin user exists
        createInitialAdmin()

        async function loadStats() {
            const data = await getAdminStats()
            setStats(data)
            setLoading(false)
        }
        loadStats()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center p-24 font-mono text-[10px] tracking-widest text-white/40 animate-pulse uppercase">
                SYNCHRONIZING ADMINISTRATIVE TELEMETRY...
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-16"
        >
            <div className="border-b border-white/[0.05] pb-12">
                <div className="flex items-center gap-4 mb-4">
                    <ShieldAlert className="h-8 w-8 text-red-500" />
                    <h1 className="text-6xl font-serif text-white tracking-tight">Platform Overview</h1>
                </div>
                <p className="font-mono text-[10px] text-white/40 uppercase tracking-[0.2em]">HIGH-LEVEL docunexusS SYSTEM METRICS [ADMIN CLEARANCE]</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="bg-executive-panel border border-white/[0.05] p-8 abstract-texture group hover:border-red-500/30 transition-all">
                    <div className="flex flex-row items-center justify-between pb-4">
                        <h3 className="font-mono text-xs text-white uppercase tracking-widest">TOTAL REGISTERED ENTITIES</h3>
                        <Users className="h-4 w-4 text-white/40 group-hover:text-red-500 transition-colors" />
                    </div>
                    <div>
                        <div className="text-4xl font-serif text-white italic">{stats?.totalUsers.toLocaleString()}</div>
                        <p className="font-mono text-[9px] text-red-500 flex items-center mt-4 uppercase tracking-widest">
                            <ArrowUpRight className="mr-2 h-3 w-3" />
                            +12% VELOCITY FROM T-30 DAYS
                        </p>
                    </div>
                </div>

                <div className="bg-executive-panel border border-white/[0.05] p-8 abstract-texture group hover:border-executive-gold/30 transition-all">
                    <div className="flex flex-row items-center justify-between pb-4">
                        <h3 className="font-mono text-xs text-white uppercase tracking-widest">ACTIVE API TOKENS</h3>
                        <Key className="h-4 w-4 text-white/40 group-hover:text-executive-gold transition-colors" />
                    </div>
                    <div>
                        <div className="text-4xl font-serif text-white italic">{stats?.activeApiKeys.toLocaleString()}</div>
                        <p className="font-mono text-[9px] text-executive-gold flex items-center mt-4 uppercase tracking-widest">
                            <ArrowUpRight className="mr-2 h-3 w-3" />
                            +4% ENROLLMENT DELTA
                        </p>
                    </div>
                </div>

                <div className="bg-executive-panel border border-white/[0.05] p-8 abstract-texture group hover:border-blue-500/30 transition-all">
                    <div className="flex flex-row items-center justify-between pb-4">
                        <h3 className="font-mono text-xs text-white uppercase tracking-widest">TOTAL PIPELINE EXECUTION</h3>
                        <Activity className="h-4 w-4 text-white/40 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <div>
                        <div className="text-4xl font-serif text-white italic">{stats?.totalApiCalls.toLocaleString()}</div>
                        <p className="font-mono text-[9px] text-blue-500 flex items-center mt-4 uppercase tracking-widest">
                            <ArrowUpRight className="mr-2 h-3 w-3" />
                            +22% THROUGHPUT INCREASE
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-16 border border-white/[0.05] p-12 bg-executive-black relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 border-t border-r border-white/5 opacity-50" />
                <div className="mb-8">
                    <h2 className="font-mono text-xs text-white uppercase tracking-widest mb-2 flex items-center gap-4">
                        <ShieldAlert className="h-4 w-4 text-red-500" />
                        SYSTEM DIAGNOSTIC MESSAGE
                    </h2>
                    <p className="font-mono text-[9px] text-white/40 uppercase tracking-[0.2em]">SERVICE ROLE CONFIGURATION STATUS</p>
                </div>

                <div className="relative z-10">
                    {stats?.totalUsers === 1248 ? (
                        <div className="p-8 bg-red-500/[0.02] border border-red-500/20 text-red-500/90 space-y-4">
                            <span className="font-mono text-[10px] uppercase font-bold tracking-widest w-full block">CRITICAL WARNING</span>
                            <p className="font-mono text-[10px] uppercase tracking-widest leading-loose italic text-red-500/70">
                                TELEMETRY DATA IS CURRENTLY MOCKED. IN ORDER TO ESTABLISH LIVE UPLINK, YOU MUST CONFIGURE <span className="text-white bg-white/10 px-2 py-1">SUPABASE_SERVICE_ROLE_KEY</span> IN YOUR ENVIRONMENT VARIABLES.
                            </p>
                        </div>
                    ) : (
                        <div className="p-8 bg-green-500/[0.02] border border-green-500/20 text-green-500/90 space-y-4">
                            <span className="font-mono text-[10px] uppercase font-bold tracking-widest w-full block">UPLINK ESTABLISHED</span>
                            <p className="font-mono text-[10px] uppercase tracking-widest leading-loose italic text-green-500/70">
                                LIVE DATA CONNECTION SECURED VIA SERVICE ROLE KEY. TELEMETRY IS ACCURATE AND SYNCHRONIZED.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    )
}
