'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Eye, Plus, Trash2, Loader2, Check } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Card } from "@/components/ui/card"

interface ApiKey {
    id: string
    key_name: string
    api_key: string
    created_at: string
    last_used_at: string | null
}

export default function ApiKeysPage() {
    const [keys, setKeys] = useState<ApiKey[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCreating, setIsCreating] = useState(false)
    const [copiedId, setCopiedId] = useState<string | null>(null)
    const [visibleKeyId, setVisibleKeyId] = useState<string | null>(null)
    const supabase = createClient()
    const { toast } = useToast()

    useEffect(() => {
        fetchKeys()
    }, [])

    const fetchKeys = async () => {
        setIsLoading(true)
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            setIsLoading(false)
            return
        }
        const { data, error } = await supabase
            .from('api_keys')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false })
        if (error) {
            toast({ title: "Error fetching keys", description: error.message, variant: "destructive" })
        } else {
            setKeys(data || [])
        }
        setIsLoading(false)
    }

    const createKey = async () => {
        setIsCreating(true)
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            toast({ title: "Please log in", variant: "destructive" })
            setIsCreating(false)
            return
        }
        const newKey = `dn_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
        const { error } = await supabase
            .from('api_keys')
            .insert({
                user_id: session.user.id,
                key_name: `Key_${new Date().getTime().toString().slice(-4)}`,
                api_key: newKey,
            })
        if (error) {
            toast({ title: "Error creating key", description: error.message, variant: "destructive" })
        } else {
            toast({ title: "API Key created successfully" })
            await fetchKeys()
        }
        setIsCreating(false)
    }

    const deleteKey = async (id: string) => {
        const { error } = await supabase
            .from('api_keys')
            .delete()
            .eq('id', id)
        if (error) {
            toast({ title: "Error deleting key", description: error.message, variant: "destructive" })
        } else {
            toast({ title: "API Key deleted" })
            setKeys(keys.filter(k => k.id !== id))
        }
    }

    const copyToClipboard = async (id: string, text: string) => {
        await navigator.clipboard.writeText(text)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
                    <p className="text-muted-foreground">Manage keys for document extraction through our API.</p>
                </div>
                <Button onClick={createKey} disabled={isCreating} className="bg-white text-black hover:bg-gray-200">
                    {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                    Create New Key
                </Button>
            </div>

            <Card className="bg-[#0a0a0a] border-white/10 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5 text-xs text-muted-foreground uppercase tracking-widest">
                            <th className="px-6 py-4 font-medium">Name</th>
                            <th className="px-6 py-4 font-medium">Key</th>
                            <th className="px-6 py-4 font-medium">Created</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {isLoading ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">Loading keys...</td>
                            </tr>
                        ) : keys.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">No API keys found.</td>
                            </tr>
                        ) : (
                            keys.map((key) => (
                                <tr key={key.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-6 font-medium">{key.key_name}</td>
                                    <td className="px-6 py-6 font-mono text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-black/50 border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-3">
                                                <span className="text-gray-400">
                                                    {visibleKeyId === key.id ? key.api_key : '••••••••••••••••••••••••••••••'}
                                                </span>
                                                <button onClick={() => setVisibleKeyId(visibleKeyId === key.id ? null : key.id)} className="text-gray-500 hover:text-white transition-colors">
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-9 w-9 text-gray-400 hover:text-white"
                                                onClick={() => copyToClipboard(key.id, key.api_key)}
                                            >
                                                {copiedId === key.id ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-sm text-muted-foreground">
                                        {new Date(key.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-9 w-9 text-gray-500 hover:text-red-500"
                                            onClick={() => deleteKey(key.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </Card>

            <div className="bg-indigo-500/10 border border-indigo-500/20 p-6 rounded-2xl flex gap-4 mt-8">
                <div className="p-2 rounded-lg bg-indigo-500/20 h-fit">
                    <Check className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                    <h4 className="font-bold text-white mb-2">Security Advice</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">
                        Treat your secret API keys as passwords. Do not share them in public repositories or client-side code. They grant immediate access to your credits and data pipeline.
                    </p>
                </div>
            </div>
        </div>
    )
}
