import {
  TeLogo, TeEyebrow, TeRule, TeShortRule, TeMethodChip, TeFooter,
  teMoney, normalizeMethod, zeroPad, spellOutNumber,
} from './_parts.jsx'

/**
 * 09 — RECIPE BINDER PAGE  (A4 portrait) — kitchen reference
 *
 * Brand top-left (quadrant logo + name + tagline+city), BINDER /
 * CATEGORY / REV mono top-right. Bold Manrope title, short rule,
 * muted description. Right: cream-tile filled photo placeholder.
 *
 * Thin hairline + 4-col meta row (CATEGORY / YIELD / COST/PORTION /
 * SELL/PORTION). Another thin rule.
 *
 * Two-column body: INGREDIENTS (hairline table name / qty / cost,
 * BATCH TOTAL bold with a strong navy rule above); METHOD (5mm square
 * chips with mono numbers, sub-groups muted mono caps, LAST step gets
 * FILLED RUST chip + bolded highlight phrase).
 *
 * NOTES with 4 hairline ruled lines. Split footer.
 */
export function TeBinderPage({ recipe = {}, brand = {} }) {
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
    <div className="tpl te-tpl te-binder printable">
      <header className="te-binder-header">
        <div className="te-binder-brand-lockup">
          <TeLogo brand={brand} size="sm"/>
          <div className="te-binder-brand-text">
            <div className="te-binder-brand-name">
              {(brand.business_name || 'Your Bakery').toUpperCase()}
            </div>
            <TeEyebrow tone="muted">
              {brand.tagline || 'Artisan bakery'} · {(brand.city || 'Ipoh').toUpperCase()}
            </TeEyebrow>
          </div>
        </div>
        <TeEyebrow tone="muted" className="te-binder-header-right">
          Binder / {category} / {rev}
        </TeEyebrow>
      </header>

      <div className="te-binder-title-row">
        <div className="te-binder-title-left">
          <h2 className="te-title te-binder-title">
            {(recipe.name || 'Recipe name').toUpperCase()}
          </h2>
          <TeShortRule/>
          {recipe.description && (
            <p className="te-binder-desc">{recipe.description}</p>
          )}
        </div>
        <div className="te-binder-photo">
          {photo ? (
            <img src={photo} alt={recipe.name || ''}/>
          ) : (
            <div className="te-binder-photo-placeholder">
              <TeEyebrow tone="muted">Recipe</TeEyebrow>
              <TeEyebrow tone="muted">Photograph</TeEyebrow>
            </div>
          )}
        </div>
      </div>

      <TeRule tone="ink" marginTop="6mm" marginBottom="4mm"/>

      <div className="te-binder-meta-row">
        <div className="te-binder-meta-cell">
          <TeEyebrow tone="muted">Category</TeEyebrow>
          <div className="te-binder-meta-val">{(recipe.category || '—').toUpperCase()}</div>
        </div>
        <div className="te-binder-meta-cell">
          <TeEyebrow tone="muted">Yield</TeEyebrow>
          <div className="te-binder-meta-val">{yieldDisplay || '—'}</div>
        </div>
        <div className="te-binder-meta-cell">
          <TeEyebrow tone="muted">Cost / Portion</TeEyebrow>
          <div className="te-binder-meta-val">{teMoney(perPortion)}</div>
        </div>
        <div className="te-binder-meta-cell">
          <TeEyebrow tone="muted">Sell / Portion</TeEyebrow>
          <div className="te-binder-meta-val">{teMoney(suggested)}</div>
        </div>
      </div>

      <TeRule marginBottom="8mm"/>

      <div className="te-binder-body">
        <section className="te-binder-section">
          <TeEyebrow tone="rust">Ingredients</TeEyebrow>
          <div className="te-binder-ing-list">
            {lines.length === 0 ? (
              <p className="te-empty">No ingredients linked yet.</p>
            ) : (
              <>
                {lines.map((line, idx) => (
                  <div key={idx} className="te-binder-ing-row">
                    <span className="te-binder-ing-name">
                      {(line.ingredient_name || 'Unknown').toUpperCase()}
                    </span>
                    <span className="te-binder-ing-qty">
                      {line.qty}{line.unit ? ` ${line.unit.toUpperCase()}` : ''}
                    </span>
                    <span className="te-binder-ing-cost">
                      {Number(line.cost || 0).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="te-binder-batch-row">
                  <span>Batch total</span>
                  <span/>
                  <span>{Number(total).toFixed(2)}</span>
                </div>
              </>
            )}
          </div>
        </section>

        <section className="te-binder-section">
          <TeEyebrow tone="rust">Method</TeEyebrow>
          {method.length === 0 ? (
            <p className="te-empty">Add method steps via the recipe's Content drawer.</p>
          ) : (
            <ol className="te-binder-method">
              {method.map((item, i) => {
                if (item.group) return <li key={i} className="te-method-group">{item.group}</li>
                stepCounter += 1
                const isLast = stepCounter === totalSteps
                return (
                  <li key={i}>
                    <TeMethodChip number={zeroPad(stepCounter)} variant={isLast ? 'accent' : 'normal'}/>
                    <span className={isLast ? 'te-binder-method-step te-binder-method-step-final' : 'te-binder-method-step'}>
                      {isLast ? renderLastStep(item.step) : item.step}
                    </span>
                  </li>
                )
              })}
            </ol>
          )}
        </section>
      </div>

      <section className="te-binder-notes">
        <TeEyebrow tone="rust">Notes</TeEyebrow>
        <div className="te-binder-notes-lines">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="te-binder-notes-line"/>
          ))}
        </div>
      </section>

      <div className="te-binder-footer-wrap">
        <TeRule marginTop="auto" marginBottom="4mm"/>
        <TeFooter brand={brand} layout="split" showSocials={false}/>
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
