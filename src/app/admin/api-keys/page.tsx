'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Ban, Key, CheckCircle2, ShieldAlert, Loader2, Info } from "lucide-react"
import { listAllApiKeys, revokeApiKey } from "@/lib/actions"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"

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
            <div className="flex flex-col items-center justify-center p-32 text-gray-400 gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <span className="text-sm font-medium">Loading key registry...</span>
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8 mt-4"
        >
            <div className="flex justify-between items-end mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 rounded-md bg-blue-500/20 border border-blue-500/30">
                            <Key className="h-4 w-4 text-blue-400" />
                        </div>
                        <span className="text-sm font-medium text-blue-400">Platform Admin</span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Audit API Keys</h1>
                    <p className="text-gray-400 text-lg">Global access registry overwatch.</p>
                </div>
            </div>

            <Card className="bg-[#050505] border-white/5 p-6 shadow-2xl relative overflow-hidden">
                <div className="mb-6 flex gap-4 relative z-10">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                            placeholder="Search by owner email or key name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 bg-black/40 border-white/10 text-white w-full rounded-xl h-11 transition-colors focus-visible:ring-blue-500/20 focus-visible:border-blue-500/50"
                        />
                    </div>
                </div>

                <div className="border border-white/5 rounded-xl overflow-hidden bg-black/20 relative z-10">
                    <div className="overflow-x-auto">
                        {apiKeys.length === 0 ? (
                            <div className="p-12 text-center text-gray-500">
                                <Info className="h-8 w-8 mx-auto mb-3 opacity-50" />
                                <p className="font-medium">No API keys found.</p>
                                <p className="text-sm mt-1">Ensure <span className="text-gray-300 font-mono text-xs bg-white/5 px-2 py-0.5 rounded">SUPABASE_SERVICE_ROLE_KEY</span> is configured and your `api_keys` table is populated.</p>
                            </div>
                        ) : (
                            <table className="w-full text-left text-sm">
                                <thead className="bg-black/40 border-b border-white/5 text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 font-semibold">Key Details</th>
                                        <th scope="col" className="px-6 py-4 font-semibold">Owner</th>
                                        <th scope="col" className="px-6 py-4 font-semibold">Status</th>
                                        <th scope="col" className="px-6 py-4 font-semibold">Created</th>
                                        <th scope="col" className="px-6 py-4 font-semibold">Last Used</th>
                                        <th scope="col" className="px-6 py-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-gray-300">
                                    {filteredKeys.map((key) => (
                                        <tr key={key.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                                                        <Key className="h-4 w-4" />
                                                    </div>
                                                    <span className="font-semibold text-white">{key.key_name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-400">{key.user_email}</td>
                                            <td className="px-6 py-4">
                                                {key.status === 'active' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-medium text-xs border border-emerald-500/20">
                                                        <CheckCircle2 className="h-3 w-3" /> Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 font-medium text-xs border border-red-500/20">
                                                        <Ban className="h-3 w-3" /> Revoked
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">{new Date(key.created_at).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-gray-500">{key.last_used}</td>
                                            <td className="px-6 py-4 text-right">
                                                {key.status === 'active' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8"
                                                        onClick={async () => {
                                                            await revokeApiKey(key.id);
                                                            loadKeys();
                                                        }}
                                                    >
                                                        Revoke
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </Card>

            <Card className="bg-[#050505] p-6 border-amber-500/20 shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl" />
                <div className="flex items-start gap-4 relative z-10">
                    <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 shrink-0">
                        <ShieldAlert className="h-6 w-6 text-amber-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white mb-2">Database Access Status</h3>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-3xl">
                            Revoking API keys globally requires <span className="text-gray-300 font-mono text-xs bg-white/5 px-2 py-0.5 rounded">SUPABASE_SERVICE_ROLE_KEY</span> to bypass RLS policies.
                            {apiKeys.length === 0 ? " Connection unavailable." : " Live connection secured."}
                        </p>
                    </div>
                </div>
            </Card>
        </motion.div>
    )
}
