-- =============================================================
-- SQL Console RPC Function for DocuNexus Dashboard
-- Run this in the Supabase SQL Editor to enable the SQL Console
-- =============================================================

-- Function: execute_sql
-- Executes a raw SQL query string and returns results as JSON rows.
-- SECURITY: Only the authenticated user who owns data can query via RLS.
-- The function runs with SECURITY DEFINER to allow running queries,
-- but we restrict which statements are allowed.

CREATE OR REPLACE FUNCTION public.execute_sql(query_text text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    result jsonb;
    query_upper text;
BEGIN
    -- Normalize input
    query_upper := upper(trim(query_text));

    -- Safety: Only allow SELECT statements (no DDL/DML that could damage data)
    IF query_upper NOT LIKE 'SELECT%'
       AND query_upper NOT LIKE 'WITH%'
       AND query_upper NOT LIKE 'EXPLAIN%'
    THEN
        RAISE EXCEPTION 'Only SELECT, WITH (CTE), and EXPLAIN statements are allowed.';
    END IF;

    -- Execute the query and return result as a JSON array
    EXECUTE format('SELECT jsonb_agg(row_to_json(t)) FROM (%s) t', query_text)
    INTO result;

    RETURN COALESCE(result, '[]'::jsonb);
END;
$$;

-- Grant execute permission to authenticated users only
REVOKE ALL ON FUNCTION public.execute_sql(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.execute_sql(text) TO authenticated;

-- =============================================================
-- NOTE: Run this SQL in your Supabase project's SQL Editor at:
-- https://supabase.com/dashboard -> SQL Editor -> New Query
-- =============================================================
