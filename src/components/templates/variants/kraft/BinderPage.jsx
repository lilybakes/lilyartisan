import { KraftBrandLockup, KraftDoubleRule, KraftFooter, kraftMoney } from './_parts.jsx'

/**
 * 09 — RECIPE BINDER PAGE  (A4 portrait) — kitchen reference
 *
 * FIELD MAPPING:
 *   recipe.lines[]              — ingredient rows
 *   recipe.method[]             — steps, with { group } sub-headings
 *   recipe.description          — italic description under the title
 *   recipe.image_url            — rotated photo box (taped-in feel)
 *   recipe.total_cost           — batch total
 *   recipe.cost_per_portion     — meta cell
 *   recipe.suggested_price      — meta cell
 *   binderNumber                — prop; "KITCHEN BINDER · No 04"
 */
export function KraftBinderPage({ recipe = {}, brand = {}, binderNumber = '04' }) {
  const lines           = recipe.lines || []
  const method          = normalizeMethod(recipe.method)
  const total           = Number(recipe.total_cost)         || 0
  const perPortion      = Number(recipe.cost_per_portion)   || 0
  const suggested       = Number(recipe.suggested_price)    || 0
  const photo           = recipe.image_url || recipe.imageUrl

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
              <div className="k-binder-meta-cell-val">{kraftMoney(perPortion)}</div>
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
              <span style={{ fontStyle: 'italic', fontSize: 9 }}>(upload via Recipe Master)</span>
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
          {lines.length === 0 ? (
            <p style={{ color: 'var(--k-muted)', fontStyle: 'italic', fontSize: 12 }}>
              No ingredients linked yet.
            </p>
          ) : (
            <>
              {lines.map((line, idx) => (
                <div key={idx} className="k-binder-ing-row">
                  <div className="k-ing-name">{line.ingredient_name || 'Unknown'}</div>
                  <div className="k-ing-qty">{line.qty}{line.unit ? ` ${line.unit}` : ''}</div>
                  <div className="k-ing-cost">{Number(line.cost || 0).toFixed(2)}</div>
                </div>
              ))}
              <div className="k-binder-batch">
                <span>Batch total</span>
                <span className="k-binder-batch-val">{Number(total).toFixed(2)}</span>
              </div>
            </>
          )}
        </section>

        <section>
          <div className="k-binder-section-head">
            <h3>Method</h3>
            <div className="k-rule-single"/>
          </div>
          {method.length === 0 ? (
            <p style={{ color: 'var(--k-muted)', fontStyle: 'italic', fontSize: 12 }}>
              Add method steps via the recipe's Content drawer.
            </p>
          ) : (
            <ol className="k-binder-method">
              {method.map((step, i) =>
                step.group
                  ? <li key={i} className="k-binder-method-group" style={{ listStyle: 'none', paddingLeft: 0 }}>{step.group}</li>
                  : <li key={i}>{step.step}</li>
              )}
            </ol>
          )}
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

function normalizeMethod(raw) {
  if (!raw || !Array.isArray(raw)) return []
  const out = []
  let lastGroup = null
  for (const item of raw) {
    if (typeof item === 'string') { out.push({ step: item }); continue }
    if (item && typeof item === 'object') {
      const g = item.group || item.group_label || item.groupLabel
      if (g && g !== lastGroup) { out.push({ group: g }); lastGroup = g }
      const s = item.step || item.text
      if (s) out.push({ step: s })
    }
  }
  return out
}
