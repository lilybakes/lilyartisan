import {
  LetterpressBrandLockup, LetterpressRule, LetterpressFooter,
  letterpressMoney,
} from './_parts.jsx'

/**
 * 09 — RECIPE BINDER PAGE  (A4 portrait) — kitchen reference
 *
 * Compact brand top-left, "KITCHEN BINDER · CATEGORY" small caps top-right.
 * Single rule. Big product title with italic sub-description, meta row
 * with small-caps labels and serif values, right side dashed photo box.
 * Two-column body: INGREDIENTS with dotted-leader rows + BATCH TOTAL,
 * METHOD as serif numbered list with small-caps sub-groups. CHEF'S NOTES
 * as lined ruled space below.
 */
export function LetterpressBinderPage({ recipe = {}, brand = {} }) {
  const lines      = recipe.lines || []
  const method     = normalizeMethod(recipe.method)
  const total      = Number(recipe.total_cost)         || 0
  const perPortion = Number(recipe.cost_per_portion)   || 0
  const suggested  = Number(recipe.suggested_price)    || 0
  const photo      = recipe.image_url || recipe.imageUrl
  const category   = recipe.category || 'Recipe'

  return (
    <div className="tpl l-tpl l-binder printable">
      <header className="l-binder-header">
        <LetterpressBrandLockup brand={brand} size="sm" layout="row"/>
        <div className="l-eyebrow l-eyebrow-muted l-binder-header-right">
          Kitchen Binder · {category}
        </div>
      </header>

      <LetterpressRule/>

      <div className="l-binder-title-block">
        <div className="l-binder-title-left">
          <h2 className="l-binder-title">{recipe.name || 'Recipe name'}</h2>
          {recipe.description && (
            <p className="l-binder-title-desc">{recipe.description}</p>
          )}
          <div className="l-binder-meta-row">
            <div className="l-binder-meta-cell">
              <div className="l-eyebrow l-eyebrow-muted">Category</div>
              <div className="l-binder-meta-val">{recipe.category || '—'}</div>
            </div>
            <div className="l-binder-meta-cell">
              <div className="l-eyebrow l-eyebrow-muted">Yield</div>
              <div className="l-binder-meta-val">{recipe.yield_portions || '—'}</div>
            </div>
            <div className="l-binder-meta-cell">
              <div className="l-eyebrow l-eyebrow-muted">Cost / Portion</div>
              <div className="l-binder-meta-val">{letterpressMoney(perPortion)}</div>
            </div>
            <div className="l-binder-meta-cell">
              <div className="l-eyebrow l-eyebrow-muted">Sell / Portion</div>
              <div className="l-binder-meta-val l-burgundy">{letterpressMoney(suggested)}</div>
            </div>
          </div>
        </div>
        <div className="l-binder-photo">
          {photo ? (
            <img src={photo} alt={recipe.name || ''}/>
          ) : (
            <div className="l-binder-photo-placeholder">
              <div className="l-eyebrow l-eyebrow-muted">Recipe Photo</div>
              <div className="l-binder-photo-hint">(placeholder when empty)</div>
            </div>
          )}
        </div>
      </div>

      <div className="l-binder-body">
        <section>
          <div className="l-eyebrow l-eyebrow-burgundy l-binder-section-lbl">Ingredients</div>
          <div className="l-binder-section-rule"/>
          {lines.length === 0 ? (
            <p className="l-empty">No ingredients linked yet.</p>
          ) : (
            <>
              {lines.map((line, idx) => (
                <div key={idx} className="l-binder-ing-row">
                  <span className="l-binder-ing-name">{line.ingredient_name || 'Unknown'}</span>
                  <span className="l-binder-ing-qty">
                    {line.qty}{line.unit ? ` ${line.unit}` : ''}
                  </span>
                  <span className="l-binder-ing-cost">
                    {Number(line.cost || 0).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="l-binder-batch">
                <div className="l-eyebrow l-eyebrow-muted">Batch Total</div>
                <div className="l-binder-batch-val">{Number(total).toFixed(2)}</div>
              </div>
            </>
          )}
        </section>

        <section>
          <div className="l-eyebrow l-eyebrow-burgundy l-binder-section-lbl">Method</div>
          <div className="l-binder-section-rule"/>
          {method.length === 0 ? (
            <p className="l-empty">Add method steps via the recipe's Content drawer.</p>
          ) : (
            <ol className="l-binder-method">
              {method.map((step, i) =>
                step.group
                  ? <li key={i} className="l-method-group">{step.group}</li>
                  : <li key={i}>{step.step}</li>
              )}
            </ol>
          )}
        </section>
      </div>

      <div className="l-binder-notes">
        <div className="l-eyebrow l-eyebrow-burgundy l-binder-section-lbl">Chef's Notes</div>
        <div className="l-binder-notes-lines">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="l-binder-notes-line"/>
          ))}
        </div>
      </div>

      <LetterpressFooter brand={brand}/>
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
