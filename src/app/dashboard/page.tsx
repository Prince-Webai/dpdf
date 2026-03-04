'use client'

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    BarChart3,
    FileText,
    Zap,
    Clock,
    CreditCard,
    ChevronRight,
    Activity,
    ShieldCheck,
    Loader2,
    CheckCircle2,
    XCircle,
    Info
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useProfile } from "@/context/profile-context"
import { createClient } from "@/utils/supabase/client"

interface UsageLog {
    id: string
    user_id: string
    action: string
    file_name?: string
    created_at: string
    status?: string
    credits_used?: number
}

export default function DashboardPage() {
    const { plan, creditPercentage, credits, creditLimit, user } = useProfile()
    const [isExporting, setIsExporting] = useState(false)

    // Real data states
    const [apiRequests24h, setApiRequests24h] = useState<number | null>(null)
    const [pdfsProcessed, setPdfsProcessed] = useState<number | null>(null)
    const [recentLogs, setRecentLogs] = useState<UsageLog[]>([])
    const [loadingStats, setLoadingStats] = useState(true)

    useEffect(() => {
        if (!user?.id) return

        const supabase = createClient()

        const fetchStats = async () => {
            setLoadingStats(true)
            try {
                // API requests in last 24h
                const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
                const { count: apiCount } = await supabase
                    .from('usage_logs')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id)
                    .gte('created_at', since24h)

                setApiRequests24h(apiCount ?? 0)

                // Total PDFs processed lifetime
                const { count: pdfCount } = await supabase
                    .from('usage_logs')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id)

                setPdfsProcessed(pdfCount ?? 0)

                // Recent activity logs
                const { data: logs } = await supabase
                    .from('usage_logs')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(5)

                setRecentLogs(logs ?? [])
            } catch (err) {
                console.error('Error fetching dashboard stats:', err)
            } finally {
                setLoadingStats(false)
            }
        }

        fetchStats()

        // Realtime subscription to usage_logs for live updates
        const channel = supabase
            .channel(`usage-logs-${user.id}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'usage_logs',
                filter: `user_id=eq.${user.id}`,
            }, () => {
                fetchStats()
            })
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [user?.id])

    const handleExport = () => {
        setIsExporting(true)
        setTimeout(() => {
            const reportData = {
                generatedAt: new Date().toISOString(),
                accountSummary: {
                    plan: plan,
                    totalCredits: credits,
                    creditLimit: creditLimit,
                    creditPercentageUsed: creditPercentage.toFixed(2) + "%",
                    apiRequestsLast24h: apiRequests24h ?? 0,
                    pdfsProcessedLifetime: pdfsProcessed ?? 0,
                },
                recentActivity: recentLogs.map(l => ({
                    id: l.id,
                    file: l.file_name || 'N/A',
                    time: new Date(l.created_at).toLocaleString(),
                    status: l.action,
                }))
            }

            const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `docunexu_report_${new Date().toISOString().split('T')[0]}.json`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
            setIsExporting(false)
        }, 800)
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
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } as any }
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-8"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 rounded-md bg-emerald-500/20 border border-emerald-500/30">
                            <Activity className="h-4 w-4 text-emerald-400" />
                        </div>
                        <span className="text-sm font-medium text-emerald-400">System Healthy</span>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Overview</h1>
                    <p className="text-gray-400 text-lg">Monitor your document metabolism and system health.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-10 bg-black border-white/10 hover:bg-white/5 text-gray-300">
                        <Clock className="mr-2 h-4 w-4" /> 7 Days
                    </Button>
                    <Button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="h-10 bg-white text-black w-[150px] hover:bg-gray-200 font-semibold shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all hover:scale-105 disabled:opacity-80"
                    >
                        {isExporting ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin text-indigo-500" /> Exporting...</>
                        ) : (
                            'Export Report'
                        )}
                    </Button>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                <motion.div variants={itemVariants}>
                    <StatCard
                        label="Credits Remaining"
                        value={credits.toLocaleString()}
                        sub={`of ${creditLimit.toLocaleString()} total`}
                        icon={Zap}
                        color="indigo"
                        loading={false}
                    />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <StatCard
                        label="API Requests"
                        value={loadingStats ? '—' : (apiRequests24h ?? 0).toLocaleString()}
                        sub="Last 24 hours"
                        icon={BarChart3}
                        color="cyan"
                        loading={loadingStats}
                    />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <StatCard
                        label="Operations Logged"
                        value={loadingStats ? '—' : (pdfsProcessed ?? 0).toLocaleString()}
                        sub="Lifetime total"
                        icon={FileText}
                        color="emerald"
                        loading={loadingStats}
                    />
                </motion.div>
            </motion.div>

            {/* Quick Tools */}
            <motion.div variants={itemVariants}>
                <Link href="/dashboard/tools/extract">
                    <Card className="bg-gradient-to-r from-emerald-900/40 to-indigo-900/40 border-white/10 p-8 hover:border-white/30 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-executive-gold/5 rounded-full blur-[100px] -mr-32 -mt-32 transition-opacity group-hover:opacity-100 opacity-0" />
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                            <div className="flex items-center gap-6">
                                <div className="p-4 rounded-2xl bg-white/10 border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                                    <Zap className="h-8 w-8 text-executive-gold" />
                                </div>
                                <div className="text-center md:text-left">
                                    <h2 className="text-2xl font-bold text-white mb-2">AI Parse Sandbox</h2>
                                    <p className="text-white/40 text-sm max-w-md">Test our extraction engine with your own documents in a zero-latency development environment.</p>
                                </div>
                            </div>
                            <Button className="bg-white text-black font-bold h-12 px-8 hover:bg-executive-gold hover:text-white transition-all">
                                Open Sandbox
                            </Button>
                        </div>
                    </Card>
                </Link>
            </motion.div>

            <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Recent Activity */}
                <motion.div variants={itemVariants} className="lg:col-span-2">
                    <Card className="bg-[#050505] border-white/5 p-6 h-full shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none transition-opacity duration-1000 group-hover:opacity-100 opacity-50" />

                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5 text-indigo-400" />
                                Activity Log
                            </h2>
                            <Link href="/dashboard/usage" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 flex items-center bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 transition-all hover:bg-indigo-500/20">
                                View all <ChevronRight className="ml-1 h-3 w-3" />
                            </Link>
                        </div>

                        <div className="space-y-1 relative z-10">
                            {loadingStats ? (
                                <div className="flex items-center justify-center h-32 text-gray-500 gap-2">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    <span className="text-sm">Loading activity...</span>
                                </div>
                            ) : recentLogs.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-32 text-center">
                                    <Info className="h-8 w-8 text-gray-600 mb-3" />
                                    <p className="text-gray-500 text-sm font-medium">No activity yet</p>
                                    <p className="text-gray-600 text-xs mt-1">Your API calls and document operations will appear here.</p>
                                </div>
                            ) : (
                                recentLogs.map((log, i) => {
                                    const isError = log.status === 'error' || log.status === 'failed'
                                    const color = isError ? 'text-red-400' : 'text-emerald-400'
                                    const bg = isError ? 'bg-red-500/10' : 'bg-emerald-500/10'
                                    const border = isError ? 'border-red-500/20' : 'border-emerald-500/20'
                                    const relTime = getRelativeTime(log.created_at)
                                    return (
                                        <motion.div
                                            key={log.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 + (i * 0.05) }}
                                            className="flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-white/5 hover:bg-white/[0.02] transition-all cursor-default"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2.5 rounded-xl ${bg} ${border} border shadow-inner`}>
                                                    {isError ? <XCircle className={`h-4 w-4 ${color}`} /> : <CheckCircle2 className={`h-4 w-4 ${color}`} />}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-gray-200">{log.action}</div>
                                                    <div className="text-xs text-gray-500 font-mono mt-0.5">
                                                        ID: {log.id.slice(0, 12)}…
                                                        {log.file_name && <span className="text-gray-400 font-sans"> · {log.file_name}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right flex flex-col items-end">
                                                <div className="text-xs text-gray-500">{relTime}</div>
                                                <span className={`mt-1 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm ${isError ? 'text-red-500 bg-red-500/10' : 'text-emerald-500 bg-emerald-500/10'}`}>
                                                    {isError ? 'Failed' : 'Completed'}
                                                </span>
                                            </div>
                                        </motion.div>
                                    )
                                })
                            )}
                        </div>
                    </Card>
                </motion.div>

                {/* Account Summary */}
                <div className="space-y-6 lg:space-y-8">
                    <motion.div variants={itemVariants}>
                        <Card className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-950 p-6 border border-indigo-500/30 text-white relative overflow-hidden group shadow-[0_0_40px_rgba(79,70,229,0.15)]">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700" />

                            <div className="relative z-10">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-200 mb-1">Active Plan</h3>
                                <div className="text-3xl font-extrabold mb-6 text-white capitalize">{plan} Tier</div>

                                <div className="space-y-3 mb-6 bg-black/20 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                                    <div className="flex justify-between text-sm items-end">
                                        <span className="text-indigo-100 font-medium">Credits Used</span>
                                        <span className="font-bold text-lg">{creditPercentage.toFixed(1)}%</span>
                                    </div>
                                    <div className="h-2.5 w-full bg-black/40 rounded-full overflow-hidden shadow-inner">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${creditPercentage}%` }}
                                            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                                            className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 relative"
                                        >
                                            <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]" />
                                        </motion.div>
                                    </div>
                                    <div className="text-xs text-indigo-200/70 text-right">
                                        {credits.toLocaleString()} / {creditLimit.toLocaleString()} credits
                                    </div>
                                </div>

                                <Button className="w-full bg-white text-indigo-900 hover:bg-gray-100 font-bold shadow-xl transition-transform hover:scale-[1.02]" asChild>
                                    <Link href="/pricing">Upgrade Limits</Link>
                                </Button>
                            </div>
                        </Card>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Card className="bg-[#050505] border-white/5 p-6 shadow-xl relative overflow-hidden">
                            <h3 className="text-lg font-bold mb-5 flex items-center gap-2 text-white">
                                <div className="p-1.5 rounded bg-white/5 border border-white/10">
                                    <CreditCard className="h-4 w-4 text-gray-400" />
                                </div>
                                Subscription
                            </h3>
                            <div className="space-y-4 text-sm">
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <span className="text-gray-400">Current Plan</span>
                                    <span className="text-white font-semibold capitalize">{plan}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <span className="text-gray-400">Next billing</span>
                                    <span className="text-white font-semibold text-xs">Managed via PayPal</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-400">Credits Available</span>
                                    <span className="text-white font-semibold">{credits.toLocaleString()}</span>
                                </div>
                                <div className="pt-2">
                                    <Link href="/pricing" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                                        View upgrade options →
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    )
}

function getRelativeTime(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins} min ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
}

function StatCard({ label, value, sub, icon: Icon, color = "indigo", loading = false }: any) {
    const colorMap: Record<string, string> = {
        indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20 group-hover:bg-indigo-500/20",
        cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20 group-hover:bg-cyan-500/20",
        emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 group-hover:bg-emerald-500/20",
        purple: "text-purple-400 bg-purple-500/10 border-purple-500/20 group-hover:bg-purple-500/20",
    }

    const iconStyle = colorMap[color]

    return (
        <Card className="bg-[#050505] border-white/5 p-6 transition-all duration-300 hover:border-white/10 hover:shadow-2xl hover:shadow-indigo-500/5 group relative overflow-hidden">
            <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${colorMap[color].split(' ')[1]}`} />

            <div className="flex items-start justify-between relative z-10">
                <div className={`p-3 rounded-xl border transition-all duration-300 group-hover:scale-110 ${iconStyle}`}>
                    <Icon className="h-5 w-5 currentColor" />
                </div>
            </div>
            <div className="mt-5 relative z-10">
                {loading ? (
                    <div className="h-9 w-20 bg-white/5 rounded animate-pulse" />
                ) : (
                    <div className="text-3xl font-extrabold tracking-tight text-white">{value}</div>
                )}
                <div className="text-sm font-semibold text-gray-400 mt-1">{label}</div>
                <div className="mt-1.5 text-xs text-gray-500 font-medium">{sub}</div>
            </div>
        </Card>
    )
}
