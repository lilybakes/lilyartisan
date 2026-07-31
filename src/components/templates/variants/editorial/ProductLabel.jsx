import {
  EditorialLogo, EditorialEyebrow, EditorialRule, stylizeTitle,
} from './_parts.jsx'

/**
 * 04 — PRODUCT LABEL  (A7 portrait, 74×105mm) — packaging
 *
 * Top: brand name serif + tagline on left, small DC filled rust square on
 * right. Middle: full-width RUST midplate with product title (italic
 * accent) in cream. Below: cream body — INGREDIENTS rust eyebrow + list,
 * then cream-tinted allergen box with ALLERGEN NOTICE rust eyebrow. Thin
 * rule + small contact line.
 */
export function EditorialProductLabel({ recipe = {}, brand = {} }) {
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

  const contact = [brand.phone, brand.website].filter(Boolean).join(' · ')
  const socials = brand.instagram ? `@${brand.instagram}` : null

  return (
    <div className="tpl e-tpl e-label printable">
      <header className="e-label-header">
        <div className="e-label-brand-text">
          <h1 className="e-brand-name e-label-brand-name">{brand.business_name || 'Your Bakery'}</h1>
          {brand.tagline && <p className="e-brand-tagline e-label-brand-tag">{brand.tagline}</p>}
        </div>
        <EditorialLogo brand={brand} size="sm"/>
      </header>

      <div className="e-label-midplate">
        <h2 className="e-title e-label-product">
          {stylizeTitle(recipe.name || 'Product name')}
        </h2>
      </div>

      <div className="e-label-body">
        <EditorialEyebrow tone="rust">Ingredients</EditorialEyebrow>
        <p className="e-label-ingredients">{ingredientsSentence}</p>

        <div className="e-label-allergen">
          <EditorialEyebrow tone="rust">Allergen Notice</EditorialEyebrow>
          <p className="e-label-allergen-body">{allergensText}</p>
        </div>
      </div>

      <EditorialRule tone="black" weight="hair" marginTop="auto"/>

      <div className="e-label-footer">
        {[contact, socials].filter(Boolean).map((s, i) => (
          <span key={i}>
            {i > 0 && ' · '}
            <span className={s === socials ? 'e-footer-social' : ''}>{s}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
