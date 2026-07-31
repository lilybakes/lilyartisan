import {
  PaLogo, PaEyebrow, PaRule, PaShortRule, PaSubtitle, PaFooter,
  normalizeMethod, toRoman, spellOutNumber, renderFinalStep,
} from './_parts.jsx'

/**
 * 01 — RECIPE CARD  (A5 portrait, 148×210mm)
 *
 * Everything centered until the two-column body. Gold-ring DC circle at
 * the top, then burgundy Cormorant brand name centered ("The Daily Crumb"),
 * italic muted subtitle ("Artisan bakery — Ipoh"), short gold rule, mauve
 * "RECIPE" tracked eyebrow, HUGE burgundy Cormorant product title, italic
 * muted meta ("Bread · one loaf · 240°C").
 *
 * Two-column body: INGREDIENTS left with hair-rule row dividers, METHOD
 * right with ROMAN NUMERALS — plain gold Cormorant numerals to the left
 * of each step. The final step's numeral turns burgundy and the leading
 * imperative phrase in the text is bolded.
 */
export function PaRecipeCard({ recipe = {}, brand = {} }) {
  const lines  = recipe.lines || []
  const method = normalizeMethod(recipe.method)

  const y = Number(recipe.yield_portions) || 0
  const catRaw = (recipe.category || 'Recipe').toLowerCase()
  const isBread = catRaw === 'bread'
  const yieldUnit = isBread
    ? (y === 1 ? 'loaf' : 'loaves')
    : (y === 1 ? 'portion' : 'portions')
  const yieldWord = spellOutNumber(y, { mode: 'lower' })
  const catDisplay = (recipe.category || 'Recipe').replace(/^./, c => c.toUpperCase())
  const oven = recipe.oven_temp || recipe.temperature
  const metaParts = [catDisplay]
  if (y > 0) metaParts.push(`${yieldWord} ${yieldUnit}`)
  if (oven) metaParts.push(oven)
  const metaLine = metaParts.join(' · ')

  const tagline = brand.tagline || 'Artisan bakery'
  const cityLine = brand.city ||
    (brand.address_line2 && brand.address_line2.split(',').pop().trim()) ||
    'Ipoh'
  const brandSubtitle = `${tagline} — ${cityLine}`

  const totalSteps = method.filter(s => !s.group).length
  let stepCounter = 0

  return (
    <div className="tpl pa-tpl pa-recipe printable">
      <div className="pa-frame">
        <header className="pa-recipe-header">
          <PaLogo brand={brand} size="lg"/>
          <div className="pa-recipe-brand-name">{brand.business_name || 'Your Bakery'}</div>
          <PaSubtitle className="pa-recipe-brand-tag">{brandSubtitle}</PaSubtitle>
          <PaShortRule/>
          <PaEyebrow className="pa-recipe-eyebrow">Recipe</PaEyebrow>

          <h2 className="pa-title pa-recipe-title">{recipe.name || 'Recipe name'}</h2>
          <PaSubtitle className="pa-recipe-meta">{metaLine}</PaSubtitle>
        </header>

        <div className="pa-recipe-body">
          <section className="pa-recipe-ingredients">
            <PaEyebrow>Ingredients</PaEyebrow>
            {lines.length === 0 ? (
              <p className="pa-empty">No ingredients yet — link them via Recipe BOM.</p>
            ) : (
              <ul className="pa-recipe-ing-list">
                {lines.map((line, idx) => (
                  <li key={idx}>
                    <span className="pa-recipe-ing-name">{line.ingredient_name || 'Unknown'}</span>
                    <span className="pa-recipe-ing-qty">
                      {line.qty}{line.unit ? ` ${line.unit}` : ''}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="pa-recipe-method">
            <PaEyebrow>Method</PaEyebrow>
            {method.length === 0 ? (
              <p className="pa-empty">Add method steps via the recipe's Content drawer.</p>
            ) : (
              <ol className="pa-recipe-method-list">
                {method.map((item, i) => {
                  if (item.group) return <li key={i} className="pa-method-group">{item.group}</li>
                  stepCounter += 1
                  const isLast = stepCounter === totalSteps
                  return (
                    <li key={i}>
                      <span className="pa-method-num" data-final={isLast ? 'true' : 'false'}>
                        {toRoman(stepCounter)}
                      </span>
                      <span className={isLast ? 'pa-recipe-method-step pa-method-step-final' : 'pa-recipe-method-step'}>
                        {isLast ? renderFinalStep(item.step) : item.step}
                      </span>
                    </li>
                  )
                })}
              </ol>
            )}
          </section>
        </div>

        <div className="pa-recipe-footer-wrap">
          <PaRule marginBottom="4mm"/>
          <PaFooter brand={brand} layout="split"/>
        </div>
      </div>
    </div>
  )
}
