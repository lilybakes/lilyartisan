import {
  TeBrandLockup, TeEyebrow, TeRule, TeShortRule, TeFooter,
  teMoney, spellOutNumber,
} from './_parts.jsx'

/**
 * 02 — COST SHEET  (A4 portrait, 210×297mm) — INTERNAL
 *
 * Top: rust×brown×cream diagonal band (~10mm). Brand lockup left,
 * "COST ANALYSIS / INTERNAL" mono eyebrow right. Bold Manrope title,
 * short rule, YIELD / TARGET FC meta.
 *
 * TOP-RIGHT SUGGESTED PRICE CARD: solid navy rectangle (~55mm wide)
 * with a subtle checkerboard texture overlay, rust "SUGGESTED /
 * PORTION" label, huge white price, divider, then Cost/portion +
 * Margin lines.
 *
 * Ingredient table with hairline rows, mono column headers. BATCH TOTAL
 * with a strong navy top border and bold RM total.
 *
 * Three-cell stats row: COST/PORTION (outlined), SUGGESTED (FILLED
 * RUST — the eye-catch), MARGIN (outlined). Caution line + split
 * footer.
 */
export function TeCostBreakdown({ recipe = {}, brand = {} }) {
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
    <div className="tpl te-tpl te-cost printable">
      <div className="te-stripe-band te-stripe-rust-brown-cream te-cost-stripe"/>

      <header className="te-cost-header">
        <TeBrandLockup brand={brand} size="sm"/>
        <TeEyebrow tone="muted" className="te-cost-header-right">Cost Analysis / Internal</TeEyebrow>
      </header>

      <div className="te-cost-title-row">
        <div className="te-cost-title-block">
          <h2 className="te-title te-cost-title">{(recipe.name || 'Recipe name').toUpperCase()}</h2>
          <TeShortRule/>
          <TeEyebrow tone="muted" className="te-cost-meta">
            Yield {yieldWord} / Target FC {targetFC}%
          </TeEyebrow>
        </div>

        <aside className="te-cost-suggested-card">
          <div className="te-cost-suggested-tex" aria-hidden="true"/>
          <div className="te-cost-suggested-inner">
            <TeEyebrow tone="rust" className="te-cost-suggested-label">Suggested / Portion</TeEyebrow>
            <div className="te-cost-suggested-price">{teMoney(suggested, { currency })}</div>
            <div className="te-cost-suggested-divider"/>
            <div className="te-cost-suggested-line">
              <span>Cost / portion</span>
              <span>{teMoney(perPortion, { currency })}</span>
            </div>
            <div className="te-cost-suggested-line">
              <span>Margin</span>
              <span>{marginPct}%</span>
            </div>
          </div>
        </aside>
      </div>

      <table className="te-cost-table">
        <thead>
          <tr>
            <th>Ingredient</th>
            <th className="te-num">Qty</th>
            <th className="te-num">Unit Price</th>
            <th className="te-num">Cost</th>
          </tr>
        </thead>
        <tbody>
          {lines.length === 0 ? (
            <tr><td colSpan="4" className="te-cost-empty">
              No ingredients linked yet — add them via Recipe BOM.
            </td></tr>
          ) : lines.map((l, idx) => (
            <tr key={idx}>
              <td className="te-cost-td-name">{(l.ingredient_name || 'Unknown').toUpperCase()}</td>
              <td className="te-num">{l.qty}{l.unit ? ` ${l.unit.toUpperCase()}` : ''}</td>
              <td className="te-num te-muted">
                {Number(l.unit_cost || 0).toFixed(2)} / {(l.unit || 'unit').toUpperCase()}
              </td>
              <td className="te-num te-cost-td-val">{Number(l.cost || 0).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        {lines.length > 0 && (
          <tfoot>
            <tr className="te-cost-batch-row">
              <td>Batch total</td>
              <td></td>
              <td></td>
              <td className="te-num">{teMoney(total, { currency })}</td>
            </tr>
          </tfoot>
        )}
      </table>

      <div className="te-cost-stats-row">
        <div className="te-cost-stat">
          <TeEyebrow tone="muted">Cost / Portion</TeEyebrow>
          <div className="te-cost-stat-val">{teMoney(perPortion, { currency })}</div>
        </div>
        <div className="te-cost-stat te-cost-stat-accent">
          <TeEyebrow tone="cream">Suggested</TeEyebrow>
          <div className="te-cost-stat-val">{teMoney(suggested, { currency })}</div>
        </div>
        <div className="te-cost-stat">
          <TeEyebrow tone="muted">Margin</TeEyebrow>
          <div className="te-cost-stat-val">{marginPct}%</div>
        </div>
      </div>

      <div className="te-cost-caution">
        <strong>Do not give this sheet to a customer.</strong>{' '}
        It carries supplier prices and margin.
      </div>

      <div className="te-cost-footer-wrap">
        <TeRule marginTop="auto" marginBottom="4mm"/>
        <TeFooter brand={brand} layout="split" showSocials={false}/>
      </div>
    </div>
  )
}
