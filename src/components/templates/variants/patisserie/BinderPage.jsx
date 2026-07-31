import {
  PaLogo, PaEyebrow, PaRule, PaShortRule, PaSubtitle, PaFooter,
  paMoney, normalizeMethod, toRoman, spellOutNumber, renderFinalStep,
} from './_parts.jsx'

/**
 * 09 — RECIPE BINDER PAGE  (A4 portrait) — kitchen reference
 *
 * Gold-framed cream A4. Brand + "KITCHEN BINDER · CAKES · 04" top row
 * (mauve tracked caps right). Hair rule. Big burgundy Cormorant title
 * LEFT, italic muted subtitle underneath. Photo placeholder in top-right
 * — a soft pink `--pa-pink` box with mauve tracked caps "RECIPE PHOTO
 * (PLACEHOLDER)" inside.
 *
 * Meta row: CATEGORY (spelled) / YIELD (spelled) / COST/PORTION / SELL/
 * PORTION — all mauve tracked caps labels + burgundy Cormorant values.
 * NO chips, NO filled boxes — restrained.
 *
 * Two-column body: INGREDIENTS + METHOD with Roman numerals (final numeral
 * burgundy). CHEF'S NOTES eyebrow + 4 hair rule lines to write on.
 */
export function PaBinderPage({ recipe = {}, brand = {} }) {
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
  const yieldWord = spellOutNumber(y, { mode: 'lower' })
  const yieldDisplay = yieldWord ? capitalize(yieldWord) : '—'
  const categoryDisplay = recipe.category
    ? recipe.category.replace(/^./, c => c.toUpperCase())
    : '—'

  const totalSteps = method.filter(s => !s.group).length
  let stepCounter = 0

  return (
    <div className="tpl pa-tpl pa-binder printable">
      <div className="pa-frame">
        <header className="pa-binder-header">
          <div className="pa-binder-brand-lockup">
            <PaLogo brand={brand} size="sm"/>
            <div className="pa-binder-brand-text">
              <div className="pa-binder-brand-name">
                {brand.business_name || 'Your Bakery'}
              </div>
              <PaSubtitle className="pa-binder-brand-tag">
                {brand.tagline || 'Artisan bakery'} — {brand.city || 'Ipoh'}
              </PaSubtitle>
            </div>
          </div>
          <PaEyebrow className="pa-binder-header-right">
            Kitchen Binder · {category} · {rev}
          </PaEyebrow>
        </header>

        <PaRule tone="mauve" marginTop="4mm" marginBottom="6mm"/>

        <div className="pa-binder-title-row">
          <div className="pa-binder-title-left">
            <h2 className="pa-title pa-binder-title">
              {recipe.name || 'Recipe name'}
            </h2>
            <PaShortRule/>
            {recipe.description && (
              <PaSubtitle className="pa-binder-desc">{recipe.description}</PaSubtitle>
            )}
          </div>
          <div className="pa-binder-photo">
            {photo ? (
              <img src={photo} alt={recipe.name || ''}/>
            ) : (
              <div className="pa-binder-photo-placeholder">
                <PaEyebrow>Recipe Photo</PaEyebrow>
                <PaEyebrow>(Placeholder)</PaEyebrow>
              </div>
            )}
          </div>
        </div>

        <PaRule marginTop="6mm" marginBottom="4mm"/>

        <div className="pa-binder-meta-row">
          <div className="pa-binder-meta-cell">
            <PaEyebrow>Category</PaEyebrow>
            <div className="pa-binder-meta-val">{categoryDisplay}</div>
          </div>
          <div className="pa-binder-meta-cell">
            <PaEyebrow>Yield</PaEyebrow>
            <div className="pa-binder-meta-val">{yieldDisplay}</div>
          </div>
          <div className="pa-binder-meta-cell">
            <PaEyebrow>Cost / Portion</PaEyebrow>
            <div className="pa-binder-meta-val">{paMoney(perPortion)}</div>
          </div>
          <div className="pa-binder-meta-cell">
            <PaEyebrow>Sell / Portion</PaEyebrow>
            <div className="pa-binder-meta-val">{paMoney(suggested)}</div>
          </div>
        </div>

        <PaRule marginBottom="8mm"/>

        <div className="pa-binder-body">
          <section className="pa-binder-section">
            <PaEyebrow>Ingredients</PaEyebrow>
            <div className="pa-binder-ing-list">
              {lines.length === 0 ? (
                <p className="pa-empty">No ingredients linked yet.</p>
              ) : (
                <>
                  {lines.map((line, idx) => (
                    <div key={idx} className="pa-binder-ing-row">
                      <span className="pa-binder-ing-name">
                        {line.ingredient_name || 'Unknown'}
                      </span>
                      <span className="pa-binder-ing-qty">
                        {line.qty}{line.unit ? ` ${line.unit}` : ''}
                      </span>
                      <span className="pa-binder-ing-cost">
                        {Number(line.cost || 0).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="pa-binder-batch-row">
                    <span>Batch total</span>
                    <span/>
                    <span>{Number(total).toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>
          </section>

          <section className="pa-binder-section">
            <PaEyebrow>Method</PaEyebrow>
            {method.length === 0 ? (
              <p className="pa-empty">Add method steps via the recipe's Content drawer.</p>
            ) : (
              <ol className="pa-binder-method">
                {method.map((item, i) => {
                  if (item.group) return <li key={i} className="pa-method-group">{item.group}</li>
                  stepCounter += 1
                  const isLast = stepCounter === totalSteps
                  return (
                    <li key={i}>
                      <span className="pa-method-num" data-final={isLast ? 'true' : 'false'}>
                        {toRoman(stepCounter)}
                      </span>
                      <span className={isLast ? 'pa-binder-method-step pa-method-step-final' : 'pa-binder-method-step'}>
                        {isLast ? renderFinalStep(item.step) : item.step}
                      </span>
                    </li>
                  )
                })}
              </ol>
            )}
          </section>
        </div>

        <section className="pa-binder-notes">
          <PaEyebrow>Chef's Notes</PaEyebrow>
          <div className="pa-binder-notes-lines">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="pa-binder-notes-line"/>
            ))}
          </div>
        </section>

        <div className="pa-binder-footer-wrap">
          <PaRule marginTop="auto" marginBottom="4mm"/>
          <PaFooter brand={brand} layout="split" showSocials={false}/>
        </div>
      </div>
    </div>
  )
}

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s
}
