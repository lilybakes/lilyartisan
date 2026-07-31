import {
  AuBrandLockup, AuEyebrow, AuRule, AuFooter,
  auMoney,
} from './_parts.jsx'

/**
 * 02 — COST SHEET  (A4 portrait, 210×297mm) — INTERNAL
 *
 * Thin full-width gradient band at the top (~15mm) with brand info left
 * and COST ANALYSIS · INTERNAL eyebrow right, both in white. Below on
 * lavender paper: massive Manrope extrabold title, and a top-right
 * GRADIENT-FILLED price card (~62mm × ~52mm rounded 4mm) with huge white
 * suggested price, hairline divider, and cost/portion + margin lines.
 *
 * Ingredient table with hairline separators. Then the "WHERE THE MONEY
 * GOES" signature — 4 horizontal gradient-filled bars showing top
 * ingredient contributors, name-left, RM-right. Bold caution line +
 * split footer.
 */
export function AuCostBreakdown({ recipe = {}, brand = {} }) {
  const lines      = recipe.lines || []
  const currency   = brand.currency || 'RM'
  const total      = Number(recipe.total_cost)         || 0
  const perPortion = Number(recipe.cost_per_portion)   || 0
  const suggested  = Number(recipe.suggested_price)    || 0
  const targetFC   = Number(recipe.target_food_cost_pct) || 30
  const marginPct  = suggested > 0
    ? Math.round(((suggested - perPortion) / suggested) * 100)
    : 0

  const y = Number(recipe.yield_portions) || 0

  // Top 4 contributors for the gradient bar chart
  const contributors = [...lines]
    .map(l => ({ name: l.ingredient_name || 'Unknown', cost: Number(l.cost) || 0 }))
    .sort((a, b) => b.cost - a.cost)
    .slice(0, 4)
  const maxCost = contributors.length > 0 ? Math.max(...contributors.map(c => c.cost)) : 0

  return (
    <div className="tpl au-tpl au-cost printable">
      <header className="au-cost-header">
        <AuBrandLockup brand={brand} size="sm" tone="cream"/>
        <div className="au-cost-header-right">COST ANALYSIS · INTERNAL</div>
      </header>

      <div className="au-cost-body">
        <div className="au-cost-top-row">
          <div className="au-cost-title-block">
            <AuEyebrow tone="purple" className="au-cost-eyebrow">Cost Sheet</AuEyebrow>
            <h2 className="au-title au-cost-title">{(recipe.name || 'Recipe name').toUpperCase()}</h2>
            <div className="au-cost-meta">
              <span>YIELD {y || '—'}</span>
              <span className="au-cost-meta-sep">·</span>
              <span>TARGET FOOD COST {targetFC}%</span>
            </div>
          </div>

          <aside className="au-cost-price-card">
            <div className="au-cost-price-eyebrow">SUGGESTED / PORTION</div>
            <div className="au-cost-price-val">{auMoney(suggested, { currency })}</div>
            <div className="au-cost-price-divider"/>
            <div className="au-cost-price-line">
              <span>Cost / portion</span>
              <span>{auMoney(perPortion, { currency })}</span>
            </div>
            <div className="au-cost-price-line">
              <span>Margin</span>
              <span>{marginPct}%</span>
            </div>
          </aside>
        </div>

        <table className="au-cost-table">
          <thead>
            <tr>
              <th>Ingredient</th>
              <th className="au-num">Qty</th>
              <th className="au-num">Unit Price</th>
              <th className="au-num">Cost</th>
            </tr>
          </thead>
          <tbody>
            {lines.length === 0 ? (
              <tr><td colSpan="4" className="au-cost-empty">
                No ingredients linked yet — add them via Recipe BOM.
              </td></tr>
            ) : lines.map((l, idx) => (
              <tr key={idx}>
                <td className="au-cost-td-name">{(l.ingredient_name || 'Unknown').toUpperCase()}</td>
                <td className="au-num">{l.qty}{l.unit ? ` ${l.unit.toUpperCase()}` : ''}</td>
                <td className="au-num au-muted">
                  {Number(l.unit_cost || 0).toFixed(2)} / {(l.unit || 'unit').toUpperCase()}
                </td>
                <td className="au-num au-cost-td-val">{Number(l.cost || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          {lines.length > 0 && (
            <tfoot>
              <tr className="au-cost-batch-row">
                <td>Batch total</td>
                <td></td>
                <td></td>
                <td className="au-num">{auMoney(total, { currency })}</td>
              </tr>
            </tfoot>
          )}
        </table>

        {contributors.length > 0 && (
          <section className="au-cost-chart">
            <AuEyebrow tone="purple" className="au-cost-chart-eyebrow">Where the money goes</AuEyebrow>
            <div className="au-cost-bars">
              {contributors.map((c, i) => {
                const pct = maxCost > 0 ? (c.cost / maxCost) * 100 : 0
                return (
                  <div key={i} className="au-cost-bar-row">
                    <div className="au-cost-bar-name">{c.name.toUpperCase()}</div>
                    <div className="au-cost-bar-track">
                      <div className="au-cost-bar-fill" style={{ width: `${pct}%` }}/>
                    </div>
                    <div className="au-cost-bar-val">{auMoney(c.cost, { bare: true })}</div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        <div className="au-cost-caution">
          <strong>Do not give this sheet to a customer.</strong>{' '}
          It carries supplier prices and margin.
        </div>

        <div className="au-cost-footer-wrap">
          <AuRule marginBottom="4mm"/>
          <AuFooter brand={brand} layout="split" showSocials={false}/>
        </div>
      </div>
    </div>
  )
}
