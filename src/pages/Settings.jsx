import { useEffect, useState } from 'react'
import { useSettings } from '../lib/settings.jsx'
import { useTable } from '../lib/data'
import IconPicker from '../components/IconPicker.jsx'
import { Icon } from '../lib/icons.jsx'
import ComingSoonWidget from '../components/ComingSoonWidget.jsx'

const CURRENCIES = ['RM', 'USD', 'SGD', 'GBP', 'EUR', 'AUD', 'JPY', 'IDR', 'THB', 'PHP']

const TABS = [
  { id: 'general', label: 'General' },
  { id: 'header',  label: 'Header Links' },
  { id: 'soon',    label: 'Coming Soon' },
]

export default function Settings() {
  const [tab, setTab] = useState('general')
  return (
    <>
      <div className="settings-tabs">
        {TABS.map(t => (
          <button key={t.id} className={tab === t.id ? 'active' : ''} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>
      {tab === 'general' && <GeneralTab/>}
      {tab === 'header'  && <HeaderLinksTab/>}
      {tab === 'soon'    && <ComingSoonWidget/>}
    </>
  )
}

/* ---------------- GENERAL TAB ---------------- */
function GeneralTab() {
  const { settings, updateSettings, loading } = useSettings()
  const [form, setForm] = useState(settings)
  const [saved, setSaved] = useState(false)

  useEffect(() => { setForm(settings) }, [settings])
  if (loading) return <div className="panel"><p className="loading">Loading settings…</p></div>

  async function save() {
    await updateSettings({
      owner_name:                   (form.owner_name    || '').trim() || 'Lily',
      business_name:                (form.business_name || '').trim() || 'Lily Artisan',
      currency:                     form.currency || 'RM',
      default_target_food_cost_pct: parseFloat(form.default_target_food_cost_pct) || 28,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="panel">
      <div className="panel-head">
        <div>
          <h3>Brand &amp; Identity</h3>
          <p className="sub">Controls the dashboard greeting, sidebar kicker under BakerNomics, and prices across the app.</p>
        </div>
      </div>

      <div className="settings-grid">
        <div className="field">
          <label>Owner Name</label>
          <input
            value={form.owner_name || ''}
            onChange={e => setForm({...form, owner_name: e.target.value})}
            placeholder="Lily"
          />
          <div className="hint">
            Used in the dashboard greeting and your profile initials, e.g. "Welcome back, {form.owner_name || 'Lily'} 👋"
          </div>
        </div>

        <div className="field">
          <label>Business Name</label>
          <input
            value={form.business_name || ''}
            onChange={e => setForm({...form, business_name: e.target.value})}
            placeholder="Lily Artisan"
          />
          <div className="hint">
            Small uppercase label under the <strong>BakerNomics</strong> lockup in the sidebar.
          </div>
        </div>

        <div className="field">
          <label>Currency</label>
          <select value={form.currency || 'RM'} onChange={e => setForm({...form, currency: e.target.value})}>
            {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="hint">Prefix on all prices. Changing this doesn't convert values.</div>
        </div>

        <div className="field">
          <label>Default Target Food Cost %</label>
          <input
            type="number" step="1" min="1" max="100"
            value={form.default_target_food_cost_pct || 28}
            onChange={e => setForm({...form, default_target_food_cost_pct: e.target.value})}
          />
          <div className="hint">Used when creating a new recipe if you don't set one explicitly.</div>
        </div>
      </div>

      <div style={{marginTop:22, display:'flex', gap:12, alignItems:'center'}}>
        <button className="primary" onClick={save}>Save Settings</button>
        {saved && <span className="pill ok">Saved ✓</span>}
      </div>
    </div>
  )
}

/* ---------------- HEADER LINKS TAB ---------------- */
function HeaderLinksTab() {
  const { rows: links, loading, insert, update, remove } = useTable('header_links', 'position')
  const [drafts, setDrafts] = useState({})

  useEffect(() => {
    const d = {}
    for (const l of links) d[l.id] = {
      label:            l.label            || '',
      url:              l.url              || '',
      icon_name:        l.icon_name        || 'link',
      open_in_new_tab:  l.open_in_new_tab ?? true,
    }
    setDrafts(d)
  }, [links])

  const setDraft = (id, patch) => setDrafts(d => ({ ...d, [id]: { ...d[id], ...patch } }))

  async function saveRow(id) {
    const d = drafts[id]; if (!d) return
    await update(id, {
      label:           d.label.trim(),
      url:             d.url.trim(),
      icon_name:       d.icon_name,
      open_in_new_tab: !!d.open_in_new_tab,
    })
  }

  async function addLink() {
    const nextPosition = (links.at(-1)?.position || 0) + 1
    await insert({ position: nextPosition, label: '', url: '', icon_name: 'link', open_in_new_tab: true })
  }

  async function del(id) {
    if (!confirm('Remove this header link?')) return
    await remove(id)
  }

  return (
    <div className="panel">
      <div className="panel-head">
        <div>
          <h3>Header Links</h3>
          <p className="sub">Icons that appear in the top-right of every page, next to the notification bell. Great for quick links to your business email, storefront, WhatsApp, Instagram, or any internal page.</p>
        </div>
        <button className="primary" onClick={addLink}>+ Add Link</button>
      </div>

      {loading && <p className="empty">Loading…</p>}
      {!loading && links.length === 0 && <p className="empty">No header links yet.</p>}

      <div style={{display:'flex', flexDirection:'column', gap:12}}>
        {links.map(l => {
          const d = drafts[l.id] || { label:'', url:'', icon_name:'link', open_in_new_tab:true }
          const dirty =
            d.label !== (l.label || '') ||
            d.url !== (l.url || '') ||
            d.icon_name !== (l.icon_name || 'link') ||
            !!d.open_in_new_tab !== !!l.open_in_new_tab
          return (
            <div key={l.id} className="header-link-row">
              <IconPicker value={d.icon_name} onChange={v => setDraft(l.id, { icon_name: v })}/>
              <div className="field" style={{flex:'1 1 160px', minWidth:140}}>
                <label>Label</label>
                <input value={d.label} onChange={e => setDraft(l.id, { label: e.target.value })} placeholder="e.g. Instagram"/>
              </div>
              <div className="field" style={{flex:'2 1 260px', minWidth:200}}>
                <label>URL</label>
                <input value={d.url} onChange={e => setDraft(l.id, { url: e.target.value })} placeholder="https://…"/>
              </div>
              <label style={{display:'flex', alignItems:'center', gap:6, whiteSpace:'nowrap', fontSize:12, color:'var(--ink-soft)'}}>
                <input type="checkbox" checked={!!d.open_in_new_tab} onChange={e => setDraft(l.id, { open_in_new_tab: e.target.checked })} style={{width:'auto'}}/>
                New tab
              </label>
              <div style={{display:'flex', gap:6}}>
                <button className="primary" onClick={() => saveRow(l.id)} disabled={!dirty}>Save</button>
                <button className="ghost" onClick={() => del(l.id)} title="Remove link"><Icon name="trash" size={14}/></button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="conv-box" style={{marginTop:20}}>
        <div className="conv-icon"><Icon name="help" size={16}/></div>
        <div>
          <b>Tip:</b> Leave the URL blank if you want a placeholder icon slot without a link. "New tab" is on by default so external links don't navigate away from the app.
        </div>
      </div>
    </div>
  )
}
