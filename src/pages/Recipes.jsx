import { useState } from 'react'
import { useTable } from '../lib/data'
import { useSettings } from '../lib/settings.jsx'
import { initials, CHIP_COLORS } from '../lib/costing'
import { Icon } from '../lib/icons.jsx'

export default function Recipes() {
  const { settings } = useSettings()
  const { rows, loading, insert, update, remove } = useTable('recipes', 'name')
  const [f, setF] = useState({ name:'', category:'', yield_portions:'', target_food_cost_pct:'' })

  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState({})

  function startEdit(r) {
    setEditingId(r.id)
    setDraft({
      name: r.name,
      category: r.category || '',
      yield_portions: String(r.yield_portions),
      target_food_cost_pct: String(r.target_food_cost_pct),
    })
  }
  function cancelEdit() { setEditingId(null); setDraft({}) }
  async function saveEdit() {
    if (!draft.name || !draft.yield_portions) { alert('Name and yield are required.'); return }
    await update(editingId, {
      name: draft.name.trim(),
      category: draft.category.trim() || null,
      yield_portions: parseInt(draft.yield_portions),
      target_food_cost_pct: parseFloat(draft.target_food_cost_pct) || settings.default_target_food_cost_pct,
    })
    setEditingId(null); setDraft({})
  }

  async function add() {
    if (!f.name || !f.yield_portions) { alert('Name and yield required.'); return }
    await insert({
      name: f.name.trim(),
      category: f.category.trim() || null,
      yield_portions: parseInt(f.yield_portions),
      target_food_cost_pct: parseFloat(f.target_food_cost_pct) || settings.default_target_food_cost_pct,
    })
    setF({ name:'', category:'', yield_portions:'', target_food_cost_pct:'' })
  }

  return (
    <div className="panel">
      <div className="panel-head">
        <div><h3>Recipe Master</h3><p className="sub">Cakes and bakes with yield (portions per batch) and target food-cost %.</p></div>
      </div>
      <table>
        <thead><tr><th>Recipe</th><th>Category</th><th className="num">Yield</th><th className="num">Target FC%</th><th></th></tr></thead>
        <tbody>
          {loading && <tr><td colSpan="5" className="empty">Loading…</td></tr>}
          {!loading && rows.length === 0 && <tr><td colSpan="5" className="empty">No recipes yet.</td></tr>}
          {rows.map((r, idx) => {
            const color = CHIP_COLORS[idx % CHIP_COLORS.length]
            const isEditing = editingId === r.id

            if (isEditing) {
              return (
                <tr key={r.id} style={{background:'#fafaff'}}>
                  <td>
                    <div className="row-name">
                      <div className="row-chip" style={{background:color}}>{initials(draft.name || r.name)}</div>
                      <input value={draft.name} onChange={e => setDraft({...draft, name: e.target.value})} style={{width:240}}/>
                    </div>
                  </td>
                  <td><input value={draft.category} onChange={e => setDraft({...draft, category: e.target.value})} style={{width:130}} placeholder="Category"/></td>
                  <td className="num"><input type="number" value={draft.yield_portions} onChange={e => setDraft({...draft, yield_portions: e.target.value})} style={{width:80, textAlign:'right'}}/></td>
                  <td className="num"><input type="number" value={draft.target_food_cost_pct} onChange={e => setDraft({...draft, target_food_cost_pct: e.target.value})} style={{width:80, textAlign:'right'}}/></td>
                  <td>
                    <div className="action-cell">
                      <button className="primary" onClick={saveEdit}>Save</button>
                      <button className="ghost" onClick={cancelEdit}>Cancel</button>
                    </div>
                  </td>
                </tr>
              )
            }

            return (
              <tr key={r.id}>
                <td><div className="row-name"><div className="row-chip" style={{background:color}}>{initials(r.name)}</div><strong>{r.name}</strong></div></td>
                <td><span className="pill bridge">{r.category || '—'}</span></td>
                <td className="num">{r.yield_portions}</td>
                <td className="num">{r.target_food_cost_pct}%</td>
                <td>
                  <div className="action-cell">
                    <button className="edit" onClick={() => startEdit(r)} title="Edit"><Icon name="edit" size={13}/></button>
                    <button className="ghost" onClick={() => remove(r.id)} title="Remove"><Icon name="trash" size={13}/></button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="row-add">
        <div className="field"><label>Name</label><input value={f.name} onChange={e=>setF({...f,name:e.target.value})} placeholder="e.g. Chocolate Fudge Cake" style={{width:240}}/></div>
        <div className="field"><label>Category</label><input value={f.category} onChange={e=>setF({...f,category:e.target.value})} placeholder="Cake / Cupcake" style={{width:150}}/></div>
        <div className="field"><label>Yield</label><input type="number" value={f.yield_portions} onChange={e=>setF({...f,yield_portions:e.target.value})} style={{width:100}}/></div>
        <div className="field"><label>Target FC %</label><input type="number" value={f.target_food_cost_pct} onChange={e=>setF({...f,target_food_cost_pct:e.target.value})} placeholder={String(settings.default_target_food_cost_pct)} style={{width:110}}/></div>
        <button className="primary" onClick={add}>+ Add Recipe</button>
      </div>
    </div>
  )
}
