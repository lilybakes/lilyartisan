import {
  BhBrandLockup, BhEyebrow, BhRule, BhFooter,
  bhMoney,
} from './_parts.jsx'

/**
 * 02 — COST SHEET  (A4 portrait, 210×297mm) — INTERNAL
 *
 * Top: brand lockup left, solid RED "COST ANALYSIS · INTERNAL" chip right.
 * Thick black rule underneath. Then the title block: Archivo Black title
 * left, and a large solid BLUE rectangle price card top-right (~55mm wide,
 * cream text on cobalt) — "SUGGESTED / PORTION" eyebrow, huge cream price,
 * a thin cream divider, then cost/margin lines stacked below.
 *
 * Cost table: BLACK filled header row with white text (Manrope 700
 * uppercase). The COST column highlights with a solid YELLOW background
 * on every body cell — the eye-catch column. BATCH TOTAL row with a thick
 * black top rule and blue total figure.
 *
 * Bottom stats: three equal boxes — COST/PORTION (thin outlined), SUGGESTED
 * (SOLID YELLOW with black text — the accent), MARGIN (thin outlined).
 *
 * "INTERNAL USE ONLY" caution: full-width solid BLACK bar with a yellow
 * eyebrow + cream body copy warning against showing this to customers.
 */
export function BhCostBreakdown({ recipe = {}, brand = {} }) {
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

  return (
    <div className="tpl bh-tpl bh-cost printable">
      <header className="bh-cost-header">
        <BhBrandLockup brand={brand} size="sm"/>
        <div className="bh-cost-tag-red">
          <span>COST ANALYSIS · INTERNAL</span>
        </div>
      </header>

      <BhRule weight="thick" marginTop="4mm" marginBottom="8mm"/>

      <div className="bh-cost-title-row">
        <div className="bh-cost-title-left">
          <BhEyebrow tone="blue">Recipe</BhEyebrow>
          <h2 className="bh-title bh-cost-title">{(recipe.name || 'Recipe name').toUpperCase()}</h2>
          <div className="bh-cost-meta">
            YIELD {y > 0 ? y : '—'} · TARGET FOOD COST {targetFC}%
          </div>
        </div>

        {/* Solid BLUE price card top-right */}
        <div className="bh-cost-price-card">
          <div className="bh-cost-price-eyebrow">SUGGESTED / PORTION</div>
          <div className="bh-cost-price-val">{bhMoney(suggested, { currency })}</div>
          <div className="bh-cost-price-divider"/>
          <div className="bh-cost-price-line">
            <span>COST</span>
            <span>{bhMoney(perPortion, { currency })}</span>
          </div>
          <div className="bh-cost-price-line">
            <span>MARGIN</span>
            <span>{marginPct}%</span>
          </div>
        </div>
      </div>

      <table className="bh-cost-table">
        <thead>
          <tr>
            <th>INGREDIENT</th>
            <th className="bh-num">QTY</th>
            <th className="bh-num">UNIT PRICE</th>
            <th className="bh-num bh-cost-th-yellow">COST</th>
          </tr>
        </thead>
        <tbody>
          {lines.length === 0 ? (
            <tr><td colSpan="4" className="bh-cost-empty">
              No ingredients linked yet — add them via Recipe BOM.
            </td></tr>
          ) : lines.map((l, idx) => (
            <tr key={idx}>
              <td className="bh-cost-td-name">{(l.ingredient_name || 'Unknown').toUpperCase()}</td>
              <td className="bh-num">{l.qty}{l.unit ? ` ${l.unit.toUpperCase()}` : ''}</td>
              <td className="bh-num bh-muted">
                {Number(l.unit_cost || 0).toFixed(2)} / {(l.unit || 'unit').toUpperCase()}
              </td>
              <td className="bh-num bh-cost-td-yellow">{Number(l.cost || 0).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        {lines.length > 0 && (
          <tfoot>
            <tr className="bh-cost-batch-row">
              <td>BATCH TOTAL</td>
              <td></td>
              <td></td>
              <td className="bh-num bh-cost-batch-val">{bhMoney(total, { currency })}</td>
            </tr>
          </tfoot>
        )}
      </table>

      <div className="bh-cost-stats-row">
        <div className="bh-cost-stat">
          <BhEyebrow tone="muted">Cost / Portion</BhEyebrow>
          <div className="bh-cost-stat-val">{bhMoney(perPortion, { currency })}</div>
        </div>
        <div className="bh-cost-stat bh-cost-stat-accent">
          <div className="bh-cost-stat-eyebrow">SUGGESTED</div>
          <div className="bh-cost-stat-val">{bhMoney(suggested, { currency })}</div>
        </div>
        <div className="bh-cost-stat">
          <BhEyebrow tone="muted">Margin</BhEyebrow>
          <div className="bh-cost-stat-val">{marginPct}%</div>
        </div>
      </div>

      <div className="bh-cost-caution">
        <span className="bh-cost-caution-label">INTERNAL USE ONLY</span>
        <span className="bh-cost-caution-body">
          Do not give this sheet to a customer — it carries supplier prices and margin.
        </span>
      </div>

      <div className="bh-cost-footer-wrap">
        <BhRule weight="thick" marginTop="auto" marginBottom="4mm"/>
        <BhFooter brand={brand} layout="split" showSocials={false}/>
      </div>
    </div>
  )
}
