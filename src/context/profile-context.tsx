'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { createClient } from '@/utils/supabase/client'

export const PLAN_LIMITS: Record<string, { credits: number; token_limit: number }> = {
    'free': { credits: 100, token_limit: 50000 },
    'Hobby': { credits: 100, token_limit: 50000 },
    'Basic': { credits: 17000, token_limit: 1000000 },
    'Personal': { credits: 37000, token_limit: 5000000 },
    'Business': { credits: 81000, token_limit: 20000000 },
}

interface Profile {
    id: string
    plan: string
    credits: number
    credit_limit: number
    token_limit: number
    full_name: string | null
    email: string | null
    created_at: string | null
}

interface ProfileContextValue {
    user: any | null
    profile: Profile | null
    loading: boolean
    plan: string
    credits: number
    creditLimit: number
    tokenLimit: number
    fullName: string
    creditPercentage: number
    refreshProfile: () => Promise<void>
}

const ProfileContext = createContext<ProfileContextValue | null>(null)

export function ProfileProvider({ children }: { children: ReactNode }) {
    const supabase = createClient()
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchProfile = async () => {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        setUser(authUser)
        if (!authUser) { setLoading(false); return }

        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single()

        if (data) {
            setProfile(data)
        } else {
            // Fallback to user_metadata if profile row missing
            const meta = authUser.user_metadata || {}
            const planName = meta.plan || 'free'
            const limits = PLAN_LIMITS[planName] || PLAN_LIMITS['free']
            setProfile({
                id: authUser.id,
                plan: planName,
                credits: meta.credits ?? limits.credits,
                credit_limit: meta.credit_limit ?? limits.credits,
                token_limit: meta.token_limit ?? limits.token_limit,
                full_name: meta.full_name || null,
                email: authUser.email || null,
                created_at: authUser.created_at || null,
            })
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchProfile()

        // Auth state change listener (e.g. after re-login)
        const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                fetchProfile()
            } else {
                setUser(null)
                setProfile(null)
            }
        })

        return () => authSub.unsubscribe()
    }, [])

    // Set up Realtime subscription AFTER we know the user id
    useEffect(() => {
        if (!user?.id) return

        const channel = supabase
            .channel(`profile-${user.id}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'profiles',
                filter: `id=eq.${user.id}`,
            }, (payload) => {
                console.log('[ProfileContext] Realtime update received:', payload.new)
                setProfile(payload.new as Profile)
            })
            .subscribe((status) => {
                console.log('[ProfileContext] Realtime subscription status:', status)
            })

        return () => { supabase.removeChannel(channel) }
    }, [user?.id])

    // Derived values
    const plan = profile?.plan || 'free'
    const credits = profile?.credits ?? 0
    const limits = PLAN_LIMITS[plan] || PLAN_LIMITS['free']
    const creditLimit = profile?.credit_limit || limits.credits
    const tokenLimit = profile?.token_limit || limits.token_limit
    const fullName = profile?.full_name || user?.user_metadata?.full_name || 'User'
    const creditPercentage = Math.min(100, Math.max(0, (credits / (creditLimit || 1)) * 100))

    return (
        <ProfileContext.Provider value={{
            user,
            profile,
            loading,
            plan,
            credits,
            creditLimit,
            tokenLimit,
            fullName,
            creditPercentage,
            refreshProfile: fetchProfile,
        }}>
            {children}
        </ProfileContext.Provider>
    )
}

export function useProfile() {
    const ctx = useContext(ProfileContext)
    if (!ctx) throw new Error('useProfile must be used inside <ProfileProvider>')
    return ctx
}
