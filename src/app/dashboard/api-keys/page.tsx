'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Copy, Eye, Plus, Trash2, Loader2, Check, Shield } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { useToast } from "@/hooks/use-toast"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

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
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            setIsLoading(false)
            return
        }

        const { data, error } = await supabase
            .from('api_keys')
            .select('*')
            .eq('user_id', user.id)
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
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            toast({ title: "Please log in", variant: "destructive" })
            setIsCreating(false)
            return
        }

        // Generate a cryptographically secure key
        const newKey = `dn_${crypto.randomUUID().replace(/-/g, '')}${crypto.randomUUID().substring(0, 8)}`

        const { error } = await supabase
            .from('api_keys')
            .insert({
                user_id: user.id,
                key_name: `Key - ${new Date().toLocaleDateString()}`,
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

    const toggleVisibility = (id: string) => {
        setVisibleKeyId(visibleKeyId === id ? null : id)
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                <div className="flex flex-col gap-1">
                    <h1 className="text-4xl font-bold tracking-tight text-white">Security Keys</h1>
                    <p className="text-white/40 text-[13px] font-medium uppercase tracking-widest">Infrastucture Access Control</p>
                </div>
                <Button
                    onClick={createKey}
                    disabled={isCreating}
                    className="bg-blue-600 hover:bg-blue-500 text-white gap-2 rounded-2xl px-6 py-6 shadow-2xl shadow-blue-500/20 active:scale-95 transition-all text-sm font-bold"
                >
                    {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    Provision New Access
                </Button>
            </div>

            <Card className="bg-white/5 backdrop-blur-3xl border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-white/50">
                        <thead className="text-[10px] text-white/20 font-bold uppercase tracking-[0.2em] bg-white/[0.02] border-b border-white/5">
                            <tr>
                                <th scope="col" className="px-8 py-5">Label</th>
                                <th scope="col" className="px-8 py-5">Authentication Token</th>
                                <th scope="col" className="px-8 py-5">Created</th>
                                <th scope="col" className="px-8 py-5">Last Activity</th>
                                <th scope="col" className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500/40 mb-4" />
                                        <p className="text-white/20 font-medium">Synchronizing with secure vault...</p>
                                    </td>
                                </tr>
                            ) : keys.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <p className="text-white/30 mb-6 font-medium">No active authentication tokens found.</p>
                                        <Button onClick={createKey} variant="outline" className="border-white/10 text-white/50 hover:bg-white/5 rounded-2xl px-6 py-5">
                                            Initialize Development Key
                                        </Button>
                                    </td>
                                </tr>
                            ) : (
                                keys.map((key) => (
                                    <tr key={key.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-8 py-6 font-bold text-white tracking-tight">{key.key_name}</td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 max-w-[300px]">
                                                <div className="relative group/key w-full">
                                                    <Input
                                                        type={visibleKeyId === key.id ? "text" : "password"}
                                                        value={key.api_key}
                                                        readOnly
                                                        className="h-10 bg-white/5 border-white/5 text-blue-300 font-mono text-[10px] w-full rounded-xl pr-20 focus:ring-1 focus:ring-blue-500/50"
                                                    />
                                                    <div className="absolute right-1 top-1 flex gap-1 bg-[#0a0a0a]/80 backdrop-blur-md rounded-lg p-0.5 border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => copyToClipboard(key.id, key.api_key)}
                                                            className="text-white/40 hover:text-white p-1.5 rounded-md hover:bg-white/5 transition-all"
                                                            title="Copy to clipboard"
                                                        >
                                                            {copiedId === key.id ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                                                        </button>
                                                        <button
                                                            onClick={() => toggleVisibility(key.id)}
                                                            className="text-white/40 hover:text-white p-1.5 rounded-md hover:bg-white/5 transition-all"
                                                            title="Toggle visibility"
                                                        >
                                                            <Eye className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-white/30 font-mono text-xs">{new Date(key.created_at).toLocaleDateString()}</td>
                                        <td className="px-8 py-6 text-white/30 font-mono text-xs">{key.last_used_at ? new Date(key.last_used_at).toLocaleDateString() : 'Never'}</td>
                                        <td className="px-8 py-6 text-right">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <button className="text-white/20 hover:text-red-400 p-2.5 rounded-xl hover:bg-red-400/10 transition-all border border-transparent hover:border-red-400/20">
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </DialogTrigger>
                                                <DialogContent className="border-white/10 bg-[#050505] text-white rounded-[2rem] max-w-md">
                                                    <DialogHeader>
                                                        <DialogTitle className="text-2xl font-bold tracking-tight">Revoke Access?</DialogTitle>
                                                        <DialogDescription className="text-white/40 text-sm mt-4 leading-relaxed">
                                                            This will immediately deactivate <span className="text-white font-bold">{key.key_name}</span>. Any live services or pipelines using this token will fail permanently.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <DialogFooter className="mt-8 flex gap-3">
                                                        <DialogClose asChild>
                                                            <Button variant="outline" className="flex-1 border-white/10 text-white/50 hover:bg-white/5 rounded-2xl py-6 font-bold">Cancel</Button>
                                                        </DialogClose>
                                                        <DialogClose asChild>
                                                            <Button variant="destructive" onClick={() => deleteKey(key.id)} className="flex-1 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white border border-red-500/20 rounded-2xl py-6 font-bold transition-all">
                                                                Revoke Token
                                                            </Button>
                                                        </DialogClose>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Card className="mt-10 bg-blue-500/5 border-blue-500/10 rounded-[2.5rem] p-10 overflow-hidden relative group">
                <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
                <h3 className="text-blue-400 font-bold mb-3 text-sm uppercase tracking-[0.2em] flex items-center gap-2">
                    <Shield className="h-4 w-4" /> Secure Integration Standards
                </h3>
                <p className="text-white/40 text-sm leading-relaxed max-w-3xl">
                    Never expose these keys in client-side code or public version control systems.
                    Utilize <code className="text-blue-300 bg-blue-500/10 px-1.5 py-0.5 rounded font-mono text-[11px]">.env.local</code> for local development and securely encrypted secrets in production.
                    If you detect anomalies in traffic, rotate your credentials immediately.
                </p>
            </Card>
        </div>
    )
}
