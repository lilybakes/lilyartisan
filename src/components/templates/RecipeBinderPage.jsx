function money(n, currency = 'RM') {
  return `${currency}${Number(n || 0).toFixed(2)}`
}

/**
 * Recipe Binder Page — "Chef's Professional"
 * A4. Left brand-color sidebar with metadata; right-hand main body.
 */
export function RecipeBinderPage({ recipe, brand }) {
  const currency = brand.currency || 'RM'

  return (
    <div className="tpl tpl-binder-v2 printable" style={{ '--brand': brand.brand_color }}>
      {/* Sidebar */}
      <aside className="tpl-binder-v2-side">
        <div className="tpl-binder-v2-side-brand">
          {brand.logo_data_url && <img src={brand.logo_data_url} alt="" className="tpl-binder-v2-side-logo"/>}
          <div className="tpl-binder-v2-side-name">{brand.business_name || 'Your Bakery'}</div>
          {brand.tagline && <div className="tpl-binder-v2-side-tag">{brand.tagline}</div>}
        </div>

        <div className="tpl-binder-v2-side-rule"/>

        <div className="tpl-binder-v2-side-meta">
          <div className="tpl-binder-v2-side-meta-item">
            <div className="tpl-binder-v2-side-meta-label">Category</div>
            <div className="tpl-binder-v2-side-meta-value">{recipe.category || '—'}</div>
          </div>
          <div className="tpl-binder-v2-side-meta-item">
            <div className="tpl-binder-v2-side-meta-label">Yield</div>
            <div className="tpl-binder-v2-side-meta-value">{recipe.yield_portions} portions</div>
          </div>
          <div className="tpl-binder-v2-side-meta-item">
            <div className="tpl-binder-v2-side-meta-label">Batch cost</div>
            <div className="tpl-binder-v2-side-meta-value">{money(recipe.total_cost, currency)}</div>
          </div>
          <div className="tpl-binder-v2-side-meta-item">
            <div className="tpl-binder-v2-side-meta-label">Cost / portion</div>
            <div className="tpl-binder-v2-side-meta-value">{money(recipe.cost_per_portion, currency)}</div>
          </div>
          <div className="tpl-binder-v2-side-meta-item tpl-binder-v2-side-meta-hero">
            <div className="tpl-binder-v2-side-meta-label">Sell / portion</div>
            <div className="tpl-binder-v2-side-meta-value">{money(recipe.suggested_price, currency)}</div>
          </div>
        </div>

        <div className="tpl-binder-v2-side-photo">
          {recipe.image_url ? (
            <img src={recipe.image_url} alt=""/>
          ) : (
            <div className="tpl-binder-v2-side-photo-empty">
              <div>📷</div>
              <div>Photo slot</div>
            </div>
          )}
        </div>

        <div className="tpl-binder-v2-side-contact">
          {brand.contact_phone && <div>{brand.contact_phone}</div>}
          {brand.contact_email && <div>{brand.contact_email}</div>}
          {brand.website       && <div>{brand.website}</div>}
          {brand.instagram     && <div>@{brand.instagram}</div>}
          {brand.facebook      && <div>fb/{brand.facebook}</div>}
          {brand.address       && <div className="tpl-binder-v2-side-addr">{brand.address}</div>}
        </div>
      </aside>

      {/* Main body */}
      <main className="tpl-binder-v2-main">
        <div className="tpl-binder-v2-main-head">
          <div className="tpl-binder-v2-eyebrow">Recipe № {(recipe.id || '').slice(0, 6)}</div>
          <h1 className="tpl-binder-v2-name">{recipe.name}</h1>
          {recipe.description && <p className="tpl-binder-v2-desc">{recipe.description}</p>}
        </div>

        <section className="tpl-binder-v2-section">
          <h2>Ingredients</h2>
          <table className="tpl-binder-v2-ing">
            <thead>
              <tr>
                <th>Ingredient</th>
                <th style={{textAlign:'right', width:70}}>Qty</th>
                <th style={{textAlign:'right', width:80}}>Cost</th>
              </tr>
            </thead>
            <tbody>
              {recipe.lines.map((l, i) => (
                <tr key={i}>
                  <td>{l.ingredient_name}</td>
                  <td style={{textAlign:'right'}}>{l.qty} {l.unit || ''}</td>
                  <td style={{textAlign:'right'}}>{money(l.cost, currency)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="2" style={{textAlign:'right'}}>Batch total</td>
                <td style={{textAlign:'right', color:'var(--brand)'}}>{money(recipe.total_cost, currency)}</td>
              </tr>
            </tfoot>
          </table>
        </section>

        <section className="tpl-binder-v2-section">
          <h2>Method</h2>
          <div className="tpl-binder-v2-method">
            {recipe.method || <span style={{color:'#A5A3AE', fontStyle:'italic'}}>No method recorded.</span>}
          </div>
        </section>

        <section className="tpl-binder-v2-section">
          <h2>Chef's notes</h2>
          <div className="tpl-binder-v2-notes">
            {[1,2,3,4,5,6].map(i => <div key={i} className="tpl-binder-v2-notes-line"/>)}
          </div>
        </section>
      </main>
    </div>
  )
}
