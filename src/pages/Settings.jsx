import { useEffect, useState } from 'react'
import { useSettings } from '../lib/settings.jsx'

const CURRENCIES = ['RM', 'USD', 'SGD', 'GBP', 'EUR', 'AUD', 'JPY', 'IDR', 'THB', 'PHP']

export default function Settings() {
  const { settings, updateSettings, loading } = useSettings()
  const [form, setForm] = useState(settings)
  const [saved, setSaved] = useState(false)

  useEffect(() => { setForm(settings) }, [settings])

  if (loading) return <div className="panel"><p className="loading">Loading settings…</p></div>

  async function save() {
    await updateSettings({
      owner_name: form.owner_name.trim() || 'Lily',
      business_name: form.business_name.trim() || 'Lily Artisan',
      currency: form.currency || 'RM',
      default_target_food_cost_pct: parseFloat(form.default_target_food_cost_pct) || 28,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <>
      <div className="panel">
        <div className="panel-head">
          <div>
            <h3>Settings</h3>
            <p className="sub">Customize how Lily Artisan appears throughout the app. These values are shared across every page.</p>
          </div>
        </div>

        <div className="settings-grid">
          <div className="field">
            <label>Owner Name</label>
            <input value={form.owner_name || ''} onChange={e => setForm({...form, owner_name: e.target.value})} placeholder="Lily"/>
            <div style={{fontSize:11.5, color:'var(--muted)', marginTop:4}}>Shown in the dashboard greeting, e.g. "Welcome back, {form.owner_name || 'Lily'} 👋"</div>
          </div>

          <div className="field">
            <label>Business Name</label>
            <input value={form.business_name || ''} onChange={e => setForm({...form, business_name: e.target.value})} placeholder="Lily Artisan"/>
            <div style={{fontSize:11.5, color:'var(--muted)', marginTop:4}}>Used on invoices, reports, and the app header.</div>
          </div>

          <div className="field">
            <label>Currency</label>
            <select value={form.currency || 'RM'} onChange={e => setForm({...form, currency: e.target.value})}>
              {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div style={{fontSize:11.5, color:'var(--muted)', marginTop:4}}>All prices and costs are displayed with this prefix. Changing this doesn't convert values — it just changes the label.</div>
          </div>

          <div className="field">
            <label>Default Target Food Cost %</label>
            <input type="number" step="1" min="1" max="100" value={form.default_target_food_cost_pct || 28} onChange={e => setForm({...form, default_target_food_cost_pct: e.target.value})}/>
            <div style={{fontSize:11.5, color:'var(--muted)', marginTop:4}}>Used when creating a new recipe if you don't set one explicitly. Typical bakery range: 25–35%.</div>
          </div>
        </div>

        <div style={{marginTop:22, display:'flex', gap:12, alignItems:'center'}}>
          <button className="primary" onClick={save}>Save Settings</button>
          {saved && <span className="pill ok">Saved ✓</span>}
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <div>
            <h3>Coming Soon</h3>
            <p className="sub">Placeholder for future customization — no functionality yet, just space to grow into.</p>
          </div>
        </div>
        <div className="settings-grid">
          <div style={{padding:16, border:'1px dashed var(--line)', borderRadius:10, color:'var(--muted)'}}>
            <strong style={{color:'var(--ink)'}}>Logo Upload</strong><br/>
            Upload a logo to appear in the sidebar and on printed reports.
          </div>
          <div style={{padding:16, border:'1px dashed var(--line)', borderRadius:10, color:'var(--muted)'}}>
            <strong style={{color:'var(--ink)'}}>Tax Rate</strong><br/>
            Add a tax/GST percentage for invoicing.
          </div>
          <div style={{padding:16, border:'1px dashed var(--line)', borderRadius:10, color:'var(--muted)'}}>
            <strong style={{color:'var(--ink)'}}>Multi-user Access</strong><br/>
            Invite staff with role-based permissions.
          </div>
          <div style={{padding:16, border:'1px dashed var(--line)', borderRadius:10, color:'var(--muted)'}}>
            <strong style={{color:'var(--ink)'}}>Export / Backup</strong><br/>
            Download all recipes & ingredients as CSV.
          </div>
        </div>
      </div>
    </>
  )
}
