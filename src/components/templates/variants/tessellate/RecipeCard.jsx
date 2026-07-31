import {
  TeLogo, TeEyebrow, TeRule, TeShortRule, TeMethodChip, TeFooter,
  normalizeMethod, zeroPad, spellOutNumber,
} from './_parts.jsx'

/**
 * 01 — RECIPE CARD  (A5 portrait, 148×210mm)
 *
 * Top: full-width rust×brown×cream diagonal stripe band (~15mm). Below,
 * quadrant logo center + brand name + RECIPE / 01 mono meta. Bold
 * Manrope title, short rule, mono "BREAD / YIELD 1 / 240°C" meta.
 *
 * Two-column body: INGREDIENTS list left (mono qty, upper name, hair
 * separators), METHOD list right (5mm square chips with mono numbers,
 * FINAL step gets FILLED RUST chip + bold leading imperative). A small
 * decorative cream checkerboard block sits below the ingredients as
 * page ornament.
 *
 * Hairline + split footer at the bottom.
 */
export function TeRecipeCard({ recipe = {}, brand = {} }) {
  const lines  = recipe.lines || []
  const method = normalizeMethod(recipe.method)

  const y = Number(recipe.yield_portions) || 0
  const category = (recipe.category || 'Recipe').toUpperCase()
  const yieldPart = y > 0 ? `YIELD ${y}` : null
  const temp = recipe.oven_temp_c || recipe.oven_temperature || null
  const tempPart = temp ? `${temp}°C` : null
  const metaLine = [category, yieldPart, tempPart].filter(Boolean).join(' / ')

  const cityLine = brand.city ||
    (brand.address_line2 && brand.address_line2.split(',').pop().trim()) ||
    'Ipoh'

  const totalSteps = method.filter(s => !s.group).length
  let stepCounter = 0

  return (
    <div className="tpl te-tpl te-recipe printable">
      <div className="te-stripe-band te-stripe-rust-brown-cream te-recipe-stripe"/>

      <header className="te-recipe-header">
        <TeLogo brand={brand} size="lg"/>
        <div className="te-recipe-brand-name">{(brand.business_name || 'Your Bakery').toUpperCase()}</div>
        <TeEyebrow tone="muted" className="te-recipe-brand-tag">
          {brand.tagline || 'Artisan bakery'} · {cityLine.toUpperCase()}
        </TeEyebrow>
        <TeEyebrow tone="rust" className="te-recipe-eyebrow">Recipe / 01</TeEyebrow>

        <h2 className="te-title te-recipe-title">{(recipe.name || 'Recipe name').toUpperCase()}</h2>
        <TeShortRule/>
        <TeEyebrow tone="muted" className="te-recipe-meta">{metaLine}</TeEyebrow>
      </header>

      <div className="te-recipe-body">
        <section className="te-recipe-ingredients">
          <TeEyebrow tone="rust">Ingredients</TeEyebrow>
          {lines.length === 0 ? (
            <p className="te-empty">No ingredients yet — link them via Recipe BOM.</p>
          ) : (
            <ul className="te-recipe-ing-list">
              {lines.map((line, idx) => (
                <li key={idx}>
                  <span className="te-recipe-ing-name">{(line.ingredient_name || 'Unknown').toUpperCase()}</span>
                  <span className="te-recipe-ing-qty">
                    {line.qty}{line.unit ? ` ${line.unit.toUpperCase()}` : ''}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <div className="te-recipe-ornament te-check-cream-tile" aria-hidden="true"/>
        </section>

        <section className="te-recipe-method">
          <TeEyebrow tone="rust">Method</TeEyebrow>
          {method.length === 0 ? (
            <p className="te-empty">Add method steps via the recipe's Content drawer.</p>
          ) : (
            <ol className="te-recipe-method-list">
              {method.map((item, i) => {
                if (item.group) return <li key={i} className="te-method-group">{item.group}</li>
                stepCounter += 1
                const isLast = stepCounter === totalSteps
                return (
                  <li key={i}>
                    <TeMethodChip number={zeroPad(stepCounter)} variant={isLast ? 'accent' : 'normal'}/>
                    <span className={isLast ? 'te-recipe-method-step te-recipe-method-step-final' : 'te-recipe-method-step'}>
                      {isLast ? renderLastStep(item.step) : item.step}
                    </span>
                  </li>
                )
              })}
            </ol>
          )}
        </section>
      </div>

      <div className="te-recipe-footer-wrap">
        <TeRule marginBottom="4mm"/>
        <TeFooter brand={brand} layout="split"/>
      </div>
    </div>
  )
}

/** Bold the opening 1-2 word imperative phrase of the final step. */
function renderLastStep(text) {
  if (!text) return null
  const s = String(text).trim()
  const m = s.match(/^([A-Z][a-z]+(?:\s+[a-z]+)?)\s+(.+)$/)
  if (m) return <><strong>{m[1]}</strong> {m[2]}</>
  return s
}
