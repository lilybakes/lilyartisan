-- ============================================================
-- Lily Artisan — schema patch v3 (add app_name + logo_data_url)
-- Run once in Supabase SQL Editor. Safe to re-run.
-- ============================================================

alter table settings
  add column if not exists app_name text default 'Baker|Nomics',
  add column if not exists logo_data_url text;

-- Backfill existing row if the new column was just added.
update settings set app_name = coalesce(app_name, 'Baker|Nomics') where id = 1;
