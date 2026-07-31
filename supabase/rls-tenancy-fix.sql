-- ============================================================================
-- Tenancy fix — remove the "sysadmin sees all" loophole on user data
-- ============================================================================
-- Delta 1 set the RLS policy on user data tables to:
--     USING (user_id = auth.uid() OR is_sysadmin())
--
-- Consequence: when Anthony (sysadmin) opens Recipe Master he sees EVERY
-- user's recipes mixed with his own, with no visual difference. If he "edits"
-- what he thought was his recipe, he's actually editing another user's row.
--
-- This migration switches all user data tables to strict per-user policies:
--     USING (user_id = auth.uid())
--
-- Sysadmin loses the ability to peek at other users' data through the normal
-- UI. To browse a specific user's data (support case, etc.) sysadmin uses the
-- existing impersonation flow (sysadmin_start_impersonation) on the Users
-- page — that swaps the session to be the target user.
--
-- Sysadmin management pages (/app/sysadmin/*) are UNAFFECTED — they use
-- SECURITY DEFINER RPCs (sysadmin_list_users, sysadmin_list_orders, etc.)
-- which bypass row-level policies by design.
--
-- Existing data is unchanged. Any rows sysadmin edited while under the old
-- policy remain with the owner they were originally created under.
--
-- Safe to re-run.
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. Drop the old "own or sysadmin" policies
-- ============================================================================
DROP POLICY IF EXISTS "own or sysadmin" ON ingredients;
DROP POLICY IF EXISTS "own or sysadmin" ON recipes;
DROP POLICY IF EXISTS "own or sysadmin" ON bom_lines;
DROP POLICY IF EXISTS "own or sysadmin" ON inventory;
DROP POLICY IF EXISTS "own or sysadmin" ON header_links;
DROP POLICY IF EXISTS "own or sysadmin" ON settings;

-- Older drafts that may still be around
DROP POLICY IF EXISTS "own only"        ON ingredients;
DROP POLICY IF EXISTS "own only"        ON recipes;
DROP POLICY IF EXISTS "own only"        ON bom_lines;
DROP POLICY IF EXISTS "own only"        ON inventory;
DROP POLICY IF EXISTS "own only"        ON header_links;
DROP POLICY IF EXISTS "own only"        ON settings;


-- ============================================================================
-- 2. Recreate as strict per-user
-- ============================================================================
CREATE POLICY "own only" ON ingredients   FOR ALL
  USING     (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "own only" ON recipes       FOR ALL
  USING     (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "own only" ON bom_lines     FOR ALL
  USING     (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "own only" ON inventory     FOR ALL
  USING     (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "own only" ON header_links  FOR ALL
  USING     (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "own only" ON settings      FOR ALL
  USING     (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());


-- ============================================================================
-- 3. Verify tenancy tightening on a per-table basis
-- ============================================================================
DO $$
DECLARE
  v_leaks integer := 0;
  v_table text;
BEGIN
  FOR v_table IN
    SELECT unnest(ARRAY['ingredients','recipes','bom_lines','inventory','header_links','settings'])
  LOOP
    EXECUTE format(
      'SELECT count(*) FROM pg_policies WHERE tablename = %L AND qual LIKE %L',
      v_table, '%is_sysadmin%'
    ) INTO v_leaks;
    IF v_leaks > 0 THEN
      RAISE EXCEPTION 'Table % still has a policy referencing is_sysadmin() — expected zero after this migration.', v_table;
    END IF;
  END LOOP;
  RAISE NOTICE 'All user-data tables are now strict per-user. Sysadmin no longer sees other users'' data through normal queries.';
END $$;


-- ============================================================================
-- 4. Optional: seed starter recipes for the sysadmin
-- ============================================================================
-- Since Anthony has been operating on Lily's data (through the old loophole),
-- his own account currently has zero recipes/ingredients of its own.
-- Run the starter seed so he has his own playground.
-- Idempotent — no-op if he already has recipes.
DO $$
DECLARE
  v_admin_id uuid;
BEGIN
  SELECT id INTO v_admin_id FROM auth.users WHERE email = 'anthony2211@gmail.com';
  IF v_admin_id IS NOT NULL THEN
    -- Only if the seed function exists (from the starter-recipes delta)
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'seed_starter_recipes') THEN
      PERFORM seed_starter_recipes(v_admin_id);
      RAISE NOTICE 'Seeded starter recipes for anthony2211@gmail.com (skipped if he already had any)';
    END IF;
  END IF;
END $$;


COMMIT;

-- ============================================================================
-- Quick sanity checks you can run after
-- ============================================================================
--   SELECT tablename, policyname, cmd, qual
--     FROM pg_policies
--     WHERE tablename IN ('ingredients','recipes','bom_lines','inventory','header_links','settings')
--     ORDER BY tablename, policyname;
--
-- Every row should show qual = (user_id = auth.uid())
-- with no `OR is_sysadmin()` anywhere.
-- ============================================================================
