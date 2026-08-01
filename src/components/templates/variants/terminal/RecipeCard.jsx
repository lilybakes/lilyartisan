import {
  TrLogo, TrEyebrow, TrRule, TrStatusChip, TrMetaCell, TrMethodDigit, TrFooter,
  normalizeMethod, zeroPad, renderLastStep,
} from './_parts.jsx'

/**
 * 01 — RECIPE CARD  (A5 portrait, 148×210mm)
 *
 * Terminal / CRT aesthetic on dark navy grid paper.
 *
 * Top row: DC teal square + Manrope 800 brand name + mono uppercase
 * subtitle on the LEFT; `• ACTIVE` teal-outlined status chip on the RIGHT.
 * Thin teal hair rule. Then the `RECIPE_01 / BREAD` teal mono eyebrow, big
 * Manrope 800 title, and a 3-cell meta row (YIELD / BAKE / TIME) each with
 * a teal LEFT VERTICAL BAR, mono uppercase teal label, Manrope 700 white
 * value.
 *
 * Two-column body: INPUTS left (teal mono eyebrow, ingredient rows with
 * hair separators — name white, qty teal mono right-aligned), SEQUENCE
 * right (teal mono eyebrow, numbered method steps with plain teal mono
 * digits, FINAL step's digit turns AMBER and leading imperative bolds).
 *
 * Thin hair rule + split footer at bottom.
 */
export function TrRecipeCard({ recipe = {}, brand = {} }) {
  const lines  = recipe.lines || []
  const method = normalizeMethod(recipe.method)

  const y = Number(recipe.yield_portions) || 0
  const category = (recipe.category || 'RECIPE').toUpperCase().replace(/\s+/g, '_')
  const isBread = (recipe.category || '').toLowerCase() === 'bread'
  const yieldUnit = isBread
    ? (y === 1 ? 'LOAF' : 'LOAVES')
    : (y === 1 ? 'PORTION' : 'PORTIONS')
  const yieldValue = y > 0 ? `${y} ${yieldUnit}` : '—'
  const bakeTemp = recipe.bake_temp || recipe.oven_temp || '240°C'
  const bakeTime = recipe.bake_time || recipe.time || '35 MIN'

  const recipeNum = zeroPad(recipe.number || recipe.recipe_number || 1)
  const eyebrowText = `RECIPE_${recipeNum} / ${category}`

  const totalSteps = method.filter(s => !s.group).length
  let stepCounter = 0

  return (
    <div className="tpl tr-tpl tr-recipe printable">
      <header className="tr-recipe-header">
        <div className="tr-recipe-brand">
          <TrLogo brand={brand} size="md"/>
          <div className="tr-recipe-brand-text">
            <div className="tr-recipe-brand-name">
              {brand.business_name || 'The Daily Crumb'}
            </div>
            <div className="tr-recipe-brand-sub">
              {(brand.tagline || 'ARTISAN BAKERY').toUpperCase()} / {(brand.city || 'IPOH').toUpperCase()}
            </div>
          </div>
        </div>
        <TrStatusChip tone="teal">ACTIVE</TrStatusChip>
      </header>

      <TrRule tone="hair" marginTop="4mm" marginBottom="6mm"/>

      <TrEyebrow tone="teal" className="tr-recipe-eyebrow">{eyebrowText}</TrEyebrow>

      <h2 className="tr-recipe-title">{recipe.name || 'Classic Sourdough Loaf'}</h2>

      <div className="tr-recipe-meta-row">
        <TrMetaCell label="YIELD" value={yieldValue}/>
        <TrMetaCell label="BAKE"  value={String(bakeTemp).toUpperCase()}/>
        <TrMetaCell label="TIME"  value={String(bakeTime).toUpperCase()}/>
      </div>

      <div className="tr-recipe-body">
        <section className="tr-recipe-section">
          <TrEyebrow tone="teal">INPUTS</TrEyebrow>
          {lines.length === 0 ? (
            <p className="tr-empty">// no inputs — link them via Recipe BOM</p>
          ) : (
            <ul className="tr-recipe-ing-list">
              {lines.map((line, idx) => (
                <li key={idx}>
                  <span className="tr-recipe-ing-name">{line.ingredient_name || 'Unknown'}</span>
                  <span className="tr-recipe-ing-qty">
                    {line.qty}{line.unit ? ` ${line.unit}` : ''}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="tr-recipe-section">
          <TrEyebrow tone="teal">SEQUENCE</TrEyebrow>
          {method.length === 0 ? (
            <p className="tr-empty">// no method — add via Content drawer</p>
          ) : (
            <ol className="tr-recipe-method-list">
              {method.map((item, i) => {
                if (item.group) return <li key={i} className="tr-method-group">// {item.group}</li>
                stepCounter += 1
                const isLast = stepCounter === totalSteps
                return (
                  <li key={i}>
                    <TrMethodDigit number={zeroPad(stepCounter)} variant={isLast ? 'accent' : 'normal'}/>
                    <span className={isLast ? 'tr-recipe-method-step tr-recipe-method-step-final' : 'tr-recipe-method-step'}>
                      {isLast ? renderLastStep(item.step) : item.step}
                    </span>
                  </li>
                )
              })}
            </ol>
          )}
        </section>
      </div>

      <div className="tr-recipe-footer-wrap">
        <TrRule tone="hair" marginBottom="3mm"/>
        <TrFooter brand={brand} layout="split"/>
      </div>
    </div>
  )
}
