import { BkoBrandLockup, BkoRule, BkoChip, BkoFooter } from './_parts.jsx'

/**
 * 01 — RECIPE CARD  (A5 portrait, 148×210mm)
 *
 * FIELD MAPPING (enriched recipe from Templates.jsx):
 *   recipe.lines[]        — { ingredient_name, qty, unit, cost, unit_cost }
 *   recipe.method[]       — jsonb array of strings, or { step, group }
 *   recipe.category       — meta chip
 *   recipe.yield_portions — meta chip
 */
export function BkoRecipeCard({ recipe = {}, brand = {} }) {
  const lines  = recipe.lines || []
  const method = normalizeMethod(recipe.method)
  const yieldStr = recipe.yield_portions
    ? `Yield ${recipe.yield_portions}${recipe.yield_portions === 1 ? '' : ' portions'}`
    : null

  return (
    <div className="tpl b-tpl b-recipe-card printable">
      <header className="b-header">
        <BkoBrandLockup brand={brand} size="md" layout="row"/>
      </header>

      <BkoRule/>

      <div className="b-recipe-body">
        <div>
          <h2 className="b-recipe-title">{recipe.name || 'Recipe name'}</h2>
          <div className="b-recipe-chips">
            {recipe.category && <BkoChip>{recipe.category}</BkoChip>}
            {yieldStr && <BkoChip>{yieldStr}</BkoChip>}
          </div>
        </div>

        <section>
          <div className="b-eyebrow b-eyebrow-accent b-section-lbl">Ingredients</div>
          {lines.length === 0 ? (
            <p className="b-empty">No ingredients yet — link them via Recipe BOM.</p>
          ) : (
            <div className="b-recipe-ingredients">
              {lines.map((line, idx) => (
                <div key={idx} className="b-recipe-ing-pair">
                  <span className="b-recipe-ing-qty">
                    {line.qty}{line.unit ? ` ${line.unit}` : ''}
                  </span>
                  <span className="b-recipe-ing-name">
                    {line.ingredient_name || 'Unknown ingredient'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="b-eyebrow b-eyebrow-accent b-section-lbl">Method</div>
          {method.length === 0 ? (
            <p className="b-empty">
              Add method steps in the recipe's <em>Content</em> drawer.
            </p>
          ) : (
            <ol className="b-recipe-method">
              {method.map((step, i) =>
                step.group
                  ? <li key={i} className="b-method-group">{step.group}</li>
                  : <li key={i}>{step.step}</li>
              )}
            </ol>
          )}
        </section>
      </div>

      <BkoFooter brand={brand} layout="split"/>
    </div>
  )
}

/** Accepts array of strings OR array of { step, group } — returns flat list of {step} / {group} items */
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
