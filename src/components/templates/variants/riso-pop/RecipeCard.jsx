import {
  RpOffsetTitle, RpBrandLockup, RpEyebrow, RpMetaPill, RpMethodChip, RpFooter, RpRule,
  normalizeMethod, zeroPad, renderLastStep,
} from './_parts.jsx'

/**
 * 01 — RECIPE CARD  (A5 portrait, 148×210mm)
 *
 * The signature composition: two big overlapping SOLID CIRCLES bleeding
 * off the top-left corner — rust on the outside, navy overlapping it (the
 * navy disk gets mix-blend-mode: multiply so the intersection reads as
 * deep brown, faking a riso overprint). The offset-effect product title
 * sits below the circles at ~36px, wrapping naturally.
 *
 * Then a row of meta pills (YIELD 1 LOAF navy · 240°C rust · 35 MIN
 * outline) and a two-column body: INGREDIENTS list left with hair-rule
 * separators, METHOD list right with plain rust-tinted digits. The FINAL
 * method step gets the ACCENT rust-filled square with a cream digit +
 * bolded leading imperative.
 */
export function RpRecipeCard({ recipe = {}, brand = {} }) {
  const lines  = recipe.lines || []
  const method = normalizeMethod(recipe.method)

  const y = Number(recipe.yield_portions) || 0
  const category = (recipe.category || 'Recipe').toUpperCase()
  const isBread = (recipe.category || '').toLowerCase() === 'bread'
  const yieldUnit = isBread
    ? (y === 1 ? 'LOAF' : 'LOAVES')
    : (y === 1 ? 'PORTION' : 'PORTIONS')
  const yieldPill = y > 0 ? `YIELD ${y} ${yieldUnit}` : `YIELD ${yieldUnit}`

  const totalSteps = method.filter(s => !s.group).length
  let stepCounter = 0

  // Recipe N° from category order — a simple "N° 01" style flourish
  const recipeNumber = recipe.id
    ? String(Math.abs(String(recipe.id).split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % 99 + 1).padStart(2, '0')
    : '01'

  return (
    <div className="tpl rp-tpl rp-recipe printable">
      <div className="rp-recipe-shapes" aria-hidden="true">
        <div className="rp-circle rp-circle-rust"/>
        <div className="rp-circle rp-circle-navy rp-circle-blend"/>
      </div>

      <header className="rp-recipe-header">
        <RpBrandLockup brand={brand}/>
        <div className="rp-recipe-header-right">
          <RpEyebrow tone="rust" className="rp-recipe-header-eyebrow">
            Recipe N° {recipeNumber} · {category}
          </RpEyebrow>
        </div>
      </header>

      <div className="rp-recipe-title-block">
        <RpEyebrow tone="rust" className="rp-recipe-eyebrow">Recipe</RpEyebrow>
        <RpOffsetTitle size="md">{recipe.name || 'Recipe name'}</RpOffsetTitle>
        <div className="rp-recipe-pills">
          <RpMetaPill variant="navy">{yieldPill}</RpMetaPill>
          {recipe.oven_temp && <RpMetaPill variant="rust">{recipe.oven_temp}</RpMetaPill>}
          {recipe.bake_time && <RpMetaPill variant="outline">{recipe.bake_time}</RpMetaPill>}
          {!recipe.oven_temp && !recipe.bake_time && (
            <>
              <RpMetaPill variant="rust">240°C</RpMetaPill>
              <RpMetaPill variant="outline">35 MIN</RpMetaPill>
            </>
          )}
        </div>
      </div>

      <div className="rp-recipe-body">
        <section className="rp-recipe-ingredients">
          <RpEyebrow>Ingredients</RpEyebrow>
          {lines.length === 0 ? (
            <p className="rp-empty">No ingredients yet — link them via Recipe BOM.</p>
          ) : (
            <ul className="rp-recipe-ing-list">
              {lines.map((line, idx) => (
                <li key={idx}>
                  <span className="rp-recipe-ing-name">{line.ingredient_name || 'Unknown'}</span>
                  <span className="rp-recipe-ing-qty">
                    {line.qty}{line.unit ? ` ${line.unit}` : ''}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rp-recipe-method">
          <RpEyebrow>Method</RpEyebrow>
          {method.length === 0 ? (
            <p className="rp-empty">Add method steps via the recipe's Content drawer.</p>
          ) : (
            <ol className="rp-recipe-method-list">
              {method.map((item, i) => {
                if (item.group) return <li key={i} className="rp-method-group">{item.group}</li>
                stepCounter += 1
                const isLast = stepCounter === totalSteps
                return (
                  <li key={i}>
                    <RpMethodChip number={zeroPad(stepCounter)} variant={isLast ? 'accent' : 'normal'}/>
                    <span className={isLast ? 'rp-recipe-method-step rp-recipe-method-step-final' : 'rp-recipe-method-step'}>
                      {isLast ? renderLastStep(item.step) : item.step}
                    </span>
                  </li>
                )
              })}
            </ol>
          )}
        </section>
      </div>

      <div className="rp-recipe-footer-wrap">
        <RpRule tone="hair" marginBottom="3mm"/>
        <RpFooter brand={brand} layout="split"/>
      </div>
    </div>
  )
}
