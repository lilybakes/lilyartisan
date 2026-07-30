-- ============================================================================
-- DELTA — Personalization (hero image + avatar)
-- ============================================================================
-- Adds:
--   * profiles: hero_mode, hero_url, avatar_url
--   * hero_gallery table (system-provided images user can pick from)
--   * update_my_personalization() — secure user-facing update function
--
-- Safe to re-run.
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. Extend profiles with personalization columns
-- ============================================================================
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS hero_mode  text NOT NULL DEFAULT 'default'
    CHECK (hero_mode IN ('default', 'custom', 'gallery', 'none')),
  ADD COLUMN IF NOT EXISTS hero_url   text,
  ADD COLUMN IF NOT EXISTS avatar_url text;


-- ============================================================================
-- 2. hero_gallery — the system-provided image bank
-- ============================================================================
CREATE TABLE IF NOT EXISTS hero_gallery (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url   text NOT NULL,
  label       text,
  position    integer NOT NULL DEFAULT 0,
  active      boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_by  uuid REFERENCES auth.users ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS hero_gallery_position_idx ON hero_gallery(position);

ALTER TABLE hero_gallery ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "hero_gallery read"  ON hero_gallery;
DROP POLICY IF EXISTS "hero_gallery write" ON hero_gallery;

CREATE POLICY "hero_gallery read"  ON hero_gallery FOR SELECT USING (active = true OR is_sysadmin());
CREATE POLICY "hero_gallery write" ON hero_gallery FOR ALL   USING (is_sysadmin()) WITH CHECK (is_sysadmin());

GRANT SELECT                       ON hero_gallery TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE       ON hero_gallery TO authenticated;


-- ============================================================================
-- 3. Seed the 3 default gallery items pointing at static assets
--    (Static files ship in /public/gallery/ — served by Netlify)
-- ============================================================================
INSERT INTO hero_gallery (label, image_url, position)
SELECT * FROM (VALUES
  ('Chef in red apron with hat', '/gallery/chef-01.png',  1),
  ('Baker holding fresh bread',  '/gallery/baker-01.png', 2),
  ('Chef in red apron',          '/gallery/chef-02.png',  3)
) AS v(label, image_url, position)
WHERE NOT EXISTS (SELECT 1 FROM hero_gallery WHERE image_url = v.image_url);


-- ============================================================================
-- 4. Secure user-facing update function
--    Users can only update THEIR OWN personalization columns via this RPC.
--    This prevents any possibility of role escalation via direct UPDATE.
-- ============================================================================
CREATE OR REPLACE FUNCTION update_my_personalization(
  p_hero_mode  text,
  p_hero_url   text,
  p_avatar_url text
) RETURNS void AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  IF p_hero_mode NOT IN ('default', 'custom', 'gallery', 'none') THEN
    RAISE EXCEPTION 'Invalid hero_mode: %', p_hero_mode;
  END IF;

  UPDATE profiles SET
    hero_mode  = p_hero_mode,
    hero_url   = p_hero_url,
    avatar_url = p_avatar_url,
    updated_at = now()
  WHERE user_id = auth.uid();
END $$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION update_my_personalization(text, text, text) TO authenticated;

COMMIT;
