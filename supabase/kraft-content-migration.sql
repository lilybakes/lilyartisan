-- ============================================================================
-- Kraft Content Migration
-- ============================================================================
-- Adds every data field the Kraft templates need to consume real content
-- instead of the hardcoded strings they've been rendering.
--
-- Recipes get: method (structured), description (marketing), storage/care/
-- allergens/label overrides, show_in_menu.
--
-- Settings get: default care text, head-baker name + signature URL,
-- wholesale defaults (discount, MOQ, terms).
--
-- Adds a per-user template_customization table for the hardcoded snippets
-- on Delivery Tag, Social Card, Certificate, and Menu Insert.
--
-- Safe to re-run.
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. Recipes — per-recipe content
-- ============================================================================
ALTER TABLE recipes
  ADD COLUMN IF NOT EXISTS method                  jsonb   NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS description             text,           -- short marketing tagline, used on Social Card
  ADD COLUMN IF NOT EXISTS storage_text            text,           -- override for brand default_storage_notes
  ADD COLUMN IF NOT EXISTS care_text               text,           -- override — Care Card "How to keep it"
  ADD COLUMN IF NOT EXISTS allergens_text          text,           -- override — used on Care Card
  ADD COLUMN IF NOT EXISTS label_ingredients_text  text,           -- override — Product Label ingredients paragraph
  ADD COLUMN IF NOT EXISTS label_allergens_text    text,           -- override — Product Label allergen box
  ADD COLUMN IF NOT EXISTS show_in_menu            boolean NOT NULL DEFAULT true;

COMMENT ON COLUMN recipes.method IS
  'Ordered list of steps. Either strings, or {step: string, group: string} for sub-groups (e.g. "CUPCAKES" / "BUTTERCREAM"). Example: [{"step":"Cream the butter..."}, {"step":"Add eggs...","group":"CUPCAKES"}]';


-- ============================================================================
-- 2. Settings — brand-level template defaults
-- ============================================================================
ALTER TABLE settings
  ADD COLUMN IF NOT EXISTS default_care_text          text,
  ADD COLUMN IF NOT EXISTS head_baker_name            text,
  ADD COLUMN IF NOT EXISTS head_baker_signature_url   text,
  ADD COLUMN IF NOT EXISTS wholesale_discount_pct     integer NOT NULL DEFAULT 30,
  ADD COLUMN IF NOT EXISTS wholesale_moq              integer NOT NULL DEFAULT 10,
  ADD COLUMN IF NOT EXISTS wholesale_terms_text       text
    DEFAULT 'Prices valid 30 days from the effective date · Minimum order 10 units per SKU · Orders placed by 6pm are ready next morning · Nett 14 days, or cash on collection · Custom flavours on request';


-- ============================================================================
-- 3. template_customization — per-user, per-template custom snippets
-- ============================================================================
CREATE TABLE IF NOT EXISTS template_customization (
  user_id      uuid        NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  template_key text        NOT NULL,   -- 'delivery' | 'social' | 'cert' | 'menu' | ...
  custom       jsonb       NOT NULL DEFAULT '{}'::jsonb,
  updated_at   timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, template_key)
);

ALTER TABLE template_customization ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tc read own"  ON template_customization;
DROP POLICY IF EXISTS "tc write own" ON template_customization;

CREATE POLICY "tc read own"
  ON template_customization FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "tc write own"
  ON template_customization FOR ALL
  USING     (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON template_customization TO authenticated;


COMMIT;
