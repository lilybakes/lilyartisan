import { useEffect, useMemo, useState } from 'react'
import { useTable, useBomLines } from '../lib/data'
import { UNITS } from '../lib/units'
import { useSettings } from '../lib/settings.jsx'
import { Icon } from '../lib/icons.jsx'
import Chip from '../components/Chip.jsx'
import { costPerPortion, recipeCostTotal, lineCost, suggestedPrice, money } from '../lib/costing'
import RecipePicker from '../components/RecipePicker'

export default function Costing() {
  const { settings } = useSettings()
  const { rows: recipes } = useTable('recipes', 'name')
  const { rows: ingredients } = useTable('ingredients', 'name')
  const [recipeId, setRecipeId] = useState(null)
  useEffect(() => { if (!recipeId && recipes.length) setRecipeId(recipes[0].id) }, [recipes, recipeId])
  const { lines } = useBomLines(recipeId)
  const ingById = useMemo(() => Object.fromEntries(ingredients.map(i => [i.id, i])), [ingredients])

  if (recipes.length === 0) return <div className="panel"><p className="empty">Add a recipe first.</p></div>
  const recipe = recipes.find(r => r.id === recipeId)
  if (!recipe) return null

  const total = recipeCostTotal(lines, ingById)
  const cpp = costPerPortion(recipe, lines, ingById)
  const sp = suggestedPrice(recipe, lines, ingById)

  return (
    <>
      <RecipePicker recipes={recipes} value={recipeId} onChange={setRecipeId}/>
      <div className="metric-row">
        <div className="metric a">
          <div className="m-icn"><Icon name="costing" size={24}/></div>
          <div><div className="l">Total Batch Cost</div><div className="v">{money(total, settings.currency)}</div></div>
        </div>
        <div className="metric b">
          <div className="m-icn"><Icon name="inventory" size={24}/></div>
          <div><div className="l">Portions per Batch</div><div className="v">{recipe.yield_portions}</div></div>
        </div>
        <div className="metric c">
          <div className="m-icn"><Icon name="pricing" size={24}/></div>
          <div><div className="l">Cost per Portion</div><div className="v">{money(cpp, settings.currency)}</div></div>
        </div>
      </div>
      <div className="panel">
        <div className="panel-head" style={{alignItems:'center'}}>
          <div style={{display:'flex', gap:14, alignItems:'center'}}>
            <Chip item={recipe} size={56}/>
            <div>
              <h3>{recipe.name}</h3>
              <p className="sub">Cost breakdown — suggested price <strong>{money(sp, settings.currency)}</strong> at {recipe.target_food_cost_pct}% target food cost</p>
            </div>
          </div>
        </div>
        <table>
          <thead><tr><th>Ingredient</th><th className="num">Qty used</th><th>Conversion</th><th className="num">Line cost</th></tr></thead>
          <tbody>
            {lines.length === 0 && <tr><td colSpan="4" className="empty">No BOM lines yet.</td></tr>}
            {lines.map(l => {
              const ing = ingById[l.ingredient_id]
              if (!ing) return <tr key={l.id}><td>(deleted)</td><td className="num">{l.qty} {l.unit}</td><td>—</td><td className="num">—</td></tr>
              const r = lineCost(ing, l.qty, l.unit)
              const badge = !r.ok ? <span className="pill err">{r.reason}</span>
                : r.bridged ? <span className="pill bridge">via density</span>
                : <span className="pill ok">exact</span>
              return (
                <tr key={l.id}>
                  <td><div className="row-name"><Chip item={ing} size={32}/><strong>{ing.name}</strong></div></td>
                  <td className="num">{l.qty} {UNITS[l.unit]?.label}</td>
                  <td>{badge}</td>
                  <td className="num"><strong>{r.ok ? money(r.cost, settings.currency) : '—'}</strong></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
