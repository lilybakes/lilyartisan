-- ============================================================================
-- Fix: "column reference 'user_id' is ambiguous" on Invite New User
-- ============================================================================
-- Two RPCs have RETURNS TABLE (user_id uuid, ...) as their output signature
-- AND then run UPDATE profiles ... WHERE user_id = v_user_id inside the body.
--
-- PostgreSQL resolves the unqualified `user_id` in WHERE to two candidates:
--   1. The OUTPUT column `user_id` declared in RETURNS TABLE
--   2. The `profiles.user_id` table column
-- It cannot pick, so it aborts with the ambiguity error.
--
-- Same class of bug as sysadmin_users_for_grant (email ambiguity). Fix: fully
-- qualify with a table alias (`p.user_id`) and add SET search_path.
--
-- The visible symptom was on sysadmin_invite_user; sysadmin_approve_order has
-- the identical shape and will fail the first time a checkout order is
-- approved. Fixing both here.
--
-- Safe to re-run.
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. sysadmin_invite_user  — aliased profiles → p
-- ============================================================================
DROP FUNCTION IF EXISTS sysadmin_invite_user(text, timestamptz, timestamptz, text);

CREATE FUNCTION sysadmin_invite_user(
  p_email text,
  p_subscription_start timestamptz DEFAULT NULL,
  p_subscription_end   timestamptz DEFAULT NULL,
  p_plan_type          text        DEFAULT 'yearly'
)
RETURNS TABLE (user_id uuid, email text, temp_password text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_user_id       uuid;
  v_temp_password text;
BEGIN
  IF NOT is_sysadmin() THEN RAISE EXCEPTION 'Only sysadmins can invite'; END IF;
  IF p_email IS NULL OR p_email = '' THEN RAISE EXCEPTION 'Email required'; END IF;

  IF EXISTS (SELECT 1 FROM auth.users u WHERE lower(u.email) = lower(p_email)) THEN
    RAISE EXCEPTION 'Email already in use';
  END IF;

  v_temp_password := encode(gen_random_bytes(9), 'base64');
  v_user_id       := gen_random_uuid();

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

  -- Aliased profiles → p so `p.user_id` cannot be confused with the OUTPUT
  -- column `user_id` declared in RETURNS TABLE.
  UPDATE profiles AS p SET
    subscription_status = 'active',
    plan_type           = p_plan_type,
    subscription_start  = COALESCE(p_subscription_start, now()),
    subscription_end    = COALESCE(p_subscription_end,   now() + interval '1 year')
  WHERE p.user_id = v_user_id;

  PERFORM log_audit('invite_user', v_user_id, jsonb_build_object('plan', p_plan_type));

  RETURN QUERY SELECT v_user_id, lower(p_email), v_temp_password;
END;
$$;

GRANT EXECUTE ON FUNCTION sysadmin_invite_user(text, timestamptz, timestamptz, text) TO authenticated;


-- ============================================================================
-- 2. sysadmin_approve_order  — same shape, same fix
-- ============================================================================
DROP FUNCTION IF EXISTS sysadmin_approve_order(uuid);

CREATE FUNCTION sysadmin_approve_order(p_order_id uuid)
RETURNS TABLE (user_id uuid, email text, temp_password text, invoice_number text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_order        orders;
  v_user_id      uuid;
  v_temp_pw      text;
  v_invoice      text;
  v_inv_seq      int;
  v_inv_year     int;
  v_inv_prefix   text;
  v_year_reset   boolean;
BEGIN
  IF NOT is_sysadmin() THEN RAISE EXCEPTION 'Only sysadmins can approve orders'; END IF;

  SELECT * INTO v_order FROM orders WHERE id = p_order_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Order not found'; END IF;
  IF v_order.status = 'approved' THEN RAISE EXCEPTION 'Order already approved'; END IF;
  IF v_order.status = 'rejected' THEN RAISE EXCEPTION 'Order was rejected'; END IF;

  IF EXISTS (SELECT 1 FROM auth.users u WHERE lower(u.email) = lower(v_order.customer_email)) THEN
    RAISE EXCEPTION 'A user with email % already exists. Cannot re-create.', v_order.customer_email;
  END IF;

  v_temp_pw := encode(gen_random_bytes(9), 'base64');
  v_user_id := gen_random_uuid();

  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data,
    confirmation_token, email_change, email_change_token_new, recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    v_user_id, 'authenticated', 'authenticated',
    lower(v_order.customer_email),
    crypt(v_temp_pw, gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}',
    '{}', '', '', '', ''
  );

  INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
  VALUES (
    gen_random_uuid(), v_user_id,
    jsonb_build_object('sub', v_user_id::text, 'email', lower(v_order.customer_email), 'email_verified', true),
    'email', v_user_id::text,
    now(), now(), now()
  );

  -- Aliased profiles → p so `p.user_id` cannot be confused with the OUTPUT
  -- column `user_id` declared in RETURNS TABLE.
  UPDATE profiles AS p SET
    subscription_status = 'active',
    plan_type           = 'yearly',
    subscription_start  = now(),
    subscription_end    = now() + interval '1 year'
  WHERE p.user_id = v_user_id;

  -- (settings.user_id was already qualified in the original — leaving as-is)
  UPDATE settings AS s SET
    owner_name    = v_order.customer_name,
    business_name = COALESCE(NULLIF(v_order.customer_business, ''), s.business_name)
  WHERE s.user_id = v_user_id;

  -- Invoice number generation
  SELECT invoice_next_seq, invoice_current_year, invoice_prefix, invoice_year_reset
    INTO v_inv_seq, v_inv_year, v_inv_prefix, v_year_reset
    FROM platform_settings WHERE id = 1;

  IF v_year_reset AND v_inv_year != extract(year from now())::int THEN
    v_inv_year := extract(year from now())::int;
    v_inv_seq  := 1;
  END IF;

  v_invoice := v_inv_prefix
             || (CASE WHEN v_year_reset THEN v_inv_year::text || '-' ELSE '' END)
             || lpad(v_inv_seq::text, 4, '0');

  UPDATE platform_settings SET
    invoice_next_seq     = v_inv_seq + 1,
    invoice_current_year = v_inv_year
  WHERE id = 1;

  UPDATE orders AS o SET
    status         = 'approved',
    approved_at    = now(),
    approved_by    = auth.uid(),
    user_id        = v_user_id,
    invoice_number = v_invoice,
    updated_at     = now()
  WHERE o.id = p_order_id;

  INSERT INTO audit_log (actor_id, actor_email, action, target_user_id, target_email, details)
  VALUES (
    auth.uid(),
    (SELECT u.email FROM auth.users u WHERE u.id = auth.uid()),
    'approve_order',
    v_user_id,
    v_order.customer_email,
    jsonb_build_object('order_id', p_order_id, 'reference', v_order.reference, 'invoice_number', v_invoice)
  );

  RETURN QUERY SELECT v_user_id, v_order.customer_email::text, v_temp_pw, v_invoice;
END;
$$;

GRANT EXECUTE ON FUNCTION sysadmin_approve_order(uuid) TO authenticated;

COMMIT;
