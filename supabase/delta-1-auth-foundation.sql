-- ============================================================================
-- DELTA 1 — Auth Foundation
-- ============================================================================
-- Prerequisites: Create these two users in Supabase Dashboard first
--   (Authentication > Users > "Add user"):
--     1. lily2211@gmail.com    (password: 2211Qwer!)
--     2. anthony2211@gmail.com (password: 2211Qwer!)
--
-- This script is transactional and idempotent. Safe to re-run.
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. Verify prerequisite users exist
-- ============================================================================
DO $$
DECLARE
  lily_id  uuid;
  admin_id uuid;
BEGIN
  SELECT id INTO lily_id  FROM auth.users WHERE email = 'lily2211@gmail.com';
  SELECT id INTO admin_id FROM auth.users WHERE email = 'anthony2211@gmail.com';

  IF lily_id IS NULL THEN
    RAISE EXCEPTION 'User lily2211@gmail.com not found. Create in Supabase Dashboard first: Authentication > Users > Add user.';
  END IF;
  IF admin_id IS NULL THEN
    RAISE EXCEPTION 'User anthony2211@gmail.com not found. Create in Supabase Dashboard first: Authentication > Users > Add user.';
  END IF;

  RAISE NOTICE 'Found Lily:  %', lily_id;
  RAISE NOTICE 'Found Admin: %', admin_id;
END $$;


-- ============================================================================
-- 2. Add user_id columns to all existing tables (nullable for now)
-- ============================================================================
ALTER TABLE ingredients   ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE recipes       ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE bom_lines     ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE inventory     ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE header_links  ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE settings      ADD COLUMN IF NOT EXISTS user_id uuid;


-- ============================================================================
-- 3. Create profiles table
-- ============================================================================
CREATE TABLE IF NOT EXISTS profiles (
  user_id              uuid primary key references auth.users on delete cascade,
  role                 text not null default 'user' check (role in ('user', 'sysadmin')),
  subscription_status  text not null default 'trial' check (subscription_status in ('trial', 'active', 'expired', 'suspended')),
  plan_type            text not null default 'trial' check (plan_type in ('trial', 'yearly', 'admin')),
  subscription_start   timestamptz,
  subscription_end     timestamptz,
  original_signup_date timestamptz not null default now(),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);


-- ============================================================================
-- 4. Helper: is_sysadmin() — used in RLS policies without recursion
-- ============================================================================
CREATE OR REPLACE FUNCTION is_sysadmin() RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'sysadmin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;


-- ============================================================================
-- 5. Stamp existing data with Lily's user_id + create profiles
-- ============================================================================
DO $$
DECLARE
  lily_id  uuid;
  admin_id uuid;
BEGIN
  SELECT id INTO lily_id  FROM auth.users WHERE email = 'lily2211@gmail.com';
  SELECT id INTO admin_id FROM auth.users WHERE email = 'anthony2211@gmail.com';

  -- Stamp all Lily's existing data
  UPDATE ingredients   SET user_id = lily_id WHERE user_id IS NULL;
  UPDATE recipes       SET user_id = lily_id WHERE user_id IS NULL;
  UPDATE bom_lines     SET user_id = lily_id WHERE user_id IS NULL;
  UPDATE inventory     SET user_id = lily_id WHERE user_id IS NULL;
  UPDATE header_links  SET user_id = lily_id WHERE user_id IS NULL;
  UPDATE settings      SET user_id = lily_id WHERE user_id IS NULL;

  -- Create profiles for both users
  --   Lily: active yearly subscription, generous 10-year runway
  --   Admin: sysadmin role
  INSERT INTO profiles (user_id, role, subscription_status, plan_type, subscription_start, subscription_end)
  VALUES (
    lily_id, 'user', 'active', 'yearly',
    now(), now() + INTERVAL '10 years'
  )
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO profiles (user_id, role, subscription_status, plan_type)
  VALUES (admin_id, 'sysadmin', 'active', 'admin')
  ON CONFLICT (user_id) DO NOTHING;
END $$;


-- ============================================================================
-- 6. Restructure settings from singleton (id=1) to per-user (user_id as PK)
-- ============================================================================
ALTER TABLE settings DROP CONSTRAINT IF EXISTS singleton;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'settings' AND constraint_name = 'settings_pkey'
  ) THEN
    ALTER TABLE settings DROP CONSTRAINT settings_pkey;
  END IF;
END $$;

ALTER TABLE settings DROP COLUMN IF EXISTS id;

-- user_id must be non-null and unique to become the PK
ALTER TABLE settings ALTER COLUMN user_id SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'settings' AND constraint_name = 'settings_pkey'
  ) THEN
    ALTER TABLE settings ADD PRIMARY KEY (user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'settings' AND constraint_name = 'settings_user_id_fkey'
  ) THEN
    ALTER TABLE settings ADD CONSTRAINT settings_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES auth.users ON DELETE CASCADE;
  END IF;
END $$;


-- ============================================================================
-- 7. Seed default settings + header_links for the sysadmin
--    (Lily already has these from her existing data)
-- ============================================================================
DO $$
DECLARE
  admin_id uuid;
BEGIN
  SELECT id INTO admin_id FROM auth.users WHERE email = 'anthony2211@gmail.com';

  INSERT INTO settings (user_id, owner_name, business_name, currency, default_target_food_cost_pct, app_name)
  VALUES (admin_id, 'Anthony', 'Sysadmin', 'RM', 28, 'Baker|Nomics')
  ON CONFLICT (user_id) DO NOTHING;

  IF NOT EXISTS (SELECT 1 FROM header_links WHERE user_id = admin_id) THEN
    INSERT INTO header_links (user_id, position, label, url, icon_name) VALUES
      (admin_id, 1, 'Language', '', 'globe'),
      (admin_id, 2, 'Apps', '', 'grid');
  END IF;
END $$;


-- ============================================================================
-- 8. Enforce NOT NULL + FKs on user_id across all tables
-- ============================================================================
ALTER TABLE ingredients   ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE recipes       ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE bom_lines     ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE inventory     ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE header_links  ALTER COLUMN user_id SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'ingredients_user_id_fkey') THEN
    ALTER TABLE ingredients ADD CONSTRAINT ingredients_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'recipes_user_id_fkey') THEN
    ALTER TABLE recipes ADD CONSTRAINT recipes_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'bom_lines_user_id_fkey') THEN
    ALTER TABLE bom_lines ADD CONSTRAINT bom_lines_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'inventory_user_id_fkey') THEN
    ALTER TABLE inventory ADD CONSTRAINT inventory_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'header_links_user_id_fkey') THEN
    ALTER TABLE header_links ADD CONSTRAINT header_links_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users ON DELETE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS ingredients_user_id_idx   ON ingredients(user_id);
CREATE INDEX IF NOT EXISTS recipes_user_id_idx       ON recipes(user_id);
CREATE INDEX IF NOT EXISTS bom_lines_user_id_idx     ON bom_lines(user_id);
CREATE INDEX IF NOT EXISTS inventory_user_id_idx     ON inventory(user_id);
CREATE INDEX IF NOT EXISTS header_links_user_id_idx  ON header_links(user_id);


-- ============================================================================
-- 9. Set-user-id trigger — auto-populate user_id on INSERT if not provided
-- ============================================================================
CREATE OR REPLACE FUNCTION set_user_id_on_insert() RETURNS trigger AS $$
BEGIN
  IF NEW.user_id IS NULL AND auth.uid() IS NOT NULL THEN
    NEW.user_id := auth.uid();
  END IF;
  RETURN NEW;
END $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_user_id_ingredients  ON ingredients;
DROP TRIGGER IF EXISTS trg_set_user_id_recipes      ON recipes;
DROP TRIGGER IF EXISTS trg_set_user_id_bom_lines    ON bom_lines;
DROP TRIGGER IF EXISTS trg_set_user_id_inventory    ON inventory;
DROP TRIGGER IF EXISTS trg_set_user_id_header_links ON header_links;

CREATE TRIGGER trg_set_user_id_ingredients  BEFORE INSERT ON ingredients  FOR EACH ROW EXECUTE FUNCTION set_user_id_on_insert();
CREATE TRIGGER trg_set_user_id_recipes      BEFORE INSERT ON recipes      FOR EACH ROW EXECUTE FUNCTION set_user_id_on_insert();
CREATE TRIGGER trg_set_user_id_bom_lines    BEFORE INSERT ON bom_lines    FOR EACH ROW EXECUTE FUNCTION set_user_id_on_insert();
CREATE TRIGGER trg_set_user_id_inventory    BEFORE INSERT ON inventory    FOR EACH ROW EXECUTE FUNCTION set_user_id_on_insert();
CREATE TRIGGER trg_set_user_id_header_links BEFORE INSERT ON header_links FOR EACH ROW EXECUTE FUNCTION set_user_id_on_insert();


-- ============================================================================
-- 10. New-user trigger — for FUTURE signups (Delta 3+)
--     Creates profile + default settings + default header_links
--     Auto-promotes anthony2211@gmail.com to sysadmin
-- ============================================================================
CREATE OR REPLACE FUNCTION handle_new_user() RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (user_id, role, subscription_status, plan_type, subscription_start, subscription_end)
  VALUES (
    NEW.id,
    CASE WHEN NEW.email = 'anthony2211@gmail.com' THEN 'sysadmin' ELSE 'user' END,
    CASE WHEN NEW.email = 'anthony2211@gmail.com' THEN 'active'   ELSE 'trial' END,
    CASE WHEN NEW.email = 'anthony2211@gmail.com' THEN 'admin'    ELSE 'trial' END,
    CASE WHEN NEW.email = 'anthony2211@gmail.com' THEN NULL       ELSE now() END,
    CASE WHEN NEW.email = 'anthony2211@gmail.com' THEN NULL       ELSE now() + INTERVAL '14 days' END
  )
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO settings (user_id, owner_name, business_name, currency, default_target_food_cost_pct, app_name)
  VALUES (NEW.id, coalesce(split_part(NEW.email, '@', 1), 'User'), 'My Bakery', 'RM', 28, 'Baker|Nomics')
  ON CONFLICT (user_id) DO NOTHING;

  IF NOT EXISTS (SELECT 1 FROM header_links WHERE user_id = NEW.id) THEN
    INSERT INTO header_links (user_id, position, label, url, icon_name) VALUES
      (NEW.id, 1, 'Language', '', 'globe'),
      (NEW.id, 2, 'Apps', '', 'grid');
  END IF;

  RETURN NEW;
END $$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- ============================================================================
-- 11. Switch RLS: drop anon-full-access, add per-user policies
-- ============================================================================
-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop old anon policies (safe if not exist)
DROP POLICY IF EXISTS "anon full access ingredients"  ON ingredients;
DROP POLICY IF EXISTS "anon full access recipes"      ON recipes;
DROP POLICY IF EXISTS "anon full access bom_lines"    ON bom_lines;
DROP POLICY IF EXISTS "anon full access inventory"    ON inventory;
DROP POLICY IF EXISTS "anon full access header_links" ON header_links;
DROP POLICY IF EXISTS "anon full access settings"     ON settings;

-- Also drop any policies from previous drafts of this migration
DROP POLICY IF EXISTS "own ingredients"   ON ingredients;
DROP POLICY IF EXISTS "own recipes"       ON recipes;
DROP POLICY IF EXISTS "own bom_lines"     ON bom_lines;
DROP POLICY IF EXISTS "own inventory"     ON inventory;
DROP POLICY IF EXISTS "own header_links"  ON header_links;
DROP POLICY IF EXISTS "own settings"      ON settings;
DROP POLICY IF EXISTS "own or sysadmin"   ON profiles;

-- Profiles: user sees own; sysadmin sees all
CREATE POLICY "profiles select"  ON profiles FOR SELECT USING (user_id = auth.uid() OR is_sysadmin());
CREATE POLICY "profiles update"  ON profiles FOR UPDATE USING (user_id = auth.uid() OR is_sysadmin())
                                             WITH CHECK (user_id = auth.uid() OR is_sysadmin());
CREATE POLICY "profiles insert"  ON profiles FOR INSERT WITH CHECK (user_id = auth.uid() OR is_sysadmin());
CREATE POLICY "profiles delete"  ON profiles FOR DELETE USING (is_sysadmin());

-- Data tables: user owns their rows; sysadmin sees/edits all
CREATE POLICY "own or sysadmin" ON ingredients   FOR ALL USING (user_id = auth.uid() OR is_sysadmin()) WITH CHECK (user_id = auth.uid() OR is_sysadmin());
CREATE POLICY "own or sysadmin" ON recipes       FOR ALL USING (user_id = auth.uid() OR is_sysadmin()) WITH CHECK (user_id = auth.uid() OR is_sysadmin());
CREATE POLICY "own or sysadmin" ON bom_lines     FOR ALL USING (user_id = auth.uid() OR is_sysadmin()) WITH CHECK (user_id = auth.uid() OR is_sysadmin());
CREATE POLICY "own or sysadmin" ON inventory     FOR ALL USING (user_id = auth.uid() OR is_sysadmin()) WITH CHECK (user_id = auth.uid() OR is_sysadmin());
CREATE POLICY "own or sysadmin" ON header_links  FOR ALL USING (user_id = auth.uid() OR is_sysadmin()) WITH CHECK (user_id = auth.uid() OR is_sysadmin());
CREATE POLICY "own or sysadmin" ON settings      FOR ALL USING (user_id = auth.uid() OR is_sysadmin()) WITH CHECK (user_id = auth.uid() OR is_sysadmin());


-- ============================================================================
-- 12. Grants — ensure authenticated users can access these tables via API
-- ============================================================================
GRANT SELECT, INSERT, UPDATE, DELETE ON profiles      TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ingredients   TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON recipes       TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON bom_lines     TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON inventory     TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON header_links  TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON settings      TO authenticated;

-- Revoke anon access from data tables (bucket stays public for image URLs)
REVOKE ALL ON profiles     FROM anon;
REVOKE ALL ON ingredients  FROM anon;
REVOKE ALL ON recipes      FROM anon;
REVOKE ALL ON bom_lines    FROM anon;
REVOKE ALL ON inventory    FROM anon;
REVOKE ALL ON header_links FROM anon;
REVOKE ALL ON settings     FROM anon;

COMMIT;

-- ============================================================================
-- Done. Verify with:
--   SELECT email, id FROM auth.users;
--   SELECT * FROM profiles;
--   SELECT count(*), user_id FROM ingredients GROUP BY user_id;
-- ============================================================================
