import { NextResponse } from 'next/server'
import { createClient } from '../../../utils/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/dashboard'

    if (code) {
        const supabase = await createClient()
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            const appUrl = process.env.NEXT_PUBLIC_APP_URL || origin

            // Determine redirect: respect explicit 'next', else check for admin role
            let redirectPath = next
            if (next === '/dashboard') {
                const role = data.session?.user?.app_metadata?.role
                if (role === 'admin') {
                    redirectPath = '/admin'
                }
            }

            return NextResponse.redirect(`${appUrl}${redirectPath}`)
        }
    }

    // OAuth failed — redirect to login with error message
    return NextResponse.redirect(`${origin}/login?message=OAuth sign-in failed. Please try again.`)
}
