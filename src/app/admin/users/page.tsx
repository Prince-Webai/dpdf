'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Ban, UserCheck, Shield, MoreHorizontal } from "lucide-react"

// Mock data since we lack the SUPABASE_SERVICE_ROLE_KEY to query auth.users
const mockUsers = [
    { id: "1a2b3c", email: "alice@techcorp.com", name: "Alice Smith", role: "user", status: "active", joined: "2024-01-15" },
    { id: "4d5e6f", email: "bob@startup.io", name: "Bob Jones", role: "admin", status: "active", joined: "2023-11-02" },
    { id: "7g8h9i", email: "charlie@freelance.net", name: "Charlie Day", role: "user", status: "suspended", joined: "2024-02-28" },
    { id: "0j1k2l", email: "diana@enterprise.co", name: "Diana Prince", role: "user", status: "active", joined: "2024-03-10" },
    { id: "3m4n5o", email: "evan@studio.design", name: "Evan Wright", role: "user", status: "active", joined: "2024-03-12" },
]

export default function AdminUsersPage() {
    const [searchTerm, setSearchTerm] = useState("")

    const filteredUsers = mockUsers.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Manage Users</h1>
                    <p className="text-gray-400">View and administer platform accounts.</p>
                </div>
            </div>

            <div className="mb-6 flex gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-[#0a0a0a] border-white/10 text-white w-full"
                    />
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700">Export CSV</Button>
            </div>

            <div className="bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-500 uppercase bg-black/50 border-b border-white/10">
                            <tr>
                                <th scope="col" className="px-6 py-4">User</th>
                                <th scope="col" className="px-6 py-4">Role</th>
                                <th scope="col" className="px-6 py-4">Status</th>
                                <th scope="col" className="px-6 py-4">Joined</th>
                                <th scope="col" className="px-6 py-4 flex justify-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-white">{user.name}</span>
                                            <span className="text-xs text-gray-500">{user.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.role === 'admin' ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 text-xs font-medium border border-indigo-500/20">
                                                <Shield className="h-3 w-3" /> Admin
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-1 rounded bg-gray-500/10 text-gray-400 text-xs font-medium border border-gray-500/20">
                                                User
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.status === 'active' ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20">
                                                <UserCheck className="h-3 w-3" /> Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-500/10 text-red-400 text-xs font-medium border border-red-500/20">
                                                <Ban className="h-3 w-3" /> Suspended
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">{new Date(user.joined).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 flex justify-end">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-8 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-sm text-indigo-200">
                <strong>Admin Notice:</strong> Full user suspension and role promotion requires `SUPABASE_SERVICE_ROLE_KEY` implementation to bypass standard auth restrictions.
            </div>
        </div>
    )
}
