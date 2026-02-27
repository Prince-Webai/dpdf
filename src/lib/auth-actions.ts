'use server'

import { createClient } from "@/utils/supabase/server"

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
