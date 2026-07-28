-- ============================================================
-- Lily Artisan — schema patch v3 (customizable header links)
-- Run once in Supabase SQL Editor. Safe to re-run.
-- ============================================================

create table if not exists header_links (
  id              uuid primary key default gen_random_uuid(),
  position        integer not null default 0,
  label           text default '',
  url             text default '',
  icon_name       text default 'link',
  open_in_new_tab boolean default true,
  created_at      timestamptz not null default now()
);

create index if not exists header_links_position_idx on header_links(position);

alter table header_links enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'header_links' and policyname = 'anon full access header_links') then
    create policy "anon full access header_links" on header_links for all using (true) with check (true);
  end if;
end $$;

-- Seed the 2 default slots (idempotent — only inserts if the table is empty)
insert into header_links (position, label, url, icon_name)
select 1, 'Language', '', 'globe'
where not exists (select 1 from header_links);

insert into header_links (position, label, url, icon_name)
select 2, 'Apps', '', 'grid'
where (select count(*) from header_links) = 1;
