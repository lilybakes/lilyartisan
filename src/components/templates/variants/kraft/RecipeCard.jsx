import {
  KraftBrandLockup, KraftDoubleRule, KraftSeal, KraftFooter, KraftEyebrow,
} from './_parts.jsx'

/**
 * 01 — RECIPE CARD  (A5 portrait, 148×210mm)
 *
 * Matches Image 6 (Classic Sourdough Loaf) from the Kraft handover:
 *   • Small brand lockup top-left (monogram + name + tagline)
 *   • Double horizontal brown rule
 *   • Large slab-serif recipe title + small-caps meta row
 *   • Ingredients: 2-column grid — bold slab-serif brown qty | regular name
 *   • Method: numbered list in body sans
 *   • Circular dashed "BAKED SMALL BATCH" seal bottom-right
 *   • Dashed-divider footer split between address (L) and contact (R)
 */
export function KraftRecipeCard({ recipe = {}, brand = {} }) {
  const ings = recipe.ingredients || []
  const method = recipe.method || []
  const yieldStr = recipe.yield_portions
    ? `YIELD ${recipe.yield_portions} ${recipe.yield_unit || 'PORTIONS'}`
    : null
  const notes = recipe.notes  // optional third meta chip (e.g. "SLOW FERMENT")

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
            {notes && <><span className="k-recipe-meta-sep">·</span><span>{notes}</span></>}
          </div>
        </div>

        <section>
          <div className="k-recipe-section-head">
            <h3>Ingredients</h3>
            <div className="k-rule-single"/>
          </div>
          <div className="k-recipe-ingredients">
            {ings.map((i, idx) => (
              <>
                <div key={`q${idx}`} className="k-recipe-ing-qty">{i.qty}{i.unit ? ` ${i.unit}` : ''}</div>
                <div key={`n${idx}`} className="k-recipe-ing-name">{i.name}</div>
              </>
            ))}
          </div>
        </section>

        <section>
          <div className="k-recipe-section-head">
            <h3>Method</h3>
            <div className="k-rule-single"/>
          </div>
          <ol className="k-recipe-method">
            {method.map((step, i) => (
              <li key={i}>{typeof step === 'string' ? step : step.step}</li>
            ))}
          </ol>
        </section>
      </div>

      <div className="k-recipe-seal-wrap">
        <KraftSeal text="BAKED / SMALL / BATCH" size={82}/>
      </div>

      <KraftFooter brand={brand} layout="split"/>
    </div>
  )
}
