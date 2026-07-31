import {
  VerdantEyebrow, VerdantChip, VerdantMethodChip, VerdantHairRule,
  VerdantDecorCircle, VerdantFooter, normalizeMethod,
} from './_parts.jsx'

/**
 * 01 — RECIPE CARD  (A5 portrait, 148×210mm)
 *
 * Top ~35% is a filled dark-green header block with two decorative
 * mint-tinted circles overlapping the top-right corner (soft, off-page).
 * Header content: brand small caps cream + big serif product title cream.
 *
 * Below on cream: a row of rounded pill chips for BREAD / YIELD / TEMP.
 * Two-column body — INGREDIENTS list (name left, qty right, hairline
 * separators) and METHOD numbered list. The FINAL method step gets the
 * accent chip variant (dark green fill, cream number) to visually
 * emphasise the crucial finishing action.
 *
 * FIELD MAPPING:
 *   recipe.lines[]        — { ingredient_name, qty, unit }
 *   recipe.method[]       — step strings (or { step, group })
 *   recipe.category       — first pill chip
 *   recipe.yield_portions — "YIELD N LOAF/PORTIONS"
 *   recipe.bake_temp      — optional third chip (e.g. "240°C")
 */
export function VerdantRecipeCard({ recipe = {}, brand = {} }) {
  const lines  = recipe.lines || []
  const method = normalizeMethod(recipe.method)

  const y = Number(recipe.yield_portions) || 0
  const yieldUnit = (recipe.category || '').toLowerCase() === 'bread'
    ? (y === 1 ? 'loaf' : 'loaves')
    : (y === 1 ? 'portion' : 'portions')

  const brandLine = `${brand?.business_name || 'Your Bakery'}${
    brand?.city ? ` · ${brand.city}` : (brand?.address_line2 ? ` · ${brand.address_line2.split(',').pop().trim()}` : '')
  }`

  const totalSteps = method.filter(s => !s.group).length
  let stepCounter = 0

  return (
    <div className="tpl v-tpl v-recipe printable">
      <header className="v-recipe-header">
        <VerdantDecorCircle size={220} top={-90}  right={-100} tone="green-tint" />
        <VerdantDecorCircle size={140} top={20}   right={-40}  tone="green-tint" outlined />
        <VerdantEyebrow tone="cream" className="v-recipe-brand-line">{brandLine}</VerdantEyebrow>
        <h2 className="v-title v-recipe-title">{recipe.name || 'Recipe name'}</h2>
      </header>

      <div className="v-recipe-body">
        <div className="v-recipe-chips">
          {recipe.category && <VerdantChip>{recipe.category}</VerdantChip>}
          {y > 0 && <VerdantChip>Yield {y} {yieldUnit}</VerdantChip>}
          {recipe.bake_temp && <VerdantChip>{recipe.bake_temp}</VerdantChip>}
        </div>

        <div className="v-recipe-columns">
          <section className="v-recipe-ingredients">
            <VerdantEyebrow>Ingredients</VerdantEyebrow>
            {lines.length === 0 ? (
              <p className="v-empty">No ingredients yet — link them via Recipe BOM.</p>
            ) : (
              <ul className="v-recipe-ing-list">
                {lines.map((line, idx) => (
                  <li key={idx}>
                    <span className="v-recipe-ing-name">{line.ingredient_name || 'Unknown'}</span>
                    <span className="v-recipe-ing-qty">
                      {line.qty}{line.unit ? ` ${line.unit}` : ''}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="v-recipe-method">
            <VerdantEyebrow>Method</VerdantEyebrow>
            {method.length === 0 ? (
              <p className="v-empty">Add method steps via the recipe's Content drawer.</p>
            ) : (
              <ol className="v-recipe-method-list">
                {method.map((item, i) => {
                  if (item.group) return <li key={i} className="v-method-group">{item.group}</li>
                  stepCounter += 1
                  const isLast = stepCounter === totalSteps
                  return (
                    <li key={i}>
                      <VerdantMethodChip number={stepCounter} variant={isLast ? 'accent' : 'normal'}/>
                      <span className={isLast ? 'v-recipe-method-step v-recipe-method-step-accent' : 'v-recipe-method-step'}>
                        {item.step}
                      </span>
                    </li>
                  )
                })}
              </ol>
            )}
          </section>
        </div>

        <VerdantHairRule marginTop="auto"/>
        <VerdantFooter brand={brand} layout="split"/>
      </div>
    </div>
  )
}
