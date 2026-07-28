-- ============================================================
-- Cake Costing & BOM — Supabase schema
-- Run this in Supabase SQL Editor once, on a fresh project.
-- Single-user setup: RLS enabled with an open policy for the
-- anon key. When you add auth later, tighten these policies.
-- ============================================================

-- INGREDIENTS
create table if not exists ingredients (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  purchase_unit  text not null,          -- g, kg, oz, lb, ml, l, tsp, tbsp, cup, pcs
  purchase_qty   numeric not null check (purchase_qty > 0),
  purchase_price numeric not null check (purchase_price >= 0),
  waste_pct      numeric not null default 0 check (waste_pct >= 0 and waste_pct < 100),
  density_g_ml   numeric,                -- optional; needed only for mass<->volume bridging
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

-- BOM LINES (recipe <-> ingredient join with qty and unit-of-use)
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

-- INVENTORY (optional module — one row per ingredient)
create table if not exists inventory (
  ingredient_id uuid primary key references ingredients(id) on delete cascade,
  stock_qty     numeric not null default 0,
  updated_at    timestamptz not null default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table ingredients enable row level security;
alter table recipes     enable row level security;
alter table bom_lines   enable row level security;
alter table inventory   enable row level security;

-- Single-user, no login: allow anon key full access.
-- When you add auth later, replace these with owner-scoped policies.
create policy "anon full access ingredients" on ingredients for all using (true) with check (true);
create policy "anon full access recipes"     on recipes     for all using (true) with check (true);
create policy "anon full access bom_lines"   on bom_lines   for all using (true) with check (true);
create policy "anon full access inventory"   on inventory   for all using (true) with check (true);

-- ============================================================
-- Seed row (optional — delete if not wanted)
-- ============================================================
insert into recipes (name, category, yield_portions, target_food_cost_pct)
values ('Classic Vanilla Sponge Cake (8" round)', 'Cake', 12, 28)
on conflict do nothing;
