'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, FileText, Zap, User, Star, Shield, Clock } from "lucide-react"
import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { createClient } from '@/utils/supabase/client'

function DashboardOverviewContent() {
    const searchParams = useSearchParams()
    const isDevView = searchParams.get('view') === 'developer'
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        async function loadUser() {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
            setLoading(false)
        }
        loadUser()
    }, [])

    if (loading) return <div className="p-8 text-gray-500">Loading your profile...</div>

    const userMetadata = user?.user_metadata || {}
    const plan = userMetadata.plan || 'Hobby'
    const credits = userMetadata.credits || 100
    const fullName = userMetadata.full_name || 'DocuNexu User'

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
                            <div className="text-3xl font-bold text-white">1,248</div>
                            <p className="text-xs text-gray-500 mt-1">+12% from last month</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-[#0a0a0a] border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">Success Rate</CardTitle>
                            <Zap className="h-4 w-4 text-emerald-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white">99.2%</div>
                            <p className="text-xs text-gray-500 mt-1">Excellent performance</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-[#0a0a0a] border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">Active Keys</CardTitle>
                            <Star className="h-4 w-4 text-orange-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white">2</div>
                            <p className="text-xs text-indigo-400 mt-1 hover:underline cursor-pointer">Manage keys</p>
                        </CardContent>
                    </Card>
                </div>
                {/* ... rest of dev view (existing activity) ... */}
                <h2 className="text-xl font-semibold mb-4 mt-12">Recent API Activity</h2>
                <Card className="bg-[#0a0a0a] border-white/10 overflow-hidden">
                    <div className="divide-y divide-white/10">
                        {[
                            { action: "PDF to JSON Extraction", status: 200, time: "2 minutes ago", id: "req_xyz123" },
                            { action: "Merge PDF Documents", status: 200, time: "1 hour ago", id: "req_abc456" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-2 h-2 rounded-full ${item.status === 200 ? 'bg-green-500' : 'bg-red-500'}`} />
                                    <div>
                                        <p className="font-medium text-sm text-gray-200">{item.action}</p>
                                        <p className="text-xs text-gray-500 font-mono">{item.id}</p>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-400">{item.time}</div>
                            </div>
                        ))}
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
                                    <span>{new Date(user?.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Usage/Plan Card */}
                <Card className="bg-indigo-600/5 border-indigo-500/20 backdrop-blur-sm">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Your Plan</CardTitle>
                            <Zap className="h-5 w-5 text-indigo-400 animate-pulse" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-4xl font-black text-white">{plan}</div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Credits Remaining</span>
                                <span className="text-white font-bold">{credits} / 100</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500" style={{ width: `${credits}%` }} />
                            </div>
                        </div>
                        <button className="w-full mt-4 py-2 rounded-lg bg-white text-black text-sm font-bold hover:bg-gray-200 transition-colors">
                            Upgrade Plan
                        </button>
                    </CardContent>
                </Card>
            </div>

            <h2 className="text-xl font-semibold mb-4 mt-12">Platform Usage Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-[#0a0a0a] border-white/10 p-4">
                    <p className="text-xs text-gray-500 mb-1">Total Requests</p>
                    <p className="text-xl font-bold text-white">1.2k</p>
                </Card>
                <Card className="bg-[#0a0a0a] border-white/10 p-4">
                    <p className="text-xs text-gray-500 mb-1">Average Response</p>
                    <p className="text-xl font-bold text-white">450ms</p>
                </Card>
                <Card className="bg-[#0a0a0a] border-white/10 p-4">
                    <p className="text-xs text-gray-500 mb-1">Uptime</p>
                    <p className="text-xl font-bold text-white">99.99%</p>
                </Card>
                <Card className="bg-[#0a0a0a] border-white/10 p-4">
                    <p className="text-xs text-gray-500 mb-1">Support Tier</p>
                    <p className="text-xl font-bold text-indigo-400">Standard</p>
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
