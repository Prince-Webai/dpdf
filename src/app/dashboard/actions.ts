'use server'

import { createAdminClient } from "@/utils/supabase/admin"
import { createClient } from "@/utils/supabase/server"

/**
 * Deletes the currently authenticated user's account entirely:
 * - Removes user from auth.users (cascades to profiles, api_keys, usage_logs via DB constraints)
 * - Called from the client; uses the admin client on server to actually perform deletion
 */
export async function deleteSelfAccount() {
    try {
        // 1. Get the current authenticated user from their session
        const supabaseServer = await createClient()
        const { data: { user }, error: sessionError } = await supabaseServer.auth.getUser()

        if (sessionError || !user) {
            return { success: false, error: 'Not authenticated. Please log in again.' }
        }

        const userId = user.id

        // 2. Use admin client to delete the user from auth.users
        //    (this will cascade-delete profiles, api_keys, usage_logs etc. via DB foreign key constraints)
        const adminSupabase = await createAdminClient()
        const { error: deleteError } = await adminSupabase.auth.admin.deleteUser(userId)

        if (deleteError) throw deleteError

        return { success: true }
    } catch (error: any) {
        console.error('Error deleting user account:', error)
        return { success: false, error: error.message || 'Failed to delete account.' }
    }
}
