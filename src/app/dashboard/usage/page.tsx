'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function UsagePage() {
    const data = [
        { name: 'Mon', calls: 400 },
        { name: 'Tue', calls: 300 },
        { name: 'Wed', calls: 500 },
        { name: 'Thu', calls: 280 },
        { name: 'Fri', calls: 590 },
        { name: 'Sat', calls: 120 },
        { name: 'Sun', calls: 90 },
    ]

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2">Usage & Limits</h1>
            <p className="text-gray-400 mb-8">Monitor your API activity and billing limits.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <Card className="bg-[#0a0a0a] border-white/10">
                    <CardHeader>
                        <CardTitle className="text-lg">Monthly API Calls</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-3xl font-bold text-white">1,248</span>
                            <span className="text-sm text-gray-500">/ 10,000 (Pro Plan)</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-2 mt-4 overflow-hidden">
                            <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '12.48%' }}></div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-[#0a0a0a] border-white/10">
                    <CardHeader>
                        <CardTitle className="text-lg">Storage Used</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-3xl font-bold text-white">14.2 GB</span>
                            <span className="text-sm text-gray-500">/ 50 GB (Pro Plan)</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-2 mt-4 overflow-hidden">
                            <div className="bg-cyan-500 h-2 rounded-full" style={{ width: '28.4%' }}></div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-[#0a0a0a] border-white/10 p-6">
                <h3 className="font-semibold text-lg mb-6">Activity (Last 7 Days)</h3>
                <div className="h-72 w-full">
                    {/* Note: In a real app with pure recharts, we need to handle SSR.
              Since this is a 'use client' component, recharts works fine. */}
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
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
        </div>
    )
}
