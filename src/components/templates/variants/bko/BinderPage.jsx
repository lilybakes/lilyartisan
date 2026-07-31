import { BkoBrandLockup, BkoRule, BkoFooter, bkoMoney } from './_parts.jsx'

/**
 * 09 — RECIPE BINDER PAGE  (A4 portrait) — kitchen reference
 *
 * FIELD MAPPING:
 *   recipe.lines[]              — ingredient rows
 *   recipe.method[]             — steps, with { group } sub-headings
 *   recipe.description          — subtitle under the title
 *   recipe.image_url            — photo box (dashed placeholder when absent)
 *   recipe.total_cost           — batch total
 *   recipe.cost_per_portion     — meta cell
 *   recipe.suggested_price      — meta cell
 */
export function BkoBinderPage({ recipe = {}, brand = {} }) {
  const lines      = recipe.lines || []
  const method     = normalizeMethod(recipe.method)
  const total      = Number(recipe.total_cost)       || 0
  const perPortion = Number(recipe.cost_per_portion) || 0
  const suggested  = Number(recipe.suggested_price)  || 0
  const photo      = recipe.image_url || recipe.imageUrl

  return (
    <div className="tpl b-tpl b-binder printable">
      <header className="b-header">
        <BkoBrandLockup brand={brand} size="md" layout="row"/>
      </header>

      <BkoRule/>

      <div className="b-binder-title-block">
        <div className="b-binder-title-left">
          <h2>{recipe.name || 'Recipe name'}</h2>
          {recipe.description && (
            <div className="b-binder-title-desc">{recipe.description}</div>
          )}
        </div>
        <div className="b-binder-photo">
          {photo ? (
            <img src={photo} alt={recipe.name || ''}/>
          ) : (
            <div className="b-binder-photo-placeholder">
              Recipe photo<br/>
              <span className="b-binder-photo-hint">(placeholder when empty)</span>
            </div>
          )}
        </div>
      </div>

      <div className="b-binder-meta-row">
        <div>
          <div className="b-eyebrow b-eyebrow-muted">Category</div>
          <div className="b-binder-meta-val">{recipe.category || '—'}</div>
        </div>
        <div>
          <div className="b-eyebrow b-eyebrow-muted">Yield</div>
          <div className="b-binder-meta-val">{recipe.yield_portions || '—'}</div>
        </div>
        <div>
          <div className="b-eyebrow b-eyebrow-muted">Cost / Portion</div>
          <div className="b-binder-meta-val">{bkoMoney(perPortion)}</div>
        </div>
        <div>
          <div className="b-eyebrow b-eyebrow-muted">Sell / Portion</div>
          <div className="b-binder-meta-val b-accent">{bkoMoney(suggested)}</div>
        </div>
      </div>

      <div className="b-binder-body">
        <section>
          <div className="b-eyebrow b-eyebrow-accent b-section-lbl">Ingredients</div>
          {lines.length === 0 ? (
            <p className="b-empty">No ingredients linked yet.</p>
          ) : (
            <>
              {lines.map((line, idx) => (
                <div key={idx} className="b-binder-ing-row">
                  <div className="b-ing-name">{line.ingredient_name || 'Unknown'}</div>
                  <div className="b-ing-qty">{line.qty}{line.unit ? ` ${line.unit}` : ''}</div>
                  <div className="b-ing-cost">{Number(line.cost || 0).toFixed(2)}</div>
                </div>
              ))}
              <div className="b-binder-batch">
                <span>Batch total</span>
                <span className="b-binder-batch-val">{Number(total).toFixed(2)}</span>
              </div>
            </>
          )}
        </section>

        <section>
          <div className="b-eyebrow b-eyebrow-accent b-section-lbl">Method</div>
          {method.length === 0 ? (
            <p className="b-empty">Add method steps via the recipe's Content drawer.</p>
          ) : (
            <ol className="b-binder-method">
              {method.map((step, i) =>
                step.group
                  ? <li key={i} className="b-method-group">{step.group}</li>
                  : <li key={i}>{step.step}</li>
              )}
            </ol>
          )}
        </section>
      </div>

      <div className="b-binder-notes">
        <div className="b-eyebrow b-eyebrow-accent b-section-lbl">Chef's notes</div>
        <div className="b-binder-notes-lines">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="b-binder-notes-line"/>
          ))}
        </div>
      </div>

      <BkoFooter brand={brand} layout="split"/>
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
