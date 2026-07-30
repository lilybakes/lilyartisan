-- ============================================================================
-- DELTA 4 — Public Checkout + Payment Verification Queue
-- ============================================================================
-- Public flow:
--   1. Anon calls create_order() → gets an order id + reference
--   2. Customer pays externally (DuitNow / bank transfer)
--   3. Anon calls set_order_proof() with a Supabase Storage URL
--   4. Sysadmin reviews via /app/sysadmin/orders
--   5. Sysadmin approves → auth user created, subscription set, invoice numbered
--
-- Safe to re-run.
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. orders table
-- ============================================================================
CREATE TABLE IF NOT EXISTS orders (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference         text NOT NULL UNIQUE,
  customer_name     text NOT NULL,
  customer_email    text NOT NULL,
  customer_business text,
  customer_address  text,
  amount            numeric(10,2) NOT NULL,
  currency          text NOT NULL DEFAULT 'RM',
  status            text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'proof_uploaded', 'approved', 'rejected', 'cancelled')),
  proof_url         text,
  proof_uploaded_at timestamptz,
  approved_at       timestamptz,
  approved_by       uuid REFERENCES auth.users ON DELETE SET NULL,
  rejected_at       timestamptz,
  rejected_by       uuid REFERENCES auth.users ON DELETE SET NULL,
  rejected_reason   text,
  user_id           uuid REFERENCES auth.users ON DELETE SET NULL,
  invoice_number    text,
  notes             text,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS orders_status_idx     ON orders(status);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS orders_email_idx      ON orders(customer_email);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "orders sysadmin" ON orders;
CREATE POLICY "orders sysadmin" ON orders FOR ALL
  USING (is_sysadmin())
  WITH CHECK (is_sysadmin());

GRANT SELECT, INSERT, UPDATE, DELETE ON orders TO authenticated;
-- anon has NO direct table access; all writes go through SECURITY DEFINER RPCs


-- ============================================================================
-- 2. Extend platform_settings with order numbering
-- ============================================================================
ALTER TABLE platform_settings
  ADD COLUMN IF NOT EXISTS order_next_seq  integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS order_year      integer NOT NULL DEFAULT extract(year from now())::int,
  ADD COLUMN IF NOT EXISTS order_prefix    text    NOT NULL DEFAULT 'ORD-',
  ADD COLUMN IF NOT EXISTS annual_price    numeric(10,2) NOT NULL DEFAULT 149.00;


-- ============================================================================
-- 3. Public RPC: create_order()
-- ============================================================================
CREATE OR REPLACE FUNCTION create_order(
  p_name     text,
  p_email    text,
  p_business text DEFAULT NULL,
  p_address  text DEFAULT NULL
) RETURNS TABLE (order_id uuid, reference text) AS $$
DECLARE
  v_ref    text;
  v_seq    int;
  v_year   int;
  v_stored_year int;
  v_prefix text;
  v_amount numeric(10,2);
  v_id     uuid;
BEGIN
  -- Basic validation
  IF p_name  IS NULL OR trim(p_name)  = '' THEN RAISE EXCEPTION 'Name is required'; END IF;
  IF p_email IS NULL OR trim(p_email) = '' THEN RAISE EXCEPTION 'Email is required'; END IF;
  IF position('@' in p_email) = 0          THEN RAISE EXCEPTION 'Email is not valid'; END IF;

  -- Reject if this email already has an active user
  IF EXISTS (
    SELECT 1 FROM auth.users u
    LEFT JOIN profiles p ON p.user_id = u.id
    WHERE lower(u.email) = lower(trim(p_email))
      AND (p.subscription_end IS NULL OR p.subscription_end > now())
      AND (p.email_status IS NULL OR p.email_status != 'detached')
  ) THEN
    RAISE EXCEPTION 'An active account with this email already exists. Please sign in instead.';
  END IF;

  -- Read counters + reset if new year
  SELECT order_next_seq, order_year, order_prefix, annual_price
    INTO v_seq, v_stored_year, v_prefix, v_amount
    FROM platform_settings WHERE id = 1;

  v_year := extract(year from now())::int;
  IF v_year != v_stored_year THEN
    v_seq := 1;
  END IF;

  v_ref := v_prefix || v_year || '-' || lpad(v_seq::text, 4, '0');

  UPDATE platform_settings SET
    order_next_seq = v_seq + 1,
    order_year     = v_year
  WHERE id = 1;

  INSERT INTO orders (reference, customer_name, customer_email, customer_business, customer_address, amount)
  VALUES (v_ref, trim(p_name), lower(trim(p_email)), trim(p_business), trim(p_address), v_amount)
  RETURNING id INTO v_id;

  RETURN QUERY SELECT v_id, v_ref;
END $$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION create_order(text, text, text, text) TO anon, authenticated;


-- ============================================================================
-- 4. Public RPC: get_order_public() — customer viewing their own order
-- ============================================================================
CREATE OR REPLACE FUNCTION get_order_public(p_order_id uuid)
RETURNS TABLE (
  id                uuid,
  reference         text,
  customer_name     text,
  customer_email    text,
  customer_business text,
  amount            numeric,
  currency          text,
  status            text,
  proof_url         text,
  proof_uploaded_at timestamptz,
  created_at        timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    o.id,
    o.reference::text,
    o.customer_name::text,
    o.customer_email::text,
    o.customer_business::text,
    o.amount,
    o.currency::text,
    o.status::text,
    o.proof_url::text,
    o.proof_uploaded_at,
    o.created_at
  FROM orders o
  WHERE o.id = p_order_id;
END $$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION get_order_public(uuid) TO anon, authenticated;


-- ============================================================================
-- 5. Public RPC: set_order_proof() — customer uploads proof
-- ============================================================================
CREATE OR REPLACE FUNCTION set_order_proof(p_order_id uuid, p_proof_url text)
RETURNS void AS $$
DECLARE
  v_current_status text;
BEGIN
  IF p_proof_url IS NULL OR trim(p_proof_url) = '' THEN
    RAISE EXCEPTION 'Proof URL required';
  END IF;

  SELECT status INTO v_current_status FROM orders WHERE id = p_order_id;
  IF v_current_status IS NULL THEN
    RAISE EXCEPTION 'Order not found';
  END IF;
  IF v_current_status IN ('approved', 'rejected', 'cancelled') THEN
    RAISE EXCEPTION 'This order is no longer awaiting payment';
  END IF;

  UPDATE orders SET
    proof_url         = p_proof_url,
    proof_uploaded_at = now(),
    status            = 'proof_uploaded',
    updated_at        = now()
  WHERE id = p_order_id;
END $$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION set_order_proof(uuid, text) TO anon, authenticated;


-- ============================================================================
-- 6. Sysadmin RPC: list_orders() — with optional status filter + counts
-- ============================================================================
CREATE OR REPLACE FUNCTION sysadmin_list_orders(p_status text DEFAULT NULL)
RETURNS TABLE (
  id                uuid,
  reference         text,
  customer_name     text,
  customer_email    text,
  customer_business text,
  customer_address  text,
  amount            numeric,
  currency          text,
  status            text,
  proof_url         text,
  proof_uploaded_at timestamptz,
  approved_at       timestamptz,
  rejected_at       timestamptz,
  rejected_reason   text,
  user_id           uuid,
  invoice_number    text,
  created_at        timestamptz
) AS $$
BEGIN
  IF NOT is_sysadmin() THEN RAISE EXCEPTION 'Only sysadmins'; END IF;

  RETURN QUERY
  SELECT
    o.id, o.reference::text, o.customer_name::text, o.customer_email::text,
    o.customer_business::text, o.customer_address::text,
    o.amount, o.currency::text, o.status::text,
    o.proof_url::text, o.proof_uploaded_at,
    o.approved_at, o.rejected_at, o.rejected_reason::text,
    o.user_id, o.invoice_number::text, o.created_at
  FROM orders o
  WHERE (p_status IS NULL OR o.status = p_status)
  ORDER BY o.created_at DESC;
END $$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION sysadmin_list_orders(text) TO authenticated;


CREATE OR REPLACE FUNCTION sysadmin_order_counts()
RETURNS TABLE (status text, count bigint) AS $$
BEGIN
  IF NOT is_sysadmin() THEN RAISE EXCEPTION 'Only sysadmins'; END IF;
  RETURN QUERY
  SELECT o.status::text, COUNT(*)::bigint
  FROM orders o
  GROUP BY o.status;
END $$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION sysadmin_order_counts() TO authenticated;


-- ============================================================================
-- 7. Sysadmin RPC: approve_order() — creates user + subscription + invoice#
-- ============================================================================
CREATE OR REPLACE FUNCTION sysadmin_approve_order(p_order_id uuid)
RETURNS TABLE (user_id uuid, email text, temp_password text, invoice_number text) AS $$
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

  IF EXISTS (SELECT 1 FROM auth.users WHERE lower(email) = lower(v_order.customer_email)) THEN
    RAISE EXCEPTION 'A user with email % already exists. Cannot re-create.', v_order.customer_email;
  END IF;

  -- Create auth user (mirrors sysadmin_invite_user pattern)
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

  -- Profile is created by the on_auth_user_created trigger — update with paid subscription
  UPDATE profiles SET
    subscription_status = 'active',
    plan_type           = 'yearly',
    subscription_start  = now(),
    subscription_end    = now() + interval '1 year'
  WHERE user_id = v_user_id;

  -- Populate settings (owner name, business name) from order data
  UPDATE settings SET
    owner_name    = v_order.customer_name,
    business_name = COALESCE(NULLIF(v_order.customer_business, ''), settings.business_name)
  WHERE settings.user_id = v_user_id;

  -- Invoice number
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

  -- Update order to approved
  UPDATE orders SET
    status         = 'approved',
    approved_at    = now(),
    approved_by    = auth.uid(),
    user_id        = v_user_id,
    invoice_number = v_invoice,
    updated_at     = now()
  WHERE id = p_order_id;

  -- Audit
  INSERT INTO audit_log (actor_id, actor_email, action, target_user_id, target_email, details)
  VALUES (
    auth.uid(),
    (SELECT auth.users.email FROM auth.users WHERE id = auth.uid()),
    'approve_order',
    v_user_id,
    v_order.customer_email,
    jsonb_build_object('order_id', p_order_id, 'reference', v_order.reference, 'invoice_number', v_invoice)
  );

  RETURN QUERY SELECT v_user_id, v_order.customer_email::text, v_temp_pw, v_invoice;
END $$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION sysadmin_approve_order(uuid) TO authenticated;


-- ============================================================================
-- 8. Sysadmin RPC: reject_order()
-- ============================================================================
CREATE OR REPLACE FUNCTION sysadmin_reject_order(p_order_id uuid, p_reason text DEFAULT NULL)
RETURNS void AS $$
DECLARE
  v_order orders;
BEGIN
  IF NOT is_sysadmin() THEN RAISE EXCEPTION 'Only sysadmins'; END IF;

  SELECT * INTO v_order FROM orders WHERE id = p_order_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Order not found'; END IF;
  IF v_order.status IN ('approved', 'rejected') THEN
    RAISE EXCEPTION 'Order is already %.', v_order.status;
  END IF;

  UPDATE orders SET
    status          = 'rejected',
    rejected_at     = now(),
    rejected_by     = auth.uid(),
    rejected_reason = p_reason,
    updated_at      = now()
  WHERE id = p_order_id;

  INSERT INTO audit_log (actor_id, actor_email, action, target_email, details)
  VALUES (
    auth.uid(),
    (SELECT auth.users.email FROM auth.users WHERE id = auth.uid()),
    'reject_order',
    v_order.customer_email,
    jsonb_build_object('order_id', p_order_id, 'reference', v_order.reference, 'reason', p_reason)
  );
END $$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION sysadmin_reject_order(uuid, text) TO authenticated;

COMMIT;
