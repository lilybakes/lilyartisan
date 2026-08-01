import {
  TrEyebrow, TrRule, TrMetaCell, TrMethodDigit, TrFooter,
  trMoney, normalizeMethod, zeroPad, renderLastStep,
} from './_parts.jsx'

/**
 * 09 — RECIPE BINDER PAGE  (A4 portrait, 210×297mm) — kitchen reference
 *
 * Row layout: TEAL vertical stripe (~8mm) on the LEFT edge (solid teal,
 * no grid). Right main area (~202mm) has the grid background.
 *
 * Right main: brand info top-left, `BINDER / CAKES / REV_04` teal mono
 * top-right.
 *
 * Thin teal hair rule.
 *
 * HUGE `Vanilla Cupcakes with Buttercream` Manrope 800 white title left
 * (wraps 2 lines), muted body subtitle under it. Photo placeholder box
 * right: DASHED teal border rectangle, mono uppercase `RECIPE_PHOTO /
 * [ PLACEHOLDER ]` teal muted centered inside.
 *
 * 4-cell meta row (CATEGORY, YIELD, COST/UNIT, SELL/UNIT) — each a rect
 * with TEAL LEFT BAR, mono uppercase teal label, Manrope 700 value.
 * SELL/UNIT value in TEAL mono, others white.
 *
 * Two-column body: INPUTS + SEQUENCE.
 *
 * SEQUENCE: `// CUPCAKES` and `// BUTTERCREAM` as JS-comment-style dim
 * mono sub-headers between step groups.
 *
 * Method: teal mono digit + off-white body, FINAL step amber digit +
 * amber-bold leading imperative.
 *
 * BATCH_TOTAL row at end of inputs: teal top border, mono `BATCH_TOTAL`
 * label, teal mono value.
 *
 * NOTES section at bottom: teal `NOTES` eyebrow + hair rule lines.
 */
export function TrBinderPage({ recipe = {}, brand = {} }) {
  const lines      = recipe.lines || []
  const method     = normalizeMethod(recipe.method)
  const total      = Number(recipe.total_cost)         || 0
  const perPortion = Number(recipe.cost_per_portion)   || 0
  const suggested  = Number(recipe.suggested_price)    || 0
  const photo      = recipe.image_url || recipe.imageUrl
  const category   = (recipe.category || 'RECIPES').toUpperCase().replace(/\s+/g, '_')

  const now = new Date()
  const rev = String(now.getMonth() + 1).padStart(2, '0')

  const y = Number(recipe.yield_portions) || 0
  const yieldDisplay = y > 0 ? String(y) : '—'

  const totalSteps = method.filter(s => !s.group).length
  let stepCounter = 0

  const cityLine = brand.city ||
    (brand.address_line2 && brand.address_line2.split(',').pop().trim()) ||
    'Ipoh'

  return (
    <div className="tpl tr-tpl tr-binder printable">
      <div className="tr-binder-stripe"/>
      <div className="tr-binder-main">
        <header className="tr-binder-header">
          <div className="tr-binder-brand">
            <div className="tr-binder-brand-name">
              {brand.business_name || 'The Daily Crumb'}
            </div>
            <div className="tr-binder-brand-sub">
              {(brand.tagline || 'ARTISAN BAKERY').toUpperCase()} / {cityLine.toUpperCase()}
            </div>
          </div>
          <TrEyebrow tone="teal" className="tr-binder-header-right">
            BINDER / {category} / REV_{rev}
          </TrEyebrow>
        </header>

        <TrRule tone="hair" marginTop="3mm" marginBottom="6mm"/>

        <div className="tr-binder-title-row">
          <div className="tr-binder-title-left">
            <h2 className="tr-binder-title">
              {recipe.name || 'Vanilla Cupcakes with Buttercream'}
            </h2>
            {recipe.description && (
              <p className="tr-binder-desc">{recipe.description}</p>
            )}
          </div>
          <div className="tr-binder-photo">
            {photo ? (
              <img src={photo} alt={recipe.name || ''}/>
            ) : (
              <div className="tr-binder-photo-placeholder">
                RECIPE_PHOTO
                <br/>
                [ PLACEHOLDER ]
              </div>
            )}
          </div>
        </div>

        <div className="tr-binder-meta-row">
          <TrMetaCell label="CATEGORY"  value={(recipe.category || '—').toUpperCase()}/>
          <TrMetaCell label="YIELD"     value={yieldDisplay}/>
          <TrMetaCell label="COST/UNIT" value={trMoney(perPortion)}/>
          <TrMetaCell label="SELL/UNIT" value={trMoney(suggested)} tone="teal"/>
        </div>

        <div className="tr-binder-body">
          <section className="tr-binder-section">
            <TrEyebrow tone="teal">INPUTS</TrEyebrow>
            <div className="tr-binder-ing-list">
              {lines.length === 0 ? (
                <p className="tr-empty">// no ingredients linked yet</p>
              ) : (
                <>
                  {lines.map((line, idx) => (
                    <div key={idx} className="tr-binder-ing-row">
                      <span className="tr-binder-ing-name">
                        {line.ingredient_name || 'Unknown'}
                      </span>
                      <span className="tr-binder-ing-qty">
                        {line.qty}{line.unit ? ` ${line.unit}` : ''}
                      </span>
                      <span className="tr-binder-ing-cost">
                        {Number(line.cost || 0).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="tr-binder-batch-row">
                    <span>BATCH_TOTAL</span>
                    <span/>
                    <span>{Number(total).toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>
          </section>

          <section className="tr-binder-section">
            <TrEyebrow tone="teal">SEQUENCE</TrEyebrow>
            {method.length === 0 ? (
              <p className="tr-empty">// no method — add via Content drawer</p>
            ) : (
              <ol className="tr-binder-method">
                {method.map((item, i) => {
                  if (item.group) {
                    return <li key={i} className="tr-method-group">// {item.group}</li>
                  }
                  stepCounter += 1
                  const isLast = stepCounter === totalSteps
                  return (
                    <li key={i}>
                      <TrMethodDigit number={zeroPad(stepCounter)} variant={isLast ? 'accent' : 'normal'}/>
                      <span className={isLast ? 'tr-binder-method-step tr-binder-method-step-final' : 'tr-binder-method-step'}>
                        {isLast ? renderLastStep(item.step) : item.step}
                      </span>
                    </li>
                  )
                })}
              </ol>
            )}
          </section>
        </div>

        <section className="tr-binder-notes">
          <TrEyebrow tone="teal">NOTES</TrEyebrow>
          <div className="tr-binder-notes-lines">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="tr-binder-notes-line"/>
            ))}
          </div>
        </section>

        <div className="tr-binder-footer-wrap">
          <TrRule tone="hair" marginTop="auto" marginBottom="3mm"/>
          <TrFooter brand={brand} layout="split" showSocials={false}/>
        </div>
      </div>
    </div>
  )
}
