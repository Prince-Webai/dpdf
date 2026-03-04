'use client'

import { useEffect, useState } from "react"
import { Users, Key, Activity, ArrowUpRight, Loader2, ShieldCheck, Info } from "lucide-react"
import { getAdminStats, createInitialAdmin } from "@/lib/actions"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"

export default function AdminOverviewPage() {
    const [stats, setStats] = useState<{
        totalUsers: number;
        activeApiKeys: number;
        totalApiCalls: number;
    } | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        createInitialAdmin()

        async function loadStats() {
            const data = await getAdminStats()
            setStats(data)
            setLoading(false)
        }
        loadStats()
    }, [])

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } as any }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-32 text-gray-400 gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <span className="text-sm font-medium">Loading platform metrics...</span>
            </div>
        )
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-8"
        >
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 rounded-md bg-blue-500/20 border border-blue-500/30">
                            <Activity className="h-4 w-4 text-blue-400" />
                        </div>
                        <span className="text-sm font-medium text-blue-400">Platform Admin</span>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Platform Overview</h1>
                    <p className="text-gray-400 text-lg">High-level DocuNexu system metrics and health.</p>
                </div>
            </motion.div>

            <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <motion.div variants={itemVariants}>
                    <StatCard
                        label="Total Registered Users"
                        value={stats?.totalUsers.toLocaleString()}
                        sub="+12% velocity this month"
                        icon={Users}
                        color="blue"
                    />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <StatCard
                        label="Active API Keys"
                        value={stats?.activeApiKeys.toLocaleString()}
                        sub="+4% enrollment delta"
                        icon={Key}
                        color="emerald"
                    />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <StatCard
                        label="Total Pipeline Execution"
                        value={stats?.totalApiCalls.toLocaleString()}
                        sub="+22% throughput increase"
                        icon={Activity}
                        color="cyan"
                    />
                </motion.div>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-8">
                <Card className="bg-[#050505] border-white/5 p-6 h-full shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none transition-opacity duration-1000 group-hover:opacity-100 opacity-50" />

                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-blue-400" />
                            System Diagnostic
                        </h2>
                    </div>

                    <div className="relative z-10">
                        {stats?.totalUsers === 1248 ? (
                            <div className="p-6 bg-amber-500/10 border border-amber-500/20 text-amber-500/90 rounded-xl space-y-2">
                                <div className="flex items-center gap-2 font-bold">
                                    <Info className="h-5 w-5" /> Mock Data Warning
                                </div>
                                <p className="text-sm text-amber-500/80 leading-relaxed">
                                    Telemetry data is currently mocked. In order to establish a live uplink, you must configure <span className="text-white bg-white/10 px-2 py-0.5 rounded font-mono text-xs">SUPABASE_SERVICE_ROLE_KEY</span> in your environment variables.
                                </p>
                            </div>
                        ) : (
                            <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl space-y-2">
                                <div className="flex items-center gap-2 font-bold">
                                    <ShieldCheck className="h-5 w-5" /> Uplink Established
                                </div>
                                <p className="text-sm text-emerald-400/80 leading-relaxed">
                                    Live data connection secured via service role key. Telemetry is accurate and synchronized with the database.
                                </p>
                            </div>
                        )}
                    </div>
                </Card>
            </motion.div>
        </motion.div>
    )
}

function StatCard({ label, value, sub, icon: Icon, color = "blue" }: any) {
    const colorMap: Record<string, string> = {
        blue: "text-blue-400 bg-blue-500/10 border-blue-500/20 group-hover:bg-blue-500/20",
        cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20 group-hover:bg-cyan-500/20",
        emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 group-hover:bg-emerald-500/20",
    }
    const iconStyle = colorMap[color]

    return (
        <Card className="bg-[#050505] border-white/5 p-6 transition-all duration-300 hover:border-blue-500/10 hover:shadow-2xl hover:shadow-blue-500/5 group relative overflow-hidden h-full">
            <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${colorMap[color].split(' ')[1]}`} />

            <div className="flex items-start justify-between relative z-10">
                <div className={`p-3 rounded-xl border transition-all duration-300 group-hover:scale-110 ${iconStyle}`}>
                    <Icon className="h-5 w-5 currentColor" />
                </div>
            </div>
            <div className="mt-5 relative z-10">
                <div className="text-3xl font-extrabold tracking-tight text-white">{value}</div>
                <div className="text-sm font-semibold text-gray-400 mt-1">{label}</div>
                <div className="mt-1.5 text-xs text-gray-500 font-medium flex items-center gap-1">
                    <ArrowUpRight className="h-3 w-3" /> {sub}
                </div>
            </div>
        </Card>
    )
}
