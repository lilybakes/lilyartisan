import {
  EmberBrandLockup, EmberEyebrow, EmberRule, EmberFooter,
  emberMoney, topContributors,
} from './_parts.jsx'

/**
 * 02 — COST BREAKDOWN  (A4 portrait, 210×297mm) — INTERNAL
 *
 * Header: brand heavy condensed uppercase black + muted tagline left,
 * filled ember-red pill COST ANALYSIS · INTERNAL right. Thick black rule.
 *
 * Title block: massive title left + YIELD / TARGET small caps muted below;
 * filled deep-burgundy suggested-price card right with SUGGESTED / PORTION
 * cream + huge condensed RM 10.00 cream + cream divider + Cost/portion +
 * Margin lines.
 *
 * WHERE THE MONEY GOES — horizontal bar chart of top 4 contributors,
 * burgundy→red→orange gradient bars over cream tint tracks, cost right in
 * bold sans.
 *
 * Full costing table: filled NEAR-BLACK header bar with cream small caps
 * text, subtle warm-cream zebra alternates. BATCH TOTAL bold left + big
 * ember amount right.
 *
 * Bottom: FULL-WIDTH near-black bar with "Internal use only." ember + rest
 * cream sans — signature Ember industrial move.
 */
export function EmberCostBreakdown({ recipe = {}, brand = {} }) {
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
    <div className="tpl em-tpl em-cost printable">
      <header className="em-cost-header">
        <EmberBrandLockup brand={brand} size="sm"/>
        <div className="em-cost-header-pill">
          <EmberEyebrow tone="cream">Cost Analysis · Internal</EmberEyebrow>
        </div>
      </header>

      <EmberRule/>

      <div className="em-cost-title-block">
        <div className="em-cost-title-left">
          <h2 className="em-title em-cost-title">{(recipe.name || 'Recipe name').toUpperCase()}</h2>
          <EmberEyebrow tone="muted" className="em-cost-meta">
            Yield {y || 0} {yieldUnit} · Target Food Cost {targetFC}%
          </EmberEyebrow>
        </div>
        <div className="em-cost-suggested-card">
          <EmberEyebrow tone="cream">Suggested / Portion</EmberEyebrow>
          <div className="em-cost-suggested-value">{emberMoney(suggested, { currency })}</div>
          <div className="em-cost-suggested-divider"/>
          <div className="em-cost-suggested-line">
            <span>Cost / portion</span>
            <span>{emberMoney(perPortion, { currency })}</span>
          </div>
          <div className="em-cost-suggested-line">
            <span>Margin</span>
            <span>{marginPct}%</span>
          </div>
        </div>
      </div>

      {contributors.items.length > 0 && (
        <section className="em-cost-chart-section">
          <EmberEyebrow>Where the Money Goes</EmberEyebrow>
          <div className="em-cost-chart">
            {contributors.items.map((c, i) => (
              <div key={i} className="em-cost-chart-row">
                <div className="em-cost-chart-name">{c.name}</div>
                <div className="em-cost-chart-track">
                  <div className="em-cost-chart-fill" style={{ width: `${c.pct}%` }}/>
                </div>
                <div className="em-cost-chart-val">{emberMoney(c.cost, { currency })}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="em-cost-table-section">
        <table className="em-cost-table">
          <thead>
            <tr>
              <th>Ingredient</th>
              <th className="em-num">Qty</th>
              <th className="em-num">Unit Price</th>
              <th className="em-num">Cost</th>
            </tr>
          </thead>
          <tbody>
            {lines.length === 0 ? (
              <tr><td colSpan="4" className="em-cost-empty">
                No ingredients linked yet — add them via Recipe BOM.
              </td></tr>
            ) : lines.map((l, idx) => (
              <tr key={idx}>
                <td className="em-cost-td-name">{l.ingredient_name || 'Unknown'}</td>
                <td className="em-num">{l.qty}{l.unit ? ` ${l.unit}` : ''}</td>
                <td className="em-num em-muted">{currency} {Number(l.unit_cost || 0).toFixed(2)}/{l.unit || 'unit'}</td>
                <td className="em-num em-cost-td-val">{Number(l.cost || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          {lines.length > 0 && (
            <tfoot>
              <tr className="em-cost-batch-row">
                <td>Batch total</td>
                <td></td>
                <td></td>
                <td className="em-num">{emberMoney(total, { currency })}</td>
              </tr>
            </tfoot>
          )}
        </table>
      </section>

      <div className="em-cost-caution-bar">
        <span className="em-cost-caution-lead">Internal use only.</span>
        <span className="em-cost-caution-body">
          This sheet carries supplier prices and margin — do not hand it to a customer.
        </span>
      </div>

      <div className="em-cost-footer-wrap">
        <EmberFooter brand={brand} layout="split" showSocials={false}/>
      </div>
    </div>
  )
}
