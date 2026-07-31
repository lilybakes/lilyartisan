import {
  PaEyebrow, PaRule, PaSubtitle, PaFooter,
  paMoney, spellOutNumber,
} from './_parts.jsx'

/**
 * 02 — COST SHEET  (A4 portrait, 210×297mm) — INTERNAL
 *
 * Very different feel from other variants — refined and understated. The
 * three stat columns (COST/PORTION, SUGGESTED/PORTION, MARGIN) are simple
 * TEXT on cream with hair-rule dividers between them, NO filled boxes,
 * NO card backgrounds. The one pink accent is the caution note at the
 * bottom: a full pink rounded rectangle with dark burgundy text inside.
 *
 * Top: brand burgundy Cormorant left, "COST ANALYSIS · INTERNAL" mauve
 * tracked caps right. Hair rule. Centered title BIG burgundy Cormorant
 * with italic subtitle "Yield ten slices · target food cost thirty per
 * cent" below. Three-mini-column stat row separated by mauve hair rules.
 * Ingredient table with hair rules, no filled header. Batch total row.
 */
export function PaCostBreakdown({ recipe = {}, brand = {} }) {
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
  const catRaw = (recipe.category || '').toLowerCase()
  const isBread = catRaw === 'bread'
  const yieldUnit = isBread
    ? (y === 1 ? 'loaf' : 'loaves')
    : (y === 1 ? 'portion' : 'portions')
  const yieldWord = spellOutNumber(y, { mode: 'lower' })
  const targetFCWord = spellOutNumber(targetFC, { mode: 'lower' })
  const metaParts = []
  if (y > 0) metaParts.push(`Yield ${yieldWord} ${yieldUnit}`)
  metaParts.push(`target food cost ${targetFCWord} per cent`)
  const metaLine = metaParts.join(' · ')

  return (
    <div className="tpl pa-tpl pa-cost printable">
      <div className="pa-frame">
        <header className="pa-cost-header">
          <div className="pa-cost-brand">{brand.business_name || 'Your Bakery'}</div>
          <PaEyebrow className="pa-cost-header-right">Cost Analysis · Internal</PaEyebrow>
        </header>

        <PaRule tone="mauve" marginTop="4mm"/>

        <div className="pa-cost-title-block">
          <h2 className="pa-title pa-cost-title">{recipe.name || 'Recipe name'}</h2>
          <PaSubtitle className="pa-cost-meta">{metaLine}</PaSubtitle>
        </div>

        <PaRule tone="mauve"/>

        <div className="pa-cost-stats-row">
          <div className="pa-cost-stat">
            <PaEyebrow>Cost / Portion</PaEyebrow>
            <div className="pa-cost-stat-val">{paMoney(perPortion, { currency })}</div>
          </div>
          <div className="pa-cost-stat pa-cost-stat-primary">
            <PaEyebrow>Suggested / Portion</PaEyebrow>
            <div className="pa-cost-stat-val pa-cost-stat-val-lg">{paMoney(suggested, { currency })}</div>
          </div>
          <div className="pa-cost-stat">
            <PaEyebrow>Margin</PaEyebrow>
            <div className="pa-cost-stat-val">{marginPct}%</div>
          </div>
        </div>

        <PaRule tone="mauve"/>

        <table className="pa-cost-table">
          <thead>
            <tr>
              <th>Ingredient</th>
              <th className="pa-num">Qty</th>
              <th className="pa-num">Unit Price</th>
              <th className="pa-num">Cost</th>
            </tr>
          </thead>
          <tbody>
            {lines.length === 0 ? (
              <tr><td colSpan="4" className="pa-cost-empty">
                No ingredients linked yet — add them via Recipe BOM.
              </td></tr>
            ) : lines.map((l, idx) => (
              <tr key={idx}>
                <td className="pa-cost-td-name">{l.ingredient_name || 'Unknown'}</td>
                <td className="pa-num">{l.qty}{l.unit ? ` ${l.unit}` : ''}</td>
                <td className="pa-num pa-muted">
                  {Number(l.unit_cost || 0).toFixed(2)} / {l.unit || 'unit'}
                </td>
                <td className="pa-num pa-cost-td-val">{Number(l.cost || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          {lines.length > 0 && (
            <tfoot>
              <tr className="pa-cost-batch-row">
                <td>Batch total</td>
                <td></td>
                <td></td>
                <td className="pa-num">{paMoney(total, { currency })}</td>
              </tr>
            </tfoot>
          )}
        </table>

        <div className="pa-cost-caution">
          <strong>Internal use only.</strong>{' '}
          This sheet carries supplier prices and margin — do not share with customers.
        </div>

        <div className="pa-cost-footer-wrap">
          <PaRule marginTop="auto" marginBottom="4mm"/>
          <PaFooter brand={brand} layout="split" showSocials={false}/>
        </div>
      </div>
    </div>
  )
}
