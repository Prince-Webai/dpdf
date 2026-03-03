'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Ban, Key, CheckCircle2, ShieldAlert, Loader2 } from "lucide-react"
import { listAllApiKeys, revokeApiKey } from "@/lib/actions"
import { motion } from "framer-motion"

interface ApiKey {
    id: string;
    key_name: string;
    user_email: string;
    status: string;
    created_at: string;
    last_used: string;
}

export default function AdminApiKeysPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
    const [loading, setLoading] = useState(true)

    const loadKeys = async () => {
        const data = await listAllApiKeys()
        if (data && data.length > 0) {
            setApiKeys(data)
        }
        setLoading(false)
    }

    useEffect(() => {
        loadKeys()
    }, [])

    const filteredKeys = apiKeys.filter(key =>
        key.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        key.key_name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) {
        return (
            <div className="flex items-center justify-center p-24 font-mono text-[10px] tracking-widest text-white/40 animate-pulse uppercase">
                SYNCHRONIZING KEY REGISTRY...
            </div>
        )
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
                    <h1 className="text-6xl font-serif text-white mb-4 tracking-tight">Audit API Keys</h1>
                    <p className="font-mono text-[10px] text-white/40 uppercase tracking-[0.2em]">GLOBAL ACCESS REGISTRY OVERWATCH</p>
                </div>
            </div>

            <div className="mb-6 flex gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                    <Input
                        placeholder="Search by owner email or key name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 bg-executive-panel border-white/[0.05] text-white w-full rounded-none font-mono text-[10px] uppercase tracking-widest h-12 focus-visible:ring-0 focus-visible:border-red-500/50 transition-colors"
                    />
                </div>
            </div>

            <div className="border border-white/[0.05] overflow-hidden bg-executive-panel abstract-texture">
                <div className="overflow-x-auto relative z-10">
                    {apiKeys.length === 0 ? (
                        <div className="p-8 text-center font-mono text-[10px] text-white/40 uppercase tracking-widest italic">
                            No API keys found. Ensure `SUPABASE_SERVICE_ROLE_KEY` is configured and your `api_keys` table is populated.
                        </div>
                    ) : (
                        <table className="w-full text-left font-mono text-[10px] uppercase tracking-widest">
                            <thead className="bg-black/50 border-b border-white/[0.05] text-white/40">
                                <tr>
                                    <th scope="col" className="px-8 py-6 font-normal">Key Details</th>
                                    <th scope="col" className="px-8 py-6 font-normal">Owner</th>
                                    <th scope="col" className="px-8 py-6 font-normal">Status</th>
                                    <th scope="col" className="px-8 py-6 font-normal">Created</th>
                                    <th scope="col" className="px-8 py-6 font-normal">Last Used</th>
                                    <th scope="col" className="px-8 py-6 font-normal text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.05] text-white/80">
                                {filteredKeys.map((key) => (
                                    <tr key={key.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 flex items-center justify-center border border-white/[0.05] group-hover:border-executive-gold/30 bg-executive-black transition-colors">
                                                    <Key className="h-3 w-3 text-executive-gold" />
                                                </div>
                                                <span className="font-bold text-white tracking-wider">{key.key_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-white/60 lowercase tracking-normal">{key.user_email}</td>
                                        <td className="px-8 py-6">
                                            {key.status === 'active' ? (
                                                <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-400 font-bold border border-green-500/20">
                                                    <CheckCircle2 className="h-3 w-3" /> ACTIVE
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 text-red-500 font-bold border border-red-500/20">
                                                    <Ban className="h-3 w-3" /> REVOKED
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-white/40">{new Date(key.created_at).toLocaleDateString()}</td>
                                        <td className="px-8 py-6 text-white/40">{key.last_used}</td>
                                        <td className="px-8 py-6 text-right">
                                            {key.status === 'active' && (
                                                <button
                                                    className="inline-flex items-center gap-2 text-white/40 hover:text-red-500 transition-colors tracking-widest font-bold"
                                                    onClick={async () => {
                                                        await revokeApiKey(key.id);
                                                        loadKeys();
                                                    }}
                                                >
                                                    REVOKE
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            <div className="mt-16 p-8 bg-executive-black border border-red-500/20 flex items-start gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 border-t border-r border-red-500/10 opacity-50" />
                <div className="w-12 h-12 border border-red-500/30 flex items-center justify-center shrink-0">
                    <ShieldAlert className="h-5 w-5 text-red-500" />
                </div>
                <div className="space-y-4">
                    <h3 className="font-mono text-[10px] text-red-500 uppercase tracking-[0.2em] font-bold">DATABASE ACCESS STATUS</h3>
                    <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest leading-loose max-w-3xl italic">
                        REVOKING API KEYS GLOBALLY REQUIRES <span className="text-white">SUPABASE_SERVICE_ROLE_KEY</span> TO BYPASS RLS POLICIES.
                        {apiKeys.length === 0 ? " CONNECTION UNAVAILABLE." : " LIVE CONNECTION SECURED."}
                    </p>
                </div>
            </div>
        </motion.div>
    )
}
