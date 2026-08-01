import {
  RpOffsetTitle, RpBrandLockup, RpEyebrow, RpRule, RpMethodChip, RpFooter,
  rpMoney, normalizeMethod, zeroPad, renderLastStep,
} from './_parts.jsx'

/**
 * 09 — RECIPE BINDER PAGE  (A4 portrait) — kitchen reference
 *
 * ROW-LAYOUT container: 8mm vertical RUST STRIPE on the LEFT edge runs
 * full 297mm height (align-items: stretch on the container handles the
 * stretch — no min-height needed on the stripe). Content column on the
 * right.
 *
 * Brand top-left. "Kitchen Binder · Cakes · 04" rust tracked caps top-
 * right. Thick navy rule. Offset-effect recipe title on the left; solid
 * NAVY photo placeholder square (~50mm) on the right in cream.
 *
 * 4-cell meta row: CATEGORY, YIELD, COST/PORTION (thin navy outlined
 * cells with navy Manrope 800 value); SELL/PORTION cell is FULL RUST
 * filled with cream — the eye-catch highlight.
 *
 * Two-column body: INGREDIENTS with navy total-row + rust label, METHOD
 * with plain rust digits, LAST step gets NAVY-filled square + cream digit
 * and bolded leading imperative.
 *
 * CHEF'S NOTES with 4 hair-rule lines. Split footer at the bottom.
 */
export function RpBinderPage({ recipe = {}, brand = {} }) {
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
  const isBread = (recipe.category || '').toLowerCase() === 'bread'
  const yieldUnit = isBread
    ? (y === 1 ? 'LOAF' : 'LOAVES')
    : (y === 1 ? 'PORTION' : 'PORTIONS')
  const yieldDisplay = y > 0 ? `${y} ${yieldUnit}` : '—'

  const totalSteps = method.filter(s => !s.group).length
  let stepCounter = 0

  return (
    <div className="tpl rp-tpl rp-binder printable">
      <div className="rp-binder-stripe" aria-hidden="true"/>

      <div className="rp-binder-content">
        <header className="rp-binder-header">
          <RpBrandLockup brand={brand}/>
          <div className="rp-binder-header-right">
            Kitchen Binder · {category} · {rev}
          </div>
        </header>

        <RpRule tone="navy-thick" className="rp-binder-rule"/>

        <div className="rp-binder-title-row">
          <div className="rp-binder-title-left">
            <RpOffsetTitle size="sm">{recipe.name || 'Recipe name'}</RpOffsetTitle>
            {recipe.description && (
              <p className="rp-binder-desc">{recipe.description}</p>
            )}
          </div>
          <div className="rp-binder-photo">
            {photo ? (
              <img src={photo} alt={recipe.name || ''}/>
            ) : (
              <div className="rp-binder-photo-placeholder">
                Recipe Photo<br/>(Placeholder)
              </div>
            )}
          </div>
        </div>

        <div className="rp-binder-meta-row">
          <div className="rp-binder-meta-cell">
            <RpEyebrow tone="rust">Category</RpEyebrow>
            <div className="rp-binder-meta-val">{(recipe.category || '—')}</div>
          </div>
          <div className="rp-binder-meta-cell">
            <RpEyebrow tone="rust">Yield</RpEyebrow>
            <div className="rp-binder-meta-val">{yieldDisplay}</div>
          </div>
          <div className="rp-binder-meta-cell">
            <RpEyebrow tone="rust">Cost / Portion</RpEyebrow>
            <div className="rp-binder-meta-val">{rpMoney(perPortion)}</div>
          </div>
          <div className="rp-binder-meta-cell rp-binder-meta-cell-accent">
            <RpEyebrow tone="cream">Sell / Portion</RpEyebrow>
            <div className="rp-binder-meta-val">{rpMoney(suggested)}</div>
          </div>
        </div>

        <div className="rp-binder-body">
          <section className="rp-binder-section">
            <RpEyebrow tone="rust">Ingredients</RpEyebrow>
            <div className="rp-binder-ing-list">
              {lines.length === 0 ? (
                <p className="rp-empty">No ingredients linked yet.</p>
              ) : (
                <>
                  {lines.map((line, idx) => (
                    <div key={idx} className="rp-binder-ing-row">
                      <span className="rp-binder-ing-name">
                        {line.ingredient_name || 'Unknown'}
                      </span>
                      <span className="rp-binder-ing-qty">
                        {line.qty}{line.unit ? ` ${line.unit}` : ''}
                      </span>
                      <span className="rp-binder-ing-cost">
                        {Number(line.cost || 0).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="rp-binder-batch-row">
                    <span>Batch Total</span>
                    <span/>
                    <span>{Number(total).toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>
          </section>

          <section className="rp-binder-section">
            <RpEyebrow tone="rust">Method</RpEyebrow>
            {method.length === 0 ? (
              <p className="rp-empty">Add method steps via the recipe's Content drawer.</p>
            ) : (
              <ol className="rp-binder-method">
                {method.map((item, i) => {
                  if (item.group) return <li key={i} className="rp-method-group">{item.group}</li>
                  stepCounter += 1
                  const isLast = stepCounter === totalSteps
                  return (
                    <li key={i}>
                      <RpMethodChip
                        number={zeroPad(stepCounter)}
                        variant={isLast ? 'navy' : 'accent'}
                      />
                      <span className={isLast ? 'rp-binder-method-step rp-binder-method-step-final' : 'rp-binder-method-step'}>
                        {isLast ? renderLastStep(item.step) : item.step}
                      </span>
                    </li>
                  )
                })}
              </ol>
            )}
          </section>
        </div>

        <section className="rp-binder-notes">
          <RpEyebrow tone="rust">Chef's Notes</RpEyebrow>
          <div className="rp-binder-notes-lines">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rp-binder-notes-line"/>
            ))}
          </div>
        </section>

        <div className="rp-binder-footer-wrap">
          <RpRule tone="hair" className="rp-binder-footer-rule"/>
          <RpFooter brand={brand} layout="split" showSocials={false}/>
        </div>
      </div>
    </div>
  )
}
