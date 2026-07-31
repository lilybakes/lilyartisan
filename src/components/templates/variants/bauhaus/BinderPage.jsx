import {
  BhLogoMark, BhEyebrow, BhRule, BhMethodChip, BhFooter,
  bhMoney, normalizeMethod, zeroPad,
} from './_parts.jsx'

/**
 * 09 — RECIPE BINDER PAGE  (A4 portrait) — kitchen reference
 *
 * Top ~15mm: a row of four separated shapes across the top-left area —
 * small BLUE rectangle · YELLOW quarter-circle · BLACK rectangle · small
 * RED rectangle. Like a decorative bar. BINDER · CATEGORY · REV meta at
 * top-right (Manrope 700 uppercase).
 *
 * Thick black rule under the composition. Brand lockup (BhLogoMark + name
 * + tagline) with the massive Archivo Black title next to a solid BLACK
 * "RECIPE / PHOTOGRAPH" placeholder box (or user photo).
 *
 * 4-col meta row (CATEGORY / YIELD / COST / PORTION / SELL / PORTION) —
 * each cell has a small blue eyebrow label and Archivo Black value.
 *
 * Two-column body: INGREDIENTS (name / qty / cost columns, BATCH TOTAL
 * bold with thick black top border); METHOD (numbered blue solid squares,
 * sub-groups muted uppercase, FINAL step gets red solid square + bolded
 * highlight phrase).
 *
 * NOTES with 4 lines. Split footer.
 */
export function BhBinderPage({ recipe = {}, brand = {} }) {
  const lines      = recipe.lines || []
  const method     = normalizeMethod(recipe.method)
  const total      = Number(recipe.total_cost)         || 0
  const perPortion = Number(recipe.cost_per_portion)   || 0
  const suggested  = Number(recipe.suggested_price)    || 0
  const photo      = recipe.image_url || recipe.imageUrl
  const category   = (recipe.category || 'Recipes').toUpperCase()

  const now = new Date()
  const rev = String(now.getMonth() + 1).padStart(2, '0')

  const y = Number(recipe.yield_portions) || 0

  const totalSteps = method.filter(s => !s.group).length
  let stepCounter = 0

  return (
    <div className="tpl bh-tpl bh-binder printable">
      {/* --- Row of 4 shapes across the top-left, meta at right --- */}
      <div className="bh-binder-top">
        <div className="bh-binder-top-shapes">
          <span className="bh-binder-top-blue"/>
          <span className="bh-binder-top-yellow"/>
          <span className="bh-binder-top-black"/>
          <span className="bh-binder-top-red"/>
        </div>
        <div className="bh-binder-top-meta">
          BINDER · {category} · REV {rev}
        </div>
      </div>

      <BhRule weight="thick" marginTop="4mm" marginBottom="8mm"/>

      <header className="bh-binder-header">
        <div className="bh-binder-brand-lockup">
          <BhLogoMark brand={brand} size="sm"/>
          <div className="bh-binder-brand-text">
            <div className="bh-binder-brand-name">
              {(brand.business_name || 'Your Bakery').toUpperCase()}
            </div>
            <BhEyebrow tone="muted">
              {brand.tagline || 'Artisan bakery'} — {(brand.city || 'Ipoh').toUpperCase()}
            </BhEyebrow>
          </div>
        </div>
      </header>

      <div className="bh-binder-title-row">
        <div className="bh-binder-title-left">
          <BhEyebrow tone="blue">Recipe</BhEyebrow>
          <h2 className="bh-title bh-binder-title">
            {(recipe.name || 'Recipe name').toUpperCase()}
          </h2>
          {recipe.description && (
            <p className="bh-binder-desc">{recipe.description}</p>
          )}
        </div>
        <div className="bh-binder-photo">
          {photo ? (
            <img src={photo} alt={recipe.name || ''}/>
          ) : (
            <div className="bh-binder-photo-placeholder">
              <div>RECIPE</div>
              <div>PHOTOGRAPH</div>
            </div>
          )}
        </div>
      </div>

      <BhRule weight="thick" marginTop="6mm" marginBottom="4mm"/>

      <div className="bh-binder-meta-row">
        <div className="bh-binder-meta-cell">
          <BhEyebrow tone="blue">Category</BhEyebrow>
          <div className="bh-binder-meta-val">{(recipe.category || '—').toUpperCase()}</div>
        </div>
        <div className="bh-binder-meta-cell">
          <BhEyebrow tone="blue">Yield</BhEyebrow>
          <div className="bh-binder-meta-val">{y > 0 ? y : '—'}</div>
        </div>
        <div className="bh-binder-meta-cell">
          <BhEyebrow tone="blue">Cost / Portion</BhEyebrow>
          <div className="bh-binder-meta-val">{bhMoney(perPortion)}</div>
        </div>
        <div className="bh-binder-meta-cell">
          <BhEyebrow tone="blue">Sell / Portion</BhEyebrow>
          <div className="bh-binder-meta-val">{bhMoney(suggested)}</div>
        </div>
      </div>

      <BhRule weight="thick" marginBottom="8mm"/>

      <div className="bh-binder-body">
        <section className="bh-binder-section">
          <BhEyebrow tone="red">Ingredients</BhEyebrow>
          <div className="bh-binder-ing-list">
            {lines.length === 0 ? (
              <p className="bh-empty">No ingredients linked yet.</p>
            ) : (
              <>
                {lines.map((line, idx) => (
                  <div key={idx} className="bh-binder-ing-row">
                    <span className="bh-binder-ing-name">
                      {(line.ingredient_name || 'Unknown').toUpperCase()}
                    </span>
                    <span className="bh-binder-ing-qty">
                      {line.qty}{line.unit ? ` ${line.unit.toUpperCase()}` : ''}
                    </span>
                    <span className="bh-binder-ing-cost">
                      {Number(line.cost || 0).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="bh-binder-batch-row">
                  <span>BATCH TOTAL</span>
                  <span/>
                  <span>{Number(total).toFixed(2)}</span>
                </div>
              </>
            )}
          </div>
        </section>

        <section className="bh-binder-section">
          <BhEyebrow tone="blue">Method</BhEyebrow>
          {method.length === 0 ? (
            <p className="bh-empty">Add method steps via the recipe's Content drawer.</p>
          ) : (
            <ol className="bh-binder-method">
              {method.map((item, i) => {
                if (item.group) return <li key={i} className="bh-method-group">{item.group}</li>
                stepCounter += 1
                const isLast = stepCounter === totalSteps
                return (
                  <li key={i}>
                    <BhMethodChip number={zeroPad(stepCounter)} variant={isLast ? 'accent' : 'normal'}/>
                    <span className={isLast ? 'bh-binder-method-step bh-binder-method-step-final' : 'bh-binder-method-step'}>
                      {isLast ? renderLastStep(item.step) : item.step}
                    </span>
                  </li>
                )
              })}
            </ol>
          )}
        </section>
      </div>

      <section className="bh-binder-notes">
        <BhEyebrow tone="red">Chef's Notes</BhEyebrow>
        <div className="bh-binder-notes-lines">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bh-binder-notes-line"/>
          ))}
        </div>
      </section>

      <div className="bh-binder-footer-wrap">
        <BhRule weight="thick" marginTop="auto" marginBottom="4mm"/>
        <BhFooter brand={brand} layout="split" showSocials={false}/>
      </div>
    </div>
  )
}

function renderLastStep(text) {
  if (!text) return null
  const s = String(text).trim()
  const m = s.match(/^(.+?\s+)(\w+\s+\w+)(\s+.+)$/)
  if (m && s.length > 30 && s.length < 90) {
    return <>{m[1]}<strong>{m[2]}</strong>{m[3]}</>
  }
  const m2 = s.match(/^([A-Z][a-z]+(?:\s+[a-z]+)?)\s+(.+)$/)
  if (m2) return <><strong>{m2[1]}</strong> {m2[2]}</>
  return s
}
