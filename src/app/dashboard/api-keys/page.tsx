'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Eye, Plus, Trash2, Loader2, Check, ShieldCheck, Key } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"

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
            toast({ title: "Portal auth failure", variant: "destructive" })
            setIsCreating(false)
            return
        }
        const newKey = `dn_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
        const { error } = await supabase
            .from('api_keys')
            .insert({
                user_id: session.user.id,
                key_name: `KEY_${new Date().getTime().toString().slice(-4)}`,
                api_key: newKey,
            })
        if (error) {
            toast({ title: "Key generation faulted", description: error.message, variant: "destructive" })
        } else {
            toast({ title: "New key successfully registered" })
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
            toast({ title: "Deletion failed", description: error.message, variant: "destructive" })
        } else {
            toast({ title: "Key invalidated" })
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
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-16"
        >
            <div className="flex justify-between items-end border-b border-white/[0.05] pb-12">
                <div>
                    <h1 className="text-6xl font-serif text-white mb-4 tracking-tight">Access Registry</h1>
                    <p className="font-mono text-[10px] text-white/40 uppercase tracking-[0.2em]">API AUTHENTICATION ARCHITECTURE</p>
                </div>
                <button
                    onClick={createKey}
                    disabled={isCreating}
                    className="border border-executive-gold px-8 py-3 text-executive-gold font-mono text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-executive-gold hover:text-black hover:tracking-[0.4em] flex items-center gap-3 disabled:opacity-20"
                >
                    {isCreating ? <Loader2 className="h-4 w-4 animate-spin text-executive-gold" /> : <Plus className="h-4 w-4" />}
                    REGISTER NEW KEY
                </button>
            </div>

            <div className="border border-white/[0.05] overflow-hidden bg-executive-panel abstract-texture">
                <table className="w-full text-left font-mono relative z-10">
                    <thead>
                        <tr className="border-b border-white/[0.05] text-[9px] text-white/30 uppercase tracking-[0.2em]">
                            <th className="px-8 py-6 font-normal">NAME SPECIFICATION</th>
                            <th className="px-8 py-6 font-normal">ENCRYPTED TOKEN</th>
                            <th className="px-8 py-6 font-normal">INITIALIZED</th>
                            <th className="px-8 py-6 font-normal text-right">ACTION</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.05] text-white/80">
                        {isLoading ? (
                            <tr>
                                <td colSpan={4} className="px-8 py-24 text-center text-[10px] text-white/20 uppercase tracking-widest animate-pulse">SYNCHRONIZING REGISTRY...</td>
                            </tr>
                        ) : keys.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-8 py-24 text-center text-[10px] text-white/20 uppercase tracking-widest italic">NO ACTIVE REGISTRY ENTRIES IDENTIFIED</td>
                            </tr>
                        ) : (
                            keys.map((key) => (
                                <tr key={key.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="px-8 py-8">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs text-white uppercase tracking-wider">{key.key_name}</span>
                                            <span className="text-[9px] text-white/40 font-mono tracking-tighter truncate w-32">{key.id}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-4 group/key">
                                            <div className="flex-1 max-w-[420px] bg-executive-black border border-white/[0.05] px-4 py-2 flex items-center justify-between transition-all group-hover/key:border-executive-gold/30">
                                                <span className="text-[11px] text-white/60 font-mono tracking-tighter truncate pr-4 italic">
                                                    {visibleKeyId === key.id ? key.api_key : '•••••••••••••••••••••••••••••••••••'}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => toggleVisibility(key.id)} className="text-white/40 hover:text-white transition-colors">
                                                        <Eye className="h-3 w-3" />
                                                    </button>
                                                    <button onClick={() => copyToClipboard(key.id, key.api_key)} className="text-white/40 hover:text-executive-gold transition-colors">
                                                        {copiedId === key.id ? <Check className="h-3 w-3 text-executive-gold" /> : <Copy className="h-3 w-3" />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] text-white/60">{new Date(key.created_at).toLocaleDateString()}</span>
                                            <span className="text-[9px] text-white/30 uppercase tracking-widest">EST_TIMEZONE</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8 text-right">
                                        <button
                                            onClick={() => deleteKey(key.id)}
                                            className="text-white/40 hover:text-red-500 transition-colors inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest group/del"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                            <span className="opacity-0 group-hover/del:opacity-50 transition-opacity">REVOKE</span>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="border border-white/[0.05] p-12 bg-executive-black flex items-start gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 border-t border-r border-executive-gold/20" />
                <div className="w-12 h-12 border border-executive-gold/30 flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-5 w-5 text-executive-gold" />
                </div>
                <div className="space-y-4">
                    <h3 className="font-mono text-[10px] text-executive-gold uppercase tracking-[0.2em] font-bold">SECURITY ARCHITECTURE ADVISORY</h3>
                    <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest leading-loose max-w-3xl italic">
                        SECRET TOKENS GRANT PERMANENT ADMINISTRATIVE ACCESS TO THE DOCUMENT EXTRACTION PIPELINE. LEAKED TOKENS MUST BE INVALIDATED IMMEDIATELY VIA THE REVOKE PROTOCOL. ENCRYPT ALL VECTORS IN PRODUCTION ENVIRONMENTS.
                    </p>
                </div>
            </div>
        </motion.div>
    )
}
