'use client'

import { useState, useEffect, Suspense } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
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
    Info,
    Star,
    Shield,
    User
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useProfile } from "@/context/profile-context"
import { createClient } from "@/utils/supabase/client"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface UsageLog {
    id: string
    user_id: string
    action: string
    file_name?: string
    created_at: string
    status?: string
    credits_used?: number
}

function DashboardOverviewContent() {
    const { plan, creditPercentage, credits, creditLimit, user, fullName } = useProfile()
    const router = useRouter()
    const [isExporting, setIsExporting] = useState(false)
    const [isDevView, setIsDevView] = useState(false)

    // Real data states
    const [apiRequests24h, setApiRequests24h] = useState<number>(0)
    const [pdfsProcessed, setPdfsProcessed] = useState<number>(0)
    const [recentLogs, setRecentLogs] = useState<UsageLog[]>([])
    const [loadingStats, setLoadingStats] = useState(true)
    const [stats, setStats] = useState({
        totalCalls: 0,
        successRate: 100,
        activeKeys: 0
    })

    const fetchStats = async () => {
        if (!user?.id) return
        const supabase = createClient()

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

            // Fetch active keys count
            const { count: keyCount } = await supabase
                .from('api_keys')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .eq('status', 'active')

            // Fetch total calls for success rate calculation
            const { data: allLogs } = await supabase
                .from('usage_logs')
                .select('status')
                .eq('user_id', user.id)

            const total = allLogs?.length || 0
            const success = allLogs?.filter(l => l.status !== 'error' && l.status !== 'failed').length || 0
            const rate = total > 0 ? Math.round((success / total) * 100) : 100

            setStats({
                totalCalls: total,
                successRate: rate,
                activeKeys: keyCount ?? 0
            })

        } catch (err) {
            console.error('Error fetching dashboard stats:', err)
        } finally {
            setLoadingStats(false)
        }
    }

    useEffect(() => {
        if (!user?.id) return

        fetchStats()

        const supabase = createClient()
        // Realtime subscription for usage_logs
        const channel = supabase
            .channel(`dashboard-realtime-${user.id}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'usage_logs',
                filter: `user_id=eq.${user.id}`,
            }, () => {
                fetchStats()
            })
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'api_keys',
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
                    "apiRequestsLast24h": apiRequests24h,
                    pdfsProcessedLifetime: pdfsProcessed,
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

    const firstName = fullName?.split(' ')[0] || 'User'

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-10"
        >
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/30">
                        Welcome, {firstName}
                    </h1>
                    <p className="text-white/40 text-sm font-medium uppercase tracking-[0.25em]">Dashboard Overview & Identity</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={() => setIsDevView(!isDevView)}
                        className="h-11 bg-white/5 border-white/10 hover:bg-white/10 text-white/70 rounded-2xl px-6 font-bold text-xs uppercase tracking-widest transition-all"
                    >
                        {isDevView ? 'User View' : 'Dev View'}
                    </Button>
                    <Button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="h-11 bg-white text-black hover:bg-white/90 rounded-2xl px-6 font-bold text-xs uppercase tracking-widest transition-all shadow-xl disabled:opacity-50"
                    >
                        {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Export Report'}
                    </Button>
                </div>
            </motion.div>

            {isDevView ? (
                <div className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard
                            label="Total API Calls"
                            value={stats.totalCalls}
                            sub="Lifetime activities"
                            icon={Activity}
                            color="blue"
                            loading={loadingStats}
                        />
                        <StatCard
                            label="Success Rate"
                            value={`${stats.successRate}%`}
                            sub="Optimal performance"
                            icon={Zap}
                            color="emerald"
                            loading={loadingStats}
                        />
                        <StatCard
                            label="Active Keys"
                            value={stats.activeKeys}
                            sub="Provisioned credentials"
                            icon={Star}
                            color="amber"
                            loading={loadingStats}
                        />
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-xl font-bold tracking-tight text-white/80">Recent API Activity</h2>
                        <Card className="bg-white/5 backdrop-blur-3xl border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
                            <CardContent className="p-0">
                                <div className="divide-y divide-white/5">
                                    {loadingStats ? (
                                        <div className="p-12 text-center text-white/20 font-medium flex flex-col items-center gap-4">
                                            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                                            <span>Analyzing neural logs...</span>
                                        </div>
                                    ) : recentLogs.length === 0 ? (
                                        <div className="p-12 text-center text-white/20 font-medium">No recent activity detected.</div>
                                    ) : (
                                        recentLogs.map((item, i) => (
                                            <div key={i} className="flex items-center justify-between p-6 hover:bg-white/[0.03] transition-colors group">
                                                <div className="flex items-center gap-5">
                                                    <div className={cn(
                                                        "w-3 h-3 rounded-full blur-[2px] animate-pulse shadow-lg",
                                                        item.status !== 'error' && item.status !== 'failed' ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-red-500 shadow-red-500/50'
                                                    )} />
                                                    <div>
                                                        <p className="font-bold text-sm text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{item.action || "API Request"}</p>
                                                        <p className="text-[10px] text-white/20 font-mono tracking-tighter uppercase mt-0.5">{item.id}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-mono text-white/30">{new Date(item.created_at).toLocaleString()}</div>
                                                    {item.file_name && <p className="text-[10px] text-white/20 mt-1">{item.file_name}</p>}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            ) : (
                <div className="space-y-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* User Details */}
                        <Card className="lg:col-span-8 bg-white/5 backdrop-blur-3xl border-white/10 rounded-[3rem] p-8 shadow-2xl relative group overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
                            <CardHeader className="p-0 mb-10">
                                <CardTitle className="text-2xl font-bold text-white tracking-tight">Account Intelligence</CardTitle>
                                <CardDescription className="text-white/30 text-sm">Security credentials and profile metadata.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                    {[
                                        { label: 'Full Name', value: fullName, icon: User, color: 'text-blue-400' },
                                        { label: 'Email Address', value: user?.email, icon: Shield, color: 'text-emerald-400' },
                                        { label: 'Account ID', value: user?.id, icon: null, mono: true },
                                        { label: 'Member Since', value: user?.created_at ? new Date(user.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : '—', icon: Clock, color: 'text-purple-400' }
                                    ].map((item, idx) => (
                                        <div key={idx} className="space-y-2 group/item">
                                            <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.2em]">{item.label}</p>
                                            <div className="flex items-center gap-3">
                                                {item.icon && <item.icon className={cn("h-4 w-4", item.color)} />}
                                                <span className={cn(
                                                    "text-white/80 font-medium group-hover/item:text-white transition-colors",
                                                    item.mono ? "font-mono text-xs text-white/30 truncate max-w-[200px]" : "text-base"
                                                )}>
                                                    {item.value}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Plan Card */}
                        <Card className="lg:col-span-4 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[3rem] p-1 border-0 shadow-[0_20px_50px_rgba(99,102,241,0.3)] group hover:scale-[1.02] transition-transform">
                            <div className="bg-[#050505] rounded-[2.8rem] h-full p-8 relative overflow-hidden flex flex-col justify-between">
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl" />
                                <CardHeader className="p-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em]">Current Ecosystem</span>
                                        <Zap className="h-5 w-5 text-amber-400 fill-amber-400 animate-pulse" />
                                    </div>
                                    <CardTitle className="text-4xl font-black text-white capitalize tracking-tighter">{plan}</CardTitle>
                                </CardHeader>

                                <div className="mt-8 space-y-6">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-end">
                                            <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Resources</span>
                                            <div className="text-right">
                                                <span className="text-white font-black text-lg">{credits.toLocaleString()}</span>
                                                <span className="text-white/30 text-sm font-normal ml-2">/ {creditLimit.toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <div className="h-3 w-full bg-white/5 rounded-full p-0.5 overflow-hidden ring-1 ring-white/10 shadow-inner">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${creditPercentage}%` }}
                                                className="h-full bg-gradient-to-r from-indigo-400 to-blue-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(99,102,241,0.5)]"
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        onClick={() => router.push('/pricing')}
                                        className="w-full bg-white text-black hover:bg-white/90 rounded-2xl py-6 font-bold text-sm tracking-tight transition-all active:scale-95 shadow-xl mt-4"
                                    >
                                        Upgrade
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-xl font-bold tracking-tight text-white/80">Platform Utilization</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { label: 'Total Requests', value: stats.totalCalls, suffix: '', icon: Activity, color: 'text-blue-400' },
                                { label: 'Active Keys', value: stats.activeKeys, suffix: '', icon: Star, color: 'text-amber-400' },
                                { label: 'Success Rate', value: stats.successRate, suffix: '%', icon: Zap, color: 'text-emerald-400' },
                                { label: 'Next Reset', value: '30 Days', suffix: '', icon: Clock, color: 'text-indigo-400' },
                            ].map((stat, idx) => (
                                <Card key={idx} className="bg-white/5 backdrop-blur-3xl border-white/10 rounded-[2rem] p-6 shadow-xl hover:bg-white/[0.08] transition-all group overflow-hidden">
                                    <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.2em] mb-3">{stat.label}</p>
                                    <div className="flex items-center justify-between">
                                        <p className={cn(
                                            "text-3xl font-black tracking-tight group-hover:scale-105 transition-transform origin-left",
                                            stat.color || "text-white"
                                        )}>
                                            {stat.value}{stat.suffix}
                                        </p>
                                        <stat.icon className={cn("h-5 w-5 opacity-20 group-hover:opacity-100 transition-opacity", stat.color)} />
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    )
}

function StatCard({ label, value, sub, icon: Icon, color = "blue", loading = false }: any) {
    const colorMap: Record<string, string> = {
        blue: "text-blue-400 bg-blue-500/10 border-blue-500/20 group-hover:bg-blue-500/20",
        emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 group-hover:bg-emerald-500/20",
        amber: "text-amber-400 bg-amber-500/10 border-amber-500/20 group-hover:bg-amber-500/20",
    }

    const iconStyle = colorMap[color] || colorMap.blue

    return (
        <Card className="bg-white/5 backdrop-blur-3xl border-white/10 rounded-[2.5rem] p-8 hover:bg-white/[0.07] transition-all group overflow-hidden relative shadow-2xl">
            <div className={cn("absolute top-0 right-0 w-24 h-24 rounded-bl-[5rem] blur-2xl group-hover:opacity-40 transition-opacity", color === 'blue' ? 'bg-blue-500/10' : color === 'emerald' ? 'bg-emerald-500/10' : 'bg-amber-500/10')} />
            <CardHeader className="p-0 mb-4 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold text-white/30 uppercase tracking-[0.2em]">{label}</CardTitle>
                <Icon className={cn("h-5 w-5 group-hover:scale-110 transition-transform", colorMap[color]?.split(' ')[0])} />
            </CardHeader>
            <CardContent className="p-0">
                {loading ? (
                    <div className="h-12 w-24 bg-white/5 rounded-lg animate-pulse" />
                ) : (
                    <div className="text-5xl font-bold tracking-tighter text-white">{value}</div>
                )}
                <p className="text-xs text-white/20 mt-2 font-medium">{sub}</p>
            </CardContent>
        </Card>
    )
}

export default function DashboardPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                    <p className="text-white/20 font-medium tracking-widest uppercase text-xs">Initializing DocuNexu Dashboard</p>
                </div>
            </div>
        }>
            <DashboardOverviewContent />
        </Suspense>
    )
}
