import {
  EmberEyebrow, EmberChip, EmberRule, EmberFooter, normalizeMethod, zeroPad,
} from './_parts.jsx'

/**
 * 01 — RECIPE CARD  (A5 portrait, 148×210mm)
 *
 * Top ~40% is a burgundy→red→orange gradient block with a diagonal-cut
 * bottom edge (clip-path). Brand small-caps cream + massive heavy
 * condensed uppercase title cream inside — wraps naturally to 2-3 lines.
 *
 * Below on cream: three meta chips — BREAD (filled black), YIELD 1 LOAF
 * (filled ember), 240°C (outlined). Two-column body: INGREDIENTS list
 * (name / qty, hairline separators) and METHOD (numbered "01" "02" in
 * heavy ember, sans body). The FINAL step's leading phrase gets bold
 * treatment via a heuristic — first 1-2 words up to a period bold.
 *
 * FIELD MAPPING:
 *   recipe.lines[]        — { ingredient_name, qty, unit }
 *   recipe.method[]       — step strings or { step, group }
 *   recipe.category       — first chip (black tone)
 *   recipe.yield_portions — second chip (ember tone)
 *   recipe.bake_temp      — third chip (outlined tone)
 */
export function EmberRecipeCard({ recipe = {}, brand = {} }) {
  const lines  = recipe.lines || []
  const method = normalizeMethod(recipe.method)

  const y = Number(recipe.yield_portions) || 0
  const yieldUnit = (recipe.category || '').toLowerCase() === 'bread'
    ? (y === 1 ? 'loaf' : 'loaves')
    : (y === 1 ? 'portion' : 'portions')

  const cityLine = brand.city ||
    (brand.address_line2 && brand.address_line2.split(',').pop().trim()) ||
    'Ipoh'
  const brandLine = `${(brand?.business_name || 'Your Bakery')} · ${cityLine}`

  const totalSteps = method.filter(s => !s.group).length
  let stepCounter = 0

  return (
    <div className="tpl em-tpl em-recipe printable">
      <header className="em-recipe-header">
        <EmberEyebrow tone="cream" className="em-recipe-brand-line">{brandLine}</EmberEyebrow>
        <h2 className="em-title em-recipe-title">{(recipe.name || 'Recipe name').toUpperCase()}</h2>
      </header>

      <div className="em-recipe-body">
        <div className="em-recipe-chips">
          {recipe.category && <EmberChip tone="black">{recipe.category}</EmberChip>}
          {y > 0 && <EmberChip tone="ember">Yield {y} {yieldUnit}</EmberChip>}
          {recipe.bake_temp && <EmberChip tone="outlined">{recipe.bake_temp}</EmberChip>}
        </div>

        <div className="em-recipe-columns">
          <section className="em-recipe-ingredients">
            <EmberEyebrow>Ingredients</EmberEyebrow>
            {lines.length === 0 ? (
              <p className="em-empty">No ingredients yet — link them via Recipe BOM.</p>
            ) : (
              <ul className="em-recipe-ing-list">
                {lines.map((line, idx) => (
                  <li key={idx}>
                    <span className="em-recipe-ing-name">{line.ingredient_name || 'Unknown'}</span>
                    <span className="em-recipe-ing-qty">
                      {line.qty}{line.unit ? ` ${line.unit}` : ''}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="em-recipe-method">
            <EmberEyebrow>Method</EmberEyebrow>
            {method.length === 0 ? (
              <p className="em-empty">Add method steps via the recipe's Content drawer.</p>
            ) : (
              <ol className="em-recipe-method-list">
                {method.map((item, i) => {
                  if (item.group) return <li key={i} className="em-method-group">{item.group}</li>
                  stepCounter += 1
                  const isLast = stepCounter === totalSteps
                  return (
                    <li key={i}>
                      <span className="em-recipe-method-num">{zeroPad(stepCounter)}</span>
                      <span className={isLast ? 'em-recipe-method-step em-recipe-method-step-final' : 'em-recipe-method-step'}>
                        {isLast ? renderLastStep(item.step) : item.step}
                      </span>
                    </li>
                  )
                })}
              </ol>
            )}
          </section>
        </div>

        <div className="em-recipe-footer-wrap">
          <EmberRule marginTop="auto" marginBottom="6mm"/>
          <EmberFooter brand={brand}/>
        </div>
      </div>
    </div>
  )
}

/**
 * Bold the opening imperative phrase of the final step (up to the first period,
 * or the first 2 significant words), matching the mockup's "Cool completely"
 * highlight. Falls back to plain text if the pattern doesn't fit.
 */
function renderLastStep(text) {
  if (!text) return null
  const s = String(text).trim()
  // Match "Word Word" opener → 2-word action phrase
  const m = s.match(/^([A-Z][a-z]+(?:\s+[a-z]+)?)\s+(.+)$/)
  if (m) {
    return <><strong>{m[1]}</strong> {m[2]}</>
  }
  return s
}
