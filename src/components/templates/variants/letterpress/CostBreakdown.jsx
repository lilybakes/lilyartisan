import {
  LetterpressBrandLockup, LetterpressRule, LetterpressFooter,
  letterpressMoney, spellOutNumber,
} from './_parts.jsx'

/**
 * 02 — COST BREAKDOWN  (A4 portrait, 210×297mm) — INTERNAL
 *
 * Professional "statement of cost" format. Compact brand lockup top-left,
 * "STATEMENT OF COST · CONFIDENTIAL" small caps top-right, centered title,
 * italic subtitle with spelled-out numbers, 3-cell headline row, serif
 * table body with dotted rules — no monospace anywhere.
 */
export function LetterpressCostBreakdown({ recipe = {}, brand = {} }) {
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
  const yieldWord = y > 0 && y <= 99 ? spellOutNumber(y) : String(y || '—')
  const yieldUnit = (recipe.category || '').toLowerCase() === 'bread' ? 'loaf' : 'slice'
  const fcWord = spellOutNumber(targetFC) || String(targetFC)

  return (
    <div className="tpl l-tpl l-cost printable">
      <header className="l-cost-header">
        <LetterpressBrandLockup brand={brand} size="sm" layout="row"/>
        <div className="l-eyebrow l-eyebrow-muted l-cost-header-right">
          Statement of Cost · Confidential
        </div>
      </header>

      <LetterpressRule/>

      <div className="l-cost-title-block">
        <h2 className="l-cost-title">{recipe.name || 'Recipe name'}</h2>
        <p className="l-cost-subtitle">
          Yield {yieldWord} {yieldUnit}{y === 1 ? '' : 's'}
          {' · '}
          target food cost {fcWord} per cent
        </p>
      </div>

      <div className="l-cost-headline">
        <div className="l-cost-headline-cell">
          <div className="l-eyebrow l-eyebrow-muted">Cost / Portion</div>
          <div className="l-cost-headline-val">{letterpressMoney(perPortion)}</div>
        </div>
        <div className="l-cost-headline-cell l-cost-headline-suggested">
          <div className="l-eyebrow l-eyebrow-burgundy">Suggested / Portion</div>
          <div className="l-cost-headline-val l-burgundy">{letterpressMoney(suggested)}</div>
        </div>
        <div className="l-cost-headline-cell">
          <div className="l-eyebrow l-eyebrow-muted">Margin</div>
          <div className="l-cost-headline-val l-burgundy">{marginPct}%</div>
        </div>
      </div>

      <table className="l-cost-table">
        <thead>
          <tr>
            <th>Ingredient</th>
            <th className="l-num">Qty</th>
            <th className="l-num">Unit Price</th>
            <th className="l-num">Cost</th>
          </tr>
        </thead>
        <tbody>
          {lines.length === 0 ? (
            <tr><td colSpan="4" className="l-cost-empty">
              No ingredients linked yet — add them via Recipe BOM.
            </td></tr>
          ) : lines.map((l, idx) => (
            <tr key={idx}>
              <td>{l.ingredient_name || 'Unknown'}</td>
              <td className="l-num">{l.qty}{l.unit ? ` ${l.unit}` : ''}</td>
              <td className="l-num">{currency} {Number(l.unit_cost || 0).toFixed(2)}/{l.unit || 'unit'}</td>
              <td className="l-num l-cost-val">{Number(l.cost || 0).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        {lines.length > 0 && (
          <tfoot>
            <tr className="l-cost-batch-row">
              <td>Batch Total</td>
              <td></td>
              <td></td>
              <td className="l-num">{letterpressMoney(total)}</td>
            </tr>
          </tfoot>
        )}
      </table>

      <p className="l-cost-caption">
        For internal reference only — not to be shared with customers.
      </p>

      <LetterpressFooter brand={brand} showSocials={false}/>
    </div>
  )
}
