import {
  RpOffsetTitle, RpBrandLockup, RpEyebrow, RpFooter, RpRule,
  rpMoney,
} from './_parts.jsx'

/**
 * 02 — COST SHEET  (A4 portrait, 210×297mm) — INTERNAL
 *
 * Small partial RUST circle bleeds off the top-right corner behind a
 * solid NAVY suggested-price card. Rust CHIP "COST ANALYSIS · INTERNAL"
 * sits top-right of the header (above the corner circle by z-index).
 *
 * The offset-effect product title stretches LEFT of the price card, big
 * (50px) so the misregistration reads. RUST-tinted meta line beneath.
 *
 * Ingredient table: solid NAVY header row with cream text, COST column
 * header is filled RUST (the highlight). Ingredient rows on cream with
 * hair rules. BATCH TOTAL row has a strong navy top rule; the label sits
 * RUST tracked caps left, and the huge RM total sits RUST 28px right.
 *
 * Bottom caution: solid NAVY bar with RUST bold intro ("Internal use
 * only.") + cream body copy.
 */
export function RpCostBreakdown({ recipe = {}, brand = {} }) {
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
  const isBread = (recipe.category || '').toLowerCase() === 'bread'
  const yieldUnit = isBread
    ? (y === 1 ? 'LOAF' : 'LOAVES')
    : (y === 1 ? 'SLICE' : 'SLICES')
  const yieldWord = y > 0 ? `YIELD ${y} ${yieldUnit}` : `YIELD ${yieldUnit}`

  return (
    <div className="tpl rp-tpl rp-cost printable">
      <div className="rp-cost-corner-circle" aria-hidden="true"/>

      <header className="rp-cost-header">
        <RpBrandLockup brand={brand}/>
        <div className="rp-cost-chip">Cost Analysis · Internal</div>
      </header>

      <div className="rp-cost-title-row">
        <div className="rp-cost-title-block">
          <RpOffsetTitle size="md">{recipe.name || 'Recipe name'}</RpOffsetTitle>
          <RpEyebrow tone="rust" className="rp-cost-meta">
            {yieldWord} · Target Food Cost {targetFC}%
          </RpEyebrow>
        </div>
        <div className="rp-cost-price-card">
          <div className="rp-cost-price-eyebrow">Suggested / Portion</div>
          <div className="rp-cost-price-val">{rpMoney(suggested, { currency })}</div>
          <div className="rp-cost-price-divider"/>
          <div className="rp-cost-price-sub">
            <span>Cost / Portion</span>
            <strong>{rpMoney(perPortion, { currency })}</strong>
          </div>
          <div className="rp-cost-price-sub">
            <span>Margin</span>
            <strong>{marginPct}%</strong>
          </div>
        </div>
      </div>

      <table className="rp-cost-table">
        <thead>
          <tr>
            <th>Ingredient</th>
            <th className="rp-num">Qty</th>
            <th className="rp-num">Unit Price</th>
            <th className="rp-num rp-cost-th-cost">Cost</th>
          </tr>
        </thead>
        <tbody>
          {lines.length === 0 ? (
            <tr><td colSpan="4" className="rp-cost-empty">
              No ingredients linked yet — add them via Recipe BOM.
            </td></tr>
          ) : lines.map((l, idx) => (
            <tr key={idx}>
              <td className="rp-cost-td-name">{l.ingredient_name || 'Unknown'}</td>
              <td className="rp-num">{l.qty}{l.unit ? ` ${l.unit}` : ''}</td>
              <td className="rp-num rp-cost-td-muted">
                {Number(l.unit_cost || 0).toFixed(2)} / {l.unit || 'unit'}
              </td>
              <td className="rp-num rp-cost-td-val">{Number(l.cost || 0).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        {lines.length > 0 && (
          <tfoot>
            <tr className="rp-cost-batch-row">
              <td>Batch Total</td>
              <td></td>
              <td></td>
              <td className="rp-num rp-cost-batch-val">{rpMoney(total, { currency })}</td>
            </tr>
          </tfoot>
        )}
      </table>

      <div className="rp-cost-caution">
        <strong>Internal use only.</strong>{' '}
        Do not give this sheet to a customer. It carries supplier prices and margin.
      </div>

      <div className="rp-cost-footer-wrap">
        <RpRule tone="hair" marginBottom="3mm"/>
        <RpFooter brand={brand} layout="split" showSocials={false}/>
      </div>
    </div>
  )
}
