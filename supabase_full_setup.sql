-- =============================================================
-- DocuNexus — Complete Supabase Setup
-- Run this entire script in the Supabase SQL Editor
-- Project: mlqscdkfvkoqrnzwabxi
-- =============================================================


-- =============================================================
-- 1. PROFILES TABLE & TRIGGER
-- =============================================================

CREATE TABLE IF NOT EXISTS public.profiles (
    id             UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name      TEXT,
    email          TEXT,
    plan           TEXT    NOT NULL DEFAULT 'free',
    credits        INTEGER NOT NULL DEFAULT 100,
    credit_limit   INTEGER NOT NULL DEFAULT 100,
    token_limit    INTEGER NOT NULL DEFAULT 50000,
    created_at     TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at     TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile"    ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile"  ON public.profiles;
DROP POLICY IF EXISTS "Service role has full access"  ON public.profiles;

CREATE POLICY "Users can view own profile"   ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Service role has full access" ON public.profiles USING (true) WITH CHECK (true);

-- Auto-create profile row on signup
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- =============================================================
-- 2. API KEYS TABLE
-- =============================================================

CREATE TABLE IF NOT EXISTS public.api_keys (
    id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id    UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    key_name   TEXT    DEFAULT 'Production Key',
    api_key    TEXT    UNIQUE NOT NULL,
    is_active  BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own api keys"    ON public.api_keys;
DROP POLICY IF EXISTS "Users can generate api keys"    ON public.api_keys;
DROP POLICY IF EXISTS "Users can manage own api keys"  ON public.api_keys;
DROP POLICY IF EXISTS "Users can delete own api keys"  ON public.api_keys;

CREATE POLICY "Users can view own api keys"   ON public.api_keys FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can generate api keys"   ON public.api_keys FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage own api keys" ON public.api_keys FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own api keys" ON public.api_keys FOR DELETE USING (auth.uid() = user_id);


-- =============================================================
-- 3. USAGE LOGS TABLE
-- =============================================================

CREATE TABLE IF NOT EXISTS public.usage_logs (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    endpoint    TEXT    NOT NULL,
    credits_used INTEGER DEFAULT 1,
    error       TEXT,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own usage logs"       ON public.usage_logs;
DROP POLICY IF EXISTS "Service role can insert usage logs"  ON public.usage_logs;

CREATE POLICY "Users can view own usage logs"      ON public.usage_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role can insert usage logs" ON public.usage_logs FOR INSERT WITH CHECK (true);


-- =============================================================
-- 4. RPC FUNCTIONS — SECURE SERVER LOGIC
-- =============================================================

-- Validate an API key via RPC (SECURITY DEFINER bypasses RLS for the proxy)
CREATE OR REPLACE FUNCTION public.validate_api_key(input_key TEXT)
RETURNS TABLE (user_id UUID, is_active BOOLEAN) AS $$
BEGIN
    RETURN QUERY
    SELECT a.user_id, a.is_active
    FROM public.api_keys a
    WHERE a.api_key = input_key;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Deduct credits from a user's profile
CREATE OR REPLACE FUNCTION public.deduct_user_credits(p_user_id UUID, p_amount INTEGER)
RETURNS void AS $$
BEGIN
    UPDATE public.profiles
    SET credits = credits - p_amount
    WHERE id = p_user_id AND credits >= p_amount;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Upgrade a user's plan and reset credit/token limits
CREATE OR REPLACE FUNCTION public.upgrade_user_plan(target_user_id UUID, plan_name TEXT)
RETURNS void AS $$
DECLARE
    new_credits     INTEGER;
    new_token_limit INTEGER;
BEGIN
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
-- 5. execute_sql — POWERS THE SQL CONSOLE IN THE DASHBOARD
-- =============================================================
-- This function lets authenticated users run read-only SELECT
-- queries against their own data from the SQL Console page.
-- It is SECURITY DEFINER so it can execute dynamically, but
-- it enforces that calls come from authenticated users only.
-- =============================================================

CREATE OR REPLACE FUNCTION public.execute_sql(query_text TEXT)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
    stmt   TEXT;
BEGIN
    -- Only authenticated users may call this
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Unauthorized: must be logged in to use the SQL console.';
    END IF;

    -- Strip trailing semicolons / whitespace so we can wrap safely
    stmt := trim(both ' ' from trim(both ';' from query_text));

    -- Guard: only allow SELECT statements (prevents mutations)
    IF upper(left(stmt, 6)) <> 'SELECT' THEN
        RAISE EXCEPTION 'Only SELECT statements are allowed in the SQL Console.';
    END IF;

    -- Execute and return as a JSON array
    EXECUTE format('SELECT jsonb_agg(row_to_json(t)) FROM (%s) t', stmt)
    INTO result;

    RETURN COALESCE(result, '[]'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated role
GRANT EXECUTE ON FUNCTION public.execute_sql(TEXT) TO authenticated;


-- =============================================================
-- PLAN REFERENCE
-- =============================================================
-- Plan       | Monthly  | Annual   | Credits | Token Limit
-- -----------|----------|----------|---------|-------------
-- free       | —        | —        | 100     | 50,000
-- Basic      | $14.99   | $13.99   | 17,000  | 1,000,000
-- Personal   | $24.99   | $22.99   | 37,000  | 5,000,000
-- Business   | $49.99   | $49.99   | 81,000  | 20,000,000
-- =============================================================
