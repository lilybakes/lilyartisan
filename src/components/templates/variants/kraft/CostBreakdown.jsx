import { KraftBrandLockup, KraftDoubleRule, KraftFooter, kraftMoney } from './_parts.jsx'

/**
 * 02 — COST BREAKDOWN  (A4 portrait, 210×297mm) — INTERNAL USE
 *
 * Matches Image 7 (Chocolate Fudge Cake cost breakdown):
 *   • Header lockup left, "COSTING LEDGER · INTERNAL" small caps right
 *   • Double rule
 *   • Product name (bold slab, big) + italic yield/target line, LEFT
 *   • Brown-bordered rectangle: "SUGGESTED / PORTION" + big RM value, RIGHT
 *   • Dotted-separator table: INGREDIENT / QTY / UNIT PRICE / COST
 *   • Bold Batch total row with brown value
 *   • 3 kraft-tinted stat boxes: cost/portion, suggested price, margin (green)
 *   • Italic muted "Internal use only" warning
 *   • Dashed-divider split footer
 */
export function KraftCostBreakdown({ recipe = {}, brand = {} }) {
  const ings = recipe.ingredients || []
  const currency = brand.currency || 'RM'
  const batchTotal = recipe.batch_total ?? recipe.batchTotal ?? 0
  const costPerPortion = recipe.cost_per_portion ?? recipe.costPerPortion ?? 0
  const suggested = recipe.suggested_price ?? recipe.suggestedPrice ?? 0
  const marginPct = recipe.margin_pct ?? recipe.marginPct ??
    (suggested > 0 ? Math.round(((suggested - costPerPortion) / suggested) * 100) : 0)
  const targetFC = recipe.target_food_cost_pct ?? recipe.targetFoodCostPct

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
            {recipe.yield_portions && <>Yield {recipe.yield_portions} {recipe.yield_unit || 'portions'}</>}
            {targetFC && <> · target food cost {targetFC}%</>}
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
            <th className="k-num">Unit Price</th>
            <th className="k-num">Cost</th>
          </tr>
        </thead>
        <tbody>
          {ings.map((i, idx) => (
            <tr key={idx}>
              <td>{i.name}</td>
              <td className="k-num">{i.qty}{i.unit ? ` ${i.unit}` : ''}</td>
              <td className="k-num">{i.unit_basis || i.unit_price != null ? `${currency} ${Number(i.unit_price).toFixed(2)}${i.unit_basis ? `/${i.unit_basis}` : ''}` : '—'}</td>
              <td className="k-num k-cost-val">{Number(i.line_cost ?? i.cost ?? 0).toFixed(2)}</td>
            </tr>
          ))}
          <tr className="k-cost-batch-row">
            <td>Batch total</td>
            <td></td>
            <td></td>
            <td className="k-num">{kraftMoney(batchTotal)}</td>
          </tr>
        </tbody>
      </table>

      <div className="k-cost-stats">
        <div className="k-cost-stat">
          <div className="k-eyebrow k-cost-stat-lbl">Cost / Portion</div>
          <div className="k-cost-stat-val">{kraftMoney(costPerPortion)}</div>
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
