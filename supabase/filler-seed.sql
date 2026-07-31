-- ============================================================================
-- Default filler recipe for new signups
-- ============================================================================
-- Replaces seed_starter_recipes() with a single, polished "hello world"
-- recipe — a moist chocolate ganache cake — with every content field
-- populated so all 10 kraft templates render beautifully for a brand-new user.
--
-- Also converts recipes.method from text to jsonb if it's still text (an
-- earlier migration was fighting an older one).
--
-- Safe to re-run. Idempotent — a user with any existing recipes is skipped.
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. Convert recipes.method from text → jsonb if it hasn't been already
-- ============================================================================
-- Earlier `starter-recipes.sql` added method as text. Later
-- `kraft-content-migration.sql` tried to add it as jsonb but its
-- `ADD COLUMN IF NOT EXISTS` was a no-op because the column existed. So on
-- your database it's still text. Convert it, preserving existing content by
-- splitting on newlines.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'recipes' AND column_name = 'method' AND data_type = 'text'
  ) THEN
    ALTER TABLE recipes ALTER COLUMN method DROP DEFAULT;
    ALTER TABLE recipes ALTER COLUMN method TYPE jsonb USING (
      CASE
        WHEN method IS NULL OR trim(method) = '' THEN '[]'::jsonb
        ELSE (
          SELECT COALESCE(jsonb_agg(to_jsonb(trim(step))), '[]'::jsonb)
          FROM regexp_split_to_table(method, E'\n') AS step
          WHERE trim(step) != ''
        )
      END
    );
    ALTER TABLE recipes ALTER COLUMN method SET DEFAULT '[]'::jsonb;
    ALTER TABLE recipes ALTER COLUMN method SET NOT NULL;
    RAISE NOTICE 'Converted recipes.method from text → jsonb';
  END IF;
END $$;


-- ============================================================================
-- 2. Replace seed_starter_recipes() with the single-recipe filler
-- ============================================================================
CREATE OR REPLACE FUNCTION seed_starter_recipes(p_user_id uuid)
RETURNS void AS $$
DECLARE
  -- Ingredients
  v_ap_flour     uuid := gen_random_uuid();
  v_gran_sugar   uuid := gen_random_uuid();
  v_cocoa        uuid := gen_random_uuid();
  v_bak_pow      uuid := gen_random_uuid();
  v_bak_soda     uuid := gen_random_uuid();
  v_salt         uuid := gen_random_uuid();
  v_egg          uuid := gen_random_uuid();
  v_milk         uuid := gen_random_uuid();
  v_veg_oil      uuid := gen_random_uuid();
  v_vanilla      uuid := gen_random_uuid();
  v_dark_choc    uuid := gen_random_uuid();
  v_cream        uuid := gen_random_uuid();
  -- Recipe
  v_choc_cake    uuid := gen_random_uuid();
BEGIN
  -- Idempotent: only seed a user with zero recipes
  IF EXISTS (SELECT 1 FROM recipes WHERE user_id = p_user_id LIMIT 1) THEN
    RETURN;
  END IF;

  -- --------------------------------------------------------------------------
  -- 12 essential ingredients — realistic Malaysian bakery-supply prices in RM
  -- --------------------------------------------------------------------------
  INSERT INTO ingredients (id, user_id, name, purchase_unit, purchase_qty, purchase_price, waste_pct) VALUES
    (v_ap_flour,   p_user_id, 'All-purpose flour',   'g',   1000,  4.50, 2),
    (v_gran_sugar, p_user_id, 'Granulated sugar',    'g',   1000,  3.50, 1),
    (v_cocoa,      p_user_id, 'Cocoa powder',        'g',    500, 22.00, 2),
    (v_bak_pow,    p_user_id, 'Baking powder',       'g',    500, 12.00, 1),
    (v_bak_soda,   p_user_id, 'Baking soda',         'g',    500,  8.00, 1),
    (v_salt,       p_user_id, 'Sea salt',            'g',    500,  6.00, 1),
    (v_egg,        p_user_id, 'Large eggs',          'pcs',   30, 15.00, 3),
    (v_milk,       p_user_id, 'Whole milk',          'ml',  1000,  7.50, 2),
    (v_veg_oil,    p_user_id, 'Vegetable oil',       'ml',  1000,  8.00, 1),
    (v_vanilla,    p_user_id, 'Vanilla extract',     'ml',   100, 25.00, 1),
    (v_dark_choc,  p_user_id, 'Dark chocolate 70%',  'g',    500, 28.00, 2),
    (v_cream,      p_user_id, 'Heavy cream',         'ml',  1000, 22.00, 2);

  -- --------------------------------------------------------------------------
  -- Moist Chocolate Ganache Cake — all fields populated so every one of the
  -- 10 Kraft templates renders correctly out of the box for a brand-new user.
  -- --------------------------------------------------------------------------
  INSERT INTO recipes (
    id, user_id, name, category, yield_portions, target_food_cost_pct,
    description, method,
    storage_text, care_text, allergens_text,
    label_ingredients_text, label_allergens_text,
    show_in_menu
  ) VALUES (
    v_choc_cake, p_user_id, 'Moist Chocolate Ganache Cake', 'Cakes', 10, 30,

    'The classic. Deep-cocoa crumb, tender from oil and hot coffee, finished with mirror-smooth dark chocolate ganache.',

    -- Structured method with group labels — renders on Recipe Card & Binder
    '[
      { "group": "CAKE" },
      { "step": "Preheat oven to 175°C. Line a 22cm round tin with parchment." },
      { "step": "Whisk flour, cocoa, baking powder, baking soda, salt, and sugar together in a large bowl." },
      { "step": "In a separate bowl, whisk eggs, milk, oil, and vanilla until smooth." },
      { "step": "Pour wet into dry and whisk until just combined." },
      { "step": "Slowly stream in 240ml of hot water (or hot coffee for deeper flavour) while whisking. The batter will look very thin — that is correct." },
      { "step": "Pour into the tin and bake 32–35 minutes, until a skewer comes out with a few moist crumbs still clinging." },
      { "step": "Cool 15 minutes in the tin, then turn out onto a rack. Cool completely before ganaching." },
      { "group": "GANACHE" },
      { "step": "Finely chop the dark chocolate and place in a heatproof bowl." },
      { "step": "Warm the cream just to the edge of a simmer, then pour over the chocolate. Rest untouched for 2 minutes." },
      { "step": "Whisk from the centre outward until glossy and smooth." },
      { "step": "Pour over the cooled cake. Set at room temperature 20 minutes, or refrigerate 5 minutes for a firmer finish." }
    ]'::jsonb,

    -- Care Card, Delivery Tag
    'Best within 4 days at room temperature under a cake dome. Refrigerate in hot weather; bring back to room temperature 30 minutes before serving.',
    -- Care Card override (has a warmer voice than storage)
    'Better on day two, honestly — the crumb settles overnight into something even more tender.',
    -- Allergens
    'Contains: wheat, dairy, eggs. May contain traces of nuts and soy.',

    -- Product Label — customer-facing ingredients list
    'Wheat flour, sugar, cocoa powder, whole milk, dark chocolate, heavy cream, eggs, vegetable oil, vanilla extract, baking powder, baking soda, sea salt.',
    -- Product Label allergens
    'Contains: wheat, dairy, eggs. May contain traces of nuts and soy.',

    true  -- show_in_menu
  );

  -- --------------------------------------------------------------------------
  -- BOM lines — quantities for a 10-slice 22cm round cake.
  -- Cost per portion works out to ~RM 2.74, at 30% target FC → suggested ~RM 9.13
  -- --------------------------------------------------------------------------
  INSERT INTO bom_lines (recipe_id, ingredient_id, qty, unit) VALUES
    (v_choc_cake, v_ap_flour,   200, 'g'),
    (v_choc_cake, v_gran_sugar, 300, 'g'),
    (v_choc_cake, v_cocoa,       75, 'g'),
    (v_choc_cake, v_bak_pow,      8, 'g'),
    (v_choc_cake, v_bak_soda,     4, 'g'),
    (v_choc_cake, v_salt,         3, 'g'),
    (v_choc_cake, v_egg,          2, 'pcs'),
    (v_choc_cake, v_milk,       240, 'ml'),
    (v_choc_cake, v_veg_oil,    120, 'ml'),
    (v_choc_cake, v_vanilla,     10, 'ml'),
    (v_choc_cake, v_dark_choc,  200, 'g'),
    (v_choc_cake, v_cream,      200, 'ml');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION seed_starter_recipes(uuid) TO authenticated;

-- Note: the trigger `on_new_user_seed_recipes` created by starter-recipes.sql
-- already points at this function, so it now uses the new single-recipe
-- filler for every future signup automatically.

COMMIT;
