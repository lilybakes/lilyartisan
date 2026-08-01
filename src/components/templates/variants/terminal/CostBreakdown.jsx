import {
  TrBrandLockup, TrEyebrow, TrRule, TrStatusChip, TrBarBlock, TrFooter,
  trMoney,
} from './_parts.jsx'

/**
 * 02 — COST SHEET  (A4 portrait, 210×297mm) — INTERNAL
 *
 * Terminal aesthetic — dark navy grid paper, big teal SUGGESTED / PORTION
 * price card top-right, `• RESTRICTED / INTERNAL` amber-outlined status
 * chip.
 *
 * Header: brand lockup left, amber RESTRICTED chip right. Thin teal rule.
 * Then `COST_ANALYSIS / CAKES` teal mono eyebrow left + big TEAL price
 * card RIGHT: teal mono `SUGGESTED / PORTION` eyebrow, HUGE teal
 * JetBrains Mono price (RM 10.00), thin teal divider, then cost/portion +
 * margin lines mono-labelled.
 *
 * Below: big Manrope 800 title, `yield: 10 · target_food_cost: 30%` mono
 * lowercase kv-style meta.
 *
 * Ingredient table: teal-filled header row (dark text on teal, mono
 * uppercase wide-tracked), body rows on dark with teal-tinted hairlines,
 * COST column values in TEAL mono bold. BATCH_TOTAL row: teal top border,
 * mono uppercase label left, big TEAL mono RM value right.
 *
 * Below table: 3 stat boxes (COST/PORTION outlined, SUGGESTED highlighted
 * teal, MARGIN outlined). Then AMBER-left-bar caution: "Internal use
 * only." amber bold + body copy.
 *
 * Split footer.
 */
export function TrCostBreakdown({ recipe = {}, brand = {} }) {
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
  const category = (recipe.category || 'RECIPES').toUpperCase().replace(/\s+/g, '_')

  return (
    <div className="tpl tr-tpl tr-cost printable">
      <header className="tr-cost-header">
        <TrBrandLockup brand={brand} size="sm"/>
        <TrStatusChip tone="amber">RESTRICTED / INTERNAL</TrStatusChip>
      </header>

      <TrRule tone="hair" marginTop="4mm" marginBottom="6mm"/>

      <div className="tr-cost-top-row">
        <div className="tr-cost-top-left">
          <TrEyebrow tone="teal" className="tr-cost-eyebrow">
            COST_ANALYSIS / {category}
          </TrEyebrow>
          <h2 className="tr-cost-title">{recipe.name || 'Chocolate Fudge Cake'}</h2>
          <div className="tr-cost-meta">
            yield: {y || '—'} · target_food_cost: {targetFC}%
          </div>
        </div>

        <aside className="tr-cost-price-card">
          <div className="tr-cost-price-card-eyebrow">SUGGESTED / PORTION</div>
          <div className="tr-cost-price-card-value">{trMoney(suggested, { currency })}</div>
          <div className="tr-cost-price-card-rule"/>
          <div className="tr-cost-price-card-row">
            <span className="tr-cost-price-card-label">cost / portion</span>
            <span className="tr-cost-price-card-num">{trMoney(perPortion, { currency, bare: true })}</span>
          </div>
          <div className="tr-cost-price-card-row">
            <span className="tr-cost-price-card-label">margin</span>
            <span className="tr-cost-price-card-num">{marginPct}%</span>
          </div>
        </aside>
      </div>

      <table className="tr-cost-table">
        <thead>
          <tr>
            <th>INGREDIENT</th>
            <th className="tr-num">QTY</th>
            <th className="tr-num">UNIT PRICE</th>
            <th className="tr-num">COST</th>
          </tr>
        </thead>
        <tbody>
          {lines.length === 0 ? (
            <tr><td colSpan="4" className="tr-cost-empty">
              // no ingredients linked yet — add them via Recipe BOM
            </td></tr>
          ) : lines.map((l, idx) => (
            <tr key={idx}>
              <td className="tr-cost-td-name">{l.ingredient_name || 'Unknown'}</td>
              <td className="tr-num">{l.qty}{l.unit ? ` ${l.unit}` : ''}</td>
              <td className="tr-num tr-muted">
                {Number(l.unit_cost || 0).toFixed(2)} / {l.unit || 'unit'}
              </td>
              <td className="tr-num tr-cost-td-val">{Number(l.cost || 0).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        {lines.length > 0 && (
          <tfoot>
            <tr className="tr-cost-batch-row">
              <td>BATCH_TOTAL</td>
              <td></td>
              <td></td>
              <td className="tr-num">{trMoney(total, { currency })}</td>
            </tr>
          </tfoot>
        )}
      </table>

      <div className="tr-cost-stats-row">
        <div className="tr-cost-stat">
          <div className="tr-cost-stat-label">COST / PORTION</div>
          <div className="tr-cost-stat-val">{trMoney(perPortion, { currency })}</div>
        </div>
        <div className="tr-cost-stat tr-cost-stat-accent">
          <div className="tr-cost-stat-label">SUGGESTED</div>
          <div className="tr-cost-stat-val">{trMoney(suggested, { currency })}</div>
        </div>
        <div className="tr-cost-stat">
          <div className="tr-cost-stat-label">MARGIN</div>
          <div className="tr-cost-stat-val">{marginPct}%</div>
        </div>
      </div>

      <TrBarBlock tone="amber" className="tr-cost-caution">
        <div className="tr-cost-caution-title">Internal use only.</div>
        <div className="tr-cost-caution-body">
          This sheet carries supplier prices and margin. Do not share with customers.
        </div>
      </TrBarBlock>

      <div className="tr-cost-footer-wrap">
        <TrRule tone="hair" marginTop="auto" marginBottom="3mm"/>
        <TrFooter brand={brand} layout="split" showSocials={false}/>
      </div>
    </div>
  )
}
