'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Terminal,
    Play,
    Save,
    Copy,
    Database,
    Table,
    History,
    ChevronRight,
    Search,
    MessageSquare,
    Loader2
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const SNIPPETS = [
    {
        title: "Initialize Credits Schema",
        sql: `-- Create a table to track user credits against DocuNexu plans
CREATE TABLE public.docunexu_account_credits (
  id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
  credits_balance bigint DEFAULT 17000,
  credit_limit bigint DEFAULT 17000,
  plan_tier text DEFAULT 'basic',
  last_topup_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.docunexu_account_credits ENABLE ROW LEVEL SECURITY;`
    },
    {
        title: "Log API Extraction Event",
        sql: `-- Record a PDF extraction event for analytics
INSERT INTO docunexu_logs (user_id, operation, tokens_used)
VALUES (auth.uid(), 'pdf_extraction', 150);`
    },
    {
        title: "Usage Heatmap Query",
        sql: `-- Fetch usage grouped by hour for the dashboard
SELECT 
  date_trunc('hour', created_at) as hour,
  count(*) as request_count
FROM docunexu_usage_logs
WHERE created_at > now() - interval '24 hours'
GROUP BY 1
ORDER BY 1 DESC;`
    }
]

export default function SQLEditorPage() {
    const [query, setQuery] = useState(SNIPPETS[0].sql)
    const [isExecuting, setIsExecuting] = useState(false)
    const [results, setResults] = useState<any[] | null>(null)
    const [activeTab, setActiveTab] = useState('editor')

    const runQuery = () => {
        setIsExecuting(true)
        setResults(null)

        // Simulate database latency
        setTimeout(() => {
            setResults([
                { id: 1, name: "Sample extraction", size: "1.2MB", status: "success", timestamp: "2024-03-04 10:00:00" },
                { id: 2, name: "Invoice processing", size: "850KB", status: "success", timestamp: "2024-03-04 10:15:00" },
                { id: 3, name: "Data validation", size: "400KB", status: "failed", timestamp: "2024-03-04 10:30:00" },
            ])
            setIsExecuting(false)
        }, 800)
    }

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/30">
                            <Database className="h-6 w-6 text-indigo-400" />
                        </div>
                        Supabase SQL Console
                    </h1>
                    <p className="text-gray-400">Direct query interface for your DocuNexu data layer.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="border-white/10 hover:bg-white/5 gap-2">
                        <History className="h-4 w-4" /> History
                    </Button>
                    <Button onClick={runQuery} disabled={isExecuting} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                        {isExecuting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-current" />}
                        Run Query
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 overflow-hidden">
                {/* Sidebar: Snippets & Tables */}
                <div className="lg:col-span-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                    <Card className="bg-[#0a0a0a] border-white/5 p-4">
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search snippets..."
                                className="w-full bg-black border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all"
                            />
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <Table className="h-3 w-3" /> Quick Snippets
                                </h3>
                                <div className="space-y-1">
                                    {SNIPPETS.map((snippet, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setQuery(snippet.sql)}
                                            className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-all group border border-transparent hover:border-white/5"
                                        >
                                            <div className="font-medium group-hover:text-indigo-400 transition-colors">{snippet.title}</div>
                                            <div className="text-[10px] text-gray-600 truncate">Supabase SQL Editor</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/5">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <MessageSquare className="h-3 w-3" /> AI Assistant
                                </h3>
                                <div className="bg-indigo-600/5 border border-indigo-500/20 rounded-xl p-4">
                                    <p className="text-[11px] text-indigo-300 leading-relaxed italic">
                                        "Try asking me to generate a query for document extraction trends over the last week."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Main: Editor & Results */}
                <div className="lg:col-span-3 flex flex-col gap-6 overflow-hidden">
                    {/* Editor Panel */}
                    <Card className="bg-[#0a0a0a] border-white/5 flex flex-col overflow-hidden h-1/2 min-h-[300px] group">
                        <div className="bg-white/[0.03] border-b border-white/5 px-4 py-2 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">Query Editor</span>
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] text-emerald-500 font-bold">Connected</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-500 hover:text-white">
                                    <Copy className="h-3.5 w-3.5" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-500 hover:text-white">
                                    <Save className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </div>
                        <div className="flex-1 relative font-mono text-sm">
                            <textarea
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full h-full bg-[#050505] text-indigo-100 p-6 focus:outline-none resize-none spellcheck-false tracking-tight custom-scrollbar"
                                placeholder="Enter SQL query..."
                            />
                            {/* Line Numbers Simulation */}
                            <div className="absolute left-0 top-0 w-10 h-full bg-black/30 border-r border-white/5 pointer-events-none flex flex-col items-center pt-6 text-[10px] text-gray-700 select-none">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => <div key={n} className="h-5">{n}</div>)}
                            </div>
                        </div>
                    </Card>

                    {/* Results Panel */}
                    <Card className="bg-[#0a0a0a] border-white/5 flex-1 min-h-[250px] flex flex-col overflow-hidden">
                        <div className="bg-white/[0.03] border-b border-white/5 px-4 py-3 flex items-center justify-between">
                            <h3 className="font-bold text-sm flex items-center gap-2">
                                <Terminal className="h-4 w-4 text-indigo-400" /> Output
                            </h3>
                            {results && (
                                <span className="text-[10px] text-gray-500 font-mono">
                                    {results.length} rows returned · 42ms
                                </span>
                            )}
                        </div>
                        <CardContent className="p-0 flex-1 overflow-auto bg-[#050505] custom-scrollbar">
                            {!results && !isExecuting && (
                                <div className="h-full flex flex-col items-center justify-center text-gray-700 opacity-50">
                                    <Terminal className="h-10 w-10 mb-2" />
                                    <p className="text-xs uppercase tracking-widest font-bold">Run a query to see results</p>
                                </div>
                            )}

                            {isExecuting && (
                                <div className="h-full flex flex-col items-center justify-center space-y-4">
                                    <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
                                    <p className="text-sm text-gray-500 animate-pulse font-mono">Executing on supabase-db...</p>
                                </div>
                            )}

                            <AnimatePresence>
                                {results && (
                                    <motion.table
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="w-full text-sm text-left border-collapse"
                                    >
                                        <thead>
                                            <tr className="bg-white/[0.02] border-b border-white/5">
                                                <th className="px-6 py-3 font-bold text-gray-400 uppercase tracking-widest text-[10px]">ID</th>
                                                <th className="px-6 py-3 font-bold text-gray-400 uppercase tracking-widest text-[10px]">Name</th>
                                                <th className="px-6 py-3 font-bold text-gray-400 uppercase tracking-widest text-[10px]">Size</th>
                                                <th className="px-6 py-3 font-bold text-gray-400 uppercase tracking-widest text-[10px]">Status</th>
                                                <th className="px-6 py-3 font-bold text-gray-400 uppercase tracking-widest text-[10px]">Timestamp</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {results.map((row, i) => (
                                                <motion.tr
                                                    key={row.id}
                                                    initial={{ opacity: 0, y: 5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.05 }}
                                                    className="border-b border-white/[0.03] hover:bg-white/[0.01] transition-colors"
                                                >
                                                    <td className="px-6 py-3 text-gray-500 font-mono text-xs">{row.id}</td>
                                                    <td className="px-6 py-3 text-gray-300 font-medium">{row.name}</td>
                                                    <td className="px-6 py-3 text-gray-500">{row.size}</td>
                                                    <td className="px-6 py-3">
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${row.status === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-500'
                                                            }`}>
                                                            {row.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-3 text-gray-500 text-xs">{row.timestamp}</td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </motion.table>
                                )}
                            </AnimatePresence>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
            `}</style>
        </div>
    )
}
