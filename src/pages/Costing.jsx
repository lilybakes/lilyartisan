import { useEffect, useMemo, useState } from 'react'
import { useTable, useBomLines } from '../lib/data'
import { UNITS } from '../lib/units'
import { costPerPortion, recipeCostTotal, lineCost, money } from '../lib/costing'
import RecipePicker from '../components/RecipePicker'

export default function Costing() {
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

  return (
    <>
      <RecipePicker recipes={recipes} value={recipeId} onChange={setRecipeId}/>
      <div className="panel">
        <h2>Yield &amp; Costing — {recipe.name}</h2>
        <div className="statrow">
          <div className="stat"><div className="v">{money(total)}</div><div className="l">Total batch cost</div></div>
          <div className="stat"><div className="v">{recipe.yield_portions}</div><div className="l">Portions per batch</div></div>
          <div className="stat"><div className="v">{money(cpp)}</div><div className="l">Cost per portion</div></div>
        </div>
        <table style={{marginTop:10}}>
          <thead><tr><th>Ingredient</th><th className="num">Qty used</th><th>Conversion</th><th className="num">Line cost</th></tr></thead>
          <tbody>
            {lines.length === 0 && <tr><td colSpan="4" className="empty">No BOM lines — add ingredients in Recipe BOM.</td></tr>}
            {lines.map(l => {
              const ing = ingById[l.ingredient_id]
              if (!ing) return <tr key={l.id}><td>(deleted)</td><td className="num">{l.qty} {l.unit}</td><td>—</td><td className="num">—</td></tr>
              const r = lineCost(ing, l.qty, l.unit)
              const badge = !r.ok ? <span className="pill err">{r.reason}</span>
                : r.bridged ? <span className="pill bridge">via density</span>
                : <span className="pill ok">exact</span>
              return (
                <tr key={l.id}>
                  <td>{ing.name}</td>
                  <td className="num">{l.qty} {UNITS[l.unit]?.label}</td>
                  <td>{badge}</td>
                  <td className="num">{r.ok ? money(r.cost) : '—'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
