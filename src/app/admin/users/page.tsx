'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Ban, UserCheck, Shield, MoreHorizontal, Loader2 } from "lucide-react"
import { listAllUsers, updateUserMetadata, deleteUserAccount, getUserUsage } from "../actions"
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
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        )
    }

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
                <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={loadUsers}>Refresh</Button>
            </div>

            <div className="bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    {users.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            No users found. Ensure `SUPABASE_SERVICE_ROLE_KEY` is configured to fetch live users.
                        </div>
                    ) : (
                        <table className="w-full text-sm text-left text-gray-400">
                            <thead className="text-xs text-gray-500 uppercase bg-black/50 border-b border-white/10">
                                <tr>
                                    <th scope="col" className="px-6 py-4">User</th>
                                    <th scope="col" className="px-6 py-4">Plan</th>
                                    <th scope="col" className="px-6 py-4">Credits</th>
                                    <th scope="col" className="px-6 py-4">Status</th>
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
                                            <span className="px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 text-xs font-medium border border-indigo-500/20">
                                                {user.plan}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-300">{user.credits}</span>
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
                                        <td className="px-6 py-4 flex justify-end gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => handleViewUsage(user)} className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-400/10">
                                                Usage
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => { setSelectedUser(user); setIsEditDialogOpen(true); }} className="text-gray-400 hover:text-white hover:bg-white/5">
                                                Edit
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => { setUserToDelete(user.id); setIsDeleteDialogOpen(true); }} className="text-red-400 hover:text-red-300 hover:bg-red-400/10">
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Edit User Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="bg-[#0a0a0a] border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle>Edit User: {selectedUser?.name}</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Manually override user plan and resource limits.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedUser && (
                        <form onSubmit={handleUpdateUser} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <UILabel>Subscription Plan</UILabel>
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
                                    className="w-full bg-black border border-white/10 rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                >
                                    <option value="free">Free</option>
                                    <option value="Basic">Basic</option>
                                    <option value="Personal">Personal</option>
                                    <option value="Business">Business</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <UILabel>Available Credits</UILabel>
                                <Input
                                    type="number"
                                    value={selectedUser.credits}
                                    onChange={(e) => setSelectedUser({ ...selectedUser, credits: parseInt(e.target.value) })}
                                    className="bg-black border-white/10"
                                />
                            </div>
                            <div className="space-y-2">
                                <UILabel>Token Limit</UILabel>
                                <Input
                                    type="number"
                                    value={selectedUser.tokenLimit}
                                    onChange={(e) => setSelectedUser({ ...selectedUser, tokenLimit: parseInt(e.target.value) })}
                                    className="bg-black border-white/10"
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={isUpdating} className="bg-indigo-600 hover:bg-indigo-700">
                                    {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save Changes'}
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            {/* Usage Stats Dialog */}
            <Dialog open={isUsageDialogOpen} onOpenChange={setIsUsageDialogOpen}>
                <DialogContent className="bg-[#0a0a0a] border-white/10 text-white max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Usage History: {selectedUser?.email}</DialogTitle>
                    </DialogHeader>
                    <div className="max-h-[400px] overflow-y-auto mt-4">
                        <table className="w-full text-xs text-left text-gray-400">
                            <thead className="text-gray-500 uppercase bg-black border-b border-white/10">
                                <tr>
                                    <th className="px-4 py-2">Date</th>
                                    <th className="px-4 py-2">Endpoint</th>
                                    <th className="px-4 py-2">Credits Used</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {usageData.length === 0 ? (
                                    <tr><td colSpan={3} className="p-4 text-center">No logs found</td></tr>
                                ) : (
                                    usageData.map((log: any) => (
                                        <tr key={log.id}>
                                            <td className="px-4 py-2">{new Date(log.created_at).toLocaleString()}</td>
                                            <td className="px-4 py-2">{log.endpoint}</td>
                                            <td className="px-4 py-2">{log.credits_used}</td>
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
                <DialogContent className="bg-[#0a0a0a] border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Are you sure you want to delete this user account? This action is permanent and will remove all associated data.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting} className="text-gray-400">
                            Cancel
                        </Button>
                        <Button onClick={handleDeleteUser} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
                            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
