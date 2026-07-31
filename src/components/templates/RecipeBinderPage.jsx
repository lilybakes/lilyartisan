import { BrandHeader, BrandFooter } from './parts.jsx'

function money(n, currency = 'RM') {
  return `${currency}${Number(n || 0).toFixed(2)}`
}

/**
 * A4 detailed recipe binder page — for the kitchen binder.
 * Includes photo slot, full ingredient table with quantities AND costs,
 * method, and a notes section for chef comments.
 */
export function RecipeBinderPage({ recipe, brand }) {
  const currency = brand.currency || 'RM'
  return (
    <div className="tpl tpl-binder printable" style={{ '--brand': brand.brand_color }}>
      <BrandHeader brand={brand} compact/>

      <div className="tpl-binder-title-row">
        <div>
          <h1 className="tpl-binder-name">{recipe.name}</h1>
          {recipe.description && <p className="tpl-binder-desc">{recipe.description}</p>}
          <div className="tpl-binder-meta">
            <span><strong>Category</strong> {recipe.category || '—'}</span>
            <span><strong>Yield</strong> {recipe.yield_portions} portions</span>
            <span><strong>Cost / portion</strong> {money(recipe.cost_per_portion, currency)}</span>
            <span><strong>Sell / portion</strong> {money(recipe.suggested_price, currency)}</span>
          </div>
        </div>
        <div className="tpl-binder-photo">
          {recipe.image_url ? (
            <img src={recipe.image_url} alt=""/>
          ) : (
            <div className="tpl-binder-photo-empty">📷<br/><span>Photo</span></div>
          )}
        </div>
      </div>

      <div className="tpl-binder-columns">
        <div className="tpl-binder-col">
          <h2 className="tpl-section-title">Ingredients</h2>
          <table className="tpl-binder-ing-table">
            <thead>
              <tr>
                <th>Ingredient</th>
                <th style={{textAlign:'right'}}>Qty</th>
                <th style={{textAlign:'right'}}>Cost</th>
              </tr>
            </thead>
            <tbody>
              {recipe.lines.map((l, i) => (
                <tr key={i}>
                  <td>{l.ingredient_name}</td>
                  <td style={{textAlign:'right'}}>{l.qty} {l.unit || ''}</td>
                  <td style={{textAlign:'right'}}>{money(l.cost, currency)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="2" style={{textAlign:'right', fontWeight:700}}>Batch total</td>
                <td style={{textAlign:'right', fontWeight:800, color:'var(--brand)'}}>{money(recipe.total_cost, currency)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="tpl-binder-col">
          <h2 className="tpl-section-title">Method</h2>
          <div className="tpl-binder-method">
            {recipe.method || <span className="tpl-empty">No method recorded. Add one on the recipe detail page.</span>}
          </div>
        </div>
      </div>

      <div className="tpl-binder-notes">
        <h2 className="tpl-section-title">Chef's notes</h2>
        <div className="tpl-binder-notes-lines">
          {[1,2,3,4,5,6].map(i => <div key={i} className="tpl-binder-notes-line"/>)}
        </div>
      </div>

      <BrandFooter brand={brand}/>
    </div>
  )
}
