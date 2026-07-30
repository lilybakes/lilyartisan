-- ============================================================================
-- Starter recipes for new users
-- ============================================================================
-- Seeds 18 realistic bakery ingredients, 6 fully-costed recipes, and their
-- BOM lines automatically when a new user signs up.
--
-- Idempotent: only seeds if the user has zero recipes. Existing users like
-- Lily and Anthony are untouched — this only runs for fresh accounts.
--
-- The seed pairs perfectly with the Templates page: every starter recipe
-- has description, method, storage_notes, and allergen_notice populated so
-- Classic Recipe Card / Care Card / Product Label all look complete out of
-- the box.
--
-- Safe to re-run.
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. Add optional recipe columns used by templates + this seed
-- ============================================================================
ALTER TABLE recipes
  ADD COLUMN IF NOT EXISTS description     text,
  ADD COLUMN IF NOT EXISTS method          text,
  ADD COLUMN IF NOT EXISTS storage_notes   text,
  ADD COLUMN IF NOT EXISTS allergen_notice text;


-- ============================================================================
-- 2. The seed function
-- ============================================================================
-- Prices are realistic Malaysian bakery-supply prices in RM.
-- All quantities use grams / millilitres / pieces for consistent costing.
-- ============================================================================
CREATE OR REPLACE FUNCTION seed_starter_recipes(p_user_id uuid)
RETURNS void AS $$
DECLARE
  -- Ingredient IDs
  v_bread_flour  uuid := gen_random_uuid();
  v_ap_flour     uuid := gen_random_uuid();
  v_gran_sugar   uuid := gen_random_uuid();
  v_brown_sugar  uuid := gen_random_uuid();
  v_icing_sugar  uuid := gen_random_uuid();
  v_butter       uuid := gen_random_uuid();
  v_egg          uuid := gen_random_uuid();
  v_milk         uuid := gen_random_uuid();
  v_cream        uuid := gen_random_uuid();
  v_vanilla      uuid := gen_random_uuid();
  v_bak_pow      uuid := gen_random_uuid();
  v_bak_soda     uuid := gen_random_uuid();
  v_salt         uuid := gen_random_uuid();
  v_yeast        uuid := gen_random_uuid();
  v_cocoa        uuid := gen_random_uuid();
  v_dark_choc    uuid := gen_random_uuid();
  v_blueberries  uuid := gen_random_uuid();
  v_almonds      uuid := gen_random_uuid();

  -- Recipe IDs
  v_sourdough    uuid := gen_random_uuid();
  v_choc_chip    uuid := gen_random_uuid();
  v_cupcakes     uuid := gen_random_uuid();
  v_choc_cake    uuid := gen_random_uuid();
  v_blue_muff    uuid := gen_random_uuid();
  v_biscotti     uuid := gen_random_uuid();
BEGIN
  -- Idempotency: skip if user already has any recipes
  IF EXISTS (SELECT 1 FROM recipes WHERE user_id = p_user_id LIMIT 1) THEN
    RETURN;
  END IF;

  -- ==========================================================================
  -- 18 INGREDIENTS — all priced per gram/ml/piece for consistent costing
  -- ==========================================================================
  INSERT INTO ingredients (id, user_id, name, purchase_unit, purchase_qty, purchase_price, waste_pct) VALUES
    (v_bread_flour, p_user_id, 'Bread flour',            'g',    1000,  5.00, 2),
    (v_ap_flour,    p_user_id, 'All-purpose flour',      'g',    1000,  4.50, 2),
    (v_gran_sugar,  p_user_id, 'Granulated sugar',       'g',    1000,  3.50, 1),
    (v_brown_sugar, p_user_id, 'Brown sugar',            'g',    1000,  6.00, 1),
    (v_icing_sugar, p_user_id, 'Icing sugar',            'g',    1000,  5.00, 1),
    (v_butter,      p_user_id, 'Unsalted butter',        'g',    500,  18.00, 3),
    (v_egg,         p_user_id, 'Large eggs',             'pcs',  30,   15.00, 3),
    (v_milk,        p_user_id, 'Whole milk',             'ml',   1000,  7.50, 2),
    (v_cream,       p_user_id, 'Heavy cream',            'ml',   1000, 22.00, 2),
    (v_vanilla,     p_user_id, 'Vanilla extract',        'ml',   100,  25.00, 1),
    (v_bak_pow,     p_user_id, 'Baking powder',          'g',    500,  12.00, 1),
    (v_bak_soda,    p_user_id, 'Baking soda',            'g',    500,   8.00, 1),
    (v_salt,        p_user_id, 'Sea salt',               'g',    500,   6.00, 1),
    (v_yeast,       p_user_id, 'Instant yeast',          'g',    500,  15.00, 1),
    (v_cocoa,       p_user_id, 'Cocoa powder (unsweet)', 'g',    500,  22.00, 2),
    (v_dark_choc,   p_user_id, 'Dark chocolate chips',   'g',    500,  28.00, 2),
    (v_blueberries, p_user_id, 'Blueberries (frozen)',   'g',    500,  18.00, 5),
    (v_almonds,     p_user_id, 'Sliced almonds',         'g',    250,  20.00, 3);

  -- ==========================================================================
  -- 6 RECIPES — full description / method / storage / allergen
  -- ==========================================================================
  INSERT INTO recipes (id, user_id, name, category, yield_portions, target_food_cost_pct, description, method, storage_notes, allergen_notice) VALUES

    (v_sourdough, p_user_id, 'Classic Sourdough Loaf', 'Bread', 1, 30,
     'A crusty artisan loaf with a chewy crumb. Simple ingredients, patient fermentation.',
     E'1. Mix bread flour, salt, yeast, and softened butter in a bowl.\n2. Add 350ml lukewarm water gradually and knead for 10 minutes until smooth and elastic.\n3. Cover and bulk ferment 2–3 hours at room temperature until doubled.\n4. Shape into a boule and proof another 60 minutes on a floured cloth.\n5. Score the top with a lame or sharp knife.\n6. Bake at 240°C for 30–35 minutes with steam (a tray of hot water on the bottom shelf).\n7. Cool completely on a wire rack before slicing.',
     'Best consumed within 3 days. Store at room temperature in a paper bag or bread box — never plastic, which softens the crust. Freeze sliced portions for up to 1 month.',
     'Contains: wheat, dairy. Made in a facility that also handles nuts and eggs.'),

    (v_choc_chip, p_user_id, 'Chocolate Chip Cookies', 'Cookies', 24, 30,
     'Chewy in the middle, crisp at the edges, loaded with dark chocolate. A universal crowd-pleaser.',
     E'1. Cream butter and both sugars until pale and fluffy, about 3 minutes.\n2. Beat in eggs one at a time, then the vanilla.\n3. Whisk together flour, baking soda, and salt in a separate bowl. Fold into the wet mixture until just combined.\n4. Stir in chocolate chips.\n5. Scoop 2-tablespoon portions onto a lined tray, spacing 5cm apart.\n6. Bake at 175°C for 12–14 minutes until edges are golden but centres are still soft.\n7. Cool on the tray for 5 minutes, then transfer to a rack.',
     'Best within 5 days in an airtight container at room temperature. Freeze pre-scooped dough balls up to 3 months and bake straight from frozen — add 2 minutes to the timer.',
     'Contains: wheat, dairy, eggs. May contain traces of nuts.'),

    (v_cupcakes, p_user_id, 'Vanilla Cupcakes with Buttercream', 'Cakes', 12, 28,
     'Light vanilla sponge topped with silky vanilla buttercream. A birthday-party staple.',
     E'CUPCAKES\n1. Cream 100g butter with the granulated sugar until pale, about 3 minutes.\n2. Beat in the eggs one at a time, then 5ml of the vanilla.\n3. Sift together flour, baking powder, and salt.\n4. Alternate folding in the dry ingredients and the milk, in three additions each.\n5. Divide between 12 lined cases and bake at 175°C for 20 minutes.\n6. Cool completely before frosting.\n\nBUTTERCREAM\n7. Whip the remaining 100g softened butter until pale and airy.\n8. Beat in the sifted icing sugar and remaining vanilla until fluffy and pipeable.\n9. Pipe generously onto the cooled cupcakes.',
     'Best within 3 days at room temperature in a covered container. In warm weather, refrigerate but bring back to room temperature before serving.',
     'Contains: wheat, dairy, eggs.'),

    (v_choc_cake, p_user_id, 'Chocolate Fudge Cake', 'Cakes', 10, 30,
     'A deeply moist chocolate cake finished with a glossy dark chocolate ganache. Cocoa-forward and rich without being cloying.',
     E'CAKE\n1. Cream butter and sugar until light, about 4 minutes.\n2. Beat in the eggs and 5ml of the vanilla.\n3. Sift together flour, cocoa powder, baking powder, and salt.\n4. Alternate folding in the dry ingredients and the milk, in three additions each.\n5. Pour into a lined 22cm tin and bake at 170°C for 40–45 minutes until a skewer comes out mostly clean.\n6. Cool completely before ganaching.\n\nGANACHE\n7. Warm the cream just to a simmer, then pour over the chopped chocolate. Rest 2 minutes.\n8. Whisk from the centre outward until glossy and smooth.\n9. Pour over the cooled cake and let it set at room temperature for 30 minutes.',
     'Best within 4 days under a cake dome at room temperature. Refrigerate in hot weather and bring back to room temperature 30 minutes before serving.',
     'Contains: wheat, dairy, eggs.'),

    (v_blue_muff, p_user_id, 'Blueberry Muffins', 'Muffins', 12, 28,
     'Tender muffins bursting with blueberries and a hint of vanilla. A café favourite for a reason.',
     E'1. Preheat oven to 190°C and line a 12-cup muffin tray.\n2. Whisk together flour, baking powder, and salt in a large bowl.\n3. In another bowl, whisk melted butter, sugar, eggs, milk, and vanilla until smooth.\n4. Fold wet into dry until just combined — a few lumps are fine. Do NOT overmix.\n5. Gently fold in the blueberries (toss them in a tablespoon of flour first if using frozen, to prevent sinking).\n6. Divide between the muffin cases, filling nearly to the top.\n7. Bake for 22–25 minutes until domed and golden. A skewer inserted should come out clean.',
     'Best the day of baking. Store in an airtight container up to 3 days, or freeze for up to 1 month and reheat at 150°C for 5 minutes.',
     'Contains: wheat, dairy, eggs.'),

    (v_biscotti, p_user_id, 'Almond Biscotti', 'Cookies', 20, 25,
     'Twice-baked Italian cookies studded with sliced almonds. Crisp, dunkable, and perfect with coffee.',
     E'1. Beat eggs, sugar, and vanilla together until pale and doubled in volume, about 3 minutes.\n2. Beat in the melted butter.\n3. Whisk together flour, baking powder, and salt. Fold into the wet mixture.\n4. Stir in the sliced almonds.\n5. Shape into a 30cm log on a lined tray, about 8cm wide. Bake at 180°C for 25 minutes.\n6. Cool for 10 minutes. Slice diagonally at 1.5cm intervals with a serrated knife.\n7. Lay slices flat on the tray and bake another 10 minutes each side until fully dry and crisp.',
     'Keeps beautifully in an airtight container for up to 2 weeks. No refrigeration needed. Great for gifting.',
     'Contains: wheat, dairy, eggs, tree nuts (almonds).');

  -- ==========================================================================
  -- BOM LINES — quantities in the same units as ingredients (g / ml / pcs)
  -- ==========================================================================
  INSERT INTO bom_lines (recipe_id, ingredient_id, qty, unit) VALUES
    -- Sourdough
    (v_sourdough, v_bread_flour, 500, 'g'),
    (v_sourdough, v_salt,         10, 'g'),
    (v_sourdough, v_yeast,         5, 'g'),
    (v_sourdough, v_butter,       30, 'g'),

    -- Chocolate Chip Cookies
    (v_choc_chip, v_ap_flour,    300, 'g'),
    (v_choc_chip, v_brown_sugar, 150, 'g'),
    (v_choc_chip, v_gran_sugar,   50, 'g'),
    (v_choc_chip, v_butter,      200, 'g'),
    (v_choc_chip, v_egg,           2, 'pcs'),
    (v_choc_chip, v_vanilla,       5, 'ml'),
    (v_choc_chip, v_bak_soda,      5, 'g'),
    (v_choc_chip, v_salt,          3, 'g'),
    (v_choc_chip, v_dark_choc,   250, 'g'),

    -- Vanilla Cupcakes with Buttercream
    (v_cupcakes,  v_ap_flour,    200, 'g'),
    (v_cupcakes,  v_gran_sugar,  200, 'g'),
    (v_cupcakes,  v_butter,      200, 'g'),
    (v_cupcakes,  v_egg,           2, 'pcs'),
    (v_cupcakes,  v_milk,        120, 'ml'),
    (v_cupcakes,  v_vanilla,      10, 'ml'),
    (v_cupcakes,  v_bak_pow,       8, 'g'),
    (v_cupcakes,  v_salt,          2, 'g'),
    (v_cupcakes,  v_icing_sugar, 200, 'g'),

    -- Chocolate Fudge Cake
    (v_choc_cake, v_ap_flour,    250, 'g'),
    (v_choc_cake, v_gran_sugar,  300, 'g'),
    (v_choc_cake, v_butter,      200, 'g'),
    (v_choc_cake, v_egg,           3, 'pcs'),
    (v_choc_cake, v_milk,        200, 'ml'),
    (v_choc_cake, v_vanilla,       5, 'ml'),
    (v_choc_cake, v_cocoa,        60, 'g'),
    (v_choc_cake, v_bak_pow,       8, 'g'),
    (v_choc_cake, v_salt,          3, 'g'),
    (v_choc_cake, v_dark_choc,   200, 'g'),
    (v_choc_cake, v_cream,       200, 'ml'),

    -- Blueberry Muffins
    (v_blue_muff, v_ap_flour,    300, 'g'),
    (v_blue_muff, v_gran_sugar,  150, 'g'),
    (v_blue_muff, v_butter,      100, 'g'),
    (v_blue_muff, v_egg,           2, 'pcs'),
    (v_blue_muff, v_milk,        240, 'ml'),
    (v_blue_muff, v_vanilla,       5, 'ml'),
    (v_blue_muff, v_bak_pow,      10, 'g'),
    (v_blue_muff, v_salt,          3, 'g'),
    (v_blue_muff, v_blueberries, 200, 'g'),

    -- Almond Biscotti
    (v_biscotti,  v_ap_flour,    250, 'g'),
    (v_biscotti,  v_gran_sugar,  200, 'g'),
    (v_biscotti,  v_butter,       50, 'g'),
    (v_biscotti,  v_egg,           2, 'pcs'),
    (v_biscotti,  v_vanilla,       5, 'ml'),
    (v_biscotti,  v_bak_pow,       5, 'g'),
    (v_biscotti,  v_salt,          2, 'g'),
    (v_biscotti,  v_almonds,     100, 'g');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION seed_starter_recipes(uuid) TO authenticated;


-- ============================================================================
-- 3. Trigger — auto-seed every new signup, wrapped so it can't fail signup
-- ============================================================================
CREATE OR REPLACE FUNCTION trigger_seed_starter_recipes()
RETURNS TRIGGER AS $$
BEGIN
  BEGIN
    PERFORM seed_starter_recipes(NEW.id);
  EXCEPTION WHEN OTHERS THEN
    -- If seeding fails for any reason (missing table, RLS quirk, etc.)
    -- we log a warning but never fail user creation.
    RAISE WARNING 'Failed to seed starter recipes for user %: %', NEW.id, SQLERRM;
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_new_user_seed_recipes ON auth.users;
CREATE TRIGGER on_new_user_seed_recipes
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION trigger_seed_starter_recipes();


COMMIT;

-- ============================================================================
-- Verify — quick sanity check
-- ============================================================================
SELECT
  proname AS function_name,
  pronargs AS num_args
FROM pg_proc
WHERE proname IN ('seed_starter_recipes', 'trigger_seed_starter_recipes');
