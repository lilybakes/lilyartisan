import {
  VerdantBrandLockup, VerdantEyebrow, VerdantMethodChip, VerdantRule,
  VerdantHairRule, VerdantFooter, verdantMoney, normalizeMethod,
} from './_parts.jsx'

/**
 * 09 — RECIPE BINDER PAGE  (A4 portrait) — kitchen reference
 *
 * Brand top-left, KITCHEN BINDER · CATEGORY · [rev] small caps green top-right.
 * Thick green rule. Left main area: big serif title + sans description.
 * Right: rounded mint "RECIPE PHOTO (PLACEHOLDER)" box.
 *
 * Meta row of 4 rounded cards — CATEGORY / YIELD / COST / PORTION /
 * SELL / PORTION. The last (SELL / PORTION) inverts to a DARK-GREEN fill
 * with cream text — the accent that draws the eye to the price the
 * kitchen sells at.
 *
 * Two-column body: INGREDIENTS list (name / qty / cost, hairline rows,
 * bold "Batch total" with a green rule above); METHOD as numbered mint
 * chips, sub-groups (CUPCAKES / BUTTERCREAM) in muted small caps, the
 * FINAL step gets the dark-green accent chip. CHEF'S NOTES with 4 ruled
 * lines. Split footer.
 */
export function VerdantBinderPage({ recipe = {}, brand = {} }) {
  const lines      = recipe.lines || []
  const method     = normalizeMethod(recipe.method)
  const total      = Number(recipe.total_cost)         || 0
  const perPortion = Number(recipe.cost_per_portion)   || 0
  const suggested  = Number(recipe.suggested_price)    || 0
  const photo      = recipe.image_url || recipe.imageUrl
  const category   = (recipe.category || 'Recipes').toUpperCase()

  const now = new Date()
  const rev = String(now.getMonth() + 1).padStart(2, '0')

  const totalSteps = method.filter(s => !s.group).length
  let stepCounter = 0

  return (
    <div className="tpl v-tpl v-binder printable">
      <header className="v-binder-header">
        <VerdantBrandLockup brand={brand}/>
        <VerdantEyebrow className="v-binder-header-right">
          Kitchen Binder · {category} · {rev}
        </VerdantEyebrow>
      </header>

      <VerdantRule/>

      <div className="v-binder-title-row">
        <div className="v-binder-title-left">
          <h2 className="v-title v-binder-title">{recipe.name || 'Recipe name'}</h2>
          {recipe.description && (
            <p className="v-binder-desc">{recipe.description}</p>
          )}
        </div>
        <div className="v-binder-photo">
          {photo ? (
            <img src={photo} alt={recipe.name || ''}/>
          ) : (
            <div className="v-binder-photo-placeholder">
              <VerdantEyebrow tone="muted">Recipe Photo</VerdantEyebrow>
              <VerdantEyebrow tone="muted">(Placeholder)</VerdantEyebrow>
            </div>
          )}
        </div>
      </div>

      <div className="v-binder-meta-row">
        <div className="v-binder-meta-cell">
          <VerdantEyebrow>Category</VerdantEyebrow>
          <div className="v-binder-meta-val">{recipe.category || '—'}</div>
        </div>
        <div className="v-binder-meta-cell">
          <VerdantEyebrow>Yield</VerdantEyebrow>
          <div className="v-binder-meta-val">{recipe.yield_portions || '—'}</div>
        </div>
        <div className="v-binder-meta-cell">
          <VerdantEyebrow>Cost / Portion</VerdantEyebrow>
          <div className="v-binder-meta-val">{verdantMoney(perPortion)}</div>
        </div>
        <div className="v-binder-meta-cell v-binder-meta-cell-accent">
          <VerdantEyebrow tone="cream">Sell / Portion</VerdantEyebrow>
          <div className="v-binder-meta-val">{verdantMoney(suggested)}</div>
        </div>
      </div>

      <div className="v-binder-body">
        <section className="v-binder-section">
          <VerdantEyebrow>Ingredients</VerdantEyebrow>
          <div className="v-binder-ing-list">
            {lines.length === 0 ? (
              <p className="v-empty">No ingredients linked yet.</p>
            ) : (
              <>
                {lines.map((line, idx) => (
                  <div key={idx} className="v-binder-ing-row">
                    <span className="v-binder-ing-name">{line.ingredient_name || 'Unknown'}</span>
                    <span className="v-binder-ing-qty">
                      {line.qty}{line.unit ? ` ${line.unit}` : ''}
                    </span>
                    <span className="v-binder-ing-cost">
                      {Number(line.cost || 0).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="v-binder-batch-row">
                  <span>Batch total</span>
                  <span/>
                  <span>{Number(total).toFixed(2)}</span>
                </div>
              </>
            )}
          </div>
        </section>

        <section className="v-binder-section">
          <VerdantEyebrow>Method</VerdantEyebrow>
          {method.length === 0 ? (
            <p className="v-empty">Add method steps via the recipe's Content drawer.</p>
          ) : (
            <ol className="v-binder-method">
              {method.map((item, i) => {
                if (item.group) return <li key={i} className="v-method-group">{item.group}</li>
                stepCounter += 1
                const isLast = stepCounter === totalSteps
                return (
                  <li key={i}>
                    <VerdantMethodChip number={stepCounter} variant={isLast ? 'accent' : 'normal'}/>
                    <span className={isLast ? 'v-binder-method-step v-binder-method-step-accent' : 'v-binder-method-step'}>
                      {item.step}
                    </span>
                  </li>
                )
              })}
            </ol>
          )}
        </section>
      </div>

      <section className="v-binder-notes">
        <VerdantEyebrow>Chef's Notes</VerdantEyebrow>
        <div className="v-binder-notes-lines">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="v-binder-notes-line"/>
          ))}
        </div>
      </section>

      <div className="v-binder-footer-wrap">
        <VerdantHairRule marginTop="auto" marginBottom="4mm"/>
        <VerdantFooter brand={brand} layout="split" showSocials={false}/>
      </div>
    </div>
  )
}
