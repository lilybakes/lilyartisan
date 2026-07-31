import { CrispBrandLockup, CrispRule, CrispChip, CrispFooter } from './_parts.jsx'

/**
 * 01 — RECIPE CARD  (A5 portrait, 148×210mm)
 *
 * FIELD MAPPING (enriched recipe from Templates.jsx):
 *   recipe.lines[]        — { ingredient_name, qty, unit, cost, unit_cost }
 *   recipe.method[]       — jsonb array of strings, or { step, group }
 *   recipe.category       — meta chip
 *   recipe.yield_portions — meta chip
 */
export function CrispRecipeCard({ recipe = {}, brand = {} }) {
  const lines  = recipe.lines || []
  const method = normalizeMethod(recipe.method)
  const yieldStr = recipe.yield_portions
    ? `Yield ${recipe.yield_portions}${recipe.yield_portions === 1 ? '' : ' portions'}`
    : null

  return (
    <div className="tpl c-tpl c-recipe-card printable">
      <header className="c-header">
        <CrispBrandLockup brand={brand} size="md" layout="row"/>
      </header>

      <CrispRule/>

      <div className="c-recipe-body">
        <div>
          <h2 className="c-recipe-title">{recipe.name || 'Recipe name'}</h2>
          <div className="c-recipe-chips">
            {recipe.category && <CrispChip>{recipe.category}</CrispChip>}
            {yieldStr && <CrispChip>{yieldStr}</CrispChip>}
          </div>
        </div>

        <section>
          <div className="c-eyebrow c-eyebrow-brown c-section-lbl">Ingredients</div>
          {lines.length === 0 ? (
            <p className="c-empty">No ingredients yet — link them via Recipe BOM.</p>
          ) : (
            <div className="c-recipe-ingredients">
              {lines.map((line, idx) => (
                <div key={idx} className="c-recipe-ing-pair">
                  <span className="c-recipe-ing-qty">
                    {line.qty}{line.unit ? ` ${line.unit}` : ''}
                  </span>
                  <span className="c-recipe-ing-name">
                    {line.ingredient_name || 'Unknown ingredient'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="c-eyebrow c-eyebrow-brown c-section-lbl">Method</div>
          {method.length === 0 ? (
            <p className="c-empty">
              Add method steps in the recipe's <em>Content</em> drawer.
            </p>
          ) : (
            <ol className="c-recipe-method">
              {method.map((step, i) =>
                step.group
                  ? <li key={i} className="c-method-group">{step.group}</li>
                  : <li key={i}>{step.step}</li>
              )}
            </ol>
          )}
        </section>
      </div>

      <CrispFooter brand={brand} layout="split"/>
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
