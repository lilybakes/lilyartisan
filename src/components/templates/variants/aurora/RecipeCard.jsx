import {
  AuEyebrow, AuMethodChip, AuChip, AuFooter,
  normalizeMethod, zeroPad, formatQtyUnit,
} from './_parts.jsx'

/**
 * 01 — RECIPE CARD  (A5 portrait, 148×210mm)
 *
 * Full-width gradient band at the top (~120mm tall) carries the brand
 * name (white letter-tracked), tagline+city eyebrow, huge white Manrope
 * extrabold product title, and three white gradient-outlined pill chips
 * (BREAD · YIELD 1 LOAF · 240°C). Below the band, lavender paper hosts
 * the INGREDIENTS + METHOD two-column body. Numbered gradient chips
 * for method; the FINAL step gets a hot-pink chip and a bold leading
 * imperative phrase.
 */
export function AuRecipeCard({ recipe = {}, brand = {} }) {
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

  const temp = recipe.oven_temp_c || recipe.oven_temp || recipe.bake_temp_c
  const tempChip = temp ? `${temp}°C` : (recipe.bake_time_minutes ? `${recipe.bake_time_minutes} MIN` : null)

  const chips = [
    category,
    y > 0 ? `YIELD ${y} ${yieldUnit}` : null,
    tempChip,
  ].filter(Boolean)

  const totalSteps = method.filter(s => !s.group).length
  let stepCounter = 0

  return (
    <div className="tpl au-tpl au-recipe printable">
      <header className="au-recipe-header">
        <div className="au-recipe-brand-name">{(brand.business_name || 'Your Bakery').toUpperCase()}</div>
        <div className="au-recipe-brand-tag">
          {(brand.tagline || 'Artisan bakery').toUpperCase()} · {cityLine.toUpperCase()}
        </div>

        <h2 className="au-title au-recipe-title">{(recipe.name || 'Recipe name').toUpperCase()}</h2>

        {chips.length > 0 && (
          <div className="au-recipe-chip-row">
            {chips.map((c, i) => <AuChip key={i} variant="outline">{c}</AuChip>)}
          </div>
        )}
      </header>

      <div className="au-recipe-body">
        <section className="au-recipe-ingredients">
          <AuEyebrow tone="purple">Ingredients</AuEyebrow>
          {lines.length === 0 ? (
            <p className="au-empty">No ingredients yet — link them via Recipe BOM.</p>
          ) : (
            <ul className="au-recipe-ing-list">
              {lines.map((line, idx) => (
                <li key={idx}>
                  <span className="au-recipe-ing-name">{(line.ingredient_name || 'Unknown').toUpperCase()}</span>
                  <span className="au-recipe-ing-qty">
                    {formatQtyUnit(line.qty, line.unit)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="au-recipe-method">
          <AuEyebrow tone="purple">Method</AuEyebrow>
          {method.length === 0 ? (
            <p className="au-empty">Add method steps via the recipe's Content drawer.</p>
          ) : (
            <ol className="au-recipe-method-list">
              {method.map((item, i) => {
                if (item.group) return <li key={i} className="au-method-group">{item.group}</li>
                stepCounter += 1
                const isLast = stepCounter === totalSteps
                return (
                  <li key={i}>
                    <AuMethodChip number={zeroPad(stepCounter)} variant={isLast ? 'accent' : 'normal'}/>
                    <span className={isLast ? 'au-recipe-method-step au-recipe-method-step-final' : 'au-recipe-method-step'}>
                      {isLast ? renderLastStep(item.step) : item.step}
                    </span>
                  </li>
                )
              })}
            </ol>
          )}
        </section>
      </div>

      <div className="au-recipe-footer-wrap">
        <AuFooter brand={brand} layout="split"/>
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
