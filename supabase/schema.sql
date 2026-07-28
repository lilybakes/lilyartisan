-- ============================================================
-- Lily Artisan — Cake Costing & BOM schema
-- Run this in Supabase SQL Editor once (safe to re-run — uses IF NOT EXISTS).
-- Single-user setup: RLS on with permissive policies for the anon key.
-- ============================================================

-- SETTINGS (singleton row — id is always 1)
create table if not exists settings (
  id integer primary key default 1,
  owner_name text not null default 'Lily',
  business_name text not null default 'Lily Artisan',
  currency text not null default 'RM',
  default_target_food_cost_pct numeric not null default 28,
  updated_at timestamptz not null default now(),
  constraint singleton check (id = 1)
);

insert into settings (id) values (1) on conflict do nothing;

-- INGREDIENTS
create table if not exists ingredients (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  purchase_unit  text not null,
  purchase_qty   numeric not null check (purchase_qty > 0),
  purchase_price numeric not null check (purchase_price >= 0),
  waste_pct      numeric not null default 0 check (waste_pct >= 0 and waste_pct < 100),
  density_g_ml   numeric,
  color          text default '#7367f0',
  created_at     timestamptz not null default now()
);

-- RECIPES
create table if not exists recipes (
  id                    uuid primary key default gen_random_uuid(),
  name                  text not null,
  category              text,
  yield_portions        integer not null check (yield_portions > 0),
  target_food_cost_pct  numeric not null default 28 check (target_food_cost_pct > 0 and target_food_cost_pct <= 100),
  created_at            timestamptz not null default now()
);

-- BOM LINES
create table if not exists bom_lines (
  id            uuid primary key default gen_random_uuid(),
  recipe_id     uuid not null references recipes(id) on delete cascade,
  ingredient_id uuid not null references ingredients(id) on delete cascade,
  qty           numeric not null check (qty > 0),
  unit          text not null,
  created_at    timestamptz not null default now()
);

create index if not exists bom_lines_recipe_idx on bom_lines(recipe_id);
create index if not exists bom_lines_ingredient_idx on bom_lines(ingredient_id);

-- INVENTORY
create table if not exists inventory (
  ingredient_id uuid primary key references ingredients(id) on delete cascade,
  stock_qty     numeric not null default 0,
  updated_at    timestamptz not null default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table settings    enable row level security;
alter table ingredients enable row level security;
alter table recipes     enable row level security;
alter table bom_lines   enable row level security;
alter table inventory   enable row level security;

-- Single-user, no login: allow anon key full access.
do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'settings' and policyname = 'anon full access settings') then
    create policy "anon full access settings"    on settings    for all using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'ingredients' and policyname = 'anon full access ingredients') then
    create policy "anon full access ingredients" on ingredients for all using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'recipes' and policyname = 'anon full access recipes') then
    create policy "anon full access recipes"     on recipes     for all using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'bom_lines' and policyname = 'anon full access bom_lines') then
    create policy "anon full access bom_lines"   on bom_lines   for all using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'inventory' and policyname = 'anon full access inventory') then
    create policy "anon full access inventory"   on inventory   for all using (true) with check (true);
  end if;
end $$;

-- ============================================================
-- Optional seed recipe (safe to skip)
-- ============================================================
insert into recipes (name, category, yield_portions, target_food_cost_pct)
select 'Classic Vanilla Sponge (8" round)', 'Cake', 12, 28
where not exists (select 1 from recipes);
