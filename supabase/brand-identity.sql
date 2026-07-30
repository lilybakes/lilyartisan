-- ============================================================================
-- Brand Identity expansion — per-user branding for recipe / care templates
-- ============================================================================
-- Adds the columns Settings needs for personalized customer-facing sheets.
-- Safe to re-run. All columns nullable except brand_color (defaults to violet).
-- ============================================================================

ALTER TABLE settings
  ADD COLUMN IF NOT EXISTS tagline                 text,
  ADD COLUMN IF NOT EXISTS brand_color             text NOT NULL DEFAULT '#6C5CE7',
  ADD COLUMN IF NOT EXISTS contact_phone           text,
  ADD COLUMN IF NOT EXISTS contact_email           text,
  ADD COLUMN IF NOT EXISTS website                 text,
  ADD COLUMN IF NOT EXISTS address                 text,
  ADD COLUMN IF NOT EXISTS instagram               text,
  ADD COLUMN IF NOT EXISTS facebook                text,
  ADD COLUMN IF NOT EXISTS default_storage_notes   text,
  ADD COLUMN IF NOT EXISTS default_allergen_notice text;

-- logo_data_url column already exists (was previously a sysadmin-only field
-- in the original template).  It is now the per-user logo.
