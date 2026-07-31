import { BkoBrandLockup, BkoRule, BkoFooter, bkoMoney } from './_parts.jsx'

/**
 * 02 — COST BREAKDOWN  (A4 portrait, 210×297mm) — INTERNAL
 *
 * FIELD MAPPING:
 *   recipe.lines[]              — { ingredient_name, qty, unit, cost, unit_cost }
 *   recipe.total_cost           — batch total
 *   recipe.cost_per_portion     — computed from Templates.jsx enrichment
 *   recipe.suggested_price      — computed from target_food_cost_pct
 *   recipe.target_food_cost_pct — recipe's target FC% (or setting default)
 */
export function BkoCostBreakdown({ recipe = {}, brand = {} }) {
  const lines      = recipe.lines || []
  const currency    = brand.currency || 'RM'
  const total       = Number(recipe.total_cost)         || 0
  const perPortion  = Number(recipe.cost_per_portion)   || 0
  const suggested   = Number(recipe.suggested_price)    || 0
  const targetFC    = Number(recipe.target_food_cost_pct) || 30
  const marginPct   = suggested > 0
    ? Math.round(((suggested - perPortion) / suggested) * 100)
    : 0

  return (
    <div className="tpl b-tpl b-cost printable">
      <header className="b-header">
        <BkoBrandLockup brand={brand} size="sm" layout="row"/>
      </header>

      <BkoRule/>

      <div className="b-cost-title-block">
        <div className="b-cost-title-left">
          <h2>{recipe.name || 'Recipe name'}</h2>
          <div className="b-cost-meta">
            {recipe.yield_portions && (
              <>Yield {recipe.yield_portions} slice{recipe.yield_portions === 1 ? '' : 's'}</>
            )}
            {targetFC ? <> · target food cost {targetFC}%</> : null}
          </div>
        </div>
        <div className="b-cost-suggested-box">
          <div className="b-eyebrow b-eyebrow-muted">Suggested / Portion</div>
          <div className="b-cost-suggested-value">{bkoMoney(suggested)}</div>
        </div>
      </div>

      <table className="b-cost-table">
        <thead>
          <tr>
            <th>Ingredient</th>
            <th className="b-num">Qty</th>
            <th className="b-num">Unit Price</th>
            <th className="b-num">Cost</th>
          </tr>
        </thead>
        <tbody>
          {lines.length === 0 ? (
            <tr><td colSpan="4" className="b-cost-empty">
              No ingredients linked yet — add them via Recipe BOM.
            </td></tr>
          ) : lines.map((l, idx) => (
            <tr key={idx}>
              <td>{l.ingredient_name || 'Unknown'}</td>
              <td className="b-num">{l.qty}{l.unit ? ` ${l.unit}` : ''}</td>
              <td className="b-num">{currency} {Number(l.unit_cost || 0).toFixed(4)}</td>
              <td className="b-num b-cost-val">{Number(l.cost || 0).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        {lines.length > 0 && (
          <tfoot>
            <tr className="b-cost-batch-row">
              <td>Batch total</td>
              <td></td>
              <td></td>
              <td className="b-num">{bkoMoney(total)}</td>
            </tr>
          </tfoot>
        )}
      </table>

      <div className="b-cost-stats">
        <div className="b-cost-stat">
          <div className="b-eyebrow b-eyebrow-muted">Cost / Portion</div>
          <div className="b-cost-stat-val">{bkoMoney(perPortion)}</div>
        </div>
        <div className="b-cost-stat">
          <div className="b-eyebrow b-eyebrow-muted">Suggested Price</div>
          <div className="b-cost-stat-val b-accent">{bkoMoney(suggested)}</div>
        </div>
        <div className="b-cost-stat">
          <div className="b-eyebrow b-eyebrow-muted">Margin</div>
          <div className="b-cost-stat-val b-green">{marginPct}%</div>
        </div>
      </div>

      <div className="b-cost-warning">Internal use only — not for customers.</div>

      <BkoFooter brand={brand} layout="split"/>
    </div>
  )
}
