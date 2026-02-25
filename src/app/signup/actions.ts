'use server'

import { createAdminClient } from "@/utils/supabase/admin"

export async function adminSignUp(formData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}) {
    try {
        const supabase = await createAdminClient()

        const { data, error } = await supabase.auth.admin.createUser({
            email: formData.email,
            password: formData.password,
            email_confirm: true, // Auto-confirm email to bypass verification
            user_metadata: {
                first_name: formData.firstName,
                last_name: formData.lastName,
                full_name: `${formData.firstName} ${formData.lastName}`,
                plan: 'Hobby',
                credits: 100,
                token_limit: 50000
            }
        })

        if (error) {
            console.error('Admin signup error:', error)
            return { success: false, error: error.message }
        }

        return { success: true, user: data.user }
    } catch (err: any) {
        console.error('Unexpected error during admin signup:', err)
        return { success: false, error: err.message || "An unexpected error occurred" }
    }
}
