import { WaxSeal } from './ornaments.jsx'

/**
 * Product Label — "Apothecary Jar"
 * Compact, cream, serif, wax seal, oval border feel.
 */
export function ProductLabel({ recipe, brand }) {
  const allergens = recipe.allergen_notice || brand.default_allergen_notice
  const ingredientsList = recipe.lines
    .map(l => l.ingredient_name)
    .filter(Boolean)
    .join(' · ')

  return (
    <div className="tpl tpl-label-v2 printable" style={{ '--brand': brand.brand_color }}>
      {/* Outer decorative frame */}
      <div className="tpl-label-v2-frame">
        {/* Wax seal top */}
        <div className="tpl-label-v2-seal">
          <WaxSeal size={44} initials={brand.business_name}/>
        </div>

        {/* Brand strip */}
        <div className="tpl-label-v2-brand">
          <div className="tpl-label-v2-brand-est">EST.</div>
          <div className="tpl-label-v2-brand-name">{brand.business_name || 'Your Bakery'}</div>
          {brand.tagline && <div className="tpl-label-v2-brand-tag">{brand.tagline}</div>}
        </div>

        <div className="tpl-label-v2-rule"/>

        {/* Product name */}
        <div className="tpl-label-v2-product-eyebrow">Handcrafted</div>
        <h1 className="tpl-label-v2-product">{recipe.name}</h1>

        <div className="tpl-label-v2-rule"/>

        {/* Ingredients */}
        {ingredientsList && (
          <div className="tpl-label-v2-ing">
            <span className="tpl-label-v2-ing-label">Ingredients — </span>
            {ingredientsList}
          </div>
        )}

        {/* Allergens box */}
        {allergens && (
          <div className="tpl-label-v2-allergens">
            {allergens}
          </div>
        )}

        {/* Contact */}
        <div className="tpl-label-v2-contact">
          {brand.contact_phone && <span>{brand.contact_phone}</span>}
          {brand.instagram     && <span>@{brand.instagram}</span>}
          {brand.website       && <span>{brand.website}</span>}
        </div>
      </div>
    </div>
  )
}
