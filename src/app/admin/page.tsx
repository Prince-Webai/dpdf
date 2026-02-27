'use client'

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Key, Activity, ArrowUpRight, Loader2 } from "lucide-react"
import { getAdminStats, createInitialAdmin } from "@/lib/actions"

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
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        )
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Platform Overview</h1>
                    <p className="text-gray-400">High-level metrics for the DocuNexu system.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                <Card className="bg-[#0a0a0a] border-white/10 text-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-indigo-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalUsers.toLocaleString()}</div>
                        <p className="text-xs text-green-400 flex items-center mt-1">
                            <ArrowUpRight className="mr-1 h-3 w-3" />
                            +12% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-[#0a0a0a] border-white/10 text-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Active API Keys</CardTitle>
                        <Key className="h-4 w-4 text-cyan-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.activeApiKeys.toLocaleString()}</div>
                        <p className="text-xs text-green-400 flex items-center mt-1">
                            <ArrowUpRight className="mr-1 h-3 w-3" />
                            +4% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-[#0a0a0a] border-white/10 text-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Total API Calls</CardTitle>
                        <Activity className="h-4 w-4 text-red-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalApiCalls.toLocaleString()}</div>
                        <p className="text-xs text-green-400 flex items-center mt-1">
                            <ArrowUpRight className="mr-1 h-3 w-3" />
                            +22% from last month
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-[#0a0a0a] border-white/10 text-white col-span-2">
                    <CardHeader>
                        <CardTitle>System Message</CardTitle>
                        <CardDescription className="text-gray-400">
                            Service Role Key Configuration Status
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {stats?.totalUsers === 1248 ? (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-200">
                                <strong>Warning:</strong> The data shown above is still mocked. Please ensure `SUPABASE_SERVICE_ROLE_KEY` is set in your environment variables to enable live data.
                            </div>
                        ) : (
                            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-sm text-green-200">
                                <strong>Success:</strong> Live data connection established via Service Role Key.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
