import { BrandHeader } from './parts.jsx'

/**
 * Compact product label — allergens, ingredients, best-by. For packaging.
 * A7 sized when printed — 8 fit on an A4 sheet.
 */
export function ProductLabel({ recipe, brand }) {
  const allergens = recipe.allergen_notice || brand.default_allergen_notice
  const ingredientsList = recipe.lines
    .map(l => l.ingredient_name)
    .filter(Boolean)
    .join(', ')

  return (
    <div className="tpl tpl-label printable" style={{ '--brand': brand.brand_color }}>
      <div className="tpl-label-header">
        {brand.logo_data_url && <img src={brand.logo_data_url} alt="" className="tpl-label-logo"/>}
        <div className="tpl-label-brand">{brand.business_name || 'Your Bakery'}</div>
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
        {brand.contact_phone && <span>{brand.contact_phone}</span>}
        {brand.website && <span>{brand.website}</span>}
      </div>
    </div>
  )
}
