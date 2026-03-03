'use client'

import { useState } from "react"
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
    Loader2
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useProfile } from "@/context/profile-context"

export default function DashboardPage() {
    const { plan, creditPercentage, credits, creditLimit } = useProfile()
    const [isExporting, setIsExporting] = useState(false)

    const handleExport = () => {
        setIsExporting(true)

        // Simulate a small delay for a premium fluid animation effect
        setTimeout(() => {
            const reportData = {
                generatedAt: new Date().toISOString(),
                accountSummary: {
                    plan: plan,
                    totalCredits: credits,
                    creditLimit: creditLimit,
                    creditPercentageUsed: creditPercentage.toFixed(2) + "%",
                    apiRequestsLast24h: 842,
                    pdfsProcessedLifetime: 2109,
                    avgLatencyMs: 142
                },
                recentActivity: [
                    { id: "job_01H8XyA", file: "q3_financials.pdf", time: "2 mins ago", status: "Extraction Successful" },
                    { id: "job_01H8XzB", file: "merger_agreement.pdf", time: "15 mins ago", status: "Document Merged" },
                    { id: "job_01H8XwC", file: "invalid_format.docx", time: "1 hour ago", status: "Type Mismatch" },
                    { id: "job_01H8XvD", file: "receipt_batch_4.pdf", time: "3 hours ago", status: "Extraction Successful" }
                ]
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
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
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
            <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <motion.div variants={itemVariants}>
                    <StatCard label="Total Credits" value={credits.toLocaleString()} sub={`of ${creditLimit.toLocaleString()}`} icon={Zap} trend="+12%" color="indigo" />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <StatCard label="API Requests" value="842" sub="Last 24 hours" icon={BarChart3} trend="+5%" color="cyan" />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <StatCard label="PDFs Processed" value="2,109" sub="Lifetime" icon={FileText} trend="+18%" color="emerald" />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <StatCard label="Avg Latency" value="142ms" sub="Global average" icon={Clock} color="purple" />
                </motion.div>
            </motion.div>

            <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Recent Activity */}
                <motion.div variants={itemVariants} className="lg:col-span-2">
                    <Card className="bg-[#050505] border-white/5 p-6 h-full shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none transition-opacity duration-1000 group-hover:opacity-100 opacity-50" />

                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5 text-indigo-400" />
                                Security Log
                            </h2>
                            <Link href="/dashboard/usage" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 flex items-center bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 transition-all hover:bg-indigo-500/20">
                                View all <ChevronRight className="ml-1 h-3 w-3" />
                            </Link>
                        </div>
                        <div className="space-y-1 relative z-10">
                            {[
                                { id: "job_01H8XyA", file: "q3_financials.pdf", time: "2 mins ago", status: "Extraction Successful", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: Zap },
                                { id: "job_01H8XzB", file: "merger_agreement.pdf", time: "15 mins ago", status: "Document Merged", color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20", icon: FileText },
                                { id: "job_01H8XwC", file: "invalid_format.docx", time: "1 hour ago", status: "Type Mismatch", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", icon: ShieldCheck },
                                { id: "job_01H8XvD", file: "receipt_batch_4.pdf", time: "3 hours ago", status: "Extraction Successful", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: Zap },
                            ].map((log, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + (i * 0.1) }}
                                    className="flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-white/5 hover:bg-white/[0.02] transition-all cursor-default"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2.5 rounded-xl ${log.bg} ${log.border} border shadow-inner`}>
                                            <log.icon className={`h-4 w-4 ${log.color}`} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-gray-200">{log.status}</div>
                                            <div className="text-xs text-gray-500 font-mono mt-0.5">ID: {log.id} · <span className="text-gray-400 font-sans">{log.file}</span></div>
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col items-end">
                                        <div className="text-xs text-gray-500">{log.time}</div>
                                        {log.status === "Type Mismatch" ? (
                                            <span className="mt-1 text-[10px] text-red-500 font-bold uppercase tracking-widest bg-red-500/10 px-2 py-0.5 rounded-sm">Failed</span>
                                        ) : (
                                            <span className="mt-1 text-[10px] text-emerald-500 font-bold uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-sm">Completed</span>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
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
                                        Renews in 12 days
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
                                    <span className="text-gray-400">Next billing</span>
                                    <span className="text-white font-semibold">Sept 24, 2024</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-400">Payment Method</span>
                                    <div className="flex items-center gap-2">
                                        <div className="bg-white px-2 py-0.5 rounded text-[10px] font-bold text-blue-900 tracking-wider">VISA</div>
                                        <span className="text-white font-mono">•••• 4242</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    )
}

function StatCard({ label, value, sub, icon: Icon, trend, color = "indigo" }: any) {
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
                {trend && (
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-md shadow-sm">
                        {trend}
                    </span>
                )}
            </div>
            <div className="mt-5 relative z-10">
                <div className="text-3xl font-extrabold tracking-tight text-white">{value}</div>
                <div className="text-sm font-semibold text-gray-400 mt-1">{label}</div>
                <div className="mt-1.5 text-xs text-gray-500 font-medium">{sub}</div>
            </div>
        </Card>
    )
}
