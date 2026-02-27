'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, FileText, Zap, User, Star, Shield, Clock } from "lucide-react"
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useProfile } from '@/context/profile-context'
import { Button } from "@/components/ui/button"

function DashboardOverviewContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const isDevView = searchParams.get('view') === 'developer'
    const { user, plan, credits, creditLimit, creditPercentage, fullName, loading } = useProfile()
    const [stats, setStats] = useState({ totalCalls: 0, successRate: 100, activeKeys: 0 })
    const [recentActivity, setRecentActivity] = useState<any[]>([])
    const [statsLoading, setStatsLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        if (!user?.id) return

        async function loadStats() {
            setStatsLoading(true)
            const { count: keysCount } = await supabase
                .from('api_keys')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)

            const { data: requestLogs } = await supabase
                .from('api_requests')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(5)

            const activity = requestLogs || []
            const successCount = activity.filter((r: any) => r.status >= 200 && r.status < 300).length
            const calculatedSuccessRate = activity.length > 0
                ? Number(((successCount / activity.length) * 100).toFixed(1))
                : 100

            setStats({ totalCalls: activity.length, successRate: calculatedSuccessRate, activeKeys: keysCount || 0 })
            setRecentActivity(activity)
            setStatsLoading(false)
        }

        loadStats()
    }, [user?.id])

    if (loading) return <div className="p-8 text-gray-500">Loading your profile...</div>

    if (isDevView) {
        return (
            <div>
                <h1 className="text-3xl font-bold mb-8">Developer Overview</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="bg-[#0a0a0a] border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">Total API Calls</CardTitle>
                            <Activity className="h-4 w-4 text-indigo-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white">{stats.totalCalls}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-[#0a0a0a] border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">Success Rate</CardTitle>
                            <Zap className="h-4 w-4 text-emerald-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white">{stats.successRate}%</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-[#0a0a0a] border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">Active Keys</CardTitle>
                            <Star className="h-4 w-4 text-orange-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white">{stats.activeKeys}</div>
                        </CardContent>
                    </Card>
                </div>

                <h2 className="text-xl font-semibold mb-4 mt-12">Recent API Activity</h2>
                <Card className="bg-[#0a0a0a] border-white/10 overflow-hidden">
                    <div className="divide-y divide-white/10">
                        {recentActivity.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">No recent API activity found.</div>
                        ) : (
                            recentActivity.map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-2 h-2 rounded-full ${item.status >= 200 && item.status < 300 ? 'bg-green-500' : 'bg-red-500'}`} />
                                        <div>
                                            <p className="font-medium text-sm text-gray-200">{item.action || "API Request"}</p>
                                            <p className="text-xs text-gray-500 font-mono">{item.id}</p>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-400">{new Date(item.created_at).toLocaleString()}</div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>
        )
    }

    return (
        <div>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Welcome, {fullName}</h1>
                    <p className="text-gray-400 text-sm">Manage your personal account and platform usage.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* User Details */}
                <Card className="lg:col-span-2 bg-[#0a0a0a] border-white/10">
                    <CardHeader>
                        <CardTitle className="text-lg">Account Details</CardTitle>
                        <CardDescription>Personal information and registration status.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Full Name</p>
                                <div className="flex items-center gap-2 text-white">
                                    <User className="h-4 w-4 text-indigo-400" />
                                    <span>{fullName}</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Email Address</p>
                                <div className="flex items-center gap-2 text-white">
                                    <Shield className="h-4 w-4 text-emerald-400" />
                                    <span>{user?.email}</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Account ID</p>
                                <div className="flex items-center gap-2 text-gray-400 font-mono text-xs">
                                    <span>{user?.id}</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Joined Date</p>
                                <div className="flex items-center gap-2 text-white">
                                    <Clock className="h-4 w-4 text-orange-400" />
                                    <span>{user?.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Plan Card */}
                <Card className="bg-indigo-600/5 border-indigo-500/20 backdrop-blur-sm">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Your Plan</CardTitle>
                            <Zap className="h-5 w-5 text-indigo-400 animate-pulse" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-4xl font-black text-white capitalize">{plan}</div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Credits Remaining</span>
                                <span className="text-white font-bold">{credits.toLocaleString()} / {creditLimit.toLocaleString()}</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${creditPercentage}%` }} />
                            </div>
                        </div>
                        <Button
                            onClick={() => router.push('/pricing')}
                            className="w-full mt-4 py-2 rounded-lg bg-white text-black text-sm font-bold hover:bg-gray-200 transition-colors"
                        >
                            Upgrade Plan
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <h2 className="text-xl font-semibold mb-4 mt-12">Platform Usage Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-[#0a0a0a] border-white/10 p-4">
                    <p className="text-xs text-gray-500 mb-1">Total Requests</p>
                    <p className="text-xl font-bold text-white">{stats.totalCalls}</p>
                </Card>
                <Card className="bg-[#0a0a0a] border-white/10 p-4">
                    <p className="text-xs text-gray-500 mb-1">Average Response</p>
                    <p className="text-xl font-bold text-white">450ms</p>
                </Card>
                <Card className="bg-[#0a0a0a] border-white/10 p-4">
                    <p className="text-xs text-gray-500 mb-1">Success Rate</p>
                    <p className="text-xl font-bold text-white">{stats.successRate}%</p>
                </Card>
                <Card className="bg-[#0a0a0a] border-white/10 p-4">
                    <p className="text-xs text-gray-500 mb-1">Support Tier</p>
                    <p className="text-xl font-bold text-indigo-400 capitalize">{plan}</p>
                </Card>
            </div>
        </div>
    )
}

export default function DashboardOverview() {
    return (
        <Suspense fallback={<div className="p-8 text-gray-500">Loading dashboard...</div>}>
            <DashboardOverviewContent />
        </Suspense>
    )
}
