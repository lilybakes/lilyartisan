-- ============================================================================
-- DELTA 3c — Platform Settings + Audit Log
-- ============================================================================
-- Adds platform-wide flags to platform_settings:
--   * signups_enabled
--   * trial_enabled (reserved for Delta 4 — public checkout)
--   * maintenance_mode + message
--   * announcement toggle + message + severity
--
-- Also widens platform_settings SELECT to anon so the public Signup page
-- can check signups_enabled without being authenticated.
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. Extend platform_settings
-- ============================================================================
ALTER TABLE platform_settings
  ADD COLUMN IF NOT EXISTS signups_enabled       boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS trial_enabled         boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS maintenance_mode      boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS maintenance_message   text    NOT NULL DEFAULT 'We''re making improvements. Back shortly.',
  ADD COLUMN IF NOT EXISTS announcement_enabled  boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS announcement_message  text    NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS announcement_severity text    NOT NULL DEFAULT 'info'
    CHECK (announcement_severity IN ('info', 'warning', 'critical'));


-- ============================================================================
-- 2. Public-read grant for platform_settings
--    (RLS policy already allows read for all; just needs the anon table grant)
-- ============================================================================
GRANT SELECT ON platform_settings TO anon;


-- ============================================================================
-- 3. Widen audit_log SELECT via a SECURITY DEFINER helper so we can filter
--    server-side by action / target easily
-- ============================================================================
CREATE OR REPLACE FUNCTION sysadmin_list_audit_log(
  p_action        text DEFAULT NULL,
  p_target_search text DEFAULT NULL,
  p_limit         integer DEFAULT 100
) RETURNS TABLE (
  id             bigint,
  actor_id       uuid,
  actor_email    text,
  action         text,
  target_user_id uuid,
  target_email   text,
  details        jsonb,
  created_at     timestamptz
) AS $$
BEGIN
  IF NOT is_sysadmin() THEN
    RAISE EXCEPTION 'Only sysadmins can view audit log';
  END IF;

  RETURN QUERY
  SELECT
    a.id,
    a.actor_id,
    a.actor_email::text,
    a.action::text,
    a.target_user_id,
    a.target_email::text,
    a.details,
    a.created_at
  FROM audit_log a
  WHERE (p_action        IS NULL OR a.action = p_action)
    AND (p_target_search IS NULL OR
         a.target_email  ILIKE '%' || p_target_search || '%' OR
         a.actor_email   ILIKE '%' || p_target_search || '%')
  ORDER BY a.created_at DESC
  LIMIT COALESCE(p_limit, 100);
END $$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION sysadmin_list_audit_log(text, text, integer) TO authenticated;


-- ============================================================================
-- 4. Distinct action list for the filter dropdown
-- ============================================================================
CREATE OR REPLACE FUNCTION sysadmin_list_audit_actions()
RETURNS TABLE (action text, count bigint) AS $$
BEGIN
  IF NOT is_sysadmin() THEN
    RAISE EXCEPTION 'Only sysadmins can view audit log';
  END IF;
  RETURN QUERY
  SELECT a.action::text, COUNT(*)::bigint
  FROM audit_log a
  GROUP BY a.action
  ORDER BY COUNT(*) DESC;
END $$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION sysadmin_list_audit_actions() TO authenticated;

COMMIT;
