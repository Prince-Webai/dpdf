'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Eye, Plus, Trash2, Loader2, Check } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { useToast } from "@/hooks/use-toast"

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

        // Generate a random secure-looking key
        const newKey = `dn_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`

        const { error } = await supabase
            .from('api_keys')
            .insert({
                user_id: session.user.id,
                key_name: `Key - ${new Date().toLocaleDateString()}`,
                api_key: newKey,
            })

        if (error) {
            toast({ title: "Failed to create key", description: error.message, variant: "destructive" })
        } else {
            toast({ title: "Key generated successfully!" })
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
            toast({ title: "Failed to delete key", description: error.message, variant: "destructive" })
        } else {
            toast({ title: "Key deleted" })
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
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">API Keys</h1>
                    <p className="text-gray-400">Manage your secret keys for API access.</p>
                </div>
                <Button
                    onClick={createKey}
                    disabled={isCreating}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                >
                    {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    Create New Key
                </Button>
            </div>

            <div className="bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden mt-8">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-500 uppercase bg-black/50 border-b border-white/10">
                            <tr>
                                <th scope="col" className="px-6 py-4">Name</th>
                                <th scope="col" className="px-6 py-4">Secret Key</th>
                                <th scope="col" className="px-6 py-4">Created</th>
                                <th scope="col" className="px-6 py-4">Last Used</th>
                                <th scope="col" className="px-6 py-4 flex justify-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-indigo-500 mb-2" />
                                        <p className="text-gray-500">Loading keys...</p>
                                    </td>
                                </tr>
                            ) : keys.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center">
                                        <p className="text-gray-500 mb-4">You don't have any API keys yet.</p>
                                        <Button onClick={createKey} variant="outline" className="border-white/10">
                                            Generate your first key
                                        </Button>
                                    </td>
                                </tr>
                            ) : (
                                keys.map((key) => (
                                    <tr key={key.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white">{key.key_name}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 max-w-[250px]">
                                                <Input
                                                    type={visibleKeyId === key.id ? "text" : "password"}
                                                    value={key.api_key}
                                                    readOnly
                                                    className="h-8 bg-transparent border-white/10 text-gray-300 font-mono text-xs w-[220px]"
                                                />
                                                <button
                                                    onClick={() => copyToClipboard(key.id, key.api_key)}
                                                    className="text-gray-500 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
                                                >
                                                    {copiedId === key.id ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
                                                </button>
                                                <button
                                                    onClick={() => toggleVisibility(key.id)}
                                                    className="text-gray-500 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
                                                >
                                                    <Eye className="h-3 w-3" />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{new Date(key.created_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">{key.last_used_at ? new Date(key.last_used_at).toLocaleDateString() : 'Never'}</td>
                                        <td className="px-6 py-4 flex justify-end">
                                            <button
                                                onClick={() => deleteKey(key.id)}
                                                className="text-red-400 hover:text-red-300 p-2 rounded-md hover:bg-red-400/10 transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-8 p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                <h3 className="text-yellow-500 font-semibold mb-2 text-sm">Security Best Practices</h3>
                <p className="text-gray-400 text-sm">
                    Never commit your API keys to version control systems like GitHub. Use environment variables instead.
                    If you suspect a key has been compromised, delete it immediately and generate a new one.
                </p>
            </div>
        </div>
    )
}
