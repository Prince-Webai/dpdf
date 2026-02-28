'use server'

import { createAdminClient } from "@/utils/supabase/admin"
import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from 'next/cache'

// --- AUTH ACTIONS ---

export async function signUpUser(formData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}) {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
                data: {
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    full_name: `${formData.firstName} ${formData.lastName}`.trim(),
                    plan: 'free',
                    credits: 500,
                    token_limit: 50000
                }
            }
        })

        if (error) {
            console.error('Signup error:', error)
            return { success: false, error: error.message }
        }

        return { success: true, user: data.user }
    } catch (err: any) {
        console.error('Unexpected error during signup:', err)
        return { success: false, error: err.message || "An unexpected error occurred" }
    }
}

export async function forgotPassword(email: string) {
    try {
        const supabase = await createClient()
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password`,
        })

        if (error) {
            console.error('Reset password error:', error)
            return { success: false, error: error.message }
        }

        return { success: true }
    } catch (err: any) {
        console.error('Unexpected error during password reset request:', err)
        return { success: false, error: err.message || "An unexpected error occurred" }
    }
}

export async function updatePassword(password: string) {
    try {
        const supabase = await createClient()
        const { error } = await supabase.auth.updateUser({ password })

        if (error) {
            console.error('Update password error:', error)
            return { success: false, error: error.message }
        }

        return { success: true }
    } catch (err: any) {
        console.error('Unexpected error during password update:', err)
        return { success: false, error: err.message || "An unexpected error occurred" }
    }
}

// --- ADMIN ACTIONS ---

const PLAN_LIMITS: Record<string, { credits: number, token_limit: number }> = {
    'free': { credits: 100, token_limit: 50000 },
    'Hobby': { credits: 100, token_limit: 50000 },
    'Basic': { credits: 17000, token_limit: 1000000 },
    'Personal': { credits: 37000, token_limit: 5000000 },
    'Business': { credits: 81000, token_limit: 20000000 }
}

export async function listAllUsers() {
    try {
        const supabase = await createAdminClient()
        const { data: { users }, error: authError } = await supabase.auth.admin.listUsers()
        if (authError) throw authError

        const { data: profiles, error: profileError } = await supabase.from('profiles').select('*')
        if (profileError) throw profileError

        return users.map(user => {
            const profile = profiles?.find(p => p.id === user.id)
            return {
                id: user.id,
                email: user.email || '',
                name: profile?.full_name || user.user_metadata?.full_name || 'Unnamed User',
                role: user.app_metadata?.role || 'user',
                status: 'active',
                joined: new Date(user.created_at).toLocaleDateString(),
                plan: profile?.plan || user.user_metadata?.plan || 'free',
                credits: profile?.credits ?? user.user_metadata?.credits ?? 100,
                tokenLimit: profile?.token_limit ?? user.user_metadata?.token_limit ?? 50000
            }
        })
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

        const { data: { user: currentUser }, error: fetchError } = await supabase.auth.admin.getUserById(userId)
        if (fetchError) throw fetchError

        const updateData: any = {
            user_metadata: { ...currentUser?.user_metadata }
        }

        if (data.plan) {
            updateData.user_metadata.plan = data.plan
            const limits = PLAN_LIMITS[data.plan] || PLAN_LIMITS['free']

            if (data.credits === undefined) {
                updateData.user_metadata.credits = limits.credits
                updateData.user_metadata.credit_limit = limits.credits
            }
            if (data.tokenLimit === undefined) {
                updateData.user_metadata.token_limit = limits.token_limit
            }
        }

        if (data.credits !== undefined) {
            updateData.user_metadata.credits = data.credits
            if (data.credits > (updateData.user_metadata.credit_limit || 0)) {
                updateData.user_metadata.credit_limit = data.credits
            }
        }
        if (data.tokenLimit !== undefined) updateData.user_metadata.token_limit = data.tokenLimit

        if (data.role) {
            updateData.app_metadata = { role: data.role }
        }

        const { error } = await supabase.auth.admin.updateUserById(userId, updateData)
        if (error) throw error

        const profileUpsert: any = {
            id: userId,
            email: currentUser?.email,
        }

        if (updateData.user_metadata.plan !== undefined) profileUpsert.plan = updateData.user_metadata.plan
        if (updateData.user_metadata.credits !== undefined) profileUpsert.credits = updateData.user_metadata.credits
        if (updateData.user_metadata.token_limit !== undefined) profileUpsert.token_limit = updateData.user_metadata.token_limit
        if (updateData.user_metadata.credit_limit !== undefined) profileUpsert.credit_limit = updateData.user_metadata.credit_limit

        const { error: profileError } = await supabase
            .from('profiles')
            .upsert(profileUpsert, { onConflict: 'id' })

        if (profileError) console.error('Error upserting profile table:', profileError)

        revalidatePath('/dashboard', 'layout')
        revalidatePath('/admin/users')

        return { success: true }
    } catch (error: any) {
        console.error('Error updating user metadata:', error)
        return { success: false, error: error.message }
    }
}

export async function deleteUserAccount(userId: string) {
    try {
        const supabase = await createAdminClient()
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
        const { data, error } = await supabase
            .from('api_keys')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error

        return data.map(key => ({
            id: key.id,
            key_name: key.key_name || 'Untitled Key',
            user_email: key.user_id,
            status: key.is_active ? 'active' : 'revoked',
            created_at: key.created_at,
            last_used: key.last_used_at ? new Date(key.last_used_at).toLocaleDateString() : 'Never'
        }))
    } catch (error) {
        console.error('Error listing API keys:', error)
        return []
    }
}

export async function revokeApiKey(keyId: string) {
    try {
        const supabase = await createAdminClient();
        const { error } = await supabase
            .from('api_keys')
            .update({ is_active: false })
            .eq('id', keyId);
        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        console.error('Error revoking API key:', error);
        return { success: false, error: error.message };
    }
}

export async function createInitialAdmin() {
    try {
        const supabase = await createAdminClient()
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
        if (listError) throw listError

        const adminEmail = process.env.ADMIN_EMAIL || 'devashishbhavsar1@duck.com'
        const existingAdmin = users.find(u => u.email === adminEmail)

        if (existingAdmin) {
            await supabase.auth.admin.updateUserById(existingAdmin.id, {
                app_metadata: { role: 'admin' }
            })
            return { success: true }
        }
        return { success: false, message: 'Admin user not found' }
    } catch (error) {
        console.error('Error in createInitialAdmin:', error)
        return { success: false }
    }
}

export async function getAdminStats() {
    try {
        const supabase = await createAdminClient()
        const { data: { users } } = await supabase.auth.admin.listUsers()
        const { count: keysCount } = await supabase.from('api_keys').select('*', { count: 'exact', head: true }).eq('is_active', true)
        const { count: logsCount } = await supabase.from('usage_logs').select('*', { count: 'exact', head: true })

        return {
            totalUsers: users?.length || 0,
            activeApiKeys: keysCount || 0,
            totalApiCalls: logsCount || 0
        }
    } catch (error) {
        console.error('Error fetching admin stats:', error)
        return { totalUsers: 0, activeApiKeys: 0, totalApiCalls: 0 }
    }
}

// --- DASHBOARD ACTIONS ---

export async function deleteSelfAccount() {
    try {
        const supabaseServer = await createClient()
        const { data: { user }, error: sessionError } = await supabaseServer.auth.getUser()

        if (sessionError || !user) {
            return { success: false, error: 'Not authenticated. Please log in again.' }
        }

        const adminSupabase = await createAdminClient()
        const { error: deleteError } = await adminSupabase.auth.admin.deleteUser(user.id)
        if (deleteError) throw deleteError

        return { success: true }
    } catch (error: any) {
        console.error('Error deleting user account:', error)
        return { success: false, error: error.message || 'Failed to delete account.' }
    }
}
