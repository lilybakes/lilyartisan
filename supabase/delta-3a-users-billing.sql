-- ============================================================================
-- DELTA 3a — User Management + Billing Config
-- ============================================================================
-- Adds:
--   * Suspend / Detach / Delete flags on profiles
--   * platform_settings (business info, invoicing, payment)
--   * audit_log (records every sysadmin action)
--   * impersonation_sessions (holds original password hash during impersonation)
--   * SECURITY DEFINER RPCs the client calls to perform admin actions
--
-- Safe to re-run.
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. Extend profiles with status columns
-- ============================================================================
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_status text
  NOT NULL DEFAULT 'active'
  CHECK (email_status IN ('active', 'detached', 'suspended'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_changed_at timestamptz;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS suspended_at     timestamptz;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS suspended_reason text;


-- ============================================================================
-- 2. platform_settings — singleton row of platform-wide config
-- ============================================================================
CREATE TABLE IF NOT EXISTS platform_settings (
  id                integer PRIMARY KEY DEFAULT 1,
  -- Business info
  business_name     text NOT NULL DEFAULT 'Swim Revelation Trading',
  business_reg_no   text NOT NULL DEFAULT 'JR0164533-V',
  business_address  text NOT NULL DEFAULT '18 Lingkaran Meru Valley 2, Meru Valley Resort, 30020 Ipoh, Perak',
  business_email    text,
  business_phone    text,
  -- Invoice
  invoice_prefix        text NOT NULL DEFAULT '',                        -- e.g. 'BN-' → 'BN-2026-0001'
  invoice_year_reset    boolean NOT NULL DEFAULT true,                   -- reset counter each year
  invoice_next_seq      integer NOT NULL DEFAULT 1,
  invoice_current_year  integer NOT NULL DEFAULT extract(year from now())::int,
  -- Payment
  payment_qr_url        text,                                            -- DuitNow QR image
  payment_bank_name     text NOT NULL DEFAULT 'Maybank',
  payment_account_name  text NOT NULL DEFAULT 'Swim Revelation Trading',
  payment_account_no    text NOT NULL DEFAULT '558172685790',
  payment_instructions  text NOT NULL DEFAULT 'Scan the DuitNow QR or transfer to the Maybank account above. Include your order reference in the transfer note.',
  -- Meta
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT platform_settings_singleton CHECK (id = 1)
);

-- Seed the singleton row
INSERT INTO platform_settings (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;


-- ============================================================================
-- 3. audit_log — every sysadmin action gets a row
-- ============================================================================
CREATE TABLE IF NOT EXISTS audit_log (
  id              bigserial PRIMARY KEY,
  actor_id        uuid NOT NULL REFERENCES auth.users ON DELETE SET NULL,
  actor_email     text,
  action          text NOT NULL,
  target_user_id  uuid,
  target_email    text,
  details         jsonb,
  created_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS audit_log_actor_idx  ON audit_log(actor_id);
CREATE INDEX IF NOT EXISTS audit_log_target_idx ON audit_log(target_user_id);
CREATE INDEX IF NOT EXISTS audit_log_time_idx   ON audit_log(created_at DESC);


-- ============================================================================
-- 4. impersonation_sessions — holds original password hash while sysadmin
--    is impersonating a user. Restored when sysadmin stops.
-- ============================================================================
CREATE TABLE IF NOT EXISTS impersonation_sessions (
  id                     bigserial PRIMARY KEY,
  sysadmin_id            uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  target_user_id         uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  original_password_hash text NOT NULL,
  session_token          text NOT NULL,
  expires_at             timestamptz NOT NULL,
  restored_at            timestamptz,
  created_at             timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS impersonation_target_idx ON impersonation_sessions(target_user_id, restored_at);


-- ============================================================================
-- 5. RLS policies
-- ============================================================================
ALTER TABLE platform_settings      ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log              ENABLE ROW LEVEL SECURITY;
ALTER TABLE impersonation_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "platform_settings read"  ON platform_settings;
DROP POLICY IF EXISTS "platform_settings write" ON platform_settings;
CREATE POLICY "platform_settings read"  ON platform_settings FOR SELECT USING (true);
CREATE POLICY "platform_settings write" ON platform_settings FOR ALL   USING (is_sysadmin()) WITH CHECK (is_sysadmin());

DROP POLICY IF EXISTS "audit_log sysadmin" ON audit_log;
CREATE POLICY "audit_log sysadmin" ON audit_log FOR SELECT USING (is_sysadmin());

DROP POLICY IF EXISTS "impersonation_sessions sysadmin" ON impersonation_sessions;
CREATE POLICY "impersonation_sessions sysadmin" ON impersonation_sessions FOR SELECT USING (is_sysadmin());

GRANT SELECT             ON platform_settings      TO authenticated;
GRANT SELECT, UPDATE     ON platform_settings      TO authenticated;
GRANT SELECT             ON audit_log              TO authenticated;
GRANT SELECT             ON impersonation_sessions TO authenticated;


-- ============================================================================
-- 6. Helper: log_audit()
-- ============================================================================
CREATE OR REPLACE FUNCTION log_audit(
  p_action text,
  p_target_user_id uuid DEFAULT NULL,
  p_details jsonb DEFAULT NULL
) RETURNS void AS $$
DECLARE
  v_actor_email text;
  v_target_email text;
BEGIN
  SELECT email INTO v_actor_email  FROM auth.users WHERE id = auth.uid();
  IF p_target_user_id IS NOT NULL THEN
    SELECT email INTO v_target_email FROM auth.users WHERE id = p_target_user_id;
  END IF;
  INSERT INTO audit_log (actor_id, actor_email, action, target_user_id, target_email, details)
  VALUES (auth.uid(), v_actor_email, p_action, p_target_user_id, v_target_email, p_details);
END $$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================================
-- 7. sysadmin_list_users() — list all users with full info
-- ============================================================================
CREATE OR REPLACE FUNCTION sysadmin_list_users()
RETURNS TABLE (
  user_id                uuid,
  email                  text,
  role                   text,
  email_status           text,
  subscription_status    text,
  plan_type              text,
  subscription_start     timestamptz,
  subscription_end       timestamptz,
  original_signup_date   timestamptz,
  suspended_at           timestamptz,
  suspended_reason       text,
  created_at             timestamptz,
  last_sign_in_at        timestamptz
) AS $$
BEGIN
  IF NOT is_sysadmin() THEN
    RAISE EXCEPTION 'Only sysadmins can list users';
  END IF;

  RETURN QUERY
  SELECT
    u.id,
    u.email,
    p.role,
    p.email_status,
    p.subscription_status,
    p.plan_type,
    p.subscription_start,
    p.subscription_end,
    p.original_signup_date,
    p.suspended_at,
    p.suspended_reason,
    p.created_at,
    u.last_sign_in_at
  FROM auth.users u
  LEFT JOIN profiles p ON p.user_id = u.id
  ORDER BY p.created_at DESC NULLS LAST;
END $$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================================
-- 8. sysadmin_invite_user() — creates user, profile; returns credentials to relay
-- ============================================================================
CREATE OR REPLACE FUNCTION sysadmin_invite_user(
  p_email text,
  p_subscription_start timestamptz DEFAULT NULL,
  p_subscription_end   timestamptz DEFAULT NULL,
  p_plan_type          text        DEFAULT 'yearly'
)
RETURNS TABLE (user_id uuid, email text, temp_password text) AS $$
DECLARE
  v_user_id       uuid;
  v_temp_password text;
BEGIN
  IF NOT is_sysadmin() THEN RAISE EXCEPTION 'Only sysadmins can invite'; END IF;
  IF p_email IS NULL OR p_email = '' THEN RAISE EXCEPTION 'Email required'; END IF;

  -- Check email not taken
  IF EXISTS (SELECT 1 FROM auth.users WHERE lower(auth.users.email) = lower(p_email)) THEN
    RAISE EXCEPTION 'Email already in use';
  END IF;

  v_temp_password := encode(gen_random_bytes(9), 'base64');
  v_user_id       := gen_random_uuid();

  -- Create auth user (mirroring Delta 1 pattern for compatibility)
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data,
    confirmation_token, email_change, email_change_token_new, recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    v_user_id,
    'authenticated', 'authenticated',
    lower(p_email),
    crypt(v_temp_password, gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    '', '', '', ''
  );

  INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
  VALUES (
    gen_random_uuid(),
    v_user_id,
    jsonb_build_object('sub', v_user_id::text, 'email', lower(p_email), 'email_verified', true),
    'email',
    v_user_id::text,
    now(), now(), now()
  );

  -- The on_auth_user_created trigger creates a default profile.
  -- Update it with the sysadmin's specified dates.
  UPDATE profiles SET
    subscription_status = 'active',
    plan_type           = p_plan_type,
    subscription_start  = COALESCE(p_subscription_start, now()),
    subscription_end    = COALESCE(p_subscription_end,   now() + interval '1 year')
  WHERE user_id = v_user_id;

  PERFORM log_audit('invite_user', v_user_id, jsonb_build_object('plan', p_plan_type));

  RETURN QUERY SELECT v_user_id, lower(p_email), v_temp_password;
END $$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================================
-- 9. sysadmin_extend_subscription()
-- ============================================================================
CREATE OR REPLACE FUNCTION sysadmin_extend_subscription(
  p_target_user_id     uuid,
  p_subscription_start timestamptz,
  p_subscription_end   timestamptz,
  p_plan_type          text DEFAULT NULL
) RETURNS void AS $$
DECLARE
  v_old_start timestamptz;
  v_old_end   timestamptz;
BEGIN
  IF NOT is_sysadmin() THEN RAISE EXCEPTION 'Only sysadmins can extend subscriptions'; END IF;

  SELECT subscription_start, subscription_end INTO v_old_start, v_old_end
  FROM profiles WHERE user_id = p_target_user_id;

  UPDATE profiles SET
    subscription_start  = p_subscription_start,
    subscription_end    = p_subscription_end,
    plan_type           = COALESCE(p_plan_type, plan_type),
    subscription_status = CASE WHEN p_subscription_end > now() THEN 'active' ELSE 'expired' END,
    updated_at          = now()
  WHERE user_id = p_target_user_id;

  PERFORM log_audit('extend_subscription', p_target_user_id, jsonb_build_object(
    'old_start', v_old_start, 'old_end', v_old_end,
    'new_start', p_subscription_start, 'new_end', p_subscription_end
  ));
END $$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================================
-- 10. sysadmin_suspend_user() + sysadmin_unsuspend_user()
-- ============================================================================
CREATE OR REPLACE FUNCTION sysadmin_suspend_user(p_target_user_id uuid, p_reason text DEFAULT NULL)
RETURNS void AS $$
BEGIN
  IF NOT is_sysadmin() THEN RAISE EXCEPTION 'Only sysadmins can suspend'; END IF;

  UPDATE profiles SET
    email_status     = 'suspended',
    suspended_at     = now(),
    suspended_reason = p_reason,
    updated_at       = now()
  WHERE user_id = p_target_user_id;

  UPDATE auth.users SET banned_until = 'infinity' WHERE id = p_target_user_id;

  PERFORM log_audit('suspend', p_target_user_id, jsonb_build_object('reason', p_reason));
END $$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION sysadmin_unsuspend_user(p_target_user_id uuid)
RETURNS void AS $$
BEGIN
  IF NOT is_sysadmin() THEN RAISE EXCEPTION 'Only sysadmins can unsuspend'; END IF;

  UPDATE profiles SET
    email_status     = 'active',
    suspended_at     = NULL,
    suspended_reason = NULL,
    updated_at       = now()
  WHERE user_id = p_target_user_id;

  UPDATE auth.users SET banned_until = NULL WHERE id = p_target_user_id;

  PERFORM log_audit('unsuspend', p_target_user_id, NULL);
END $$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================================
-- 11. sysadmin_detach_email() + sysadmin_reattach_email()
-- ============================================================================
CREATE OR REPLACE FUNCTION sysadmin_detach_email(p_target_user_id uuid)
RETURNS void AS $$
DECLARE
  v_old_email text;
BEGIN
  IF NOT is_sysadmin() THEN RAISE EXCEPTION 'Only sysadmins can detach'; END IF;

  SELECT email INTO v_old_email FROM auth.users WHERE id = p_target_user_id;

  -- Replace with un-loginable placeholder + blank password + ban
  UPDATE auth.users SET
    email               = 'detached-' || p_target_user_id::text || '@bakernomics.invalid',
    encrypted_password  = NULL,
    banned_until        = 'infinity'
  WHERE id = p_target_user_id;

  UPDATE profiles SET
    email_status     = 'detached',
    email_changed_at = now(),
    updated_at       = now()
  WHERE user_id = p_target_user_id;

  PERFORM log_audit('detach_email', p_target_user_id, jsonb_build_object('old_email', v_old_email));
END $$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION sysadmin_reattach_email(p_target_user_id uuid, p_new_email text)
RETURNS void AS $$
BEGIN
  IF NOT is_sysadmin() THEN RAISE EXCEPTION 'Only sysadmins can reattach'; END IF;
  IF p_new_email IS NULL OR p_new_email = '' THEN RAISE EXCEPTION 'Email required'; END IF;

  IF EXISTS (SELECT 1 FROM auth.users WHERE lower(email) = lower(p_new_email) AND id != p_target_user_id) THEN
    RAISE EXCEPTION 'Email already in use by another account';
  END IF;

  UPDATE auth.users SET
    email        = lower(p_new_email),
    banned_until = NULL
  WHERE id = p_target_user_id;

  UPDATE profiles SET
    email_status     = 'active',
    email_changed_at = now(),
    updated_at       = now()
  WHERE user_id = p_target_user_id;

  PERFORM log_audit('reattach_email', p_target_user_id, jsonb_build_object('new_email', lower(p_new_email)));
END $$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================================
-- 12. sysadmin_generate_temp_password() — for password reset, no email needed
-- ============================================================================
CREATE OR REPLACE FUNCTION sysadmin_generate_temp_password(p_target_user_id uuid)
RETURNS TABLE (email text, temp_password text) AS $$
DECLARE
  v_temp text;
  v_email text;
BEGIN
  IF NOT is_sysadmin() THEN RAISE EXCEPTION 'Only sysadmins can generate temp passwords'; END IF;

  v_temp := encode(gen_random_bytes(9), 'base64');

  UPDATE auth.users SET encrypted_password = crypt(v_temp, gen_salt('bf'))
  WHERE id = p_target_user_id
  RETURNING auth.users.email INTO v_email;

  PERFORM log_audit('generate_temp_password', p_target_user_id, NULL);
  RETURN QUERY SELECT v_email, v_temp;
END $$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================================
-- 13. sysadmin_get_user_email() — used before triggering client-side reset
-- ============================================================================
CREATE OR REPLACE FUNCTION sysadmin_get_user_email(p_target_user_id uuid)
RETURNS text AS $$
DECLARE v_email text;
BEGIN
  IF NOT is_sysadmin() THEN RAISE EXCEPTION 'Only sysadmins'; END IF;
  SELECT email INTO v_email FROM auth.users WHERE id = p_target_user_id;
  PERFORM log_audit('trigger_password_reset', p_target_user_id, NULL);
  RETURN v_email;
END $$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================================
-- 14. sysadmin_delete_user() — HARD delete. Cascades everything.
-- ============================================================================
CREATE OR REPLACE FUNCTION sysadmin_delete_user(p_target_user_id uuid, p_confirm_email text)
RETURNS void AS $$
DECLARE v_actual_email text;
BEGIN
  IF NOT is_sysadmin() THEN RAISE EXCEPTION 'Only sysadmins can delete'; END IF;

  SELECT email INTO v_actual_email FROM auth.users WHERE id = p_target_user_id;
  IF v_actual_email IS NULL THEN RAISE EXCEPTION 'User not found'; END IF;
  IF lower(v_actual_email) != lower(p_confirm_email) THEN
    RAISE EXCEPTION 'Confirmation email does not match';
  END IF;

  -- Log FIRST because target user disappears after delete
  PERFORM log_audit('delete_user', p_target_user_id, jsonb_build_object('email', v_actual_email));

  DELETE FROM auth.users WHERE id = p_target_user_id;
END $$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================================
-- 15. Impersonation — start / stop
-- ============================================================================
CREATE OR REPLACE FUNCTION sysadmin_start_impersonation(p_target_user_id uuid)
RETURNS TABLE (email text, temp_password text, session_token text) AS $$
DECLARE
  v_original_hash text;
  v_target_email  text;
  v_temp          text;
  v_token         text;
BEGIN
  IF NOT is_sysadmin() THEN RAISE EXCEPTION 'Only sysadmins can impersonate'; END IF;

  SELECT auth.users.encrypted_password, auth.users.email
    INTO v_original_hash, v_target_email
  FROM auth.users WHERE id = p_target_user_id;

  IF v_target_email IS NULL OR v_original_hash IS NULL THEN
    RAISE EXCEPTION 'Cannot impersonate this user (detached or deleted)';
  END IF;

  IF EXISTS (
    SELECT 1 FROM impersonation_sessions
    WHERE target_user_id = p_target_user_id
      AND restored_at IS NULL
      AND expires_at > now()
  ) THEN
    RAISE EXCEPTION 'This user is already being impersonated. Wait for it to expire.';
  END IF;

  v_temp  := encode(gen_random_bytes(9), 'base64');
  v_token := encode(gen_random_bytes(24), 'base64');

  INSERT INTO impersonation_sessions (
    sysadmin_id, target_user_id, original_password_hash, session_token, expires_at
  ) VALUES (
    auth.uid(), p_target_user_id, v_original_hash, v_token, now() + interval '15 minutes'
  );

  UPDATE auth.users SET encrypted_password = crypt(v_temp, gen_salt('bf'))
  WHERE id = p_target_user_id;

  PERFORM log_audit('impersonate_start', p_target_user_id, NULL);
  RETURN QUERY SELECT v_target_email, v_temp, v_token;
END $$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION sysadmin_stop_impersonation(p_target_user_id uuid, p_session_token text)
RETURNS void AS $$
DECLARE v_session impersonation_sessions;
BEGIN
  SELECT * INTO v_session
  FROM impersonation_sessions
  WHERE target_user_id = p_target_user_id
    AND session_token  = p_session_token
    AND restored_at IS NULL
  ORDER BY created_at DESC LIMIT 1;

  IF v_session.id IS NULL THEN
    RAISE EXCEPTION 'No active impersonation session found';
  END IF;

  UPDATE auth.users SET encrypted_password = v_session.original_password_hash
  WHERE id = p_target_user_id;

  UPDATE impersonation_sessions SET restored_at = now() WHERE id = v_session.id;

  -- Actor here is the impersonated user (auth.uid()) — log with sysadmin_id from record
  INSERT INTO audit_log (actor_id, action, target_user_id, details)
  VALUES (v_session.sysadmin_id, 'impersonate_stop', p_target_user_id, NULL);
END $$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================================
-- 16. Grants for all sysadmin RPCs (authenticated users can call; each checks is_sysadmin internally)
-- ============================================================================
GRANT EXECUTE ON FUNCTION sysadmin_list_users()                       TO authenticated;
GRANT EXECUTE ON FUNCTION sysadmin_invite_user(text, timestamptz, timestamptz, text) TO authenticated;
GRANT EXECUTE ON FUNCTION sysadmin_extend_subscription(uuid, timestamptz, timestamptz, text) TO authenticated;
GRANT EXECUTE ON FUNCTION sysadmin_suspend_user(uuid, text)           TO authenticated;
GRANT EXECUTE ON FUNCTION sysadmin_unsuspend_user(uuid)               TO authenticated;
GRANT EXECUTE ON FUNCTION sysadmin_detach_email(uuid)                 TO authenticated;
GRANT EXECUTE ON FUNCTION sysadmin_reattach_email(uuid, text)         TO authenticated;
GRANT EXECUTE ON FUNCTION sysadmin_generate_temp_password(uuid)       TO authenticated;
GRANT EXECUTE ON FUNCTION sysadmin_get_user_email(uuid)               TO authenticated;
GRANT EXECUTE ON FUNCTION sysadmin_delete_user(uuid, text)            TO authenticated;
GRANT EXECUTE ON FUNCTION sysadmin_start_impersonation(uuid)          TO authenticated;
GRANT EXECUTE ON FUNCTION sysadmin_stop_impersonation(uuid, text)     TO authenticated;

COMMIT;

-- ============================================================================
-- Done.
-- ============================================================================
