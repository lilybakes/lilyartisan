import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useSettings } from '../lib/settings.jsx'
import { TEMPLATES, getTemplate, getTemplateComponent } from '../components/templates/index.js'
import TemplatePreviewGlyph from '../components/TemplatePreviewGlyph.jsx'
import '../components/templates-picker.css'

// Enrich a raw recipe with BOM + costs
function enrich(recipe, bomLines, ingredients, defaultTargetPct) {
  const lines = (bomLines[recipe.id] || []).map(l => {
    const ing = ingredients[l.ingredient_id]
    if (!ing) return { ...l, ingredient_name: 'Unknown ingredient', cost: 0, unit_cost: 0 }
    const unitCost = (ing.purchase_price / (ing.purchase_qty || 1)) * (1 + (ing.waste_pct || 0) / 100)
    const cost = unitCost * (Number(l.qty) || 0)
    return { ...l, ingredient_name: ing.name, unit_cost: unitCost, cost }
  })
  const totalCost  = lines.reduce((s, l) => s + l.cost, 0)
  const perPortion = totalCost / (recipe.yield_portions || 1)
  const targetPct  = recipe.target_food_cost_pct || defaultTargetPct || 30
  const suggested  = targetPct > 0 ? perPortion / (targetPct / 100) : 0
  return {
    ...recipe,
    lines,
    total_cost:            totalCost,
    cost_per_portion:      perPortion,
    target_food_cost_pct:  targetPct,
    suggested_price:       suggested,
  }
}

const STYLE_VARIANTS = [
  { key: 'kraft',       name: 'Rustic Kraft & Stamp' },
  { key: 'clean',       name: 'Clean Modern' },
  { key: 'crisp',       name: 'Crisp' },
  { key: 'letterpress', name: 'Vintage Letterpress' },
  { key: 'editorial',   name: 'Editorial Magazine' },
  { key: 'minimal',     name: 'Quiet Minimal' },
  { key: 'flour-ink',   name: 'Flour & Ink' },
]

export default function Templates() {
  const settingsCtx = useSettings() || {}
  const settings = settingsCtx.settings || {}
  const [recipes, setRecipes]           = useState([])
  const [ingredients, setIngredients]   = useState({})
  const [bomLines, setBomLines]         = useState({})
  const [recipeId, setRecipeId]         = useState('')
  const [templateKey, setTemplateKey]   = useState('classic')
  const [currentStyle, setCurrentStyle] = useState('kraft')
  const [customizations, setCustoms]    = useState({})
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    ;(async () => {
      const [{ data: recs }, { data: ings }, { data: bom }, { data: customs }] = await Promise.all([
        supabase.from('recipes').select('*').order('name'),
        supabase.from('ingredients').select('*'),
        supabase.from('bom_lines').select('*'),
        supabase.from('template_customization').select('*'),
      ])
      const ingMap = {}
      for (const i of ings || []) ingMap[i.id] = i
      const bomMap = {}
      for (const line of bom || []) {
        if (!bomMap[line.recipe_id]) bomMap[line.recipe_id] = []
        bomMap[line.recipe_id].push(line)
      }
      const customMap = {}
      for (const c of customs || []) customMap[c.template_key] = c.custom || {}

      setRecipes(recs || [])
      setIngredients(ingMap)
      setBomLines(bomMap)
      setCustoms(customMap)
      if (recs?.length) setRecipeId(prev => prev || recs[0].id)
      setLoading(false)
    })()
  }, [])

  const enrichedRecipes = useMemo(() => (
    recipes.map(r => enrich(r, bomLines, ingredients, settings.default_target_food_cost_pct))
  ), [recipes, bomLines, ingredients, settings.default_target_food_cost_pct])

  const enrichedRecipe = enrichedRecipes.find(r => r.id === recipeId) || null

  const brand = useMemo(() => ({
    business_name:            settings.business_name || '',
    owner_name:               settings.owner_name || '',
    logo_data_url:            settings.logo_data_url,
    tagline:                  settings.tagline || '',
    brand_color:              settings.brand_color || '#6C5CE7',
    currency:                 settings.currency || 'RM',
    contact_phone:            settings.contact_phone || '',
    phone:                    settings.contact_phone || '',
    contact_email:            settings.contact_email || '',
    email:                    settings.contact_email || '',
    website:                  settings.website || '',
    address:                  settings.address || '',
    address_line1:            settings.address_line1 || settings.address || '',
    address_line2:            settings.address_line2 || '',
    city:                     settings.city || '',
    instagram:                settings.instagram || '',
    facebook:                 settings.facebook || '',
    default_storage_notes:    settings.default_storage_notes || '',
    default_care_text:        settings.default_care_text || '',
    default_allergen_notice:  settings.default_allergen_notice || '',
    head_baker_name:          settings.head_baker_name || '',
    head_baker_signature_url: settings.head_baker_signature_url || '',
    wholesale_discount_pct:   settings.wholesale_discount_pct ?? 30,
    wholesale_moq:            settings.wholesale_moq ?? 10,
    wholesale_terms_text:     settings.wholesale_terms_text || '',
  }), [settings])

  const template = getTemplate(templateKey)
  const { Component: TemplateComponent, dedicated: isDedicatedVariant } =
    getTemplateComponent(templateKey, currentStyle)

  const isMulti = !!template?.multi
  const canPreview = !!TemplateComponent && (isMulti || enrichedRecipe)
  const brandComplete = !!(settings.business_name && settings.logo_data_url)
  const currentCustomization = customizations[templateKey] || {}

  return (
    <>
      <div className="panel no-print">
        <div className="panel-head">
          <div>
            <h3>Recipe Templates</h3>
            <p className="sub">
              Generate personalized sheets. Content pulls from Recipe Master and Settings —
              tweak per-template snippets in <a href="/app/settings/template-customization">Template Customization</a>.
            </p>
          </div>
        </div>

        {!brandComplete && (
          <div className="conv-box" style={{marginBottom:16}}>
            <div className="conv-icon">💡</div>
            <div>
              <b>Set up your brand first.</b> Add your logo and business name in <a href="/app/settings">Settings</a> to make templates look personalized.
            </div>
          </div>
        )}

        {!isMulti && (
          <div className="tpl-controls">
            <div className="field">
              <label>Recipe</label>
              <select value={recipeId} onChange={e => setRecipeId(e.target.value)} disabled={loading || recipes.length === 0}>
                {loading && <option>Loading…</option>}
                {!loading && recipes.length === 0 && <option>No recipes yet — create one first</option>}
                {recipes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Style</label>
              <select value={currentStyle} onChange={e => setCurrentStyle(e.target.value)}>
                {STYLE_VARIANTS.map(s => <option key={s.key} value={s.key}>{s.name}</option>)}
              </select>
            </div>
          </div>
        )}

        {isMulti && (
          <div className="tpl-multi-notice">
            <span className="tpl-multi-badge">Multi-recipe</span>
            This template renders <strong>all your recipes</strong> ({enrichedRecipes.length} total).
          </div>
        )}

        <div className="tpl-picker-grid">
          {TEMPLATES.map(t => (
            <button
              key={t.key}
              type="button"
              className={'tpl-card' + (templateKey === t.key ? ' active' : '')}
              onClick={() => setTemplateKey(t.key)}
              style={{ '--tpl-accent': t.gradient || 'linear-gradient(135deg,#6C5CE7,#8478F5)' }}
            >
              <div className="tpl-card-glyph" aria-hidden>
                <TemplatePreviewGlyph shape={t.preview} pageSize={t.pageSize}/>
              </div>
              <div className="tpl-card-body">
                <div className="tpl-card-name">{t.name}</div>
                <div className="tpl-card-desc">{t.description}</div>
              </div>
              <div className="tpl-card-badges">
                {t.pageSize && <span className="tpl-card-size">{t.pageSize}</span>}
                {t.multi && <span className="tpl-card-multi">ALL</span>}
              </div>
            </button>
          ))}
        </div>

        {canPreview && (
          <div className="tpl-actions">
            <button className="primary" onClick={() => window.print()}>
              🖨️  Print / Save as PDF
            </button>
            <div className="hint">Uses your browser's print dialog — pick "Save as PDF" for a downloadable version.</div>
          </div>
        )}
      </div>

      {canPreview && (
        <div className="templates-preview">
          {isDedicatedVariant ? (
            <TemplateComponent
              recipe={enrichedRecipe}
              recipes={enrichedRecipes}
              brand={brand}
              customization={currentCustomization}
            />
          ) : (
            <TemplateComponent
              recipe={enrichedRecipe}
              recipes={enrichedRecipes}
              brand={brand}
              styleVariant={currentStyle}
              customization={currentCustomization}
            />
          )}
        </div>
      )}
    </>
  )
}
