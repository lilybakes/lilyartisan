import { useState } from 'react'
import { useTable } from '../lib/data'
import { UNITS, UNIT_KEYS } from '../lib/units'
import { useSettings } from '../lib/settings.jsx'
import { unitCostBase, money, initials, CHIP_COLORS } from '../lib/costing'
import { Icon } from '../lib/icons.jsx'

export default function Ingredients() {
  const { settings } = useSettings()
  const { rows, loading, insert, update, remove } = useTable('ingredients', 'name')
  const [f, setF] = useState({ name:'', purchase_unit:'g', purchase_qty:'', purchase_price:'', waste_pct:'0', density_g_ml:'' })

  // Edit state
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState({})

  function startEdit(i) {
    setEditingId(i.id)
    setDraft({
      name: i.name,
      purchase_unit: i.purchase_unit,
      purchase_qty: String(i.purchase_qty),
      purchase_price: String(i.purchase_price),
      waste_pct: String(i.waste_pct ?? 0),
      density_g_ml: i.density_g_ml === null || i.density_g_ml === undefined ? '' : String(i.density_g_ml),
    })
  }
  function cancelEdit() { setEditingId(null); setDraft({}) }
  async function saveEdit() {
    if (!draft.name || !draft.purchase_qty || !draft.purchase_price) { alert('Name, qty and price are required.'); return }
    await update(editingId, {
      name: draft.name.trim(),
      purchase_unit: draft.purchase_unit,
      purchase_qty: parseFloat(draft.purchase_qty),
      purchase_price: parseFloat(draft.purchase_price),
      waste_pct: parseFloat(draft.waste_pct) || 0,
      density_g_ml: draft.density_g_ml === '' ? null : parseFloat(draft.density_g_ml),
    })
    setEditingId(null); setDraft({})
  }

  async function add() {
    if (!f.name || !f.purchase_qty || !f.purchase_price) { alert('Name, qty and price are required.'); return }
    const color = CHIP_COLORS[rows.length % CHIP_COLORS.length]
    await insert({
      name: f.name.trim(),
      purchase_unit: f.purchase_unit,
      purchase_qty: parseFloat(f.purchase_qty),
      purchase_price: parseFloat(f.purchase_price),
      waste_pct: parseFloat(f.waste_pct) || 0,
      density_g_ml: f.density_g_ml === '' ? null : parseFloat(f.density_g_ml),
      color,
    })
    setF({ name:'', purchase_unit:'g', purchase_qty:'', purchase_price:'', waste_pct:'0', density_g_ml:'' })
  }

  return (
    <div className="panel">
      <div className="panel-head">
        <div>
          <h3>Ingredient Master</h3>
          <p className="sub">Bulk purchase in → unit cost auto-calculated. Set density (g/ml) for cross-unit conversions.</p>
        </div>
      </div>
      <table>
        <thead>
          <tr><th>Ingredient</th><th>Unit</th><th className="num">Qty</th><th className="num">Price ({settings.currency})</th>
              <th className="num">Waste %</th><th className="num">Density</th><th className="num">Cost / base</th><th></th></tr>
        </thead>
        <tbody>
          {loading && <tr><td colSpan="8" className="empty">Loading…</td></tr>}
          {!loading && rows.length === 0 && <tr><td colSpan="8" className="empty">No ingredients yet.</td></tr>}
          {rows.map(i => {
            const dim = UNITS[i.purchase_unit]?.dim
            const baseLabel = dim === 'mass' ? 'g' : dim === 'volume' ? 'ml' : 'pcs'
            const isEditing = editingId === i.id

            if (isEditing) {
              return (
                <tr key={i.id} style={{background:'#fafaff'}}>
                  <td>
                    <div className="row-name">
                      <div className="row-chip" style={{background:i.color || '#7367f0'}}>{initials(draft.name || i.name)}</div>
                      <input value={draft.name} onChange={e => setDraft({...draft, name: e.target.value})} style={{width:180}}/>
                    </div>
                  </td>
                  <td>
                    <select value={draft.purchase_unit} onChange={e => setDraft({...draft, purchase_unit: e.target.value})} style={{width:80}}>
                      {UNIT_KEYS.map(u => <option key={u} value={u}>{UNITS[u].label}</option>)}
                    </select>
                  </td>
                  <td className="num"><input type="number" step="0.01" value={draft.purchase_qty} onChange={e => setDraft({...draft, purchase_qty: e.target.value})} style={{width:90, textAlign:'right'}}/></td>
                  <td className="num"><input type="number" step="0.01" value={draft.purchase_price} onChange={e => setDraft({...draft, purchase_price: e.target.value})} style={{width:100, textAlign:'right'}}/></td>
                  <td className="num"><input type="number" step="1" value={draft.waste_pct} onChange={e => setDraft({...draft, waste_pct: e.target.value})} style={{width:70, textAlign:'right'}}/></td>
                  <td className="num"><input type="number" step="0.01" value={draft.density_g_ml} onChange={e => setDraft({...draft, density_g_ml: e.target.value})} placeholder="—" style={{width:80, textAlign:'right'}}/></td>
                  <td className="num" style={{color:'var(--muted)', fontStyle:'italic'}}>recomputes on save</td>
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
              <tr key={i.id}>
                <td><div className="row-name"><div className="row-chip" style={{background:i.color || '#7367f0'}}>{initials(i.name)}</div><strong>{i.name}</strong></div></td>
                <td>{UNITS[i.purchase_unit]?.label ?? i.purchase_unit}</td>
                <td className="num">{i.purchase_qty}</td>
                <td className="num">{Number(i.purchase_price).toFixed(2)}</td>
                <td className="num">{i.waste_pct || 0}%</td>
                <td className="num">{i.density_g_ml ?? '—'}</td>
                <td className="num"><strong>{money(unitCostBase(i), settings.currency)}</strong>/{baseLabel}</td>
                <td>
                  <div className="action-cell">
                    <button className="edit" onClick={() => startEdit(i)} title="Edit"><Icon name="edit" size={13}/></button>
                    <button className="ghost" onClick={() => remove(i.id)} title="Remove"><Icon name="trash" size={13}/></button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="row-add">
        <div className="field"><label>Name</label><input value={f.name} onChange={e=>setF({...f,name:e.target.value})} placeholder="e.g. Cocoa Powder" style={{width:200}}/></div>
        <div className="field"><label>Unit</label>
          <select value={f.purchase_unit} onChange={e=>setF({...f,purchase_unit:e.target.value})} style={{width:90}}>
            {UNIT_KEYS.map(u => <option key={u} value={u}>{UNITS[u].label}</option>)}
          </select>
        </div>
        <div className="field"><label>Qty</label><input type="number" step="0.01" value={f.purchase_qty} onChange={e=>setF({...f,purchase_qty:e.target.value})} style={{width:100}}/></div>
        <div className="field"><label>Price</label><input type="number" step="0.01" value={f.purchase_price} onChange={e=>setF({...f,purchase_price:e.target.value})} style={{width:110}}/></div>
        <div className="field"><label>Waste %</label><input type="number" step="1" value={f.waste_pct} onChange={e=>setF({...f,waste_pct:e.target.value})} style={{width:90}}/></div>
        <div className="field"><label>Density g/ml</label><input type="number" step="0.01" value={f.density_g_ml} onChange={e=>setF({...f,density_g_ml:e.target.value})} style={{width:110}} placeholder="opt."/></div>
        <button className="primary" onClick={add}>+ Add Ingredient</button>
      </div>
    </div>
  )
}
