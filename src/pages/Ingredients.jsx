import { useState } from 'react'
import { useTable } from '../lib/data'
import { UNITS, UNIT_KEYS } from '../lib/units'
import { useSettings } from '../lib/settings.jsx'
import { unitCostBase, money, initials, CHIP_COLORS } from '../lib/costing'

export default function Ingredients() {
  const { settings } = useSettings()
  const { rows, loading, insert, remove } = useTable('ingredients', 'name')
  const [f, setF] = useState({ name:'', purchase_unit:'g', purchase_qty:'', purchase_price:'', waste_pct:'0', density_g_ml:'' })

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
          <p className="sub">Bulk purchase in → unit cost auto-calculated. Set density (g/ml) to enable cross-unit conversions.</p>
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
            return (
              <tr key={i.id}>
                <td><div className="row-name"><div className="row-chip" style={{background:i.color || '#7367f0'}}>{initials(i.name)}</div><strong>{i.name}</strong></div></td>
                <td>{UNITS[i.purchase_unit]?.label ?? i.purchase_unit}</td>
                <td className="num">{i.purchase_qty}</td>
                <td className="num">{Number(i.purchase_price).toFixed(2)}</td>
                <td className="num">{i.waste_pct || 0}%</td>
                <td className="num">{i.density_g_ml ?? '—'}</td>
                <td className="num"><strong>{money(unitCostBase(i), settings.currency)}</strong>/{baseLabel}</td>
                <td><button className="ghost" onClick={() => remove(i.id)}>Remove</button></td>
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
