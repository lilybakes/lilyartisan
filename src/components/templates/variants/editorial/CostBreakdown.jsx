import {
  EditorialLogo, EditorialEyebrow, EditorialRule,
  EditorialFooter, stylizeTitle, editorialMoney, topContributors,
} from './_parts.jsx'

/**
 * 02 — COST BREAKDOWN  (A4 portrait, 210×297mm) — INTERNAL
 *
 * Two-column top: title + italic accent + small-caps yield/target on left,
 * big filled rust box with suggested/portion + cost/portion + margin on right.
 * "WHERE THE MONEY GOES" horizontal bar chart of top-6 contributors (rust
 * bars with cream track, ingredient name left, RM cost right). Thick rust
 * rule, then FULL COSTING table with dotted separators. BATCH TOTAL row.
 */
export function EditorialCostBreakdown({ recipe = {}, brand = {} }) {
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
  const yieldUnit = (recipe.category || '').toLowerCase() === 'bread'
    ? (y === 1 ? 'loaf' : 'loaves')
    : (y === 1 ? 'portion' : 'slices')

  const contributors = topContributors(lines, 6)

  return (
    <div className="tpl e-tpl e-cost printable">
      <header className="e-cost-header">
        <div className="e-cost-brand">
          <EditorialLogo brand={brand} size="sm"/>
          <div>
            <h1 className="e-brand-name e-brand-name-sm">{brand.business_name || 'Your Bakery'}</h1>
            {brand.tagline && <p className="e-brand-tagline e-brand-tagline-sm">{brand.tagline}</p>}
          </div>
        </div>
        <EditorialEyebrow tone="rust" className="e-cost-header-right">Cost Analysis · Internal</EditorialEyebrow>
      </header>

      <EditorialRule tone="black" weight="thick"/>

      <div className="e-cost-title-block">
        <div className="e-cost-title-left">
          <h2 className="e-title e-cost-title">{stylizeTitle(recipe.name || 'Recipe name')}</h2>
          <EditorialEyebrow tone="muted" className="e-cost-meta">
            {y > 0 && `Yield ${y} ${yieldUnit}`}
            {y > 0 && targetFC ? ' · ' : ''}
            {targetFC ? `Target Food Cost ${targetFC}%` : ''}
          </EditorialEyebrow>
        </div>
        <div className="e-cost-suggested-box">
          <EditorialEyebrow tone="cream">Suggested / Portion</EditorialEyebrow>
          <div className="e-cost-suggested-value">{editorialMoney(suggested, { currency })}</div>
          <div className="e-cost-suggested-divider"/>
          <div className="e-cost-suggested-line">
            <span>Cost / portion</span>
            <span>{editorialMoney(perPortion, { currency })}</span>
          </div>
          <div className="e-cost-suggested-line">
            <span>Margin</span>
            <span>{marginPct}%</span>
          </div>
        </div>
      </div>

      {contributors.items.length > 0 && (
        <section className="e-cost-chart-section">
          <EditorialEyebrow tone="rust">Where the Money Goes</EditorialEyebrow>
          <div className="e-cost-chart">
            {contributors.items.map((c, i) => (
              <div key={i} className="e-cost-chart-row">
                <div className="e-cost-chart-name">{c.name}</div>
                <div className="e-cost-chart-track">
                  <div className="e-cost-chart-fill" style={{ width: `${c.pct}%` }}/>
                </div>
                <div className="e-cost-chart-val">{editorialMoney(c.cost, { currency })}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      <EditorialRule tone="black" weight="thick" marginTop="8mm"/>

      <section className="e-cost-table-section">
        <div className="e-cost-table-head">
          <EditorialEyebrow tone="rust">Full Costing</EditorialEyebrow>
          <div className="e-cost-table-head-cols">
            <span>Qty</span>
            <span>Unit Price</span>
            <span>Cost</span>
          </div>
        </div>
        <table className="e-cost-table">
          <tbody>
            {lines.length === 0 ? (
              <tr><td colSpan="4" className="e-cost-empty">
                No ingredients linked yet — add them via Recipe BOM.
              </td></tr>
            ) : lines.map((l, idx) => (
              <tr key={idx}>
                <td className="e-cost-td-name">{l.ingredient_name || 'Unknown'}</td>
                <td className="e-num">{l.qty}{l.unit ? ` ${l.unit}` : ''}</td>
                <td className="e-num e-muted">{currency} {Number(l.unit_cost || 0).toFixed(2)}/{l.unit || 'unit'}</td>
                <td className="e-num e-cost-td-val">{Number(l.cost || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          {lines.length > 0 && (
            <tfoot>
              <tr className="e-cost-batch-row">
                <td>Batch Total</td>
                <td></td>
                <td></td>
                <td className="e-num">{editorialMoney(total, { currency })}</td>
              </tr>
            </tfoot>
          )}
        </table>
      </section>

      <EditorialEyebrow tone="muted" className="e-cost-caution">
        Internal use only — not for customers
      </EditorialEyebrow>

      <EditorialRule tone="black" weight="thick" marginTop="8mm" marginBottom="4mm"/>

      <EditorialFooter brand={brand} layout="split" showSocials={false}/>
    </div>
  )
}
