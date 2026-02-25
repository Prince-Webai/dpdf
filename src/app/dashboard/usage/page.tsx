'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Loader2 } from "lucide-react"

export default function UsagePage() {
    const [chartData, setChartData] = useState<any[]>([])
    const [totalCalls, setTotalCalls] = useState(0)
    const [planLimit, setPlanLimit] = useState(100) // Default Hobby limit
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        async function fetchUsage() {
            setLoading(true)
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                const limit = user.user_metadata?.credits || 100
                setPlanLimit(limit)

                // Fetch API request logs safely
                const { data: requestLogs } = await supabase
                    .from('api_requests')
                    .select('*')
                    .eq('user_id', user.id)

                const activity = requestLogs || []

                // Set total calls
                setTotalCalls(activity.length)

                // Calculate Last 7 Days for the chart
                const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
                const last7Days: { name: string, date: string, calls: number }[] = []
                const today = new Date()

                for (let i = 6; i >= 0; i--) {
                    const d = new Date(today)
                    d.setDate(today.getDate() - i)
                    last7Days.push({
                        name: days[d.getDay()],
                        date: d.toDateString(),
                        calls: 0
                    })
                }

                // Populate chart data
                activity.forEach((log: any) => {
                    const logDate = new Date(log.created_at).toDateString()
                    const dayObj = last7Days.find(d => d.date === logDate)
                    if (dayObj) {
                        dayObj.calls += 1
                    }
                })

                setChartData(last7Days)
            } else {
                setChartData([])
            }

            setLoading(false)
        }
        fetchUsage()
    }, [])

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2">Usage & Limits</h1>
            <p className="text-gray-400 mb-8">Monitor your API activity and billing limits.</p>

            {loading ? (
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                </div>
            ) : (
                <>
                    <div className="mb-12 max-w-xl">
                        <Card className="bg-[#0a0a0a] border-white/10">
                            <CardHeader>
                                <CardTitle className="text-lg">Monthly API Calls</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-3xl font-bold text-white">{totalCalls}</span>
                                    <span className="text-sm text-gray-500">/ {planLimit} Limit</span>
                                </div>
                                <div className="w-full bg-white/5 rounded-full h-2 mt-4 overflow-hidden">
                                    <div
                                        className="bg-indigo-500 h-2 rounded-full"
                                        style={{ width: `${Math.min((totalCalls / planLimit) * 100, 100)}%` }}
                                    ></div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="bg-[#0a0a0a] border-white/10 p-6">
                        <h3 className="font-semibold text-lg mb-6">Activity (Last 7 Days)</h3>
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        cursor={{ fill: '#ffffff10' }}
                                        contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
                                    />
                                    <Bar dataKey="calls" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </>
            )}
        </div>
    )
}
