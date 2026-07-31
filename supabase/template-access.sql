-- ============================================================================
-- Template Access System — exclusive templates & styles granted per-user
-- ============================================================================
-- Default: every template + every style is available to every user.
-- Sysadmin can mark specific templates or styles as "exclusive" — those are
-- then hidden from everyone UNTIL the sysadmin explicitly grants them to
-- specific users.
--
-- Two-level control:
--   * scope='template' — locks a whole template type (e.g. only VIP users
--     see "Certificate of Craft")
--   * scope='style'    — locks a whole style variant (e.g. only VIP users
--     see the "Vintage Letterpress" aesthetic)
--
-- Safe to re-run.
-- ============================================================================

BEGIN;

-- 1. Which templates/styles are exclusive (default: everything is open)
CREATE TABLE IF NOT EXISTS template_visibility (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scope        text NOT NULL CHECK (scope IN ('template', 'style')),
  identifier   text NOT NULL,
  is_exclusive boolean NOT NULL DEFAULT false,
  updated_at   timestamptz DEFAULT now(),
  updated_by   uuid REFERENCES auth.users(id),
  UNIQUE (scope, identifier)
);

-- 2. Which users have been granted access to which exclusive item
CREATE TABLE IF NOT EXISTS template_grants (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scope      text NOT NULL CHECK (scope IN ('template', 'style')),
  identifier text NOT NULL,
  granted_by uuid REFERENCES auth.users(id),
  granted_at timestamptz DEFAULT now(),
  note       text,
  UNIQUE (user_id, scope, identifier)
);

CREATE INDEX IF NOT EXISTS idx_template_grants_user   ON template_grants(user_id);
CREATE INDEX IF NOT EXISTS idx_template_visibility_ex ON template_visibility(scope, identifier) WHERE is_exclusive;

-- ============================================================================
-- RLS
-- ============================================================================
ALTER TABLE template_visibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_grants     ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS template_visibility_read  ON template_visibility;
DROP POLICY IF EXISTS template_visibility_write ON template_visibility;
DROP POLICY IF EXISTS template_grants_read      ON template_grants;
DROP POLICY IF EXISTS template_grants_write     ON template_grants;

-- Visibility: sysadmins only (users get access info through the my_template_access RPC)
CREATE POLICY template_visibility_read  ON template_visibility FOR SELECT USING (is_sysadmin());
CREATE POLICY template_visibility_write ON template_visibility FOR ALL    USING (is_sysadmin()) WITH CHECK (is_sysadmin());

-- Grants: users can read their own; sysadmins can read/write all
CREATE POLICY template_grants_read  ON template_grants FOR SELECT USING (user_id = auth.uid() OR is_sysadmin());
CREATE POLICY template_grants_write ON template_grants FOR ALL    USING (is_sysadmin())          WITH CHECK (is_sysadmin());

-- ============================================================================
-- User-facing RPC — returns the access rules relevant to the current user
-- ============================================================================
CREATE OR REPLACE FUNCTION my_template_access()
RETURNS TABLE(scope text, identifier text, is_exclusive boolean, has_access boolean) AS $$
BEGIN
  RETURN QUERY
  SELECT
    v.scope,
    v.identifier,
    v.is_exclusive,
    (NOT v.is_exclusive) OR EXISTS (
      SELECT 1 FROM template_grants g
      WHERE g.user_id = auth.uid()
        AND g.scope = v.scope
        AND g.identifier = v.identifier
    ) AS has_access
  FROM template_visibility v
  WHERE v.is_exclusive = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper for other SQL — checks in a single call
CREATE OR REPLACE FUNCTION has_template_access(p_scope text, p_identifier text)
RETURNS boolean AS $$
DECLARE v_exclusive boolean;
BEGIN
  SELECT is_exclusive INTO v_exclusive
  FROM template_visibility
  WHERE scope = p_scope AND identifier = p_identifier;

  IF v_exclusive IS NULL OR v_exclusive = false THEN
    RETURN true;   -- not marked exclusive → open to all
  END IF;

  RETURN EXISTS (
    SELECT 1 FROM template_grants
    WHERE user_id = auth.uid()
      AND scope = p_scope
      AND identifier = p_identifier
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Sysadmin RPCs
-- ============================================================================
CREATE OR REPLACE FUNCTION sysadmin_list_template_visibility()
RETURNS TABLE(scope text, identifier text, is_exclusive boolean) AS $$
BEGIN
  IF NOT is_sysadmin() THEN RAISE EXCEPTION 'Only sysadmins'; END IF;
  RETURN QUERY SELECT v.scope, v.identifier, v.is_exclusive FROM template_visibility v;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION sysadmin_set_template_visibility(
  p_scope text, p_identifier text, p_is_exclusive boolean
) RETURNS void AS $$
BEGIN
  IF NOT is_sysadmin() THEN RAISE EXCEPTION 'Only sysadmins'; END IF;

  INSERT INTO template_visibility (scope, identifier, is_exclusive, updated_by)
  VALUES (p_scope, p_identifier, p_is_exclusive, auth.uid())
  ON CONFLICT (scope, identifier) DO UPDATE
    SET is_exclusive = p_is_exclusive,
        updated_at = now(),
        updated_by = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION sysadmin_list_template_grants()
RETURNS TABLE(
  grant_id uuid, user_id uuid, user_email text,
  scope text, identifier text, granted_at timestamptz, note text
) AS $$
BEGIN
  IF NOT is_sysadmin() THEN RAISE EXCEPTION 'Only sysadmins'; END IF;

  RETURN QUERY
  SELECT g.id, g.user_id, u.email::text, g.scope, g.identifier, g.granted_at, g.note
  FROM template_grants g
  JOIN auth.users u ON u.id = g.user_id
  ORDER BY g.granted_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION sysadmin_grant_template(
  p_user_id uuid, p_scope text, p_identifier text, p_note text DEFAULT NULL
) RETURNS void AS $$
BEGIN
  IF NOT is_sysadmin() THEN RAISE EXCEPTION 'Only sysadmins'; END IF;

  INSERT INTO template_grants (user_id, scope, identifier, granted_by, note)
  VALUES (p_user_id, p_scope, p_identifier, auth.uid(), p_note)
  ON CONFLICT (user_id, scope, identifier) DO UPDATE
    SET note = EXCLUDED.note,
        granted_at = now(),
        granted_by = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION sysadmin_revoke_template(
  p_user_id uuid, p_scope text, p_identifier text
) RETURNS void AS $$
BEGIN
  IF NOT is_sysadmin() THEN RAISE EXCEPTION 'Only sysadmins'; END IF;

  DELETE FROM template_grants
  WHERE user_id = p_user_id AND scope = p_scope AND identifier = p_identifier;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION sysadmin_users_for_grant()
RETURNS TABLE(user_id uuid, email text) AS $$
BEGIN
  IF NOT is_sysadmin() THEN RAISE EXCEPTION 'Only sysadmins'; END IF;
  RETURN QUERY SELECT id, email::text FROM auth.users WHERE email IS NOT NULL ORDER BY email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
GRANT EXECUTE ON FUNCTION my_template_access                 TO authenticated;
GRANT EXECUTE ON FUNCTION has_template_access                TO authenticated;
GRANT EXECUTE ON FUNCTION sysadmin_list_template_visibility  TO authenticated;
GRANT EXECUTE ON FUNCTION sysadmin_set_template_visibility   TO authenticated;
GRANT EXECUTE ON FUNCTION sysadmin_list_template_grants      TO authenticated;
GRANT EXECUTE ON FUNCTION sysadmin_grant_template            TO authenticated;
GRANT EXECUTE ON FUNCTION sysadmin_revoke_template           TO authenticated;
GRANT EXECUTE ON FUNCTION sysadmin_users_for_grant           TO authenticated;

COMMIT;
