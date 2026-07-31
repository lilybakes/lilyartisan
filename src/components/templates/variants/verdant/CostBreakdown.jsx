import {
  VerdantBrandLockup, VerdantEyebrow, VerdantRule, VerdantHairRule,
  VerdantDecorCircle, VerdantFooter, verdantMoney, topContributors,
} from './_parts.jsx'

/**
 * 02 — COST BREAKDOWN  (A4 portrait, 210×297mm) — INTERNAL
 *
 * Top: brand + tagline left, COST ANALYSIS · INTERNAL small caps green right.
 * Thick green rule. Left: big serif title + small caps YIELD / TARGET line.
 * Right: rounded dark-green suggested-price card with SUGGESTED / PORTION
 * cream + big RM 10.00 cream + cream divider + Cost/portion + Margin lines.
 *
 * WHERE THE MONEY GOES — horizontal bar chart of top 4 contributors,
 * green-gradient bars over mint tracks, cost right-aligned bold serif.
 *
 * Full costing table: dark green header BAR with cream small caps text,
 * zebra rows (subtle mint alternating), sans names + numbers, batch total
 * bold. Rounded mint callout "Internal use only." Split footer.
 */
export function VerdantCostBreakdown({ recipe = {}, brand = {} }) {
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
  const yieldUnit = (recipe.category || '').toLowerCase() === 'bread'
    ? (y === 1 ? 'loaf' : 'loaves')
    : (y === 1 ? 'portion' : 'slices')

  const contributors = topContributors(lines, 4)

  return (
    <div className="tpl v-tpl v-cost printable">
      <header className="v-cost-header">
        <VerdantBrandLockup brand={brand} size="sm"/>
        <VerdantEyebrow className="v-cost-header-right">Cost Analysis · Internal</VerdantEyebrow>
      </header>

      <VerdantRule marginTop="0" marginBottom="0"/>

      <div className="v-cost-title-block">
        <div className="v-cost-title-left">
          <h2 className="v-title v-cost-title">{recipe.name || 'Recipe name'}</h2>
          <VerdantEyebrow tone="muted" className="v-cost-meta">
            Yield {y || 0} {yieldUnit} · Target Food Cost {targetFC}%
          </VerdantEyebrow>
        </div>
        <div className="v-cost-suggested-card">
          <VerdantDecorCircle size={120} bottom={-40} right={-30} tone="green-tint-on-green"/>
          <VerdantEyebrow tone="cream">Suggested / Portion</VerdantEyebrow>
          <div className="v-cost-suggested-value">{verdantMoney(suggested, { currency })}</div>
          <div className="v-cost-suggested-divider"/>
          <div className="v-cost-suggested-line">
            <span>Cost / portion</span>
            <span>{verdantMoney(perPortion, { currency })}</span>
          </div>
          <div className="v-cost-suggested-line">
            <span>Margin</span>
            <span>{marginPct}%</span>
          </div>
        </div>
      </div>

      {contributors.items.length > 0 && (
        <section className="v-cost-chart-section">
          <VerdantEyebrow>Where the Money Goes</VerdantEyebrow>
          <div className="v-cost-chart">
            {contributors.items.map((c, i) => (
              <div key={i} className="v-cost-chart-row">
                <div className="v-cost-chart-name">{c.name}</div>
                <div className="v-cost-chart-track">
                  <div className="v-cost-chart-fill" style={{ width: `${c.pct}%` }}/>
                </div>
                <div className="v-cost-chart-val">{verdantMoney(c.cost, { currency })}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="v-cost-table-section">
        <table className="v-cost-table">
          <thead>
            <tr>
              <th>Ingredient</th>
              <th className="v-num">Qty</th>
              <th className="v-num">Unit Price</th>
              <th className="v-num">Cost</th>
            </tr>
          </thead>
          <tbody>
            {lines.length === 0 ? (
              <tr><td colSpan="4" className="v-cost-empty">
                No ingredients linked yet — add them via Recipe BOM.
              </td></tr>
            ) : lines.map((l, idx) => (
              <tr key={idx}>
                <td className="v-cost-td-name">{l.ingredient_name || 'Unknown'}</td>
                <td className="v-num">{l.qty}{l.unit ? ` ${l.unit}` : ''}</td>
                <td className="v-num v-muted">{currency} {Number(l.unit_cost || 0).toFixed(2)}/{l.unit || 'unit'}</td>
                <td className="v-num v-cost-td-val">{Number(l.cost || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          {lines.length > 0 && (
            <tfoot>
              <tr className="v-cost-batch-row">
                <td>Batch total</td>
                <td></td>
                <td></td>
                <td className="v-num">{verdantMoney(total, { currency })}</td>
              </tr>
            </tfoot>
          )}
        </table>
      </section>

      <div className="v-cost-caution">
        <strong>Internal use only.</strong> This sheet carries supplier prices and margin — do not hand it to a customer.
      </div>

      <div className="v-cost-footer-wrap">
        <VerdantHairRule/>
        <VerdantFooter brand={brand} layout="split" showSocials={false}/>
      </div>
    </div>
  )
}
