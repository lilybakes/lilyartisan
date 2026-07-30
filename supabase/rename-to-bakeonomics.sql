-- ============================================================================
-- Global rename: BakerNomics → BakeOnomics inside the database
-- ============================================================================
-- Uses REPLACE(), so all your sysadmin Content edits, custom email templates,
-- and platform settings are preserved — only the brand name itself changes.
--
-- Safe to re-run. Idempotent — after the first run, subsequent runs do nothing.
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. content_blocks — Landing page copy (features, pricing, FAQ, etc.)
-- ============================================================================
-- Cast JSONB → text, replace, cast back. Handles both cases:
--   'BakerNomics' → 'BakeOnomics'
--   'bakernomics'  → 'bakeonomics'  (URLs)
UPDATE content_blocks
SET content = REPLACE(REPLACE(content::text, 'BakerNomics', 'BakeOnomics'), 'bakernomics', 'bakeonomics')::jsonb,
    updated_at = now()
WHERE content::text LIKE '%BakerNomics%'
   OR content::text LIKE '%bakernomics%';


-- ============================================================================
-- 2. email_templates — subject + body
-- ============================================================================
UPDATE email_templates
SET subject = REPLACE(REPLACE(subject, 'BakerNomics', 'BakeOnomics'), 'bakernomics', 'bakeonomics'),
    body    = REPLACE(REPLACE(body,    'BakerNomics', 'BakeOnomics'), 'bakernomics', 'bakeonomics'),
    updated_at = now()
WHERE subject LIKE '%BakerNomics%'
   OR body    LIKE '%BakerNomics%'
   OR subject LIKE '%bakernomics%'
   OR body    LIKE '%bakernomics%';


-- ============================================================================
-- 3. platform_settings — announcement, maintenance message, business name
-- ============================================================================
UPDATE platform_settings
SET announcement_message = REPLACE(REPLACE(COALESCE(announcement_message, ''), 'BakerNomics', 'BakeOnomics'), 'bakernomics', 'bakeonomics'),
    maintenance_message  = REPLACE(REPLACE(COALESCE(maintenance_message, ''),  'BakerNomics', 'BakeOnomics'), 'bakernomics', 'bakeonomics'),
    payment_instructions = REPLACE(REPLACE(COALESCE(payment_instructions, ''), 'BakerNomics', 'BakeOnomics'), 'bakernomics', 'bakeonomics'),
    updated_at = now()
WHERE id = 1
  AND (
    COALESCE(announcement_message, '')  LIKE '%BakerNomics%'
 OR COALESCE(maintenance_message, '')   LIKE '%BakerNomics%'
 OR COALESCE(payment_instructions, '')  LIKE '%BakerNomics%'
 OR COALESCE(announcement_message, '')  LIKE '%bakernomics%'
 OR COALESCE(maintenance_message, '')   LIKE '%bakernomics%'
 OR COALESCE(payment_instructions, '')  LIKE '%bakernomics%'
  );


-- ============================================================================
-- 4. settings (per-user) — check for any stale 'BakerNomics' in business_name or app_name
-- ============================================================================
-- Only affects users who literally have "BakerNomics" in their settings
-- (rare — usually only your own sysadmin account).
UPDATE settings
SET business_name = REPLACE(REPLACE(COALESCE(business_name, ''), 'BakerNomics', 'BakeOnomics'), 'bakernomics', 'bakeonomics'),
    app_name      = REPLACE(REPLACE(COALESCE(app_name, ''),      'Baker|Nomics', 'Bake|Onomics'), 'BakerNomics', 'BakeOnomics')
WHERE COALESCE(business_name, '') LIKE '%BakerNomics%'
   OR COALESCE(app_name, '')      LIKE '%BakerNomics%'
   OR COALESCE(business_name, '') LIKE '%bakernomics%'
   OR COALESCE(app_name, '')      LIKE '%Baker|Nomics%';


COMMIT;

-- ============================================================================
-- Verification — should return 0 rows if everything's renamed
-- ============================================================================
SELECT 'content_blocks with BakerNomics' AS what, COUNT(*) AS remaining
FROM content_blocks WHERE content::text LIKE '%BakerNomics%' OR content::text LIKE '%bakernomics%'
UNION ALL
SELECT 'email_templates with BakerNomics', COUNT(*)
FROM email_templates WHERE subject LIKE '%BakerNomics%' OR body LIKE '%BakerNomics%'
                        OR subject LIKE '%bakernomics%' OR body LIKE '%bakernomics%'
UNION ALL
SELECT 'settings with BakerNomics', COUNT(*)
FROM settings WHERE COALESCE(business_name,'') LIKE '%BakerNomics%' OR COALESCE(app_name,'') LIKE '%BakerNomics%';
