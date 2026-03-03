'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Ban, UserCheck, Loader2, RefreshCw } from "lucide-react"
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
            <div className="flex items-center justify-center p-24 font-mono text-[10px] tracking-widest text-white/40 animate-pulse uppercase">
                INITIALIZING USER DIRECTORY UPLINK...
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
                    <h1 className="text-6xl font-serif text-white mb-4 tracking-tight">Manage Users</h1>
                    <p className="font-mono text-[10px] text-white/40 uppercase tracking-[0.2em]">ADMINISTER PLATFORM ENTITIES AND RESOURCE ALLOCATION</p>
                </div>
            </div>

            <div className="mb-6 flex gap-4">
                <div className="relative flex-1 max-w-md bg-executive-panel">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                    <Input
                        placeholder="SEARCH DIRECTORY STRINGS..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 border-white/[0.05] text-white w-full rounded-none font-mono text-[10px] uppercase tracking-widest h-12 focus-visible:ring-0 focus-visible:border-red-500/50 transition-colors bg-transparent"
                    />
                </div>
                <button
                    className="flex items-center gap-2 h-12 px-6 border border-white/[0.05] hover:border-executive-gold/30 hover:bg-white/[0.02] text-white/40 hover:text-executive-gold transition-colors font-mono text-[10px] uppercase tracking-widest"
                    onClick={loadUsers}
                >
                    <RefreshCw className="h-4 w-4" /> REFRESH UPLINK
                </button>
            </div>

            <div className="border border-white/[0.05] overflow-hidden bg-executive-panel abstract-texture">
                <div className="overflow-x-auto relative z-10">
                    {users.length === 0 ? (
                        <div className="p-8 text-center font-mono text-[10px] text-white/40 uppercase tracking-widest italic">
                            NO ENTITIES FOUND. ENSURE SERVICE ROLE KEY IS ACTIVE.
                        </div>
                    ) : (
                        <table className="w-full text-left font-mono text-[10px] uppercase tracking-widest">
                            <thead className="bg-black/50 border-b border-white/[0.05] text-white/40">
                                <tr>
                                    <th scope="col" className="px-8 py-6 font-normal">Entity Details</th>
                                    <th scope="col" className="px-8 py-6 font-normal">Access Tier</th>
                                    <th scope="col" className="px-8 py-6 font-normal">Resources</th>
                                    <th scope="col" className="px-8 py-6 font-normal">Status</th>
                                    <th scope="col" className="px-8 py-6 font-normal text-right">Administrative Override</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.05] text-white/80">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col space-y-2">
                                                <span className="font-bold text-white tracking-wider">{user.name}</span>
                                                <span className="text-white/40 lowercase tracking-normal">{user.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="inline-flex px-3 py-1 bg-white/[0.02] border border-white/[0.05] text-white/60">
                                                {user.plan}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-white/60">{user.credits} CRD</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            {user.status === 'active' ? (
                                                <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-400 font-bold border border-green-500/20">
                                                    <UserCheck className="h-3 w-3" /> ACTIVE
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 text-red-500 font-bold border border-red-500/20">
                                                    <Ban className="h-3 w-3" /> SUSPENDED
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 flex justify-end gap-6 h-full items-center">
                                            <button
                                                onClick={() => handleViewUsage(user)}
                                                className="text-white/40 hover:text-blue-400 transition-colors uppercase tracking-widest font-bold focus:outline-none"
                                            >
                                                USAGE_LOGS
                                            </button>
                                            <button
                                                onClick={() => { setSelectedUser(user); setIsEditDialogOpen(true); }}
                                                className="text-white/40 hover:text-white transition-colors uppercase tracking-widest font-bold focus:outline-none"
                                            >
                                                EDIT_LIMITS
                                            </button>
                                            <button
                                                onClick={() => { setUserToDelete(user.id); setIsDeleteDialogOpen(true); }}
                                                className="text-white/40 hover:text-red-500 transition-colors uppercase tracking-widest font-bold focus:outline-none"
                                            >
                                                TERMINATE
                                            </button>
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
                <DialogContent className="bg-executive-black border-white/[0.05] text-white p-0 overflow-hidden font-mono uppercase tracking-widest">
                    <div className="p-8 border-b border-white/[0.05]">
                        <DialogTitle className="font-serif text-2xl normal-case tracking-normal">Modify Entity: {selectedUser?.name}</DialogTitle>
                        <DialogDescription className="text-[10px] text-white/40 mt-4 leading-relaxed">
                            MANUALLY OVERRIDE USER TIER AND RESOURCE QUOTAS. CHANGES PROPAGATE IMMEDIATELY EXPERIENCING ZERO DOWNTIME.
                        </DialogDescription>
                    </div>
                    {selectedUser && (
                        <form onSubmit={handleUpdateUser} className="p-8 space-y-8">
                            <div className="space-y-4">
                                <UILabel className="text-[10px] text-white/60">ACCESS TIER</UILabel>
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
                                    className="w-full bg-black border border-white/[0.05] p-4 text-[10px] focus:ring-0 focus:border-white outline-none rounded-none transition-colors"
                                >
                                    <option value="free">FREE_TIER</option>
                                    <option value="Basic">BASIC_TIER</option>
                                    <option value="Personal">PERSONAL_TIER</option>
                                    <option value="Business">BUSINESS_TIER</option>
                                </select>
                            </div>
                            <div className="space-y-4">
                                <UILabel className="text-[10px] text-white/60">RESOURCE CREDITS</UILabel>
                                <Input
                                    type="number"
                                    value={selectedUser.credits}
                                    onChange={(e) => setSelectedUser({ ...selectedUser, credits: parseInt(e.target.value) })}
                                    className="bg-black border-white/[0.05] rounded-none h-14 font-mono text-sm focus-visible:ring-0 focus-visible:border-white"
                                />
                            </div>
                            <div className="space-y-4">
                                <UILabel className="text-[10px] text-white/60">TOKEN QUOTA LIMIT</UILabel>
                                <Input
                                    type="number"
                                    value={selectedUser.tokenLimit}
                                    onChange={(e) => setSelectedUser({ ...selectedUser, tokenLimit: parseInt(e.target.value) })}
                                    className="bg-black border-white/[0.05] rounded-none h-14 font-mono text-sm focus-visible:ring-0 focus-visible:border-white"
                                />
                            </div>
                            <div className="pt-8">
                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="w-full bg-white text-black h-12 flex items-center justify-center font-bold tracking-[0.2em] hover:bg-white/90 transition-colors disabled:opacity-50"
                                >
                                    {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'COMMIT CHANGES'}
                                </button>
                            </div>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            {/* Usage Stats Dialog */}
            <Dialog open={isUsageDialogOpen} onOpenChange={setIsUsageDialogOpen}>
                <DialogContent className="bg-executive-black border-white/[0.05] text-white p-0 max-w-3xl overflow-hidden font-mono uppercase tracking-widest">
                    <div className="p-8 border-b border-white/[0.05]">
                        <DialogTitle className="font-serif text-2xl normal-case tracking-normal">Telemetry Log</DialogTitle>
                        <p className="text-[10px] text-white/40 mt-2 lowercase tracking-normal font-sans">TARGET: {selectedUser?.email}</p>
                    </div>
                    <div className="max-h-[500px] overflow-y-auto">
                        <table className="w-full text-[10px] text-left">
                            <thead className="text-white/40 bg-black/50 border-b border-white/[0.05] sticky top-0">
                                <tr>
                                    <th className="px-8 py-4 font-normal">TIMESTAMP</th>
                                    <th className="px-8 py-4 font-normal">ENDPOINT_URI</th>
                                    <th className="px-8 py-4 font-normal text-right">COST</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.02] text-white/80">
                                {usageData.length === 0 ? (
                                    <tr><td colSpan={3} className="px-8 py-12 text-center text-white/30 italic tracking-wider">NO ACTIVITY RECORDS FOUND IN CURRENT EPOCH.</td></tr>
                                ) : (
                                    usageData.map((log: any) => (
                                        <tr key={log.id} className="hover:bg-white/[0.02]">
                                            <td className="px-8 py-4 text-white/50">{new Date(log.created_at).toLocaleString()}</td>
                                            <td className="px-8 py-4 text-blue-400 lowercase tracking-normal">{log.endpoint}</td>
                                            <td className="px-8 py-4 text-right text-red-400">{log.credits_used} CRD</td>
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
                <DialogContent className="bg-executive-black border-red-500/20 text-white p-0 overflow-hidden font-mono uppercase tracking-widest">
                    <div className="p-8 bg-red-500/10 border-b border-red-500/20">
                        <DialogTitle className="font-serif text-2xl normal-case tracking-normal text-red-500">Confirm Termination</DialogTitle>
                        <DialogDescription className="text-[10px] text-red-500/70 mt-4 leading-relaxed">
                            WARNING: THIS ACTION PROPOSES THE COMPLETE WIPING OF ENTITY DATA FROM THE REGISTRY. THIS OPERATION IS IRREVERSIBLE.
                        </DialogDescription>
                    </div>
                    <div className="p-8 flex items-center justify-end gap-6 bg-black">
                        <button
                            onClick={() => setIsDeleteDialogOpen(false)}
                            disabled={isDeleting}
                            className="text-white/40 hover:text-white transition-colors text-[10px] font-bold"
                        >
                            ABORT
                        </button>
                        <button
                            onClick={handleDeleteUser}
                            disabled={isDeleting}
                            className="bg-red-500 text-black px-8 py-3 font-bold text-[10px] hover:bg-red-400 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[160px]"
                        >
                            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'EXECUTE TERMINATION'}
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </motion.div>
    )
}
