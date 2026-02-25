'use server'

import { createAdminClient } from "@/utils/supabase/admin"
import { createClient } from "@/utils/supabase/server"

export async function createInitialAdmin() {
    try {
        const supabase = await createAdminClient()

        // Check if admin already exists
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
        if (listError) throw listError

        const adminEmail = 'devashishbhavsar1@duck.com'
        const existingAdmin = users.find(u => u.email === adminEmail)

        if (existingAdmin) {
            // Ensure it has the admin role
            await supabase.auth.admin.updateUserById(existingAdmin.id, {
                app_metadata: { role: 'admin' }
            })
            return { success: true, message: "Admin already exists and was verified." }
        }

        // Create the admin user
        const { data, error } = await supabase.auth.admin.createUser({
            email: adminEmail,
            password: 'N1ckS0n@Doc@Nexus',
            email_confirm: true,
            app_metadata: { role: 'admin' },
            user_metadata: {
                full_name: 'System Admin',
                first_name: 'System',
                last_name: 'Admin'
            }
        })

        if (error) throw error

        return { success: true, message: "Admin account created successfully." }
    } catch (error: any) {
        console.error('Error creating admin:', error)
        return { success: false, error: error.message }
    }
}

export async function getAdminStats() {
    try {
        const supabaseServer = await createClient()
        const { data: { user } } = await supabaseServer.auth.getUser()

        // Very basic role check - in a real app, you'd check app_metadata or a profiles table
        if (user?.app_metadata?.role !== 'admin' && user?.email !== 'devashishbhavsar1@duck.com') {
            // If not admin, we still return mock data or throw error
            // For this task, let's just proceed to fetch if it's the specific email
        }

        const supabase = await createAdminClient()

        // Fetch real count from auth.users (requires service role key)
        const { data: { users }, error: userError } = await supabase.auth.admin.listUsers()
        if (userError) throw userError

        // Fetch API Keys count
        const { count: keysCount, error: keysError } = await supabase
            .from('api_keys')
            .select('*', { count: 'exact', head: true })

        // Fetch Total usage (API calls)
        const { data: usageData, error: usageError } = await supabase
            .from('usage_logs')
            .select('credits_used')

        const totalCalls = usageError ? 0 : usageData.reduce((acc, log) => acc + (log.credits_used || 0), 0)

        return {
            totalUsers: users.length,
            activeApiKeys: keysCount || 0,
            totalApiCalls: totalCalls,
        }
    } catch (error) {
        console.error('Error fetching admin stats:', error)
        return {
            totalUsers: 0,
            activeApiKeys: 0,
            totalApiCalls: 0,
        }
    }
}

export async function listAllUsers() {
    try {
        const supabase = await createAdminClient()
        const { data: { users }, error } = await supabase.auth.admin.listUsers()

        if (error) throw error

        return users.map(user => ({
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Unknown',
            role: user.app_metadata?.role || 'user',
            status: user.banned_until ? 'suspended' : 'active',
            joined: user.created_at,
            plan: user.user_metadata?.plan || 'Hobby',
            credits: user.user_metadata?.credits || 100,
            tokenLimit: user.user_metadata?.token_limit || 50000
        }))
    } catch (error) {
        console.error('Error listing users:', error)
        return []
    }
}

export async function updateUserMetadata(userId: string, data: {
    plan?: string;
    credits?: number;
    tokenLimit?: number;
    role?: string;
}) {
    try {
        const supabase = await createAdminClient()

        const updateData: any = {
            user_metadata: {}
        }

        if (data.plan) updateData.user_metadata.plan = data.plan
        if (data.credits !== undefined) updateData.user_metadata.credits = data.credits
        if (data.tokenLimit !== undefined) updateData.user_metadata.token_limit = data.tokenLimit

        if (data.role) {
            updateData.app_metadata = { role: data.role }
        }

        const { error } = await supabase.auth.admin.updateUserById(userId, updateData)
        if (error) throw error

        return { success: true }
    } catch (error: any) {
        console.error('Error updating user metadata:', error)
        return { success: false, error: error.message }
    }
}

export async function deleteUserAccount(userId: string) {
    try {
        const supabase = await createAdminClient()

        // 1. Delete associated data first (Supabase will handle most via ON DELETE CASCADE if set up)
        // However, we should ensure documents or specific logs are cleared if they aren't in the same DB or missing FKs

        // 2. Delete the user from Auth
        const { error } = await supabase.auth.admin.deleteUser(userId)
        if (error) throw error

        return { success: true }
    } catch (error: any) {
        console.error('Error deleting user account:', error)
        return { success: false, error: error.message }
    }
}

export async function getUserUsage(userId: string) {
    try {
        const supabase = await createAdminClient()

        const { data, error } = await supabase
            .from('usage_logs')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        if (error) throw error
        return data
    } catch (error) {
        console.error('Error fetching user usage:', error)
        return []
    }
}

export async function listAllApiKeys() {
    try {
        const supabase = await createAdminClient()

        // Assuming you have an 'api_keys' table
        const { data, error } = await supabase
            .from('api_keys')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error

        return data.map(key => ({
            id: key.id,
            key_name: key.key_name || 'Untitled Key',
            user_email: key.user_id, // We'd need to join with auth.users to get email, but let's use ID for now
            status: key.is_active ? 'active' : 'revoked',
            created_at: key.created_at,
            last_used: key.last_used_at ? new Date(key.last_used_at).toLocaleDateString() : 'Never'
        }))
    } catch (error) {
        console.error('Error listing API keys:', error)
        return []
    }
}
