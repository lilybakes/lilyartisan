import {
  FiLogo, FiEyebrow, FiRule, FiShortRule, FiMethodChip, FiFooter,
  fiMoney, normalizeMethod, zeroPad, spellOutNumber,
} from './_parts.jsx'

/**
 * 09 — RECIPE BINDER PAGE  (A4 portrait) — kitchen reference
 *
 * Brand top-left (DC circle + name + tagline+city), BINDER · CATEGORY ·
 * REV small caps letter-tracked top-right. Big letter-tracked title +
 * short thin rule + muted description below. Right: STONE-TAN filled
 * rectangle "RECIPE / PHOTOGRAPH" placeholder — the second use of the
 * tan colour in the whole variant.
 *
 * Thin hairline + 4-col meta row (CATEGORY / YIELD spelled out / COST /
 * PORTION / SELL / PORTION) — no bordered cells per the mockup, just
 * aligned columns of small-caps label + light value. Another thin rule.
 *
 * Two-column body: INGREDIENTS (hairline table name / qty / cost, BATCH
 * TOTAL bold with thicker rule above); METHOD (numbered outlined circles
 * "01" "02", sub-groups CUPCAKES / BUTTERCREAM muted small caps, LAST
 * step gets FILLED BLACK circle + bolded highlight phrase).
 *
 * NOTES with 4 hairline ruled lines. Split footer.
 */
export function FiBinderPage({ recipe = {}, brand = {} }) {
  const lines      = recipe.lines || []
  const method     = normalizeMethod(recipe.method)
  const total      = Number(recipe.total_cost)         || 0
  const perPortion = Number(recipe.cost_per_portion)   || 0
  const suggested  = Number(recipe.suggested_price)    || 0
  const photo      = recipe.image_url || recipe.imageUrl
  const category   = (recipe.category || 'Recipes').toUpperCase()

  const now = new Date()
  const rev = String(now.getMonth() + 1).padStart(2, '0')

  const y = Number(recipe.yield_portions) || 0
  const yieldDisplay = spellOutNumber(y, { mode: 'upper' })

  const totalSteps = method.filter(s => !s.group).length
  let stepCounter = 0

  return (
    <div className="tpl fi-tpl fi-binder printable">
      <header className="fi-binder-header">
        <div className="fi-binder-brand-lockup">
          <FiLogo brand={brand} size="sm"/>
          <div className="fi-binder-brand-text">
            <div className="fi-binder-brand-name">
              {(brand.business_name || 'Your Bakery').toUpperCase()}
            </div>
            <FiEyebrow tone="muted">
              {brand.tagline || 'Artisan bakery'} · {(brand.city || 'Ipoh').toUpperCase()}
            </FiEyebrow>
          </div>
        </div>
        <FiEyebrow tone="muted" className="fi-binder-header-right">
          Binder · {category} · {rev}
        </FiEyebrow>
      </header>

      <div className="fi-binder-title-row">
        <div className="fi-binder-title-left">
          <h2 className="fi-title fi-binder-title">
            {(recipe.name || 'Recipe name').toUpperCase()}
          </h2>
          <FiShortRule/>
          {recipe.description && (
            <p className="fi-binder-desc">{recipe.description}</p>
          )}
        </div>
        <div className="fi-binder-photo">
          {photo ? (
            <img src={photo} alt={recipe.name || ''}/>
          ) : (
            <div className="fi-binder-photo-placeholder">
              <FiEyebrow tone="muted">Recipe</FiEyebrow>
              <FiEyebrow tone="muted">Photograph</FiEyebrow>
            </div>
          )}
        </div>
      </div>

      <FiRule tone="ink" marginTop="6mm" marginBottom="4mm"/>

      <div className="fi-binder-meta-row">
        <div className="fi-binder-meta-cell">
          <FiEyebrow tone="muted">Category</FiEyebrow>
          <div className="fi-binder-meta-val">{(recipe.category || '—').toUpperCase()}</div>
        </div>
        <div className="fi-binder-meta-cell">
          <FiEyebrow tone="muted">Yield</FiEyebrow>
          <div className="fi-binder-meta-val">{yieldDisplay || '—'}</div>
        </div>
        <div className="fi-binder-meta-cell">
          <FiEyebrow tone="muted">Cost / Portion</FiEyebrow>
          <div className="fi-binder-meta-val">{fiMoney(perPortion)}</div>
        </div>
        <div className="fi-binder-meta-cell">
          <FiEyebrow tone="muted">Sell / Portion</FiEyebrow>
          <div className="fi-binder-meta-val">{fiMoney(suggested)}</div>
        </div>
      </div>

      <FiRule marginBottom="8mm"/>

      <div className="fi-binder-body">
        <section className="fi-binder-section">
          <FiEyebrow tone="muted">Ingredients</FiEyebrow>
          <div className="fi-binder-ing-list">
            {lines.length === 0 ? (
              <p className="fi-empty">No ingredients linked yet.</p>
            ) : (
              <>
                {lines.map((line, idx) => (
                  <div key={idx} className="fi-binder-ing-row">
                    <span className="fi-binder-ing-name">
                      {(line.ingredient_name || 'Unknown').toUpperCase()}
                    </span>
                    <span className="fi-binder-ing-qty">
                      {line.qty}{line.unit ? ` ${line.unit.toUpperCase()}` : ''}
                    </span>
                    <span className="fi-binder-ing-cost">
                      {Number(line.cost || 0).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="fi-binder-batch-row">
                  <span>Batch total</span>
                  <span/>
                  <span>{Number(total).toFixed(2)}</span>
                </div>
              </>
            )}
          </div>
        </section>

        <section className="fi-binder-section">
          <FiEyebrow tone="muted">Method</FiEyebrow>
          {method.length === 0 ? (
            <p className="fi-empty">Add method steps via the recipe's Content drawer.</p>
          ) : (
            <ol className="fi-binder-method">
              {method.map((item, i) => {
                if (item.group) return <li key={i} className="fi-method-group">{item.group}</li>
                stepCounter += 1
                const isLast = stepCounter === totalSteps
                return (
                  <li key={i}>
                    <FiMethodChip number={zeroPad(stepCounter)} variant={isLast ? 'accent' : 'normal'}/>
                    <span className={isLast ? 'fi-binder-method-step fi-binder-method-step-final' : 'fi-binder-method-step'}>
                      {isLast ? renderLastStep(item.step) : item.step}
                    </span>
                  </li>
                )
              })}
            </ol>
          )}
        </section>
      </div>

      <section className="fi-binder-notes">
        <FiEyebrow tone="muted">Notes</FiEyebrow>
        <div className="fi-binder-notes-lines">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="fi-binder-notes-line"/>
          ))}
        </div>
      </section>

      <div className="fi-binder-footer-wrap">
        <FiRule marginTop="auto" marginBottom="4mm"/>
        <FiFooter brand={brand} layout="split" showSocials={false}/>
      </div>
    </div>
  )
}

function renderLastStep(text) {
  if (!text) return null
  const s = String(text).trim()
  const m = s.match(/^(.+?\s+)(\w+\s+\w+)(\s+.+)$/)
  if (m && s.length > 30 && s.length < 90) {
    return <>{m[1]}<strong>{m[2]}</strong>{m[3]}</>
  }
  const m2 = s.match(/^([A-Z][a-z]+(?:\s+[a-z]+)?)\s+(.+)$/)
  if (m2) return <><strong>{m2[1]}</strong> {m2[2]}</>
  return s
}
