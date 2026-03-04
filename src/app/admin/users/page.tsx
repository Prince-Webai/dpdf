'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Ban, UserCheck, Loader2, RefreshCw, Users, MoreHorizontal, Activity, Trash2, Edit2 } from "lucide-react"
import { listAllUsers, updateUserMetadata, deleteUserAccount, getUserUsage } from "@/lib/actions"
import { toast } from "@/hooks/use-toast"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label as UILabel } from "@/components/ui/label"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    status: string;
    joined: string;
    plan: string;
    credits: number;
    tokenLimit: number;
}

export default function AdminUsersPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isUsageDialogOpen, setIsUsageDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [userToDelete, setUserToDelete] = useState<string | null>(null)
    const [usageData, setUsageData] = useState<any[]>([])
    const [isUpdating, setIsUpdating] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const loadUsers = async () => {
        setLoading(true)
        const data = await listAllUsers()
        setUsers(data)
        setLoading(false)
    }

    useEffect(() => {
        loadUsers()
    }, [])

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedUser) return

        setIsUpdating(true)
        const result = await updateUserMetadata(selectedUser.id, {
            plan: selectedUser.plan,
            credits: selectedUser.credits,
            tokenLimit: selectedUser.tokenLimit
        })

        if (result.success) {
            toast({ title: "User updated successfully" })
            setIsEditDialogOpen(false)
            loadUsers()
        } else {
            toast({ title: "Failed to update user", variant: "destructive" })
        }
        setIsUpdating(false)
    }

    const handleDeleteUser = async () => {
        if (!userToDelete) return

        setIsDeleting(true)
        const result = await deleteUserAccount(userToDelete)
        if (result.success) {
            toast({ title: "User deleted" })
            setIsDeleteDialogOpen(false)
            setUserToDelete(null)
            loadUsers()
        } else {
            toast({ title: "Delete failed", variant: "destructive", description: result.error })
        }
        setIsDeleting(false)
    }

    const handleViewUsage = async (user: User) => {
        setSelectedUser(user)
        const data = await getUserUsage(user.id)
        setUsageData(data)
        setIsUsageDialogOpen(true)
    }

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-32 text-gray-400 gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <span className="text-sm font-medium">Loading user directory...</span>
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
                            <Users className="h-4 w-4 text-blue-400" />
                        </div>
                        <span className="text-sm font-medium text-blue-400">Platform Admin</span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Manage Users</h1>
                    <p className="text-gray-400 text-lg">Administer platform entities and resource allocation.</p>
                </div>
            </div>

            <Card className="bg-[#050505] border-white/5 p-6 shadow-2xl relative overflow-hidden">
                <div className="mb-6 flex gap-4 relative z-10">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                            placeholder="Search directory..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 bg-black/40 border-white/10 text-white w-full rounded-xl h-11 transition-colors focus-visible:ring-blue-500/20 focus-visible:border-blue-500/50"
                        />
                    </div>
                    <Button
                        variant="outline"
                        className="h-11 border-white/10 bg-black/40 hover:bg-white/5 hover:text-blue-400 transition-colors rounded-xl"
                        onClick={loadUsers}
                    >
                        <RefreshCw className="h-4 w-4 mr-2" /> Refresh
                    </Button>
                </div>

                <div className="border border-white/5 rounded-xl overflow-hidden bg-black/20 relative z-10 flex flex-col min-h-[400px]">
                    <div className="overflow-x-auto">
                        {users.length === 0 ? (
                            <div className="p-12 text-center text-gray-500">
                                <Users className="h-8 w-8 mx-auto mb-3 opacity-50" />
                                <p className="font-medium">No entities found.</p>
                                <p className="text-sm mt-1">Ensure service role key is active.</p>
                            </div>
                        ) : (
                            <table className="w-full text-left text-sm">
                                <thead className="bg-black/40 border-b border-white/5 text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 font-semibold">Entity Details</th>
                                        <th scope="col" className="px-6 py-4 font-semibold">Access Tier</th>
                                        <th scope="col" className="px-6 py-4 font-semibold">Resources</th>
                                        <th scope="col" className="px-6 py-4 font-semibold">Status</th>
                                        <th scope="col" className="px-6 py-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-gray-300">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-white">{user.name}</span>
                                                    <span className="text-gray-500 text-xs mt-0.5">{user.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-medium capitalize">
                                                    {user.plan}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-gray-400">{user.credits.toLocaleString()} CRD</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.status === 'active' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-medium text-xs border border-emerald-500/20">
                                                        <UserCheck className="h-3 w-3" /> Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 font-medium text-xs border border-red-500/20">
                                                        <Ban className="h-3 w-3" /> Suspended
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button
                                                        variant="ghost" size="sm"
                                                        onClick={() => handleViewUsage(user)}
                                                        className="text-gray-400 hover:text-blue-400 h-8 hover:bg-blue-500/10"
                                                    >
                                                        <Activity className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost" size="sm"
                                                        onClick={() => { setSelectedUser(user); setIsEditDialogOpen(true); }}
                                                        className="text-gray-400 hover:text-gray-200 h-8 hover:bg-white/10"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost" size="sm"
                                                        onClick={() => { setUserToDelete(user.id); setIsDeleteDialogOpen(true); }}
                                                        className="text-gray-400 hover:text-red-400 h-8 hover:bg-red-500/10"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </Card>

            {/* Edit User Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="!bg-zinc-950 border border-white/10 text-white rounded-2xl overflow-hidden p-0 max-w-lg shadow-2xl">
                    <div className="p-6 border-b border-white/5 bg-zinc-900/40">
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <Edit2 className="h-5 w-5 text-blue-400" />
                            Modify Entity
                        </DialogTitle>
                        <DialogDescription className="text-gray-400 mt-2">
                            Update {selectedUser?.name}'s resource quotas and permissions. Changes apply immediately.
                        </DialogDescription>
                    </div>
                    {selectedUser && (
                        <form onSubmit={handleUpdateUser} className="p-6 space-y-6 bg-zinc-950">
                            <div className="space-y-3">
                                <UILabel className="text-sm text-gray-400 font-medium">Access Tier</UILabel>
                                <select
                                    value={selectedUser.plan}
                                    onChange={(e) => {
                                        const newPlan = e.target.value;
                                        const PLAN_LIMITS: Record<string, { credits: number, tokenLimit: number }> = {
                                            'free': { credits: 100, tokenLimit: 50000 },
                                            'Basic': { credits: 17000, tokenLimit: 1000000 },
                                            'Personal': { credits: 37000, tokenLimit: 5000000 },
                                            'Business': { credits: 81000, tokenLimit: 20000000 }
                                        };
                                        const limits = PLAN_LIMITS[newPlan] || PLAN_LIMITS['free'];
                                        setSelectedUser({
                                            ...selectedUser,
                                            plan: newPlan,
                                            credits: limits.credits,
                                            tokenLimit: limits.tokenLimit
                                        });
                                    }}
                                    className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-sm focus:ring-1 focus:ring-blue-500/50 outline-none transition-colors text-white"
                                >
                                    <option value="free">Free Tier</option>
                                    <option value="Basic">Basic Tier</option>
                                    <option value="Personal">Personal Tier</option>
                                    <option value="Business">Business Tier</option>
                                </select>
                            </div>
                            <div className="space-y-3">
                                <UILabel className="text-sm text-gray-400 font-medium">Resource Credits</UILabel>
                                <Input
                                    type="number"
                                    value={selectedUser.credits}
                                    onChange={(e) => setSelectedUser({ ...selectedUser, credits: parseInt(e.target.value) })}
                                    className="bg-zinc-900 border-white/10 rounded-xl h-12 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 text-white"
                                />
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <Button type="button" variant="ghost" className="rounded-xl text-gray-400 hover:text-white hover:bg-white/5" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                                <Button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                                >
                                    {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            {/* Usage Stats Dialog */}
            <Dialog open={isUsageDialogOpen} onOpenChange={setIsUsageDialogOpen}>
                <DialogContent className="!bg-zinc-950 border border-white/10 text-white rounded-2xl overflow-hidden p-0 max-w-2xl shadow-2xl">
                    <div className="p-6 border-b border-white/5 bg-zinc-900/40">
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <Activity className="h-5 w-5 text-blue-400" />
                            Activity Logs
                        </DialogTitle>
                        <DialogDescription className="text-gray-400 mt-2">
                            Recent API usage for {selectedUser?.email}
                        </DialogDescription>
                    </div>
                    <div className="max-h-[500px] overflow-y-auto p-0 bg-zinc-950">
                        <table className="w-full text-sm text-left">
                            <thead className="text-gray-400 bg-zinc-900 border-b border-white/5 sticky top-0">
                                <tr>
                                    <th className="px-6 py-3 font-semibold">Timestamp</th>
                                    <th className="px-6 py-3 font-semibold">Endpoint</th>
                                    <th className="px-6 py-3 font-semibold text-right">Cost</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-gray-300">
                                {usageData.length === 0 ? (
                                    <tr><td colSpan={3} className="px-6 py-12 text-center text-gray-500 font-medium">No activity records found for this user.</td></tr>
                                ) : (
                                    usageData.map((log: any) => (
                                        <tr key={log.id} className="hover:bg-white/[0.02]">
                                            <td className="px-6 py-3 text-gray-500 text-xs">{new Date(log.created_at).toLocaleString()}</td>
                                            <td className="px-6 py-3 text-blue-400 font-mono text-xs">{log.endpoint}</td>
                                            <td className="px-6 py-3 text-right">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs border border-blue-500/20">
                                                    {log.credits_used}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="!bg-zinc-950 border border-red-500/20 text-white p-0 rounded-2xl overflow-hidden max-w-md shadow-2xl">
                    <div className="p-6 bg-red-500/10 border-b border-red-500/20">
                        <DialogTitle className="text-xl font-bold text-red-500 flex items-center gap-2">
                            <Trash2 className="h-5 w-5" /> Confirm Termination
                        </DialogTitle>
                        <DialogDescription className="text-red-400/80 mt-2">
                            This action will completely remove the user and all associated data from the platform. This is irreversible.
                        </DialogDescription>
                    </div>
                    <div className="p-6 flex items-center justify-end gap-3 bg-zinc-900/40">
                        <Button
                            variant="ghost"
                            onClick={() => setIsDeleteDialogOpen(false)}
                            disabled={isDeleting}
                            className="rounded-xl text-gray-400 hover:text-white"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDeleteUser}
                            disabled={isDeleting}
                            variant="destructive"
                            className="rounded-xl bg-red-500 hover:bg-red-600/90 text-white font-semibold"
                        >
                            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Terminate User
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </motion.div>
    )
}
