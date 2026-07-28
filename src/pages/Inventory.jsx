import { useEffect, useMemo, useState } from 'react'
import { useTable, useInventory } from '../lib/data'
import { UNITS } from '../lib/units'
import Chip from '../components/Chip.jsx'

export default function Inventory() {
  const { rows: ingredients } = useTable('ingredients', 'name')
  const { rows: inv, setStock } = useInventory()

  // Coerce stock_qty to a number here so downstream comparisons are numeric.
  const stockByIng = useMemo(
    () => Object.fromEntries(inv.map(x => [x.ingredient_id, Number(x.stock_qty)])),
    [inv]
  )

  return (
    <div className="panel">
      <div className="panel-head">
        <div>
          <h3>Inventory <span style={{fontWeight:400, color:'var(--muted)', fontSize:13}}>(optional)</span></h3>
          <p className="sub">Stock on hand per ingredient. Type a value and press Enter, tab out, or hit Save. Flags "low" under 25% of one purchase batch.</p>
        </div>
      </div>
      <table>
        <thead><tr><th>Ingredient</th><th className="num">Stock on hand</th><th>Status</th></tr></thead>
        <tbody>
          {ingredients.length === 0 && <tr><td colSpan="3" className="empty">No ingredients yet.</td></tr>}
          {ingredients.map(i => (
            <InventoryRow
              key={i.id}
              ingredient={i}
              initialStock={stockByIng[i.id] ?? 0}
              onSave={qty => setStock(i.id, qty)}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function InventoryRow({ ingredient, initialStock, onSave }) {
  const [text, setText] = useState(String(initialStock))
  const [status, setStatus] = useState('idle') // idle | saving | saved | error
  const [errorMsg, setErrorMsg] = useState('')

  // Sync the input if the server value changes (e.g. after a save elsewhere).
  useEffect(() => {
    setText(String(initialStock))
  }, [initialStock])

  const parsed = parseFloat(text)
  const numeric = isNaN(parsed) ? 0 : parsed
  const dirty = numeric !== initialStock
  const low = numeric < ingredient.purchase_qty * 0.25

  async function commit() {
    if (!dirty || status === 'saving') return
    setStatus('saving')
    setErrorMsg('')
    try {
      await onSave(numeric)
      setStatus('saved')
      setTimeout(() => setStatus(s => s === 'saved' ? 'idle' : s), 1600)
    } catch (err) {
      console.error(err)
      setStatus('error')
      setErrorMsg(err.message || 'Save failed')
    }
  }

  const inputStyle = {
    width:100,
    textAlign:'right',
    ...(dirty && status !== 'error' ? {
      borderColor:'var(--accent)',
      boxShadow:'0 0 0 3px rgba(115,103,240,0.12)',
    } : {}),
    ...(status === 'error' ? {
      borderColor:'var(--danger)',
      boxShadow:'0 0 0 3px rgba(234,84,85,0.12)',
    } : {}),
  }

  return (
    <tr>
      <td>
        <div className="row-name">
          <Chip item={ingredient} size={32}/>
          <strong>{ingredient.name}</strong>
        </div>
      </td>
      <td className="num">
        <div style={{display:'inline-flex', gap:8, alignItems:'center', justifyContent:'flex-end', flexWrap:'wrap'}}>
          <input
            type="number"
            step="0.01"
            value={text}
            onChange={e => { setText(e.target.value); if (status !== 'idle') setStatus('idle') }}
            onBlur={commit}
            onKeyDown={e => { if (e.key === 'Enter') { e.currentTarget.blur() } }}
            style={inputStyle}
          />
          <span style={{minWidth:26, textAlign:'left', color:'var(--muted)', fontWeight:500}}>
            {UNITS[ingredient.purchase_unit]?.label}
          </span>
          {dirty && status === 'idle' && (
            <button
              className="primary"
              onClick={commit}
              style={{padding:'6px 12px', fontSize:12}}
            >Save</button>
          )}
          {status === 'saving' && <span className="pill info">Saving…</span>}
          {status === 'saved'  && <span className="pill ok">Saved ✓</span>}
          {status === 'error'  && <span className="pill err" title={errorMsg}>Save failed</span>}
        </div>
      </td>
      <td><span className={`pill ${low ? 'low' : 'ok'}`}>{low ? 'Low stock' : 'OK'}</span></td>
    </tr>
  )
}
