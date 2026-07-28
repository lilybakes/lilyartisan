-- ============================================================
-- Lily Artisan — schema patch v4 (image uploads for recipes & ingredients)
-- Run once in Supabase SQL Editor. Safe to re-run.
-- ============================================================

-- 1. Add image_url columns
alter table ingredients add column if not exists image_url text;
alter table recipes     add column if not exists image_url text;

-- 2. Create the storage bucket (public, 5MB per file, images only)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'lilyartisan-images',
  'lilyartisan-images',
  true,
  5242880,  -- 5 MB per file
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- 3. Storage policies — single-user setup with anon full access.
-- When you add auth later, tighten these to auth.uid()-scoped policies.
do $$
begin
  if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='lilyartisan images public read') then
    create policy "lilyartisan images public read" on storage.objects
      for select using (bucket_id = 'lilyartisan-images');
  end if;

  if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='lilyartisan images anon upload') then
    create policy "lilyartisan images anon upload" on storage.objects
      for insert with check (bucket_id = 'lilyartisan-images');
  end if;

  if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='lilyartisan images anon update') then
    create policy "lilyartisan images anon update" on storage.objects
      for update using (bucket_id = 'lilyartisan-images');
  end if;

  if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='lilyartisan images anon delete') then
    create policy "lilyartisan images anon delete" on storage.objects
      for delete using (bucket_id = 'lilyartisan-images');
  end if;
end $$;
