'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Terminal,
    Play,
    Copy,
    Database,
    Table,
    History,
    Search,
    Loader2,
    CheckCircle2,
    XCircle,
    ChevronRight,
    Trash2,
    ClipboardCopy
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/utils/supabase/client"

// --- Starter Snippets ---
const SNIPPETS = [
    {
        title: "View Your Profile",
        sql: `SELECT id, plan, credits, credit_limit, email, created_at
FROM profiles
WHERE id = auth.uid();`
    },
    {
        title: "Recent API Usage",
        sql: `SELECT id, action, file_name, credits_used, status, created_at
FROM usage_logs
WHERE user_id = auth.uid()
ORDER BY created_at DESC
LIMIT 20;`
    },
    {
        title: "Your API Keys",
        sql: `SELECT id, key_name, is_active, last_used_at, created_at
FROM api_keys
WHERE user_id = auth.uid()
ORDER BY created_at DESC;`
    },
    {
        title: "Hourly Usage Heatmap",
        sql: `SELECT
  date_trunc('hour', created_at) AS hour,
  count(*) AS request_count
FROM usage_logs
WHERE user_id = auth.uid()
  AND created_at > now() - interval '24 hours'
GROUP BY 1
ORDER BY 1 DESC;`
    },
    {
        title: "Credits Remaining",
        sql: `SELECT
  plan,
  credits AS credits_remaining,
  credit_limit,
  round((credits::numeric / NULLIF(credit_limit, 0)) * 100, 1) AS pct_remaining
FROM profiles
WHERE id = auth.uid();`
    },
]

interface QueryResult {
    columns: string[]
    rows: Record<string, unknown>[]
    rowCount: number
    duration: number
    error?: string
}

interface HistoryEntry {
    sql: string
    timestamp: string
    rowCount: number
    success: boolean
}

export default function SQLEditorPage() {
    const supabase = createClient()
    const [query, setQuery] = useState(SNIPPETS[0].sql)
    const [isExecuting, setIsExecuting] = useState(false)
    const [result, setResult] = useState<QueryResult | null>(null)
    const [history, setHistory] = useState<HistoryEntry[]>([])
    const [showHistory, setShowHistory] = useState(false)
    const [copied, setCopied] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const runQuery = async () => {
        if (!query.trim()) return
        setIsExecuting(true)
        setResult(null)
        const start = performance.now()

        try {
            // Use Supabase RPC to execute arbitrary SQL via a server-side function
            // Falls back to a direct query approach for common SELECT patterns
            const { data, error } = await supabase.rpc('execute_sql', { query_text: query.trim() })

            const duration = Math.round(performance.now() - start)

            if (error) {
                const errResult: QueryResult = {
                    columns: [],
                    rows: [],
                    rowCount: 0,
                    duration,
                    error: error.message,
                }
                setResult(errResult)
                setHistory(prev => [{
                    sql: query.trim(),
                    timestamp: new Date().toLocaleTimeString(),
                    rowCount: 0,
                    success: false,
                }, ...prev.slice(0, 19)])
            } else {
                const rows: Record<string, unknown>[] = Array.isArray(data) ? data : []
                const columns = rows.length > 0 ? Object.keys(rows[0]) : []
                const successResult: QueryResult = {
                    columns,
                    rows,
                    rowCount: rows.length,
                    duration,
                }
                setResult(successResult)
                setHistory(prev => [{
                    sql: query.trim(),
                    timestamp: new Date().toLocaleTimeString(),
                    rowCount: rows.length,
                    success: true,
                }, ...prev.slice(0, 19)])
            }
        } catch (err: any) {
            const duration = Math.round(performance.now() - start)
            setResult({
                columns: [],
                rows: [],
                rowCount: 0,
                duration,
                error: err.message || 'Unexpected error occurred.',
            })
        } finally {
            setIsExecuting(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Ctrl+Enter or Cmd+Enter runs the query
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault()
            runQuery()
        }
        // Tab inserts spaces instead of focusing next element
        if (e.key === 'Tab') {
            e.preventDefault()
            const ta = textareaRef.current
            if (!ta) return
            const start = ta.selectionStart
            const end = ta.selectionEnd
            const newVal = query.substring(0, start) + '  ' + query.substring(end)
            setQuery(newVal)
            requestAnimationFrame(() => {
                ta.selectionStart = ta.selectionEnd = start + 2
            })
        }
    }

    const copyQuery = async () => {
        await navigator.clipboard.writeText(query)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
    }

    const copyResults = async () => {
        if (!result?.rows.length) return
        const csv = [
            result.columns.join(','),
            ...result.rows.map(r => result.columns.map(c => JSON.stringify(r[c] ?? '')).join(','))
        ].join('\n')
        await navigator.clipboard.writeText(csv)
    }

    const filteredSnippets = SNIPPETS.filter(s =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const lineCount = query.split('\n').length

    return (
        <div className="flex flex-col h-[calc(100vh-6rem)] gap-0">
            {/* Header */}
            <div className="mb-5 flex items-center justify-between flex-shrink-0">
                <div>
                    <h1 className="text-3xl font-bold mb-1.5 flex items-center gap-3 text-white">
                        <div className="p-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/30">
                            <Database className="h-6 w-6 text-indigo-400" />
                        </div>
                        SQL Console
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Live query interface — press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-xs font-mono text-gray-300">Ctrl+Enter</kbd> to run
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="border-white/10 hover:bg-white/5 gap-2 text-gray-300"
                        onClick={() => setShowHistory(!showHistory)}
                    >
                        <History className="h-4 w-4" />
                        History {history.length > 0 && <span className="ml-1 text-xs bg-white/10 px-1.5 py-0.5 rounded-full">{history.length}</span>}
                    </Button>
                    <Button
                        onClick={runQuery}
                        disabled={isExecuting || !query.trim()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-[0_0_20px_rgba(99,102,241,0.2)] disabled:opacity-50"
                    >
                        {isExecuting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-current" />}
                        Run Query
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 flex-1 overflow-hidden min-h-0">
                {/* LEFT: Snippets Panel */}
                <div className="lg:col-span-1 flex flex-col gap-4 overflow-hidden">
                    <Card className="bg-[#0a0a0a] border-white/5 flex flex-col overflow-hidden h-full">
                        <div className="p-4 border-b border-white/5 flex-shrink-0">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-600" />
                                <input
                                    type="text"
                                    placeholder="Search snippets..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="w-full bg-black/50 border border-white/8 rounded-lg py-2 pl-9 pr-4 text-xs text-gray-300 focus:outline-none focus:border-indigo-500/40 transition-all placeholder:text-gray-700"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-3 space-y-1">
                            <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2 px-2 flex items-center gap-1.5">
                                <Table className="h-3 w-3" /> Starter Queries
                            </h3>
                            {filteredSnippets.map((snippet, i) => (
                                <button
                                    key={i}
                                    onClick={() => setQuery(snippet.sql)}
                                    className="w-full text-left px-3 py-2.5 rounded-lg text-xs text-gray-500 hover:bg-white/5 hover:text-white transition-all group border border-transparent hover:border-white/5"
                                >
                                    <div className="flex items-center gap-2">
                                        <ChevronRight className="h-3 w-3 text-gray-700 group-hover:text-indigo-400 transition-colors flex-shrink-0" />
                                        <span className="font-medium group-hover:text-indigo-300 transition-colors">{snippet.title}</span>
                                    </div>
                                </button>
                            ))}

                            {/* History Panel */}
                            <AnimatePresence>
                                {showHistory && history.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pt-4 border-t border-white/5 mt-3">
                                            <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2 px-2 flex items-center gap-1.5">
                                                <History className="h-3 w-3" /> Recent
                                            </h3>
                                            {history.map((h, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setQuery(h.sql)}
                                                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-gray-500 hover:bg-white/5 hover:text-white transition-all group border border-transparent hover:border-white/5"
                                                >
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        {h.success
                                                            ? <CheckCircle2 className="h-3 w-3 text-emerald-500 flex-shrink-0" />
                                                            : <XCircle className="h-3 w-3 text-red-500 flex-shrink-0" />}
                                                        <span className="text-[10px] text-gray-700">{h.timestamp}</span>
                                                        <span className="ml-auto text-[10px] text-gray-700">{h.rowCount} rows</span>
                                                    </div>
                                                    <div className="font-mono text-[10px] text-gray-600 truncate pl-5">{h.sql.slice(0, 60)}…</div>
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </Card>
                </div>

                {/* RIGHT: Editor + Results */}
                <div className="lg:col-span-3 flex flex-col gap-4 overflow-hidden min-h-0">
                    {/* Editor */}
                    <Card className="bg-[#0a0a0a] border-white/5 flex flex-col overflow-hidden" style={{ height: '45%', minHeight: '220px' }}>
                        <div className="bg-white/[0.02] border-b border-white/5 px-4 py-2 flex items-center justify-between flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">Query Editor</span>
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] text-emerald-400 font-bold">Live</span>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <Button
                                    variant="ghost" size="sm"
                                    className="h-7 px-2 text-gray-500 hover:text-white gap-1.5 text-xs"
                                    onClick={copyQuery}
                                >
                                    {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                                    {copied ? 'Copied!' : 'Copy'}
                                </Button>
                                <Button
                                    variant="ghost" size="sm"
                                    className="h-7 px-2 text-gray-500 hover:text-red-400 gap-1.5 text-xs"
                                    onClick={() => { setQuery(''); setResult(null) }}
                                >
                                    <Trash2 className="h-3.5 w-3.5" /> Clear
                                </Button>
                            </div>
                        </div>

                        <div className="flex-1 flex overflow-hidden">
                            {/* Line numbers */}
                            <div className="w-10 bg-black/30 border-r border-white/5 flex flex-col items-end pr-2 pt-4 pb-4 text-[11px] text-gray-700 select-none font-mono flex-shrink-0 overflow-hidden">
                                {Array.from({ length: Math.max(lineCount, 12) }, (_, i) => (
                                    <div key={i} className="leading-[1.625rem]">{i + 1}</div>
                                ))}
                            </div>
                            <textarea
                                ref={textareaRef}
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                spellCheck={false}
                                className="flex-1 bg-transparent text-indigo-100 p-4 focus:outline-none resize-none font-mono text-sm leading-[1.625rem] overflow-auto"
                                placeholder="-- Enter SQL query here..."
                            />
                        </div>
                    </Card>

                    {/* Results */}
                    <Card className="bg-[#0a0a0a] border-white/5 flex flex-col overflow-hidden flex-1 min-h-0">
                        <div className="bg-white/[0.02] border-b border-white/5 px-4 py-2.5 flex items-center justify-between flex-shrink-0">
                            <h3 className="font-bold text-sm flex items-center gap-2 text-white">
                                <Terminal className="h-4 w-4 text-indigo-400" /> Output
                            </h3>
                            <div className="flex items-center gap-3">
                                {result && !result.error && (
                                    <span className="text-[11px] text-gray-500 font-mono">
                                        {result.rowCount} row{result.rowCount !== 1 ? 's' : ''} · {result.duration}ms
                                    </span>
                                )}
                                {result?.rows.length ? (
                                    <Button
                                        variant="ghost" size="sm"
                                        className="h-6 px-2 text-gray-500 hover:text-white gap-1 text-xs"
                                        onClick={copyResults}
                                    >
                                        <ClipboardCopy className="h-3 w-3" /> CSV
                                    </Button>
                                ) : null}
                            </div>
                        </div>

                        <CardContent className="p-0 flex-1 overflow-auto bg-[#050505]">
                            {/* Empty state */}
                            {!result && !isExecuting && (
                                <div className="h-full flex flex-col items-center justify-center text-gray-700">
                                    <Terminal className="h-10 w-10 mb-3 opacity-30" />
                                    <p className="text-xs uppercase tracking-widest font-bold opacity-50">Run a query to see results</p>
                                    <p className="text-[10px] text-gray-700 mt-1">Ctrl+Enter to execute</p>
                                </div>
                            )}

                            {/* Loading */}
                            {isExecuting && (
                                <div className="h-full flex flex-col items-center justify-center gap-4">
                                    <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
                                    <p className="text-sm text-gray-500 animate-pulse font-mono">Executing query…</p>
                                </div>
                            )}

                            {/* Error */}
                            <AnimatePresence>
                                {result?.error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="m-4 p-4 bg-red-500/8 border border-red-500/20 rounded-xl flex items-start gap-3"
                                    >
                                        <XCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-bold text-red-400 mb-1">Query Error</p>
                                            <pre className="text-xs text-red-300/80 whitespace-pre-wrap break-all font-mono">{result.error}</pre>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Results Table */}
                            <AnimatePresence>
                                {result && !result.error && result.rows.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="overflow-auto h-full"
                                    >
                                        <table className="w-full text-sm text-left border-collapse">
                                            <thead className="sticky top-0 z-10">
                                                <tr className="bg-[#0a0a0a] border-b border-white/5">
                                                    {result.columns.map(col => (
                                                        <th key={col} className="px-5 py-3 font-bold text-gray-400 uppercase tracking-widest text-[10px] whitespace-nowrap">
                                                            {col}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {result.rows.map((row, i) => (
                                                    <motion.tr
                                                        key={i}
                                                        initial={{ opacity: 0, y: 4 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: i * 0.03 }}
                                                        className="border-b border-white/[0.03] hover:bg-white/[0.015] transition-colors"
                                                    >
                                                        {result.columns.map(col => {
                                                            const val = row[col]
                                                            const display = val === null ? <span className="text-gray-700 italic">null</span>
                                                                : typeof val === 'boolean' ? (
                                                                    val
                                                                        ? <span className="text-emerald-400 font-bold text-xs">true</span>
                                                                        : <span className="text-red-400 font-bold text-xs">false</span>
                                                                )
                                                                    : typeof val === 'number' ? <span className="text-sky-400 font-mono">{String(val)}</span>
                                                                        : typeof val === 'object' ? <span className="text-amber-300/80 font-mono text-xs">{JSON.stringify(val)}</span>
                                                                            : String(val)
                                                            return (
                                                                <td key={col} className="px-5 py-3 text-gray-300 text-xs font-mono whitespace-nowrap max-w-[280px] truncate">
                                                                    {display}
                                                                </td>
                                                            )
                                                        })}
                                                    </motion.tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </motion.div>
                                )}

                                {/* Zero rows returned */}
                                {result && !result.error && result.rows.length === 0 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="h-full flex flex-col items-center justify-center text-gray-600 gap-3"
                                    >
                                        <CheckCircle2 className="h-8 w-8 text-emerald-500/40" />
                                        <p className="text-xs font-mono">Query executed — 0 rows returned</p>
                                        <p className="text-[10px] text-gray-700">{result.duration}ms</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
