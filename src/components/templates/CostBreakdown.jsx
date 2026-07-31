/**
 * Cost Breakdown — "Startup Dashboard"
 * Clean sans-serif, colored metric cards, live-report vibe.
 */
function money(n, currency = 'RM') {
  return `${currency}${Number(n || 0).toFixed(2)}`
}

export function CostBreakdown({ recipe, brand }) {
  const currency = brand.currency || 'RM'
  const total    = recipe.total_cost || 0
  const per      = recipe.cost_per_portion || 0
  const suggest  = recipe.suggested_price || 0
  const target   = recipe.target_food_cost_pct || 30
  const margin   = suggest > 0 ? Math.round(((suggest - per) / suggest) * 100) : 0
  const maxCost  = Math.max(1, ...recipe.lines.map(l => l.cost || 0))

  // Sort lines by cost descending for the bar chart feel
  const sortedLines = [...recipe.lines].sort((a, b) => (b.cost || 0) - (a.cost || 0))

  return (
    <div className="tpl tpl-cost-v2 printable" style={{ '--brand': brand.brand_color }}>
      {/* Top strip */}
      <div className="tpl-cost-v2-top">
        <div className="tpl-cost-v2-top-brand">
          {brand.logo_data_url && <img src={brand.logo_data_url} alt="" className="tpl-cost-v2-logo"/>}
          <div>
            <div className="tpl-cost-v2-brand-name">{brand.business_name || 'Your Bakery'}</div>
            <div className="tpl-cost-v2-report-label">Cost Analysis Report</div>
          </div>
        </div>
        <div className="tpl-cost-v2-report-meta">
          <div className="tpl-cost-v2-report-date">{new Date().toLocaleDateString(undefined, { year:'numeric', month:'short', day:'numeric' })}</div>
          <div className="tpl-cost-v2-report-recipe">{recipe.name}</div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="tpl-cost-v2-kpi-row">
        <div className="tpl-cost-v2-kpi tpl-cost-v2-kpi-a">
          <div className="tpl-cost-v2-kpi-label">Cost per portion</div>
          <div className="tpl-cost-v2-kpi-value">{money(per, currency)}</div>
          <div className="tpl-cost-v2-kpi-sub">across {recipe.yield_portions} portions</div>
        </div>
        <div className="tpl-cost-v2-kpi tpl-cost-v2-kpi-b">
          <div className="tpl-cost-v2-kpi-label">Suggested price</div>
          <div className="tpl-cost-v2-kpi-value" style={{color:'var(--brand)'}}>{money(suggest, currency)}</div>
          <div className="tpl-cost-v2-kpi-sub">target {target}% food cost</div>
        </div>
        <div className="tpl-cost-v2-kpi tpl-cost-v2-kpi-c">
          <div className="tpl-cost-v2-kpi-label">Margin</div>
          <div className="tpl-cost-v2-kpi-value" style={{
            color: margin >= 60 ? '#0EA968' : margin >= 40 ? '#E39013' : '#DC3E4F'
          }}>{margin}%</div>
          <div className="tpl-cost-v2-kpi-sub">healthy above 60%</div>
        </div>
      </div>

      {/* Breakdown chart + table */}
      <div className="tpl-cost-v2-panel">
        <div className="tpl-cost-v2-panel-head">
          <div className="tpl-cost-v2-panel-title">Ingredient breakdown</div>
          <div className="tpl-cost-v2-panel-total">
            Batch <strong>{money(total, currency)}</strong>
          </div>
        </div>
        <div className="tpl-cost-v2-lines">
          {sortedLines.map((l, i) => {
            const pct = ((l.cost || 0) / total * 100)
            return (
              <div key={i} className="tpl-cost-v2-line">
                <div className="tpl-cost-v2-line-name">{l.ingredient_name}</div>
                <div className="tpl-cost-v2-line-qty">{l.qty} {l.unit || ''}</div>
                <div className="tpl-cost-v2-line-bar">
                  <div className="tpl-cost-v2-line-bar-fill" style={{width: `${(l.cost || 0) / maxCost * 100}%`}}/>
                </div>
                <div className="tpl-cost-v2-line-cost">{money(l.cost, currency)}</div>
                <div className="tpl-cost-v2-line-pct">{pct.toFixed(1)}%</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Fine print */}
      <div className="tpl-cost-v2-note">
        Internal cost analysis. Prices reflect current supplier costs. Refresh when suppliers change.
      </div>

      <footer className="tpl-cost-v2-footer">
        <span>{brand.business_name}</span>
        {brand.contact_email && <span>{brand.contact_email}</span>}
        {brand.website && <span>{brand.website}</span>}
      </footer>
    </div>
  )
}
