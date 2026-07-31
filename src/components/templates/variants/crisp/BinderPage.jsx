import { CrispBrandLockup, CrispRule, CrispFooter, crispMoney } from './_parts.jsx'

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
export function CrispBinderPage({ recipe = {}, brand = {} }) {
  const lines      = recipe.lines || []
  const method     = normalizeMethod(recipe.method)
  const total      = Number(recipe.total_cost)       || 0
  const perPortion = Number(recipe.cost_per_portion) || 0
  const suggested  = Number(recipe.suggested_price)  || 0
  const photo      = recipe.image_url || recipe.imageUrl

  return (
    <div className="tpl c-tpl c-binder printable">
      <header className="c-header">
        <CrispBrandLockup brand={brand} size="md" layout="row"/>
      </header>

      <CrispRule/>

      <div className="c-binder-title-block">
        <div className="c-binder-title-left">
          <h2>{recipe.name || 'Recipe name'}</h2>
          {recipe.description && (
            <div className="c-binder-title-desc">{recipe.description}</div>
          )}
        </div>
        <div className="c-binder-photo">
          {photo ? (
            <img src={photo} alt={recipe.name || ''}/>
          ) : (
            <div className="c-binder-photo-placeholder">
              Recipe photo<br/>
              <span className="c-binder-photo-hint">(placeholder when empty)</span>
            </div>
          )}
        </div>
      </div>

      <div className="c-binder-meta-row">
        <div>
          <div className="c-eyebrow c-eyebrow-muted">Category</div>
          <div className="c-binder-meta-val">{recipe.category || '—'}</div>
        </div>
        <div>
          <div className="c-eyebrow c-eyebrow-muted">Yield</div>
          <div className="c-binder-meta-val">{recipe.yield_portions || '—'}</div>
        </div>
        <div>
          <div className="c-eyebrow c-eyebrow-muted">Cost / Portion</div>
          <div className="c-binder-meta-val">{crispMoney(perPortion)}</div>
        </div>
        <div>
          <div className="c-eyebrow c-eyebrow-muted">Sell / Portion</div>
          <div className="c-binder-meta-val c-brown">{crispMoney(suggested)}</div>
        </div>
      </div>

      <div className="c-binder-body">
        <section>
          <div className="c-eyebrow c-eyebrow-brown c-section-lbl">Ingredients</div>
          {lines.length === 0 ? (
            <p className="c-empty">No ingredients linked yet.</p>
          ) : (
            <>
              {lines.map((line, idx) => (
                <div key={idx} className="c-binder-ing-row">
                  <div className="c-ing-name">{line.ingredient_name || 'Unknown'}</div>
                  <div className="c-ing-qty">{line.qty}{line.unit ? ` ${line.unit}` : ''}</div>
                  <div className="c-ing-cost">{Number(line.cost || 0).toFixed(2)}</div>
                </div>
              ))}
              <div className="c-binder-batch">
                <span>Batch total</span>
                <span className="c-binder-batch-val">{Number(total).toFixed(2)}</span>
              </div>
            </>
          )}
        </section>

        <section>
          <div className="c-eyebrow c-eyebrow-brown c-section-lbl">Method</div>
          {method.length === 0 ? (
            <p className="c-empty">Add method steps via the recipe's Content drawer.</p>
          ) : (
            <ol className="c-binder-method">
              {method.map((step, i) =>
                step.group
                  ? <li key={i} className="c-method-group">{step.group}</li>
                  : <li key={i}>{step.step}</li>
              )}
            </ol>
          )}
        </section>
      </div>

      <div className="c-binder-notes">
        <div className="c-eyebrow c-eyebrow-brown c-section-lbl">Chef's notes</div>
        <div className="c-binder-notes-lines">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="c-binder-notes-line"/>
          ))}
        </div>
      </div>

      <CrispFooter brand={brand} layout="split"/>
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
