import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, FileText, Zap } from "lucide-react"

export default function DashboardOverview() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Overview</h1>

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
                        <CardTitle className="text-sm font-medium text-gray-400">Documents Processed</CardTitle>
                        <FileText className="h-4 w-4 text-emerald-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-white">842</div>
                        <p className="text-xs text-gray-500 mt-1">+5% from last month</p>
                    </CardContent>
                </Card>
                <Card className="bg-[#0a0a0a] border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Active Plan</CardTitle>
                        <Zap className="h-4 w-4 text-orange-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-white">Hobby</div>
                        <p className="text-xs text-indigo-400 mt-1 cursor-pointer hover:underline">Upgrade to Pro</p>
                    </CardContent>
                </Card>
            </div>

            <h2 className="text-xl font-semibold mb-4 mt-12">Recent Activity</h2>
            <Card className="bg-[#0a0a0a] border-white/10 overflow-hidden">
                <div className="divide-y divide-white/10">
                    {[
                        { action: "PDF to JSON Extraction", status: 200, time: "2 minutes ago", id: "req_xyz123" },
                        { action: "Merge PDF Documents", status: 200, time: "1 hour ago", id: "req_abc456" },
                        { action: "HTML to PDF Conversion", status: 500, time: "3 hours ago", id: "req_err789" },
                        { action: "PDF to Excel Extraction", status: 200, time: "Yesterday", id: "req_def012" },
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
