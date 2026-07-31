import {
  AuLogo, AuEyebrow, AuRule, AuMethodChip, AuFooter,
  auMoney, normalizeMethod, zeroPad, formatQtyUnit,
} from './_parts.jsx'

/**
 * 09 — RECIPE BINDER PAGE  (A4 portrait) — kitchen reference
 *
 * Thin vertical gradient band along the LEFT edge (~8mm wide, full page
 * height). Rest of the page is lavender paper. Brand top-left (circle +
 * name + tagline+city), BINDER · CATEGORY · REV purple eyebrow top-right.
 * Big Manrope extrabold title + muted description; right: gradient-glass
 * photo placeholder box.
 *
 * Meta row: CATEGORY / YIELD / COST · PORTION / SELL · PORTION. Two-col
 * body: INGREDIENTS (hairline table name / qty / cost, BATCH TOTAL bold
 * with stronger rule); METHOD (numbered gradient chips, LAST step gets
 * hot-pink chip + bolded phrase). NOTES with 4 hairline lines. Split
 * footer.
 */
export function AuBinderPage({ recipe = {}, brand = {} }) {
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

  const totalSteps = method.filter(s => !s.group).length
  let stepCounter = 0

  return (
    <div className="tpl au-tpl au-binder printable">
      <div className="au-binder-stripe"/>

      <div className="au-binder-inner">
        <header className="au-binder-header">
          <div className="au-binder-brand-lockup">
            <AuLogo brand={brand} size="sm"/>
            <div className="au-binder-brand-text">
              <div className="au-binder-brand-name">
                {(brand.business_name || 'Your Bakery').toUpperCase()}
              </div>
              <div className="au-binder-brand-tag">
                {(brand.tagline || 'Artisan bakery').toUpperCase()} · {(brand.city || 'Ipoh').toUpperCase()}
              </div>
            </div>
          </div>
          <div className="au-binder-header-right">
            BINDER · {category} · REV {rev}
          </div>
        </header>

        <div className="au-binder-title-row">
          <div className="au-binder-title-left">
            <AuEyebrow tone="purple">Kitchen Sheet</AuEyebrow>
            <h2 className="au-title au-binder-title">
              {(recipe.name || 'Recipe name').toUpperCase()}
            </h2>
            {recipe.description && (
              <p className="au-binder-desc">{recipe.description}</p>
            )}
          </div>
          <div className="au-binder-photo">
            {photo ? (
              <img src={photo} alt={recipe.name || ''}/>
            ) : (
              <div className="au-binder-photo-placeholder">
                <div className="au-binder-photo-label">RECIPE</div>
                <div className="au-binder-photo-label">PHOTOGRAPH</div>
              </div>
            )}
          </div>
        </div>

        <AuRule tone="hair" marginTop="6mm" marginBottom="4mm"/>

        <div className="au-binder-meta-row">
          <div className="au-binder-meta-cell">
            <AuEyebrow tone="purple">Category</AuEyebrow>
            <div className="au-binder-meta-val">{(recipe.category || '—').toUpperCase()}</div>
          </div>
          <div className="au-binder-meta-cell">
            <AuEyebrow tone="purple">Yield</AuEyebrow>
            <div className="au-binder-meta-val">{y || '—'}</div>
          </div>
          <div className="au-binder-meta-cell">
            <AuEyebrow tone="purple">Cost / Portion</AuEyebrow>
            <div className="au-binder-meta-val">{auMoney(perPortion)}</div>
          </div>
          <div className="au-binder-meta-cell">
            <AuEyebrow tone="purple">Sell / Portion</AuEyebrow>
            <div className="au-binder-meta-val">{auMoney(suggested)}</div>
          </div>
        </div>

        <AuRule marginBottom="8mm"/>

        <div className="au-binder-body">
          <section className="au-binder-section">
            <AuEyebrow tone="purple">Ingredients</AuEyebrow>
            <div className="au-binder-ing-list">
              {lines.length === 0 ? (
                <p className="au-empty">No ingredients linked yet.</p>
              ) : (
                <>
                  {lines.map((line, idx) => (
                    <div key={idx} className="au-binder-ing-row">
                      <span className="au-binder-ing-name">
                        {(line.ingredient_name || 'Unknown').toUpperCase()}
                      </span>
                      <span className="au-binder-ing-qty">
                        {formatQtyUnit(line.qty, line.unit)}
                      </span>
                      <span className="au-binder-ing-cost">
                        {Number(line.cost || 0).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="au-binder-batch-row">
                    <span>Batch total</span>
                    <span/>
                    <span>{Number(total).toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>
          </section>

          <section className="au-binder-section">
            <AuEyebrow tone="purple">Method</AuEyebrow>
            {method.length === 0 ? (
              <p className="au-empty">Add method steps via the recipe's Content drawer.</p>
            ) : (
              <ol className="au-binder-method">
                {method.map((item, i) => {
                  if (item.group) return <li key={i} className="au-method-group">{item.group}</li>
                  stepCounter += 1
                  const isLast = stepCounter === totalSteps
                  return (
                    <li key={i}>
                      <AuMethodChip number={zeroPad(stepCounter)} variant={isLast ? 'accent' : 'normal'}/>
                      <span className={isLast ? 'au-binder-method-step au-binder-method-step-final' : 'au-binder-method-step'}>
                        {isLast ? renderLastStep(item.step) : item.step}
                      </span>
                    </li>
                  )
                })}
              </ol>
            )}
          </section>
        </div>

        <section className="au-binder-notes">
          <AuEyebrow tone="purple">Notes</AuEyebrow>
          <div className="au-binder-notes-lines">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="au-binder-notes-line"/>
            ))}
          </div>
        </section>

        <div className="au-binder-footer-wrap">
          <AuRule marginTop="auto" marginBottom="4mm"/>
          <AuFooter brand={brand} layout="split" showSocials={false}/>
        </div>
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
