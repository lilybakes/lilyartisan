import { BkoBrandLockup, BkoFooter } from './_parts.jsx'

/**
 * 04 — PRODUCT LABEL  (A7 portrait, 74×105mm) — packaging
 *
 * FIELD MAPPING:
 *   Ingredients sentence = recipe.label_ingredients_text
 *                        ↓ ingredient names from recipe.lines (joined)
 *                        ↓ hard fallback
 *   Allergen sentence    = recipe.label_allergens_text
 *                        ↓ recipe.allergens_text
 *                        ↓ brand.default_allergen_notice
 *                        ↓ hard fallback
 */
export function BkoProductLabel({ recipe = {}, brand = {} }) {
  const lines = recipe.lines || []

  const ingredientsSentence =
    (recipe.label_ingredients_text && recipe.label_ingredients_text.trim()) ||
    (lines.length > 0 ? lines.map(l => l.ingredient_name).filter(Boolean).join(', ') + '.' : 'See recipe.')

  const allergensText =
    recipe.label_allergens_text ||
    recipe.allergens_text ||
    brand.default_allergen_notice ||
    'See label for allergens.'

  return (
    <div className="tpl b-tpl b-label printable">
      <div className="b-label-topbar"/>

      <div className="b-label-body">
        <BkoBrandLockup brand={brand} size="sm" layout="row"/>

        <h2 className="b-label-product">{recipe.name || 'Product name'}</h2>

        <div className="b-eyebrow b-eyebrow-accent b-section-lbl">Ingredients</div>
        <div className="b-label-ingredients">{ingredientsSentence}</div>

        <div className="b-label-allergen">
          <div className="b-eyebrow b-eyebrow-accent">Allergen notice</div>
          <div className="b-label-allergen-body">{allergensText}</div>
        </div>

        <BkoFooter brand={brand} layout="minimal" showSocials/>
      </div>
    </div>
  )
}
