import {
  LetterpressBrandLockup, LetterpressRuleWithLabel, LetterpressFooter,
  LetterpressFleuron, spellOutNumber,
} from './_parts.jsx'

/**
 * 01 — RECIPE CARD  (A5 portrait, 148×210mm)
 *
 * Centered layout, DC in square top, "— RECIPE —" rule-with-label divider,
 * massive serif product title, small-caps meta line, ingredients as
 * name→dotted-leader→qty rows, method as serif numbered list, tiny fleuron
 * near the bottom before the footer.
 *
 * FIELD MAPPING:
 *   recipe.lines[]        — { ingredient_name, qty, unit }
 *   recipe.method[]       — jsonb array of strings, or { step, group }
 *   recipe.category       — meta chip text
 *   recipe.yield_portions — meta (spelled out: "yield one loaf")
 */
export function LetterpressRecipeCard({ recipe = {}, brand = {} }) {
  const lines  = recipe.lines || []
  const method = normalizeMethod(recipe.method)

  const metaTokens = []
  if (recipe.category) metaTokens.push(recipe.category)
  if (recipe.yield_portions) {
    const y = Number(recipe.yield_portions)
    const spelled = spellOutNumber(y)
    const unit = (recipe.category || '').toLowerCase() === 'bread' ? 'loaf' : 'portion'
    metaTokens.push(`Yield ${spelled} ${unit}${y === 1 ? '' : 's'}`)
  }

  return (
    <div className="tpl l-tpl l-recipe-card printable">
      <div className="l-recipe-inner">
        <header className="l-recipe-header">
          <LetterpressBrandLockup brand={brand} size="md" layout="column"/>
        </header>

        <LetterpressRuleWithLabel label="Recipe"/>

        <h2 className="l-recipe-title">{recipe.name || 'Recipe name'}</h2>
        {metaTokens.length > 0 && (
          <div className="l-eyebrow l-eyebrow-muted l-recipe-meta">
            {metaTokens.join(' · ')}
          </div>
        )}

        <section className="l-recipe-section">
          <div className="l-eyebrow l-eyebrow-burgundy l-recipe-section-head">Ingredients</div>
          {lines.length === 0 ? (
            <p className="l-empty">No ingredients yet — link them via Recipe BOM.</p>
          ) : (
            <ul className="l-recipe-ingredients">
              {lines.map((line, idx) => (
                <li key={idx}>
                  <span className="l-recipe-ing-name">{line.ingredient_name || 'Unknown'}</span>
                  <span className="l-recipe-ing-leader"/>
                  <span className="l-recipe-ing-qty">
                    {line.qty}{line.unit ? ` ${line.unit}` : ''}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="l-recipe-section">
          <div className="l-eyebrow l-eyebrow-burgundy l-recipe-section-head">Method</div>
          {method.length === 0 ? (
            <p className="l-empty">Add method steps in the recipe's <em>Content</em> drawer.</p>
          ) : (
            <ol className="l-recipe-method">
              {method.map((step, i) =>
                step.group
                  ? <li key={i} className="l-method-group">{step.group}</li>
                  : <li key={i}>{step.step}</li>
              )}
            </ol>
          )}
        </section>

        <div className="l-recipe-fleuron"><LetterpressFleuron size={28}/></div>

        <LetterpressFooter brand={brand}/>
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
