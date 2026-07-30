import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useSettings } from '../lib/settings.jsx'
import { TEMPLATES, getTemplate } from '../components/templates/index.js'

export default function Templates() {
  const { settings } = useSettings()
  const [recipes, setRecipes]         = useState([])
  const [ingredients, setIngredients] = useState({})
  const [bomLines, setBomLines]       = useState({})
  const [recipeId, setRecipeId]       = useState('')
  const [templateKey, setTemplateKey] = useState('classic')
  const [loading, setLoading]         = useState(true)

  // Load recipes + all ingredients + all bom lines once
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
      if (!recipeId && recs?.length) setRecipeId(recs[0].id)
      setLoading(false)
    })()
  }, [])

  // Enrich the selected recipe with ingredient data + costs
  const enrichedRecipe = useMemo(() => {
    if (!recipeId) return null
    const recipe = recipes.find(r => r.id === recipeId)
    if (!recipe) return null
    const lines = (bomLines[recipeId] || []).map(l => {
      const ing = ingredients[l.ingredient_id]
      if (!ing) return { ...l, ingredient_name: 'Unknown ingredient', cost: 0, unit_cost: 0 }
      const unitCost = (ing.purchase_price / (ing.purchase_qty || 1)) * (1 + (ing.waste_pct || 0) / 100)
      const cost = unitCost * (Number(l.qty) || 0)
      return {
        ...l,
        ingredient_name: ing.name,
        unit_cost:       unitCost,
        cost,
      }
    })
    const totalCost   = lines.reduce((s, l) => s + l.cost, 0)
    const perPortion  = totalCost / (recipe.yield_portions || 1)
    const targetPct   = recipe.target_food_cost_pct || settings.default_target_food_cost_pct || 30
    const suggested   = targetPct > 0 ? perPortion / (targetPct / 100) : 0

    return {
      ...recipe,
      lines,
      total_cost:            totalCost,
      cost_per_portion:      perPortion,
      target_food_cost_pct:  targetPct,
      suggested_price:       suggested,
    }
  }, [recipeId, recipes, bomLines, ingredients, settings.default_target_food_cost_pct])

  // Build a plain brand object for templates
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

  const brandComplete = !!(settings.business_name && settings.logo_data_url)

  return (
    <>
      <div className="panel no-print">
        <div className="panel-head">
          <div>
            <h3>Recipe Templates</h3>
            <p className="sub">Generate personalized recipe and care sheets for your customers or kitchen. Pick a recipe and a template — everything uses the brand info from your <a href="/app/settings">Settings page</a>.</p>
          </div>
        </div>

        {!brandComplete && (
          <div className="conv-box" style={{marginBottom:16}}>
            <div className="conv-icon">💡</div>
            <div>
              <b>Set up your brand first.</b> Add your logo and business name in <a href="/app/settings">Settings</a> to make templates look personalized. Right now they'll use fallback text.
            </div>
          </div>
        )}

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

        <div className="template-picker">
          {TEMPLATES.map(t => (
            <button
              key={t.key}
              type="button"
              className={'template-pick' + (templateKey === t.key ? ' active' : '') + (!t.ready ? ' disabled' : '')}
              onClick={() => t.ready && setTemplateKey(t.key)}
              disabled={!t.ready}
            >
              <div className="template-pick-icon">{t.icon}</div>
              <div className="template-pick-body">
                <div className="template-pick-name">{t.name}</div>
                <div className="template-pick-desc">{t.description}</div>
              </div>
              {!t.ready && <div className="template-pick-badge">Coming next</div>}
              {t.ready && t.pageSize && <div className="template-pick-size">{t.pageSize}</div>}
            </button>
          ))}
        </div>

        {enrichedRecipe && TemplateComponent && (
          <div className="templates-actions">
            <button className="primary" onClick={() => window.print()}>
              🖨️ Print / Save as PDF
            </button>
            <div className="hint">Uses your browser's print dialog — choose "Save as PDF" for a downloadable version.</div>
          </div>
        )}
      </div>

      {/* The preview shows on screen AND is what gets printed */}
      {enrichedRecipe && TemplateComponent && (
        <div className="templates-preview">
          <TemplateComponent recipe={enrichedRecipe} brand={brand}/>
        </div>
      )}
    </>
  )
}
