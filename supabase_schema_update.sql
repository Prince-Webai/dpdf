-- =============================================================
-- DocuNexu - Supabase Profiles Table & Plan Configuration
-- Run this in the Supabase SQL Editor
-- =============================================================

-- 1. Create the profiles table (links to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    email TEXT,
    plan TEXT NOT NULL DEFAULT 'free',
    credits INTEGER NOT NULL DEFAULT 100,
    credit_limit INTEGER NOT NULL DEFAULT 100,
    token_limit INTEGER NOT NULL DEFAULT 50000,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile (name only; plan/credits managed by admin/webhook)
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Admins (service role) can do everything
CREATE POLICY "Service role has full access" ON public.profiles
    USING (true)
    WITH CHECK (true);

-- 4. Auto-create a profile row when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, plan, credits, credit_limit, token_limit)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data ->> 'full_name',
        NEW.email,
        'free',
        100,
        100,
        50000
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Trigger the function after every sign-up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Helper function to upgrade a user's plan (call from admin or webhook)
--    plan_name options: 'free' | 'Basic' | 'Personal' | 'Business'
CREATE OR REPLACE FUNCTION public.upgrade_user_plan(target_user_id UUID, plan_name TEXT)
RETURNS void AS $$
DECLARE
    new_credits INTEGER;
    new_token_limit INTEGER;
BEGIN
    -- Set limits based on plan name (matches PLAN_LIMITS in profile-context.tsx)
    CASE plan_name
        WHEN 'Basic'    THEN new_credits := 17000;  new_token_limit := 1000000;
        WHEN 'Personal' THEN new_credits := 37000;  new_token_limit := 5000000;
        WHEN 'Business' THEN new_credits := 81000;  new_token_limit := 20000000;
        ELSE                 new_credits := 100;    new_token_limit := 50000;   -- free
    END CASE;

    UPDATE public.profiles
    SET
        plan         = plan_name,
        credits      = new_credits,
        credit_limit = new_credits,
        token_limit  = new_token_limit,
        updated_at   = now()
    WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================
-- PLAN REFERENCE (matches pricing page + profile-context.tsx)
-- =============================================================
-- Plan       | Monthly Price | Annual Price | Credits | Token Limit
-- -----------|---------------|--------------|---------|------------
-- free       | -             | -            | 100     | 50,000
-- Basic      | $14.99        | $13.99       | 17,000  | 1,000,000
-- Personal   | $24.99        | $22.99       | 37,000  | 5,000,000
-- Business   | $49.99        | $49.99       | 81,000  | 20,000,000
-- =============================================================
