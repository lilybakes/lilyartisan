import { LetterpressLogo } from './_parts.jsx'

/**
 * 04 — PRODUCT LABEL  (A7 portrait, 74×105mm) — packaging
 *
 * Thin double border. Brand top, product name inside an OVAL outline
 * (Letterpress signature move), ingredients as a centered paragraph,
 * ALLERGEN NOTICE in a subtly-tinted cream box, small DC in a CIRCLE
 * at the bottom (not square — different geometry per Letterpress rules).
 */
export function LetterpressProductLabel({ recipe = {}, brand = {} }) {
  const lines = recipe.lines || []

  const ingredientsSentence =
    (recipe.label_ingredients_text && recipe.label_ingredients_text.trim()) ||
    (lines.length > 0
      ? lines.map(l => l.ingredient_name).filter(Boolean).join(', ') + '.'
      : 'See recipe.')

  const allergensText =
    recipe.label_allergens_text ||
    recipe.allergens_text ||
    brand.default_allergen_notice ||
    'See label for allergens.'

  const contact = [brand?.phone, brand?.website].filter(Boolean).join(' · ')

  return (
    <div className="tpl l-tpl l-label printable">
      <div className="l-label-border">
        <div className="l-label-inner">
          <h1 className="l-brand-name l-label-brand-name">{brand.business_name || 'Your Bakery'}</h1>
          {brand.tagline && <p className="l-brand-tagline l-label-brand-tag">{brand.tagline}</p>}

          <div className="l-label-name-oval">
            <h2 className="l-label-product">{recipe.name || 'Product name'}</h2>
          </div>

          <div className="l-eyebrow l-eyebrow-burgundy l-label-section-lbl">Ingredients</div>
          <p className="l-label-ingredients">{ingredientsSentence}</p>

          <div className="l-label-rule"/>

          <div className="l-label-allergen">
            <div className="l-eyebrow l-eyebrow-burgundy">Allergen Notice</div>
            <p className="l-label-allergen-body">{allergensText}</p>
          </div>

          <div className="l-label-monogram-wrap">
            <LetterpressLogo brand={brand} size="sm" shape="circle"/>
          </div>

          <div className="l-label-footer">
            {contact && <div className="l-eyebrow l-eyebrow-muted l-label-footer-line">{contact}</div>}
            {brand.instagram && (
              <div className="l-eyebrow l-eyebrow-burgundy l-label-footer-line">@{brand.instagram}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
