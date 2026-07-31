import { BrandHeader, BrandFooter } from './parts.jsx'

function money(n, currency = 'RM') {
  return `${currency}${Number(n || 0).toFixed(2)}`
}

/**
 * Internal cost sheet — for kitchen management and price decisions.
 * Not for customers. Shows real numbers.
 */
export function CostBreakdown({ recipe, brand, styleVariant = 'clean-modern' }) {
  const currency = brand.currency || 'RM'
  const totalCost      = recipe.total_cost || 0
  const perPortion     = recipe.cost_per_portion || 0
  const suggestedPrice = recipe.suggested_price || 0
  const targetPct      = recipe.target_food_cost_pct || 30
  const currentMargin  = suggestedPrice > 0 ? Math.round(((suggestedPrice - perPortion) / suggestedPrice) * 100) : 0

  return (
    <div className={`tpl tpl-cost printable variant-${styleVariant}`} style={{ '--brand': brand.brand_color }}>
      <BrandHeader brand={brand} compact/>

      <div className="tpl-cost-title-row">
        <div>
          <h1 className="tpl-recipe-name">{recipe.name}</h1>
          <div className="tpl-recipe-meta">
            <span>Yields {recipe.yield_portions} portions</span>
            <span>Target {targetPct}% food cost</span>
          </div>
        </div>
        <div className="tpl-cost-headline">
          <div className="tpl-cost-headline-lbl">Suggested price / portion</div>
          <div className="tpl-cost-headline-val">{money(suggestedPrice, currency)}</div>
        </div>
      </div>

      <div className="tpl-section">
        <h2 className="tpl-section-title">Ingredients</h2>
        <table className="tpl-cost-table">
          <thead>
            <tr>
              <th>Ingredient</th>
              <th style={{textAlign:'right'}}>Qty</th>
              <th style={{textAlign:'right'}}>Unit cost</th>
              <th style={{textAlign:'right'}}>Line cost</th>
            </tr>
          </thead>
          <tbody>
            {recipe.lines.map((l, i) => (
              <tr key={i}>
                <td>{l.ingredient_name}</td>
                <td style={{textAlign:'right'}}>{l.qty} {l.unit || ''}</td>
                <td style={{textAlign:'right'}}>{l.unit_cost ? money(l.unit_cost, currency) : '—'}</td>
                <td style={{textAlign:'right', fontWeight:700}}>{money(l.cost, currency)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" style={{textAlign:'right', fontWeight:700}}>Total batch cost</td>
              <td style={{textAlign:'right', fontWeight:800}}>{money(totalCost, currency)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="tpl-cost-summary">
        <div className="tpl-cost-stat">
          <div className="tpl-cost-stat-lbl">Cost per portion</div>
          <div className="tpl-cost-stat-val">{money(perPortion, currency)}</div>
        </div>
        <div className="tpl-cost-stat">
          <div className="tpl-cost-stat-lbl">Suggested price</div>
          <div className="tpl-cost-stat-val" style={{color:'var(--brand)'}}>{money(suggestedPrice, currency)}</div>
        </div>
        <div className="tpl-cost-stat">
          <div className="tpl-cost-stat-lbl">Margin at suggested price</div>
          <div className="tpl-cost-stat-val" style={{color: currentMargin >= 60 ? '#34C77B' : currentMargin >= 40 ? '#F79C42' : '#E4405F'}}>
            {currentMargin}%
          </div>
        </div>
      </div>

      <div className="tpl-cost-note">
        <strong>Internal use only.</strong> Do not share with customers. Prices reflect current ingredient costs and may need refresh if supplier prices change.
      </div>

      <BrandFooter brand={brand}/>
    </div>
  )
}
