# Default filler recipe for new signups

## What ships

Replaces `seed_starter_recipes()` with a single, polished "hello world" recipe — a **Moist Chocolate Ganache Cake** — with every content field populated. Every one of the 10 Kraft templates renders correctly out of the box the moment a new user finishes signup.

Also fixes a latent bug: an earlier migration added `recipes.method` as **text**, and my later Kraft-content migration was written assuming **jsonb**. Because `ADD COLUMN IF NOT EXISTS` is a no-op when the column exists, on your database `method` is still text — which is why the 6 starter recipes didn't render method properly on the Kraft templates either. This delta converts it to jsonb, preserving existing content by splitting on newlines.

## The recipe

**Moist Chocolate Ganache Cake** — 10 slices, target 30% food cost, ~RM 2.74/portion, suggested RM 10.

Fields populated for every template that needs them:

| Field | Used by |
|---|---|
| `name`, `category` | all |
| `yield_portions`, `target_food_cost_pct` | Cost Breakdown, Binder Page |
| `description` | Social Card, Binder Page, Menu Insert |
| `method` (jsonb array with CAKE / GANACHE sub-groups) | Recipe Card, Binder Page |
| `storage_text` | Care Card, Delivery Tag |
| `care_text` | Care Card |
| `allergens_text` | Care Card |
| `label_ingredients_text` | Product Label |
| `label_allergens_text` | Product Label |
| `show_in_menu` = true | Menu Insert, Wholesale Price List |
| `image_url` | Binder Page (NULL for now — see below) |

Method has proper sub-group labels so it renders as:

```
CAKE
  1. Preheat oven to 175°C…
  2. Whisk flour, cocoa…
  …
GANACHE
  9. Finely chop the dark chocolate…
  10. Warm the cream…
```

## 12 ingredients seeded

Everything the recipe references, priced realistically:

| Ingredient | Unit | Purchase qty | Price (RM) |
|---|---|---|---|
| All-purpose flour | g | 1000 | 4.50 |
| Granulated sugar | g | 1000 | 3.50 |
| Cocoa powder | g | 500 | 22.00 |
| Baking powder | g | 500 | 12.00 |
| Baking soda | g | 500 | 8.00 |
| Sea salt | g | 500 | 6.00 |
| Large eggs | pcs | 30 | 15.00 |
| Whole milk | ml | 1000 | 7.50 |
| Vegetable oil | ml | 1000 | 8.00 |
| Vanilla extract | ml | 100 | 25.00 |
| Dark chocolate 70% | g | 500 | 28.00 |
| Heavy cream | ml | 1000 | 22.00 |

## Files

```
supabase/
  filler-seed.sql        # NEW — method column type fix + new seed_starter_recipes
```

Safe to re-run.

## Deploy

Supabase SQL editor → paste `supabase/filler-seed.sql` → Run. Existing users are unaffected (function is idempotent per user). Every new signup from now on gets this one recipe.

If you want your own account reset to just this recipe: delete your existing recipes/ingredients in Recipe Master, then in SQL editor run:

```sql
SELECT seed_starter_recipes((SELECT id FROM auth.users WHERE email = 'anthony2211@gmail.com'));
```

## The image

`image_url` is NULL in the seed for now. I can't generate images. If you send me a chocolate cake photo you're OK with using as the default across every new signup, I'll:

1. Upload it to your `lilyartisan-images` bucket at a stable path (probably `starter/moist-chocolate-cake.jpg`)
2. Update the seed to set `image_url` to that URL
3. Ship as a two-line SQL follow-up

Anything from a phone camera works fine. Ideally landscape or square, well-lit, cake visible. If you have a photo Lily's already taken of one of her real cakes, even better — makes the default feel authentic instead of stocky. Otherwise a stock photo you've licensed also works.

## What about the earlier 6-recipe starter?

Overwritten. The old function that seeded Sourdough, Chocolate Chip Cookies, Vanilla Cupcakes, Chocolate Fudge Cake, Blueberry Muffins, and Almond Biscotti is gone. If you signed users up under the old function, they keep those 6 recipes — this only affects future signups.
