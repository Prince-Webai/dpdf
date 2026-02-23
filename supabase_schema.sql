-- Create a table to store API keys for users
CREATE TABLE public.api_keys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    key_name TEXT NOT NULL,
    api_key TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_used_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true NOT NULL
);

-- Enable Row Level Security (RLS) policies
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- Allow users to read only their own keys
CREATE POLICY "Users can view own api keys" ON public.api_keys
    FOR SELECT USING (auth.uid() = user_id);

-- Allow users to insert their own keys
CREATE POLICY "Users can insert own api keys" ON public.api_keys
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own keys
CREATE POLICY "Users can delete own api keys" ON public.api_keys
    FOR DELETE USING (auth.uid() = user_id);

-- Create a table to track API usage per user
CREATE TABLE public.usage_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    endpoint TEXT NOT NULL,
    credits_used INTEGER DEFAULT 1 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

-- Users can only see their own usage
CREATE POLICY "Users can view own usage logs" ON public.usage_logs
    FOR SELECT USING (auth.uid() = user_id);

-- Create a secure function to validate API keys (used by Next.js proxy bypassing RLS context)
-- Since the proxy calls this with anon role, we need SECURITY DEFINER
CREATE OR REPLACE FUNCTION validate_api_key(input_key text)
RETURNS TABLE (user_id uuid, is_active boolean) AS $$
BEGIN
    RETURN QUERY 
    SELECT a.user_id, a.is_active 
    FROM public.api_keys a 
    WHERE a.api_key = input_key;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
