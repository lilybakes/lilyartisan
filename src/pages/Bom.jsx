import { useEffect, useMemo, useState } from 'react'
import { useTable, useBomLines } from '../lib/data'
import { UNITS, UNIT_KEYS } from '../lib/units'
import { useSettings } from '../lib/settings.jsx'
import { lineCost, money } from '../lib/costing'
import { Icon } from '../lib/icons.jsx'
import Chip from '../components/Chip.jsx'
import RecipePicker from '../components/RecipePicker'

export default function Bom() {
  const { settings } = useSettings()
  const { rows: recipes } = useTable('recipes', 'name')
  const { rows: ingredients } = useTable('ingredients', 'name')
  const [recipeId, setRecipeId] = useState(null)

  useEffect(() => { if (!recipeId && recipes.length) setRecipeId(recipes[0].id) }, [recipes, recipeId])

  const { lines, addLine, updateLine, removeLine } = useBomLines(recipeId)
  const ingById = useMemo(() => Object.fromEntries(ingredients.map(i => [i.id, i])), [ingredients])

  const [f, setF] = useState({ ingredient_id:'', qty:'', unit:'g' })
  useEffect(() => {
    if (!f.ingredient_id && ingredients.length) setF(s => ({ ...s, ingredient_id: ingredients[0].id }))
  }, [ingredients, f.ingredient_id])

  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState({})

  function startEdit(l) {
    setEditingId(l.id)
    setDraft({ ingredient_id: l.ingredient_id, qty: String(l.qty), unit: l.unit })
  }
  function cancelEdit() { setEditingId(null); setDraft({}) }
  async function saveEdit() {
    if (!draft.ingredient_id || !draft.qty) { alert('Pick ingredient and enter qty.'); return }
    await updateLine(editingId, {
      ingredient_id: draft.ingredient_id,
      qty: parseFloat(draft.qty),
      unit: draft.unit,
    })
    setEditingId(null); setDraft({})
  }

  if (recipes.length === 0) return <div className="panel"><p className="empty">Add a recipe first in Recipe Master.</p></div>

  async function add() {
    if (!f.ingredient_id || !f.qty) { alert('Pick an ingredient and enter qty.'); return }
    await addLine({ ingredient_id: f.ingredient_id, qty: parseFloat(f.qty), unit: f.unit })
    setF({ ...f, qty:'' })
  }

  return (
    <>
      <RecipePicker recipes={recipes} value={recipeId} onChange={setRecipeId}/>
      <div className="panel">
        <div className="panel-head">
          <div><h3>Recipe BOM</h3><p className="sub">Use whatever unit the recipe is written in — conversion happens against the ingredient's purchase unit.</p></div>
        </div>
        <div className="conv-box">
          <div className="conv-icon"><Icon name="arrows" size={16}/></div>
          <div>
            <b>Conversion rules:</b> g ↔ kg, oz ↔ lb, ml ↔ L ↔ tsp/tbsp/cup convert exactly.
            Crossing mass ↔ volume (e.g. <b>cups of butter</b> against a <b>kg</b> purchase) uses each ingredient's density. Missing density is flagged, not silently guessed.
          </div>
        </div>

        <div>
          {lines.length === 0 && <p className="empty">No ingredients linked yet.</p>}
          {lines.map(l => {
            const ing = ingById[l.ingredient_id]
            const isEditing = editingId === l.id

            if (isEditing) {
              return (
                <div key={l.id} className="bom-line" style={{background:'#fafaff', borderColor:'#dedafc'}}>
                  <select value={draft.ingredient_id} onChange={e => setDraft({...draft, ingredient_id: e.target.value})}>
                    {ingredients.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                  </select>
                  <input type="number" step="0.01" value={draft.qty} onChange={e => setDraft({...draft, qty: e.target.value})}/>
                  <select value={draft.unit} onChange={e => setDraft({...draft, unit: e.target.value})}>
                    {UNIT_KEYS.map(u => <option key={u} value={u}>{UNITS[u].label}</option>)}
                  </select>
                  <div/>
                  <div className="action-cell">
                    <button className="primary" onClick={saveEdit}>Save</button>
                    <button className="ghost" onClick={cancelEdit}>Cancel</button>
                  </div>
                </div>
              )
            }

            if (!ing) return (
              <div key={l.id} className="bom-line">
                <div>(deleted ingredient)</div><div/><div/><div/>
                <button className="ghost" onClick={() => removeLine(l.id)}>Remove</button>
              </div>
            )
            const r = lineCost(ing, l.qty, l.unit)
            const badge = !r.ok ? <span className="pill err">no conversion</span>
              : r.bridged ? <span className="pill bridge">via density</span>
              : <span className="pill ok">direct</span>
            return (
              <div key={l.id} className="bom-line">
                <div className="row-name"><Chip item={ing} size={28}/><strong>{ing.name}</strong></div>
                <div className="num">{l.qty} {UNITS[l.unit]?.label}</div>
                <div>{badge}</div>
                <div className="num"><strong>{r.ok ? money(r.cost, settings.currency) : '—'}</strong></div>
                <div className="action-cell">
                  <button className="edit" onClick={() => startEdit(l)} title="Edit"><Icon name="edit" size={13}/></button>
                  <button className="ghost" onClick={() => removeLine(l.id)} title="Remove"><Icon name="trash" size={13}/></button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="bom-line" style={{marginTop:14, background:'#fafaff', borderStyle:'dashed'}}>
          <select value={f.ingredient_id} onChange={e=>setF({...f,ingredient_id:e.target.value})}>
            {ingredients.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
          </select>
          <input type="number" step="0.01" placeholder="qty" value={f.qty} onChange={e=>setF({...f,qty:e.target.value})}/>
          <select value={f.unit} onChange={e=>setF({...f,unit:e.target.value})}>
            {UNIT_KEYS.map(u => <option key={u} value={u}>{UNITS[u].label}</option>)}
          </select>
          <div/>
          <button className="primary" onClick={add}>+ Add</button>
        </div>
      </div>
    </>
  )
}
