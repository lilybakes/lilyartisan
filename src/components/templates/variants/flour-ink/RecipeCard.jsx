import {
  FiLogo, FiEyebrow, FiRule, FiShortRule, FiMethodChip, FiFooter,
  normalizeMethod, zeroPad, spellOutNumber,
} from './_parts.jsx'

/**
 * 01 — RECIPE CARD  (A5 portrait, 148×210mm)
 *
 * Everything centered until the two-column body. Thin outlined DC circle
 * at the top, followed by letter-tracked brand name, small-caps tagline
 * with city, RECIPE eyebrow. Then the massive letter-tracked light-weight
 * product title (naturally wraps to 2 lines), a short thin rule under it,
 * and a meta line "BREAD · ONE LOAF" in small caps.
 *
 * Two-column body: INGREDIENTS list left (name / qty with hairline row
 * separators), METHOD list right (numbered "01" "02" in thin outlined
 * circles, sans body). The FINAL step gets the FILLED BLACK circle with
 * cream number + a bolded leading phrase — the singular dark accent.
 *
 * Thin hairline + split footer at the bottom.
 */
export function FiRecipeCard({ recipe = {}, brand = {} }) {
  const lines  = recipe.lines || []
  const method = normalizeMethod(recipe.method)

  const y = Number(recipe.yield_portions) || 0
  const category = (recipe.category || 'Recipe').toUpperCase()
  const isBread = (recipe.category || '').toLowerCase() === 'bread'
  const yieldUnit = isBread
    ? (y === 1 ? 'LOAF' : 'LOAVES')
    : (y === 1 ? 'PORTION' : 'PORTIONS')
  const yieldWord = spellOutNumber(y, { mode: 'upper' })
  const metaLine = y > 0
    ? `${category} · ${yieldWord} ${yieldUnit}`
    : category

  const cityLine = brand.city ||
    (brand.address_line2 && brand.address_line2.split(',').pop().trim()) ||
    'Ipoh'

  const totalSteps = method.filter(s => !s.group).length
  let stepCounter = 0

  return (
    <div className="tpl fi-tpl fi-recipe printable">
      <header className="fi-recipe-header">
        <FiLogo brand={brand} size="lg"/>
        <div className="fi-recipe-brand-name">{(brand.business_name || 'Your Bakery').toUpperCase()}</div>
        <FiEyebrow tone="muted" className="fi-recipe-brand-tag">
          {brand.tagline || 'Artisan bakery'} · {cityLine.toUpperCase()}
        </FiEyebrow>
        <FiEyebrow tone="muted" className="fi-recipe-eyebrow">Recipe</FiEyebrow>

        <h2 className="fi-title fi-recipe-title">{(recipe.name || 'Recipe name').toUpperCase()}</h2>
        <FiShortRule/>
        <FiEyebrow tone="muted" className="fi-recipe-meta">{metaLine}</FiEyebrow>
      </header>

      <div className="fi-recipe-body">
        <section className="fi-recipe-ingredients">
          <FiEyebrow>Ingredients</FiEyebrow>
          {lines.length === 0 ? (
            <p className="fi-empty">No ingredients yet — link them via Recipe BOM.</p>
          ) : (
            <ul className="fi-recipe-ing-list">
              {lines.map((line, idx) => (
                <li key={idx}>
                  <span className="fi-recipe-ing-name">{(line.ingredient_name || 'Unknown').toUpperCase()}</span>
                  <span className="fi-recipe-ing-qty">
                    {line.qty}{line.unit ? ` ${line.unit.toUpperCase()}` : ''}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="fi-recipe-method">
          <FiEyebrow>Method</FiEyebrow>
          {method.length === 0 ? (
            <p className="fi-empty">Add method steps via the recipe's Content drawer.</p>
          ) : (
            <ol className="fi-recipe-method-list">
              {method.map((item, i) => {
                if (item.group) return <li key={i} className="fi-method-group">{item.group}</li>
                stepCounter += 1
                const isLast = stepCounter === totalSteps
                return (
                  <li key={i}>
                    <FiMethodChip number={zeroPad(stepCounter)} variant={isLast ? 'accent' : 'normal'}/>
                    <span className={isLast ? 'fi-recipe-method-step fi-recipe-method-step-final' : 'fi-recipe-method-step'}>
                      {isLast ? renderLastStep(item.step) : item.step}
                    </span>
                  </li>
                )
              })}
            </ol>
          )}
        </section>
      </div>

      <div className="fi-recipe-footer-wrap">
        <FiRule marginBottom="4mm"/>
        <FiFooter brand={brand} layout="split"/>
      </div>
    </div>
  )
}

/** Bold the opening 1-2 word imperative phrase of the final step, matching
 * the mockup's "Cool completely" / "fully cooled" highlight pattern. */
function renderLastStep(text) {
  if (!text) return null
  const s = String(text).trim()
  const m = s.match(/^([A-Z][a-z]+(?:\s+[a-z]+)?)\s+(.+)$/)
  if (m) return <><strong>{m[1]}</strong> {m[2]}</>
  return s
}
