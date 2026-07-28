import { useState } from 'react'
import { useTable } from '../lib/data'
import { UNITS, UNIT_KEYS } from '../lib/units'
import { unitCostBase, money } from '../lib/costing'

export default function Ingredients() {
  const { rows, loading, insert, remove } = useTable('ingredients', 'name')
  const [f, setF] = useState({ name:'', purchase_unit:'g', purchase_qty:'', purchase_price:'', waste_pct:'0', density_g_ml:'' })

  async function add() {
    if (!f.name || !f.purchase_qty || !f.purchase_price) { alert('Name, qty, price required.'); return }
    await insert({
      name: f.name.trim(),
      purchase_unit: f.purchase_unit,
      purchase_qty: parseFloat(f.purchase_qty),
      purchase_price: parseFloat(f.purchase_price),
      waste_pct: parseFloat(f.waste_pct) || 0,
      density_g_ml: f.density_g_ml === '' ? null : parseFloat(f.density_g_ml),
    })
    setF({ name:'', purchase_unit:'g', purchase_qty:'', purchase_price:'', waste_pct:'0', density_g_ml:'' })
  }

  return (
    <div className="panel">
      <h2>Ingredient Master</h2>
      <p className="sub">Bulk purchase in → unit cost auto-calculated per gram/ml/piece. Set density (g/ml) so recipe lines in cups/tsp/oz can convert against a kg/L purchase.</p>
      <table>
        <thead>
          <tr><th>Ingredient</th><th>Unit</th><th className="num">Qty</th><th className="num">Price</th>
              <th className="num">Waste %</th><th className="num">Density (g/ml)</th><th className="num">Cost / base unit</th><th></th></tr>
        </thead>
        <tbody>
          {loading && <tr><td colSpan="8" className="empty">Loading…</td></tr>}
          {!loading && rows.length === 0 && <tr><td colSpan="8" className="empty">No ingredients yet.</td></tr>}
          {rows.map(i => {
            const dim = UNITS[i.purchase_unit]?.dim
            const baseLabel = dim === 'mass' ? 'g' : dim === 'volume' ? 'ml' : 'pcs'
            return (
              <tr key={i.id}>
                <td>{i.name}</td>
                <td>{UNITS[i.purchase_unit]?.label ?? i.purchase_unit}</td>
                <td className="num">{i.purchase_qty}</td>
                <td className="num">{Number(i.purchase_price).toFixed(2)}</td>
                <td className="num">{i.waste_pct || 0}%</td>
                <td className="num">{i.density_g_ml ?? '—'}</td>
                <td className="num">{money(unitCostBase(i))}/{baseLabel}</td>
                <td><button className="ghost" onClick={() => remove(i.id)}>Remove</button></td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="row-add">
        <div className="field"><label>Name</label><input value={f.name} onChange={e=>setF({...f,name:e.target.value})} placeholder="e.g. Cocoa Powder"/></div>
        <div className="field"><label>Unit</label>
          <select value={f.purchase_unit} onChange={e=>setF({...f,purchase_unit:e.target.value})} style={{width:90}}>
            {UNIT_KEYS.map(u => <option key={u} value={u}>{UNITS[u].label}</option>)}
          </select>
        </div>
        <div className="field"><label>Qty</label><input type="number" step="0.01" value={f.purchase_qty} onChange={e=>setF({...f,purchase_qty:e.target.value})} style={{width:90}}/></div>
        <div className="field"><label>Price (RM)</label><input type="number" step="0.01" value={f.purchase_price} onChange={e=>setF({...f,purchase_price:e.target.value})} style={{width:100}}/></div>
        <div className="field"><label>Waste %</label><input type="number" step="1" value={f.waste_pct} onChange={e=>setF({...f,waste_pct:e.target.value})} style={{width:80}}/></div>
        <div className="field"><label>Density g/ml</label><input type="number" step="0.01" value={f.density_g_ml} onChange={e=>setF({...f,density_g_ml:e.target.value})} style={{width:100}} placeholder="optional"/></div>
        <button className="primary" onClick={add}>+ Add Ingredient</button>
      </div>
    </div>
  )
}
