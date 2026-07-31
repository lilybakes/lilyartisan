/**
 * Compact product label — allergens, ingredients, best-by. For packaging.
 * A7 sized when printed — 8 fit on an A4 sheet.
 */
export function ProductLabel({ recipe, brand, styleVariant = 'clean-modern' }) {
  const allergens = recipe.allergen_notice || brand.default_allergen_notice
  const ingredientsList = recipe.lines
    .map(l => l.ingredient_name)
    .filter(Boolean)
    .join(', ')

  const contactBits = []
  if (brand.contact_phone) contactBits.push(brand.contact_phone)
  if (brand.website)       contactBits.push(brand.website)
  if (brand.instagram)     contactBits.push('@' + brand.instagram)

  return (
    <div className={`tpl tpl-label printable variant-${styleVariant}`} style={{ '--brand': brand.brand_color }}>
      <div className="tpl-label-header">
        {brand.logo_data_url && <img src={brand.logo_data_url} alt="" className="tpl-label-logo"/>}
        <div className="tpl-label-header-text">
          <div className="tpl-label-brand">{brand.business_name || 'Your Bakery'}</div>
          {brand.tagline && <div className="tpl-label-tagline">{brand.tagline}</div>}
        </div>
      </div>

      <div className="tpl-label-product">{recipe.name}</div>

      {ingredientsList && (
        <div className="tpl-label-line">
          <strong>Ingredients:</strong> {ingredientsList}
        </div>
      )}

      {allergens && (
        <div className="tpl-label-allergens">
          {allergens}
        </div>
      )}

      <div className="tpl-label-footer">
        {contactBits.map((c, i) => <span key={i}>{c}</span>)}
      </div>
    </div>
  )
}
