import {
  KraftBrandLockup, KraftDoubleRule, KraftSeal, KraftFooter,
} from './_parts.jsx'

/**
 * 01 — RECIPE CARD  (A5 portrait, 148×210mm)
 *
 * FIELD MAPPING (enriched recipe from Templates.jsx):
 *   recipe.lines[]        — { ingredient_name, qty, unit, cost, unit_cost }
 *   recipe.method[]       — jsonb array of strings, or { step, group }
 *   recipe.category       — meta chip
 *   recipe.yield_portions — meta chip
 */
export function KraftRecipeCard({ recipe = {}, brand = {} }) {
  const lines  = recipe.lines || []
  const method = normalizeMethod(recipe.method)
  const yieldStr = recipe.yield_portions
    ? `YIELD ${recipe.yield_portions}${recipe.yield_portions === 1 ? '' : ' PORTIONS'}`
    : null

  return (
    <div className="tpl k-tpl k-recipe-card printable">
      <header className="k-recipe-header">
        <KraftBrandLockup brand={brand} size="md" layout="row"/>
      </header>

      <KraftDoubleRule/>

      <div className="k-recipe-body">
        <div>
          <h2 className="k-recipe-title">{recipe.name || 'Recipe name'}</h2>
          <div className="k-recipe-meta">
            {recipe.category && <span>{recipe.category}</span>}
            {recipe.category && yieldStr && <span className="k-recipe-meta-sep">·</span>}
            {yieldStr && <span>{yieldStr}</span>}
          </div>
        </div>

        <section>
          <div className="k-recipe-section-head">
            <h3>Ingredients</h3>
            <div className="k-rule-single"/>
          </div>
          {lines.length === 0 ? (
            <p className="k-recipe-empty">No ingredients yet — link them via Recipe BOM.</p>
          ) : (
            <div className="k-recipe-ingredients">
              {lines.map((line, idx) => (
                <>
                  <div key={`q${idx}`} className="k-recipe-ing-qty">
                    {line.qty}{line.unit ? ` ${line.unit}` : ''}
                  </div>
                  <div key={`n${idx}`} className="k-recipe-ing-name">
                    {line.ingredient_name || 'Unknown ingredient'}
                  </div>
                </>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="k-recipe-section-head">
            <h3>Method</h3>
            <div className="k-rule-single"/>
          </div>
          {method.length === 0 ? (
            <p className="k-recipe-empty">
              Add method steps in the recipe's <em>Content</em> drawer.
            </p>
          ) : (
            <ol className="k-recipe-method">
              {method.map((step, i) =>
                step.group
                  ? <li key={i} className="k-recipe-method-group">{step.group}</li>
                  : <li key={i}>{step.step}</li>
              )}
            </ol>
          )}
        </section>
      </div>

      <div className="k-recipe-seal-wrap">
        <KraftSeal text="BAKED / SMALL / BATCH" size={82}/>
      </div>

      <KraftFooter brand={brand} layout="split"/>
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
