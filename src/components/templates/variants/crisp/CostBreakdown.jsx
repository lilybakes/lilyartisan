import { CrispBrandLockup, CrispRule, CrispFooter, crispMoney } from './_parts.jsx'

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
export function CrispCostBreakdown({ recipe = {}, brand = {} }) {
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
    <div className="tpl c-tpl c-cost printable">
      <header className="c-header">
        <CrispBrandLockup brand={brand} size="sm" layout="row"/>
      </header>

      <CrispRule/>

      <div className="c-cost-title-block">
        <div className="c-cost-title-left">
          <h2>{recipe.name || 'Recipe name'}</h2>
          <div className="c-cost-meta">
            {recipe.yield_portions && (
              <>Yield {recipe.yield_portions} slice{recipe.yield_portions === 1 ? '' : 's'}</>
            )}
            {targetFC ? <> · target food cost {targetFC}%</> : null}
          </div>
        </div>
        <div className="c-cost-suggested-box">
          <div className="c-eyebrow c-eyebrow-muted">Suggested / Portion</div>
          <div className="c-cost-suggested-value">{crispMoney(suggested)}</div>
        </div>
      </div>

      <table className="c-cost-table">
        <thead>
          <tr>
            <th>Ingredient</th>
            <th className="c-num">Qty</th>
            <th className="c-num">Unit Price</th>
            <th className="c-num">Cost</th>
          </tr>
        </thead>
        <tbody>
          {lines.length === 0 ? (
            <tr><td colSpan="4" className="c-cost-empty">
              No ingredients linked yet — add them via Recipe BOM.
            </td></tr>
          ) : lines.map((l, idx) => (
            <tr key={idx}>
              <td>{l.ingredient_name || 'Unknown'}</td>
              <td className="c-num">{l.qty}{l.unit ? ` ${l.unit}` : ''}</td>
              <td className="c-num">{currency} {Number(l.unit_cost || 0).toFixed(4)}</td>
              <td className="c-num c-cost-val">{Number(l.cost || 0).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        {lines.length > 0 && (
          <tfoot>
            <tr className="c-cost-batch-row">
              <td>Batch total</td>
              <td></td>
              <td></td>
              <td className="c-num">{crispMoney(total)}</td>
            </tr>
          </tfoot>
        )}
      </table>

      <div className="c-cost-stats">
        <div className="c-cost-stat">
          <div className="c-eyebrow c-eyebrow-muted">Cost / Portion</div>
          <div className="c-cost-stat-val">{crispMoney(perPortion)}</div>
        </div>
        <div className="c-cost-stat">
          <div className="c-eyebrow c-eyebrow-muted">Suggested Price</div>
          <div className="c-cost-stat-val c-brown">{crispMoney(suggested)}</div>
        </div>
        <div className="c-cost-stat">
          <div className="c-eyebrow c-eyebrow-muted">Margin</div>
          <div className="c-cost-stat-val c-green">{marginPct}%</div>
        </div>
      </div>

      <div className="c-cost-warning">Internal use only — not for customers.</div>

      <CrispFooter brand={brand} layout="split"/>
    </div>
  )
}
