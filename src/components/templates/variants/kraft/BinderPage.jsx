import { KraftBrandLockup, KraftDoubleRule, KraftFooter, kraftMoney } from './_parts.jsx'

/**
 * 09 — RECIPE BINDER PAGE  (A4 portrait) — kitchen reference
 *
 * Matches Image 4 (Vanilla Cupcakes binder page):
 *   • Header left: monogram + brand + tagline
 *   • Header right: "KITCHEN BINDER · No 04" tracked caps
 *   • Double rule
 *   • Left title block: product name (big slab) + italic description
 *     + dotted separators + 4-column meta row (CATEGORY / YIELD / COST/PORTION / SELL/PORTION)
 *   • Right: recipe photo box (slightly rotated 1.5deg — taped-in feel)
 *     Uses recipe.image_url if present, otherwise placeholder text
 *   • Two-column body: Ingredients (left) with dotted-separator table + Batch total
 *                     Method (right) with sub-group labels + numbered steps
 *   • Chef's notes: title + several dotted ruled lines for writing
 *   • Dashed-divider split footer
 */
export function KraftBinderPage({ recipe = {}, brand = {}, binderNumber = '04' }) {
  const ings = recipe.ingredients || []
  const method = recipe.method || []
  const batchTotal = recipe.batch_total ?? recipe.batchTotal ?? 0
  const costPerPortion = recipe.cost_per_portion ?? recipe.costPerPortion ?? 0
  const suggested = recipe.suggested_price ?? recipe.suggestedPrice ?? 0
  const photo = recipe.image_url || recipe.imageUrl

  // Method may have grouped steps: [{groupLabel: 'CUPCAKES', step: '...'}]
  // Render group label the first time a new group appears
  let lastGroup = null

  return (
    <div className="tpl k-tpl k-binder printable">
      <header className="k-binder-header">
        <KraftBrandLockup brand={brand} size="md" layout="row"/>
        <div className="k-binder-header-right">Kitchen Binder · No {binderNumber}</div>
      </header>

      <KraftDoubleRule/>

      <div className="k-binder-title-block">
        <div className="k-binder-title-left">
          <h2>{recipe.name || 'Recipe name'}</h2>
          {recipe.description && (
            <div className="k-binder-title-desc">{recipe.description}</div>
          )}
          <div className="k-binder-meta-row">
            <div>
              <div className="k-binder-meta-cell-lbl">Category</div>
              <div className="k-binder-meta-cell-val">{recipe.category || '—'}</div>
            </div>
            <div>
              <div className="k-binder-meta-cell-lbl">Yield</div>
              <div className="k-binder-meta-cell-val">{recipe.yield_portions || '—'}</div>
            </div>
            <div>
              <div className="k-binder-meta-cell-lbl">Cost / Portion</div>
              <div className="k-binder-meta-cell-val">{kraftMoney(costPerPortion)}</div>
            </div>
            <div>
              <div className="k-binder-meta-cell-lbl">Sell / Portion</div>
              <div className="k-binder-meta-cell-val k-brown">{kraftMoney(suggested)}</div>
            </div>
          </div>
        </div>
        <div className="k-binder-photo">
          {photo ? (
            <img src={photo} alt={recipe.name || ''}/>
          ) : (
            <div className="k-binder-photo-placeholder">
              Recipe photo<br/>
              <span style={{ fontStyle: 'italic', fontSize: '9px' }}>(placeholder when empty)</span>
            </div>
          )}
        </div>
      </div>

      <div className="k-binder-body">
        <section>
          <div className="k-binder-section-head">
            <h3>Ingredients</h3>
            <div className="k-rule-single"/>
          </div>
          {ings.map((i, idx) => (
            <div key={idx} className="k-binder-ing-row">
              <div className="k-ing-name">{i.name}</div>
              <div className="k-ing-qty">{i.qty}{i.unit ? ` ${i.unit}` : ''}</div>
              <div className="k-ing-cost">{Number(i.line_cost ?? i.cost ?? 0).toFixed(2)}</div>
            </div>
          ))}
          <div className="k-binder-batch">
            <span>Batch total</span>
            <span className="k-binder-batch-val">{Number(batchTotal).toFixed(2)}</span>
          </div>
        </section>

        <section>
          <div className="k-binder-section-head">
            <h3>Method</h3>
            <div className="k-rule-single"/>
          </div>
          <ol className="k-binder-method">
            {method.map((step, i) => {
              const stepText = typeof step === 'string' ? step : step.step
              const group = typeof step === 'object' ? step.group_label || step.groupLabel : null
              const showGroup = group && group !== lastGroup
              if (showGroup) lastGroup = group
              return (
                <>
                  {showGroup && <li key={`g${i}`} className="k-binder-method-group" style={{ listStyle: 'none', paddingLeft: 0 }}>{group}</li>}
                  <li key={i}>{stepText}</li>
                </>
              )
            })}
          </ol>
        </section>
      </div>

      <div className="k-binder-notes">
        <h3 className="k-binder-notes-title">Chef's notes</h3>
        <div className="k-binder-notes-lines">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="k-binder-notes-line"/>
          ))}
        </div>
      </div>

      <KraftFooter brand={brand} layout="split"/>
    </div>
  )
}
