import { BrandHeader, BrandFooter } from './parts.jsx'

/**
 * Traditional recipe card. Ingredients list + yield + brand.
 * Sized for A5 portrait when printed.
 */
export function ClassicRecipeCard({ recipe, brand, styleVariant = 'clean-modern' }) {
  return (
    <div className={`tpl tpl-classic printable variant-${styleVariant}`} style={{ '--brand': brand.brand_color }}>
      <BrandHeader brand={brand}/>

      <div className="tpl-classic-body">
        <h1 className="tpl-recipe-name">{recipe.name}</h1>
        <div className="tpl-recipe-meta">
          <span className="tpl-recipe-meta-chip">Yields {recipe.yield_portions} portions</span>
          {recipe.category && <span className="tpl-recipe-meta-chip">{recipe.category}</span>}
        </div>

        <div className="tpl-section">
          <h2 className="tpl-section-title">Ingredients</h2>
          <div className="tpl-ingredients-list">
            {recipe.lines.map((l, i) => (
              <div key={i} className="tpl-ingredient-row">
                <span className="tpl-ing-qty">{l.qty} {l.unit || ''}</span>
                <span className="tpl-ing-name">{l.ingredient_name}</span>
              </div>
            ))}
            {recipe.lines.length === 0 && (
              <p className="tpl-empty">No ingredients added to this recipe.</p>
            )}
          </div>
        </div>

        {recipe.method && (
          <div className="tpl-section">
            <h2 className="tpl-section-title">Method</h2>
            <div className="tpl-method">{recipe.method}</div>
          </div>
        )}
      </div>

      <BrandFooter brand={brand}/>
    </div>
  )
}
