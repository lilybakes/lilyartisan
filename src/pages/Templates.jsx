import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useSettings } from '../lib/settings.jsx'
import { TEMPLATES, getTemplate } from '../components/templates/index.js'

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

export default function Templates() {
  const settingsCtx = useSettings() || {}
  const settings = settingsCtx.settings || {}
  const [recipes, setRecipes]         = useState([])
  const [ingredients, setIngredients] = useState({})
  const [bomLines, setBomLines]       = useState({})
  const [recipeId, setRecipeId]       = useState('')
  const [templateKey, setTemplateKey] = useState('classic')
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    ;(async () => {
      const [{ data: recs }, { data: ings }, { data: bom }] = await Promise.all([
        supabase.from('recipes').select('*').order('name'),
        supabase.from('ingredients').select('*'),
        supabase.from('bom_lines').select('*'),
      ])
      const ingMap = {}
      for (const i of ings || []) ingMap[i.id] = i
      const bomMap = {}
      for (const line of bom || []) {
        if (!bomMap[line.recipe_id]) bomMap[line.recipe_id] = []
        bomMap[line.recipe_id].push(line)
      }
      setRecipes(recs || [])
      setIngredients(ingMap)
      setBomLines(bomMap)
      if (recs?.length) setRecipeId(prev => prev || recs[0].id)
      setLoading(false)
    })()
  }, [])

  // Enrich ALL recipes upfront — multi-recipe templates need the full list
  const enrichedRecipes = useMemo(() => {
    return recipes.map(r => enrich(r, bomLines, ingredients, settings.default_target_food_cost_pct))
  }, [recipes, bomLines, ingredients, settings.default_target_food_cost_pct])

  const enrichedRecipe = enrichedRecipes.find(r => r.id === recipeId) || null

  const brand = useMemo(() => ({
    business_name:            settings.business_name || '',
    owner_name:               settings.owner_name || '',
    logo_data_url:            settings.logo_data_url,
    tagline:                  settings.tagline || '',
    brand_color:              settings.brand_color || '#6C5CE7',
    currency:                 settings.currency || 'RM',
    contact_phone:            settings.contact_phone || '',
    contact_email:            settings.contact_email || '',
    website:                  settings.website || '',
    address:                  settings.address || '',
    instagram:                settings.instagram || '',
    facebook:                 settings.facebook || '',
    default_storage_notes:    settings.default_storage_notes || '',
    default_allergen_notice:  settings.default_allergen_notice || '',
  }), [settings])

  const template = getTemplate(templateKey)
  const TemplateComponent = template?.component
  const isMulti = !!template?.multi

  const brandComplete = !!(settings.business_name && settings.logo_data_url)

  return (
    <>
      <div className="panel no-print">
        <div className="panel-head">
          <div>
            <h3>Recipe Templates</h3>
            <p className="sub">Generate personalized sheets for customers or your kitchen. Everything uses the brand info from your <a href="/app/settings">Settings page</a>.</p>
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
          <div className="templates-controls">
            <div className="field">
              <label>Recipe</label>
              <select value={recipeId} onChange={e => setRecipeId(e.target.value)} disabled={loading || recipes.length === 0}>
                {loading && <option>Loading…</option>}
                {!loading && recipes.length === 0 && <option>No recipes yet — create one first</option>}
                {recipes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
          </div>
        )}

        {isMulti && (
          <div className="templates-multi-notice">
            <span className="templates-multi-badge">Multi-recipe</span>
            This template renders <strong>all your recipes</strong> ({enrichedRecipes.length} total). Pick a template below.
          </div>
        )}

        <div className="template-picker">
          {TEMPLATES.map(t => (
            <button
              key={t.key}
              type="button"
              className={'template-pick' + (templateKey === t.key ? ' active' : '')}
              onClick={() => setTemplateKey(t.key)}
            >
              <div className="template-pick-icon">{t.icon}</div>
              <div className="template-pick-body">
                <div className="template-pick-name">{t.name}</div>
                <div className="template-pick-desc">{t.description}</div>
              </div>
              <div className="template-pick-size">{t.pageSize}</div>
              {t.multi && <div className="template-pick-multi">ALL</div>}
            </button>
          ))}
        </div>

        {TemplateComponent && (isMulti || enrichedRecipe) && (
          <div className="templates-actions">
            <button className="primary" onClick={() => window.print()}>
              🖨️ Print / Save as PDF
            </button>
            <div className="hint">Uses your browser's print dialog — pick "Save as PDF" for a downloadable version.</div>
          </div>
        )}
      </div>

      {TemplateComponent && (isMulti || enrichedRecipe) && (
        <div className="templates-preview">
          <TemplateComponent
            recipe={enrichedRecipe}
            recipes={enrichedRecipes}
            brand={brand}
          />
        </div>
      )}
    </>
  )
}
