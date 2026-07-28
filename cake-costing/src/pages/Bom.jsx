import { useEffect, useMemo, useState } from 'react'
import { useTable, useBomLines } from '../lib/data'
import { UNITS, UNIT_KEYS } from '../lib/units'
import { lineCost, money } from '../lib/costing'
import RecipePicker from '../components/RecipePicker'

export default function Bom() {
  const { rows: recipes } = useTable('recipes', 'name')
  const { rows: ingredients } = useTable('ingredients', 'name')
  const [recipeId, setRecipeId] = useState(null)

  useEffect(() => {
    if (!recipeId && recipes.length) setRecipeId(recipes[0].id)
  }, [recipes, recipeId])

  const { lines, addLine, removeLine } = useBomLines(recipeId)
  const ingById = useMemo(() => Object.fromEntries(ingredients.map(i => [i.id, i])), [ingredients])

  const [f, setF] = useState({ ingredient_id:'', qty:'', unit:'g' })
  useEffect(() => {
    if (!f.ingredient_id && ingredients.length) setF(s => ({ ...s, ingredient_id: ingredients[0].id }))
  }, [ingredients, f.ingredient_id])

  if (recipes.length === 0) return <div className="panel"><p className="empty">Add a recipe first in Recipe Master.</p></div>

  async function add() {
    if (!f.ingredient_id || !f.qty) { alert('Pick an ingredient and enter qty.'); return }
    await addLine({ ingredient_id: f.ingredient_id, qty: parseFloat(f.qty), unit: f.unit })
    setF({ ...f, qty:'' })
  }

  return (
    <>
      <RecipePicker recipes={recipes} value={recipeId} onChange={setRecipeId} />
      <div className="panel">
        <h2>Recipe BOM</h2>
        <p className="sub">Use whatever unit the recipe is written in — the module converts it against the ingredient's purchase unit automatically.</p>
        <div className="conv-box">
          <b>How conversion works:</b> g ↔ kg, oz ↔ lb, and ml ↔ L ↔ tsp/tbsp/cup convert exactly.
          Crossing mass ↔ volume — e.g. <b>cups of butter</b> against a <b>kg</b> purchase — needs a density (g/ml) set on the ingredient. Missing density is flagged, not silently guessed.
        </div>

        <div>
          {lines.length === 0 && <p className="empty">No ingredients linked yet.</p>}
          {lines.map(l => {
            const ing = ingById[l.ingredient_id]
            if (!ing) return (
              <div key={l.id} className="bom-line">
                <div>(deleted ingredient)</div><div></div><div></div><div></div>
                <button className="ghost" onClick={() => removeLine(l.id)}>Remove</button>
              </div>
            )
            const r = lineCost(ing, l.qty, l.unit)
            const badge = !r.ok ? <span className="pill err">no conversion</span>
              : r.bridged ? <span className="pill bridge">density-bridged</span>
              : <span className="pill ok">direct</span>
            return (
              <div key={l.id} className="bom-line">
                <div>{ing.name}</div>
                <div className="num">{l.qty} {UNITS[l.unit]?.label}</div>
                <div>{badge}</div>
                <div className="num">{r.ok ? money(r.cost) : '—'}</div>
                <button className="ghost" onClick={() => removeLine(l.id)}>Remove</button>
              </div>
            )
          })}
        </div>

        <div className="bom-line" style={{marginTop:10}}>
          <select value={f.ingredient_id} onChange={e=>setF({...f,ingredient_id:e.target.value})}>
            {ingredients.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
          </select>
          <input type="number" step="0.01" placeholder="qty" value={f.qty} onChange={e=>setF({...f,qty:e.target.value})}/>
          <select value={f.unit} onChange={e=>setF({...f,unit:e.target.value})}>
            {UNIT_KEYS.map(u => <option key={u} value={u}>{UNITS[u].label}</option>)}
          </select>
          <div></div>
          <button className="primary" onClick={add}>+ Add</button>
        </div>
      </div>
    </>
  )
}
