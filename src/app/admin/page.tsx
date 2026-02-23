'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Key, Activity, ArrowUpRight } from "lucide-react"

export default function AdminOverviewPage() {
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
                        <div className="text-2xl font-bold">1,248</div>
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
                        <div className="text-2xl font-bold">3,492</div>
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
                        <div className="text-2xl font-bold">842,501</div>
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
                            Action required regarding Supabase Service Role Key.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-200">
                            <strong>Note for Developer:</strong> The data populated on this page and throughout the Admin section is currently mocked.
                            To view live metrics and manipulate user accounts directly from `auth.users`, you must inject a `SUPABASE_SERVICE_ROLE_KEY`
                            into the environment variables. Standard anonymous/client keys are blocked by Row Level Security (RLS) from reading global user data.
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
