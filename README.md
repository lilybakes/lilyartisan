# Starter Recipes for New Users

One SQL file. Runs the migration + registers a trigger that auto-seeds every new user with realistic bakery starter content — 18 ingredients, 6 recipes, and all the BOM links pre-costed.

## The 6 starter recipes

| Recipe | Category | Yield | Target FC% |
|---|---|---|---|
| Classic Sourdough Loaf | Bread | 1 loaf | 30% |
| Chocolate Chip Cookies | Cookies | 24 | 30% |
| Vanilla Cupcakes with Buttercream | Cakes | 12 | 28% |
| Chocolate Fudge Cake | Cakes | 10 slices | 30% |
| Blueberry Muffins | Muffins | 12 | 28% |
| Almond Biscotti | Cookies | 20 | 25% |

Every recipe has `description`, `method`, `storage_notes`, and `allergen_notice` populated — so Classic Recipe Card, Care Card, and Product Label templates all look complete out of the box. No "missing method" placeholders.

The 18 supporting ingredients (flour, butter, eggs, sugar, chocolate, blueberries, almonds, etc.) are priced in realistic RM for Malaysian bakery-supply channels and use consistent grams/millilitres/pieces so the costing math works without unit conversion.

## Deploy

Supabase SQL Editor → paste `supabase/starter-recipes.sql` → Run.

The final SELECT should show two rows — `seed_starter_recipes` and `trigger_seed_starter_recipes`. That's your confirmation both the function and the trigger installed correctly.

## How the trigger works

```
User signs up (any path — free trial, sysadmin invite, paid checkout approval)
         ↓
INSERT into auth.users
         ↓
Two AFTER INSERT triggers fire on auth.users:
  1. on_auth_user_created         → creates profile + settings row
  2. on_new_user_seed_recipes     → calls seed_starter_recipes(new_user_id)
         ↓
seed_starter_recipes() checks: does this user have ANY recipes already?
  - Yes → return silently (idempotent)
  - No  → insert 18 ingredients + 6 recipes + ~50 BOM lines under their user_id
```

Every new signup lands in the app with something to explore. They can edit, delete, or use these as-is.

## Existing users are untouched

The idempotency check (`IF EXISTS (SELECT 1 FROM recipes WHERE user_id = p_user_id LIMIT 1) THEN RETURN`) means Lily, Anthony, and anyone else who already has recipes gets skipped. Lily's real recipes stay hers.

## Manually seed an existing user

If a specific existing user somehow ended up empty and wants the starter content, run:

```sql
SELECT seed_starter_recipes('<their-user-id>');
```

Only runs if they truly have no recipes. Safe to call.

## Cost preview (what the app will show after seed)

Rough numbers so you know what the templates will render for a new user:

| Recipe | Batch cost | Cost / portion | Suggested price / portion @ target FC% |
|---|---|---|---|
| Sourdough Loaf | ~RM 4.00 | RM 4.00 | RM 13.30 per loaf |
| Chocolate Chip Cookies | ~RM 26.00 | RM 1.08 | RM 3.60 per cookie |
| Vanilla Cupcakes | ~RM 14.40 | RM 1.20 | RM 4.30 per cupcake |
| Chocolate Fudge Cake | ~RM 30.00 | RM 3.00 | RM 10.00 per slice (~RM 100 whole) |
| Blueberry Muffins | ~RM 15.00 | RM 1.25 | RM 4.50 per muffin |
| Almond Biscotti | ~RM 15.00 | RM 0.75 | RM 3.00 per piece |

These are realistic artisan-bakery numbers — a new user sees immediately how the app turns their ingredient costs into confident prices.

## Rollback

```sql
DROP TRIGGER IF EXISTS on_new_user_seed_recipes ON auth.users;
DROP FUNCTION IF EXISTS trigger_seed_starter_recipes();
DROP FUNCTION IF EXISTS seed_starter_recipes(uuid);
-- The added recipes columns (description, method, storage_notes, allergen_notice)
-- can be left in place — nothing depends on them being removed.
```
