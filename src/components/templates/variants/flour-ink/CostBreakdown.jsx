import {
  FiBrandLockup, FiEyebrow, FiRule, FiShortRule, FiFooter,
  fiMoney, spellOutNumber,
} from './_parts.jsx'

/**
 * 02 — COST SHEET  (A4 portrait, 210×297mm) — INTERNAL
 *
 * Brand lockup top-left, COST SHEET · INTERNAL small-caps eyebrow right.
 * Massive letter-tracked light title, short thin rule, YIELD [word] ·
 * TARGET FOOD COST 30% meta small-caps.
 *
 * Ingredient table with hairline row separators. Column headers in small
 * caps (INGREDIENT / QTY / UNIT PRICE / COST), no filled bar. Values in
 * light sans; unit price and quantity uppercase ("250 G", "4.50 / KG").
 * BATCH TOTAL row with a stronger top border and bold RM total.
 *
 * Three-cell stats row: COST / PORTION (outlined), SUGGESTED PRICE
 * (FILLED BLACK — the singular accent of the whole variant), MARGIN
 * (outlined). Then a bold caution line — "Do not give this sheet to a
 * customer. It carries supplier prices and margin." — and split footer.
 */
export function FiCostBreakdown({ recipe = {}, brand = {} }) {
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
  const yieldWord = spellOutNumber(y, { mode: 'upper' })

  return (
    <div className="tpl fi-tpl fi-cost printable">
      <header className="fi-cost-header">
        <FiBrandLockup brand={brand} size="sm"/>
        <FiEyebrow tone="muted" className="fi-cost-header-right">Cost Sheet · Internal</FiEyebrow>
      </header>

      <div className="fi-cost-title-block">
        <h2 className="fi-title fi-cost-title">{(recipe.name || 'Recipe name').toUpperCase()}</h2>
        <FiShortRule/>
        <FiEyebrow tone="muted" className="fi-cost-meta">
          Yield {yieldWord} · Target Food Cost {targetFC}%
        </FiEyebrow>
      </div>

      <table className="fi-cost-table">
        <thead>
          <tr>
            <th>Ingredient</th>
            <th className="fi-num">Qty</th>
            <th className="fi-num">Unit Price</th>
            <th className="fi-num">Cost</th>
          </tr>
        </thead>
        <tbody>
          {lines.length === 0 ? (
            <tr><td colSpan="4" className="fi-cost-empty">
              No ingredients linked yet — add them via Recipe BOM.
            </td></tr>
          ) : lines.map((l, idx) => (
            <tr key={idx}>
              <td className="fi-cost-td-name">{(l.ingredient_name || 'Unknown').toUpperCase()}</td>
              <td className="fi-num">{l.qty}{l.unit ? ` ${l.unit.toUpperCase()}` : ''}</td>
              <td className="fi-num fi-muted">
                {Number(l.unit_cost || 0).toFixed(2)} / {(l.unit || 'unit').toUpperCase()}
              </td>
              <td className="fi-num fi-cost-td-val">{Number(l.cost || 0).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        {lines.length > 0 && (
          <tfoot>
            <tr className="fi-cost-batch-row">
              <td>Batch total</td>
              <td></td>
              <td></td>
              <td className="fi-num">{fiMoney(total, { currency })}</td>
            </tr>
          </tfoot>
        )}
      </table>

      <div className="fi-cost-stats-row">
        <div className="fi-cost-stat">
          <FiEyebrow tone="muted">Cost / Portion</FiEyebrow>
          <div className="fi-cost-stat-val">{fiMoney(perPortion, { currency })}</div>
        </div>
        <div className="fi-cost-stat fi-cost-stat-accent">
          <FiEyebrow tone="cream">Suggested Price</FiEyebrow>
          <div className="fi-cost-stat-val">{fiMoney(suggested, { currency })}</div>
        </div>
        <div className="fi-cost-stat">
          <FiEyebrow tone="muted">Margin</FiEyebrow>
          <div className="fi-cost-stat-val">{marginPct}%</div>
        </div>
      </div>

      <div className="fi-cost-caution">
        <strong>Do not give this sheet to a customer.</strong>{' '}
        It carries supplier prices and margin.
      </div>

      <div className="fi-cost-footer-wrap">
        <FiRule marginTop="auto" marginBottom="4mm"/>
        <FiFooter brand={brand} layout="split" showSocials={false}/>
      </div>
    </div>
  )
}
