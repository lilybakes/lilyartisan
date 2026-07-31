import { KraftBrandLockup, KraftDoubleRule, KraftFooter, kraftMoney } from './_parts.jsx'

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
export function KraftCostBreakdown({ recipe = {}, brand = {} }) {
  const lines           = recipe.lines || []
  const currency        = brand.currency || 'RM'
  const total           = Number(recipe.total_cost)         || 0
  const perPortion      = Number(recipe.cost_per_portion)   || 0
  const suggested       = Number(recipe.suggested_price)    || 0
  const targetFC        = Number(recipe.target_food_cost_pct) || 30
  const marginPct       = suggested > 0
    ? Math.round(((suggested - perPortion) / suggested) * 100)
    : 0

  return (
    <div className="tpl k-tpl k-cost printable">
      <header className="k-cost-header">
        <KraftBrandLockup brand={brand} size="md" layout="row"/>
        <div className="k-cost-header-right">Costing Ledger · Internal</div>
      </header>

      <KraftDoubleRule/>

      <div className="k-cost-title-block">
        <div className="k-cost-title-left">
          <h2>{recipe.name || 'Recipe name'}</h2>
          <div className="k-cost-meta">
            {recipe.yield_portions && (
              <>Yield {recipe.yield_portions} portion{recipe.yield_portions === 1 ? '' : 's'}</>
            )}
            {targetFC ? <> · target food cost {targetFC}%</> : null}
          </div>
        </div>
        <div className="k-cost-suggested-box">
          <div className="k-eyebrow">Suggested / Portion</div>
          <div className="k-cost-suggested-value">{kraftMoney(suggested)}</div>
        </div>
      </div>

      <table className="k-cost-table">
        <thead>
          <tr>
            <th>Ingredient</th>
            <th className="k-num">Qty</th>
            <th className="k-num">Unit Cost</th>
            <th className="k-num">Line Cost</th>
          </tr>
        </thead>
        <tbody>
          {lines.length === 0 ? (
            <tr><td colSpan="4" style={{ padding: '8mm 0', color: 'var(--k-muted)', fontStyle: 'italic' }}>
              No ingredients linked yet — add them via Recipe BOM.
            </td></tr>
          ) : lines.map((l, idx) => (
            <tr key={idx}>
              <td>{l.ingredient_name || 'Unknown'}</td>
              <td className="k-num">{l.qty}{l.unit ? ` ${l.unit}` : ''}</td>
              <td className="k-num">{currency} {Number(l.unit_cost || 0).toFixed(4)}</td>
              <td className="k-num k-cost-val">{Number(l.cost || 0).toFixed(2)}</td>
            </tr>
          ))}
          {lines.length > 0 && (
            <tr className="k-cost-batch-row">
              <td>Batch total</td>
              <td></td>
              <td></td>
              <td className="k-num">{kraftMoney(total)}</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="k-cost-stats">
        <div className="k-cost-stat">
          <div className="k-eyebrow k-cost-stat-lbl">Cost / Portion</div>
          <div className="k-cost-stat-val">{kraftMoney(perPortion)}</div>
        </div>
        <div className="k-cost-stat k-cost-stat-suggested">
          <div className="k-eyebrow k-cost-stat-lbl">Suggested Price</div>
          <div className="k-cost-stat-val">{kraftMoney(suggested)}</div>
        </div>
        <div className="k-cost-stat k-cost-stat-margin">
          <div className="k-eyebrow k-cost-stat-lbl">Margin</div>
          <div className="k-cost-stat-val">{marginPct}%</div>
        </div>
      </div>

      <div className="k-cost-warning">Internal use only — these numbers are not for customers.</div>

      <KraftFooter brand={brand} layout="split"/>
    </div>
  )
}
