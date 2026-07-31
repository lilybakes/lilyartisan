import {
  QuietBrandLockup, QuietEyebrow, QuietDot, QuietRule, QuietFooter,
  QuietQty, quietMoney,
} from './_parts.jsx'

/**
 * 09 — RECIPE BINDER PAGE  (A4 portrait) — kitchen reference
 *
 * DC + brand top-left, BINDER · CAKES · REV 04 mono top-right. Big space.
 * Left: rust dot + title (light sans, ~30px), italic muted description.
 * Meta row 4-col: CATEGORY / YIELD / COST / PORTION / SELL / PORTION.
 * Right: bordered thin box "RECIPE PHOTO / PLACEHOLDER" mono muted.
 * Hairlines above + below meta.
 *
 * Two-column body: INGREDIENTS list (name / qty mono / cost mono) with
 * hairline separators + batch total row; METHOD as numbered list with
 * "01" "02" in rust mono + sans body, sub-groups in rust mono small caps.
 * NOTES with 4 hairline ruled lines. Split footer with hairline above.
 */
export function QuietBinderPage({ recipe = {}, brand = {} }) {
  const lines      = recipe.lines || []
  const method     = normalizeMethod(recipe.method)
  const total      = Number(recipe.total_cost)         || 0
  const perPortion = Number(recipe.cost_per_portion)   || 0
  const suggested  = Number(recipe.suggested_price)    || 0
  const photo      = recipe.image_url || recipe.imageUrl
  const category   = (recipe.category || 'Recipe').toUpperCase()

  const now = new Date()
  const rev = `REV ${String(now.getMonth() + 1).padStart(2, '0')}`

  return (
    <div className="tpl q-tpl q-binder printable">
      <header className="q-binder-header">
        <QuietBrandLockup brand={brand} size="sm" layout="inline"/>
        <QuietEyebrow className="q-binder-header-right">Binder · {category} · {rev}</QuietEyebrow>
      </header>

      <div className="q-binder-title-row">
        <div className="q-binder-title-left">
          <div className="q-binder-title-line">
            <QuietDot/>
            <h2 className="q-title q-binder-title">{recipe.name || 'Recipe name'}</h2>
          </div>
          {recipe.description && (
            <p className="q-binder-desc">{recipe.description}</p>
          )}
          <QuietRule marginTop="6mm" marginBottom="4mm"/>
          <div className="q-binder-meta-row">
            <div className="q-binder-meta-cell">
              <QuietEyebrow>Category</QuietEyebrow>
              <div className="q-binder-meta-val">{recipe.category || '—'}</div>
            </div>
            <div className="q-binder-meta-cell">
              <QuietEyebrow>Yield</QuietEyebrow>
              <div className="q-binder-meta-val">{recipe.yield_portions || '—'}</div>
            </div>
            <div className="q-binder-meta-cell">
              <QuietEyebrow>Cost / Portion</QuietEyebrow>
              <div className="q-binder-meta-val">{quietMoney(perPortion)}</div>
            </div>
            <div className="q-binder-meta-cell">
              <QuietEyebrow tone="rust">Sell / Portion</QuietEyebrow>
              <div className="q-binder-meta-val q-rust">{quietMoney(suggested)}</div>
            </div>
          </div>
          <QuietRule/>
        </div>
        <div className="q-binder-photo">
          {photo ? (
            <img src={photo} alt={recipe.name || ''}/>
          ) : (
            <div className="q-binder-photo-placeholder">
              <QuietEyebrow>Recipe Photo</QuietEyebrow>
              <QuietEyebrow>Placeholder</QuietEyebrow>
            </div>
          )}
        </div>
      </div>

      <div className="q-binder-body">
        <section>
          <QuietEyebrow>Ingredients</QuietEyebrow>
          <div className="q-binder-ing-list">
            {lines.length === 0 ? (
              <p className="q-empty">No ingredients linked yet.</p>
            ) : (
              <>
                {lines.map((line, idx) => (
                  <div key={idx} className="q-binder-ing-row">
                    <span className="q-binder-ing-name">{line.ingredient_name || 'Unknown'}</span>
                    <span className="q-binder-ing-qty"><QuietQty qty={line.qty} unit={line.unit}/></span>
                    <span className="q-binder-ing-cost">{Number(line.cost || 0).toFixed(2)}</span>
                  </div>
                ))}
                <div className="q-binder-ing-row q-binder-batch-row">
                  <span className="q-binder-ing-name">Batch total</span>
                  <span/>
                  <span className="q-binder-ing-cost">{Number(total).toFixed(2)}</span>
                </div>
              </>
            )}
          </div>
        </section>

        <section>
          <QuietEyebrow>Method</QuietEyebrow>
          {method.length === 0 ? (
            <p className="q-empty">Add method steps via the recipe's Content drawer.</p>
          ) : (
            <ol className="q-binder-method">
              {method.map((step, i) =>
                step.group
                  ? <li key={i} className="q-method-group">{step.group}</li>
                  : <li key={i}>{step.step}</li>
              )}
            </ol>
          )}
        </section>
      </div>

      <section className="q-binder-notes">
        <QuietEyebrow>Notes</QuietEyebrow>
        <div className="q-binder-notes-lines">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="q-binder-notes-line"/>
          ))}
        </div>
      </section>

      <div className="q-binder-footer-wrap">
        <QuietRule marginBottom="4mm"/>
        <QuietFooter brand={brand} layout="split"/>
      </div>
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
