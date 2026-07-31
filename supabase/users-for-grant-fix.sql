-- ============================================================================
-- Fix: sysadmin_users_for_grant returned an empty list
-- ============================================================================
-- Root cause: my original function was:
--
--   RETURNS TABLE(user_id uuid, email text) ...
--   RETURN QUERY SELECT id, email::text FROM auth.users WHERE email IS NOT NULL;
--
-- PostgreSQL can resolve the unqualified `email` in WHERE to the OUTPUT-column
-- declaration (which is NULL inside the function body), not to `auth.users.email`.
-- Then `email IS NOT NULL` is false for every row and nothing is returned.
--
-- Fix: fully qualify columns with the `u` alias, and set search_path explicitly
-- so `auth.users` resolves cleanly under SECURITY DEFINER.
--
-- Safe to re-run.
-- ============================================================================

BEGIN;

DROP FUNCTION IF EXISTS sysadmin_users_for_grant();

CREATE FUNCTION sysadmin_users_for_grant()
RETURNS TABLE(user_id uuid, email text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  IF NOT is_sysadmin() THEN
    RAISE EXCEPTION 'sysadmin_users_for_grant: caller is not a sysadmin';
  END IF;

  RETURN QUERY
    SELECT u.id, u.email::text
    FROM auth.users u
    WHERE u.email IS NOT NULL
    ORDER BY u.email;
END;
$$;

GRANT EXECUTE ON FUNCTION sysadmin_users_for_grant() TO authenticated;

COMMIT;
