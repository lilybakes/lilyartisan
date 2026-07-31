import {
  QuietBrandLockup, QuietEyebrow, QuietDot, QuietRule, QuietFooter, QuietQty,
} from './_parts.jsx'

/**
 * 01 — RECIPE CARD  (A5 portrait, 148×210mm)
 *
 * Top-left: DC (text-only, no box) + brand + tagline. Top-right: "A5 ·
 * RECIPE" mono meta. Big whitespace, then a tiny rust dot centered, then
 * a LIGHT-weight Manrope title centered, then "BREAD / YIELD 1" mono meta.
 * INGREDIENTS section: name left, "500  g" mono right (wide-spaced unit).
 * Hairline between each row. METHOD: numbered "01" "02" in rust mono,
 * step text sans regular. Split footer.
 *
 * FIELD MAPPING:
 *   recipe.lines[]        — qty + unit + ingredient name
 *   recipe.method[]       — step strings (or { step, group })
 *   recipe.category       — mono meta pill
 *   recipe.yield_portions — mono meta pill
 */
export function QuietRecipeCard({ recipe = {}, brand = {} }) {
  const lines  = recipe.lines || []
  const method = normalizeMethod(recipe.method)

  const metaTokens = []
  if (recipe.category) metaTokens.push(recipe.category.toUpperCase())
  if (recipe.yield_portions) metaTokens.push(`YIELD ${recipe.yield_portions}`)

  return (
    <div className="tpl q-tpl q-recipe printable">
      <header className="q-recipe-header">
        <QuietBrandLockup brand={brand} size="md" layout="inline"/>
        <QuietEyebrow className="q-recipe-header-right">A5 · Recipe</QuietEyebrow>
      </header>

      <div className="q-recipe-title-block">
        <QuietDot/>
        <h2 className="q-title q-recipe-title">{recipe.name || 'Recipe name'}</h2>
        {metaTokens.length > 0 && (
          <QuietEyebrow className="q-recipe-meta">
            {metaTokens.join(' / ')}
          </QuietEyebrow>
        )}
      </div>

      <section className="q-recipe-section">
        <QuietEyebrow>Ingredients</QuietEyebrow>
        {lines.length === 0 ? (
          <p className="q-empty">No ingredients yet — link them via Recipe BOM.</p>
        ) : (
          <ul className="q-recipe-ingredients">
            {lines.map((line, idx) => (
              <li key={idx}>
                <span className="q-recipe-ing-name">{line.ingredient_name || 'Unknown'}</span>
                <span className="q-recipe-ing-qty">
                  <QuietQty qty={line.qty} unit={line.unit}/>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="q-recipe-section q-recipe-method-section">
        <QuietEyebrow>Method</QuietEyebrow>
        {method.length === 0 ? (
          <p className="q-empty">Add method steps via the recipe's <em>Content</em> drawer.</p>
        ) : (
          <ol className="q-recipe-method">
            {method.map((step, i) =>
              step.group
                ? <li key={i} className="q-method-group">{step.group}</li>
                : <li key={i}>{step.step}</li>
            )}
          </ol>
        )}
      </section>

      <div className="q-recipe-footer-wrap">
        <QuietRule marginBottom="6mm"/>
        <QuietFooter brand={brand} layout="split"/>
      </div>
    </div>
  )
}

function normalizeMethod(raw) {
  if (!raw || !Array.isArray(raw)) return []
  const out = []
  let lastGroup = null
  for (const item of raw) {
    if (typeof item === 'string') { out.push({ step: item }); continue }
    if (item && typeof item === 'object') {
      const g = item.group || item.group_label || item.groupLabel
      if (g && g !== lastGroup) { out.push({ group: g }); lastGroup = g }
      const s = item.step || item.text
      if (s) out.push({ step: s })
    }
  }
  return out
}
