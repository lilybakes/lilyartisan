import {
  EmberBrandLockup, EmberEyebrow, EmberRule, EmberFooter,
  emberMoney, normalizeMethod, zeroPad,
} from './_parts.jsx'

/**
 * 09 — RECIPE BINDER PAGE  (A4 portrait) — kitchen reference
 *
 * Thin LEFT vertical gradient stripe (burgundy top → orange bottom) —
 * signature Ember mark. Brand heavy condensed uppercase black + tagline
 * muted left. KITCHEN BINDER · CAKES · REV small caps ember top-right.
 * Thick black rule.
 *
 * Left main: massive title heavy condensed uppercase black + muted sans
 * description. Right: white-bordered rectangle "RECIPE PHOTO (PLACEHOLDER)".
 *
 * Meta row of 4 bordered cells — 3 white-with-black-border cells for
 * CATEGORY / YIELD / COST / PORTION, the FOURTH (SELL / PORTION) inverted
 * to filled EMBER RED with cream text — the accent that draws the eye
 * to the price the kitchen sells at.
 *
 * Two-column body: INGREDIENTS (name / qty / cost, hairline rows, BATCH
 * TOTAL bold with double border above); METHOD as numbered "01" "02" in
 * heavy ember + sans body, sub-groups in muted small caps, LAST step
 * gets a bolded highlight phrase. CHEF'S NOTES with 3 ruled lines.
 */
export function EmberBinderPage({ recipe = {}, brand = {} }) {
  const lines      = recipe.lines || []
  const method     = normalizeMethod(recipe.method)
  const total      = Number(recipe.total_cost)         || 0
  const perPortion = Number(recipe.cost_per_portion)   || 0
  const suggested  = Number(recipe.suggested_price)    || 0
  const photo      = recipe.image_url || recipe.imageUrl
  const category   = (recipe.category || 'Recipes').toUpperCase()

  const now = new Date()
  const rev = String(now.getMonth() + 1).padStart(2, '0')

  const totalSteps = method.filter(s => !s.group).length
  let stepCounter = 0

  return (
    <div className="tpl em-tpl em-binder printable">
      <div className="em-binder-stripe" aria-hidden="true"/>

      <div className="em-binder-content">
        <header className="em-binder-header">
          <EmberBrandLockup brand={brand} size="sm"/>
          <EmberEyebrow className="em-binder-header-right">
            Kitchen Binder · {category} · {rev}
          </EmberEyebrow>
        </header>

        <EmberRule/>

        <div className="em-binder-title-row">
          <div className="em-binder-title-left">
            <h2 className="em-title em-binder-title">{(recipe.name || 'Recipe name').toUpperCase()}</h2>
            {recipe.description && (
              <p className="em-binder-desc">{recipe.description}</p>
            )}
          </div>
          <div className="em-binder-photo">
            {photo ? (
              <img src={photo} alt={recipe.name || ''}/>
            ) : (
              <div className="em-binder-photo-placeholder">
                <EmberEyebrow tone="muted">Recipe Photo</EmberEyebrow>
                <EmberEyebrow tone="muted">(Placeholder)</EmberEyebrow>
              </div>
            )}
          </div>
        </div>

        <div className="em-binder-meta-row">
          <div className="em-binder-meta-cell">
            <EmberEyebrow>Category</EmberEyebrow>
            <div className="em-binder-meta-val">{(recipe.category || '—').toUpperCase()}</div>
          </div>
          <div className="em-binder-meta-cell">
            <EmberEyebrow>Yield</EmberEyebrow>
            <div className="em-binder-meta-val">{recipe.yield_portions || '—'}</div>
          </div>
          <div className="em-binder-meta-cell">
            <EmberEyebrow>Cost / Portion</EmberEyebrow>
            <div className="em-binder-meta-val">{emberMoney(perPortion)}</div>
          </div>
          <div className="em-binder-meta-cell em-binder-meta-cell-accent">
            <EmberEyebrow tone="cream">Sell / Portion</EmberEyebrow>
            <div className="em-binder-meta-val">{emberMoney(suggested)}</div>
          </div>
        </div>

        <div className="em-binder-body">
          <section className="em-binder-section">
            <EmberEyebrow>Ingredients</EmberEyebrow>
            <div className="em-binder-ing-list">
              {lines.length === 0 ? (
                <p className="em-empty">No ingredients linked yet.</p>
              ) : (
                <>
                  {lines.map((line, idx) => (
                    <div key={idx} className="em-binder-ing-row">
                      <span className="em-binder-ing-name">{line.ingredient_name || 'Unknown'}</span>
                      <span className="em-binder-ing-qty">
                        {line.qty}{line.unit ? ` ${line.unit}` : ''}
                      </span>
                      <span className="em-binder-ing-cost">
                        {Number(line.cost || 0).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="em-binder-batch-row">
                    <span>Batch total</span>
                    <span/>
                    <span>{Number(total).toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>
          </section>

          <section className="em-binder-section">
            <EmberEyebrow>Method</EmberEyebrow>
            {method.length === 0 ? (
              <p className="em-empty">Add method steps via the recipe's Content drawer.</p>
            ) : (
              <ol className="em-binder-method">
                {method.map((item, i) => {
                  if (item.group) return <li key={i} className="em-method-group">{item.group}</li>
                  stepCounter += 1
                  const isLast = stepCounter === totalSteps
                  return (
                    <li key={i}>
                      <span className="em-binder-method-num">{zeroPad(stepCounter)}</span>
                      <span className="em-binder-method-step">
                        {isLast ? renderLastStep(item.step) : item.step}
                      </span>
                    </li>
                  )
                })}
              </ol>
            )}
          </section>
        </div>

        <section className="em-binder-notes">
          <EmberEyebrow>Chef's Notes</EmberEyebrow>
          <div className="em-binder-notes-lines">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="em-binder-notes-line"/>
            ))}
          </div>
        </section>

        <div className="em-binder-footer-wrap">
          <EmberRule marginTop="auto" marginBottom="4mm"/>
          <EmberFooter brand={brand} layout="split" showSocials={false}/>
        </div>
      </div>
    </div>
  )
}

function renderLastStep(text) {
  if (!text) return null
  const s = String(text).trim()
  // Look for "Pipe onto **fully cooled** cupcakes" pattern — bold a 1-2
  // word phrase in the middle if it fits, else fall back to plain.
  const m = s.match(/^(.+?\s+)(\w+\s+\w+)(\s+.+)$/)
  if (m && s.length > 30 && s.length < 90) {
    // Take a phrase near the middle as the highlight — matches the mockup's
    // subtle emphasis on the critical descriptor
    return <>{m[1]}<strong>{m[2]}</strong>{m[3]}</>
  }
  return s
}
