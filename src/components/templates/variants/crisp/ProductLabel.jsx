import { CrispBrandLockup, CrispFooter } from './_parts.jsx'

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
export function CrispProductLabel({ recipe = {}, brand = {} }) {
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
    <div className="tpl c-tpl c-label printable">
      <div className="c-label-topbar"/>

      <div className="c-label-body">
        <CrispBrandLockup brand={brand} size="sm" layout="row"/>

        <h2 className="c-label-product">{recipe.name || 'Product name'}</h2>

        <div className="c-eyebrow c-eyebrow-brown c-section-lbl">Ingredients</div>
        <div className="c-label-ingredients">{ingredientsSentence}</div>

        <div className="c-label-allergen">
          <div className="c-eyebrow c-eyebrow-brown">Allergen notice</div>
          <div className="c-label-allergen-body">{allergensText}</div>
        </div>

        <CrispFooter brand={brand} layout="minimal" showSocials/>
      </div>
    </div>
  )
}
