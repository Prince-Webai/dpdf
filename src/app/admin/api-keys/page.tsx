'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Ban, Key, CheckCircle2, ShieldAlert, Loader2 } from "lucide-react"
import { listAllApiKeys, revokeApiKey } from "@/lib/actions"

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
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        )
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Audit API Keys</h1>
                    <p className="text-gray-400">Monitor and revoke API keys across the entire platform.</p>
                </div>
            </div>

            <div className="mb-6 flex gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Search by owner email or key name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-[#0a0a0a] border-white/10 text-white w-full"
                    />
                </div>
            </div>

            <div className="bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    {apiKeys.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            No API keys found. Ensure `SUPABASE_SERVICE_ROLE_KEY` is configured and your `api_keys` table is populated.
                        </div>
                    ) : (
                        <table className="w-full text-sm text-left text-gray-400">
                            <thead className="text-xs text-gray-500 uppercase bg-black/50 border-b border-white/10">
                                <tr>
                                    <th scope="col" className="px-6 py-4">Key Details</th>
                                    <th scope="col" className="px-6 py-4">Owner</th>
                                    <th scope="col" className="px-6 py-4">Status</th>
                                    <th scope="col" className="px-6 py-4">Created</th>
                                    <th scope="col" className="px-6 py-4">Last Used</th>
                                    <th scope="col" className="px-6 py-4 flex justify-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {filteredKeys.map((key) => (
                                    <tr key={key.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                                                    <Key className="h-4 w-4 text-indigo-400" />
                                                </div>
                                                <span className="font-medium text-white">{key.key_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{key.user_email}</td>
                                        <td className="px-6 py-4">
                                            {key.status === 'active' ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20">
                                                    <CheckCircle2 className="h-3 w-3" /> Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-500/10 text-red-400 text-xs font-medium border border-red-500/20">
                                                    <Ban className="h-3 w-3" /> Revoked
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">{new Date(key.created_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">{key.last_used}</td>
                                        <td className="px-6 py-4 flex justify-end">
                                            {key.status === 'active' && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                                    onClick={async () => {
                                                        await revokeApiKey(key.id);
                                                        // Refresh the list after revocation
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

            <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-4">
                <ShieldAlert className="h-5 w-5 text-red-400 mt-0.5" />
                <div>
                    <h3 className="text-red-400 font-semibold text-sm mb-1">Global Database Access Status</h3>
                    <p className="text-gray-400 text-sm">
                        Revoking API keys globally requires the `SUPABASE_SERVICE_ROLE_KEY` to bypass Row Level Security policies.
                        {apiKeys.length === 0 ? " Connection not established." : " Live connection active."}
                    </p>
                </div>
            </div>
        </div>
    )
}
