import {
  BhLogoMark, BhEyebrow, BhRule, BhShapeChip, BhMethodChip, BhFooter,
  normalizeMethod, zeroPad,
} from './_parts.jsx'

/**
 * 01 — RECIPE CARD  (A5 portrait, 148×210mm)
 *
 * Top ~50mm of the card is the signature Bauhaus composition on cream:
 *   - large solid BLUE rectangle spanning most of the width
 *   - solid YELLOW quarter-circle bulging in from the top-right
 *   - small solid RED rectangle at the right edge
 * On top of the composition sits the brand name (Archivo Black cream) at
 * left and the BhLogoMark at right.
 *
 * Below the composition, on cream paper: RECIPE 01 blue eyebrow, massive
 * Archivo Black title all caps, then a row of solid meta chips (BREAD ·
 * YIELD 1 LOAF · 240°C) with rotating colors.
 *
 * Two-column body: INGREDIENTS list left (each row = solid black bullet
 * square + name + right-aligned qty, with thin hair between), METHOD list
 * right (numbered blue solid squares 01 02, FINAL step = red solid square
 * with a bolded leading imperative).
 *
 * Thick black rule + split footer at the bottom.
 */
export function BhRecipeCard({ recipe = {}, brand = {} }) {
  const lines  = recipe.lines || []
  const method = normalizeMethod(recipe.method)

  const y = Number(recipe.yield_portions) || 0
  const category = (recipe.category || 'Recipe').toUpperCase()
  const isBread = (recipe.category || '').toLowerCase() === 'bread'
  const yieldUnit = isBread
    ? (y === 1 ? 'LOAF' : 'LOAVES')
    : (y === 1 ? 'PORTION' : 'PORTIONS')

  const cityLine = brand.city ||
    (brand.address_line2 && brand.address_line2.split(',').pop().trim()) ||
    'Ipoh'

  const totalSteps = method.filter(s => !s.group).length
  let stepCounter = 0

  // Rotating chip colors: black, yellow, blue — cycles through meta chips
  const chipColors = ['black', 'yellow', 'blue']
  const metaChips = [
    { label: category, color: chipColors[0] },
    ...(y > 0 ? [{ label: `YIELD ${y} ${yieldUnit}`, color: chipColors[1] }] : []),
    ...(recipe.oven_temp ? [{ label: String(recipe.oven_temp).toUpperCase(), color: chipColors[2] }] : []),
  ]

  return (
    <div className="tpl bh-tpl bh-recipe printable">
      {/* --- Bauhaus shape composition top band --- */}
      <div className="bh-recipe-top">
        <div className="bh-recipe-top-blue"/>
        <div className="bh-recipe-top-yellow"/>
        <div className="bh-recipe-top-red"/>

        <div className="bh-recipe-top-content">
          <div className="bh-recipe-top-brand">
            <div className="bh-recipe-top-brand-name">
              {(brand.business_name || 'Your Bakery').toUpperCase()}
            </div>
            <div className="bh-recipe-top-brand-tag">
              {brand.tagline || 'Artisan bakery'} — {cityLine.toUpperCase()}
            </div>
          </div>
          <BhLogoMark brand={brand} size="md" tone="cream"/>
        </div>
      </div>

      <header className="bh-recipe-header">
        <BhEyebrow tone="blue" className="bh-recipe-eyebrow">Recipe 01</BhEyebrow>
        <h2 className="bh-title bh-recipe-title">{(recipe.name || 'Recipe name').toUpperCase()}</h2>

        {metaChips.length > 0 && (
          <div className="bh-recipe-meta-row">
            {metaChips.map((c, i) => (
              <BhShapeChip key={i} color={c.color} size="md">{c.label}</BhShapeChip>
            ))}
          </div>
        )}
      </header>

      <div className="bh-recipe-body">
        <section className="bh-recipe-ingredients">
          <BhEyebrow tone="red">Ingredients</BhEyebrow>
          {lines.length === 0 ? (
            <p className="bh-empty">No ingredients yet — link them via Recipe BOM.</p>
          ) : (
            <ul className="bh-recipe-ing-list">
              {lines.map((line, idx) => (
                <li key={idx}>
                  <span className="bh-recipe-ing-bullet"/>
                  <span className="bh-recipe-ing-name">{(line.ingredient_name || 'Unknown').toUpperCase()}</span>
                  <span className="bh-recipe-ing-qty">
                    {line.qty}{line.unit ? ` ${line.unit.toUpperCase()}` : ''}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="bh-recipe-method">
          <BhEyebrow tone="blue">Method</BhEyebrow>
          {method.length === 0 ? (
            <p className="bh-empty">Add method steps via the recipe's Content drawer.</p>
          ) : (
            <ol className="bh-recipe-method-list">
              {method.map((item, i) => {
                if (item.group) return <li key={i} className="bh-method-group">{item.group}</li>
                stepCounter += 1
                const isLast = stepCounter === totalSteps
                return (
                  <li key={i}>
                    <BhMethodChip number={zeroPad(stepCounter)} variant={isLast ? 'accent' : 'normal'}/>
                    <span className={isLast ? 'bh-recipe-method-step bh-recipe-method-step-final' : 'bh-recipe-method-step'}>
                      {isLast ? renderLastStep(item.step) : item.step}
                    </span>
                  </li>
                )
              })}
            </ol>
          )}
        </section>
      </div>

      <div className="bh-recipe-footer-wrap">
        <BhRule weight="thick" marginBottom="4mm"/>
        <BhFooter brand={brand} layout="split"/>
      </div>
    </div>
  )
}

/** Bold the leading 1-2 word imperative of the final step */
function renderLastStep(text) {
  if (!text) return null
  const s = String(text).trim()
  const m = s.match(/^([A-Z][a-z]+(?:\s+[a-z]+)?)\s+(.+)$/)
  if (m) return <><strong>{m[1]}</strong> {m[2]}</>
  return s
}
