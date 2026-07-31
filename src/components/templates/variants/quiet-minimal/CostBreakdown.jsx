import {
  QuietBrandLockup, QuietEyebrow, QuietDot, QuietRule, QuietFooter,
  QuietQty, quietMoney,
} from './_parts.jsx'

/**
 * 02 — COST BREAKDOWN  (A4 portrait, 210×297mm) — INTERNAL
 *
 * Top: DC + brand left, COST ANALYSIS · INTERNAL mono right.
 * Rust-dot + title left, YIELD 10 · TARGET FOOD COST 30% mono meta below.
 * Right: SUGGESTED / PORTION mono eyebrow + RM 10.00 mono rust large.
 * Full-width table: INGREDIENT / QTY / UNIT PRICE / COST mono headers,
 * hairline dividers, sans names, mono numbers. Batch total row.
 * Below: 3 stats — COST/PORTION · SUGGESTED · MARGIN — mono.
 * "INTERNAL USE ONLY" mono caption, hairline, split footer.
 */
export function QuietCostBreakdown({ recipe = {}, brand = {} }) {
  const lines      = recipe.lines || []
  const currency   = brand.currency || 'RM'
  const total      = Number(recipe.total_cost)         || 0
  const perPortion = Number(recipe.cost_per_portion)   || 0
  const suggested  = Number(recipe.suggested_price)    || 0
  const targetFC   = Number(recipe.target_food_cost_pct) || 30
  const marginPct  = suggested > 0
    ? Math.round(((suggested - perPortion) / suggested) * 100)
    : 0

  return (
    <div className="tpl q-tpl q-cost printable">
      <header className="q-cost-header">
        <QuietBrandLockup brand={brand} size="sm" layout="inline"/>
        <QuietEyebrow className="q-cost-header-right">Cost Analysis · Internal</QuietEyebrow>
      </header>

      <div className="q-cost-title-block">
        <div className="q-cost-title-left">
          <div className="q-cost-title-line">
            <QuietDot/>
            <h2 className="q-title q-cost-title">{recipe.name || 'Recipe name'}</h2>
          </div>
          <QuietEyebrow className="q-cost-meta">
            YIELD {recipe.yield_portions || 0} · TARGET FOOD COST {targetFC}%
          </QuietEyebrow>
        </div>
        <div className="q-cost-suggested-block">
          <QuietEyebrow>Suggested / Portion</QuietEyebrow>
          <div className="q-cost-suggested-value">{quietMoney(suggested, { currency })}</div>
        </div>
      </div>

      <QuietRule marginTop="4mm" marginBottom="0"/>

      <table className="q-cost-table">
        <thead>
          <tr>
            <th>Ingredient</th>
            <th className="q-num">Qty</th>
            <th className="q-num">Unit Price</th>
            <th className="q-num">Cost</th>
          </tr>
        </thead>
        <tbody>
          {lines.length === 0 ? (
            <tr><td colSpan="4" className="q-cost-empty">
              No ingredients linked yet — add them via Recipe BOM.
            </td></tr>
          ) : lines.map((l, idx) => (
            <tr key={idx}>
              <td className="q-cost-name">{l.ingredient_name || 'Unknown'}</td>
              <td className="q-num"><QuietQty qty={l.qty} unit={l.unit}/></td>
              <td className="q-num q-muted">{Number(l.unit_cost || 0).toFixed(2)}/{l.unit || 'unit'}</td>
              <td className="q-num q-cost-val">{Number(l.cost || 0).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        {lines.length > 0 && (
          <tfoot>
            <tr className="q-cost-batch-row">
              <td>Batch total</td>
              <td></td>
              <td></td>
              <td className="q-num">{Number(total).toFixed(2)}</td>
            </tr>
          </tfoot>
        )}
      </table>

      <div className="q-cost-stats-row">
        <div className="q-cost-stat">
          <QuietEyebrow>Cost / Portion</QuietEyebrow>
          <div className="q-cost-stat-val">{quietMoney(perPortion, { currency })}</div>
        </div>
        <div className="q-cost-stat">
          <QuietEyebrow>Suggested</QuietEyebrow>
          <div className="q-cost-stat-val q-rust">{quietMoney(suggested, { currency })}</div>
        </div>
        <div className="q-cost-stat">
          <QuietEyebrow>Margin</QuietEyebrow>
          <div className="q-cost-stat-val">{marginPct}%</div>
        </div>
      </div>

      <QuietEyebrow className="q-cost-caution">Internal use only</QuietEyebrow>

      <div className="q-cost-footer-wrap">
        <QuietRule marginBottom="4mm"/>
        <QuietFooter brand={brand} layout="split" showSocials={false}/>
      </div>
    </div>
  )
}
