import { useEffect, useRef, useState } from 'react'
import { useSettings } from '../lib/settings.jsx'
import { useTable } from '../lib/data'
import IconPicker from '../components/IconPicker.jsx'
import { Icon } from '../lib/icons.jsx'

const CURRENCIES = ['RM', 'USD', 'SGD', 'GBP', 'EUR', 'AUD', 'JPY', 'IDR', 'THB', 'PHP']

function resizeToDataUrl(file, maxSize = 256) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('read failed'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('image decode failed'))
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
        const w = Math.round(img.width * scale)
        const h = Math.round(img.height * scale)
        const canvas = document.createElement('canvas')
        canvas.width = w; canvas.height = h
        canvas.getContext('2d').drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/png'))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

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
      {tab === 'soon'    && <ComingSoonTab/>}
    </>
  )
}

function GeneralTab() {
  const { settings, updateSettings, loading } = useSettings()
  const [form, setForm] = useState(settings)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef(null)

  useEffect(() => { setForm(settings) }, [settings])
  if (loading) return <div className="panel"><p className="loading">Loading settings…</p></div>

  async function save() {
    await updateSettings({
      owner_name: (form.owner_name || '').trim() || 'Lily',
      business_name: (form.business_name || '').trim() || 'Lily Artisan',
      app_name: (form.app_name || '').trim() || 'Baker|Nomics',
      currency: form.currency || 'RM',
      default_target_food_cost_pct: parseFloat(form.default_target_food_cost_pct) || 28,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  async function onLogoPick(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { alert('Please pick an image file.'); return }
    setUploading(true)
    try {
      const dataUrl = await resizeToDataUrl(file, 256)
      await updateSettings({ logo_data_url: dataUrl })
    } catch (err) { alert('Upload failed: ' + err.message) }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = '' }
  }

  async function clearLogo() {
    if (!confirm('Remove the uploaded logo? The default mark will be shown again.')) return
    await updateSettings({ logo_data_url: null })
  }

  const currentLogo = settings.logo_data_url || '/assets/lily-mark-white.png'
  const hasCustomLogo = !!settings.logo_data_url

  return (
    <>
      <div className="panel">
        <div className="panel-head">
          <div><h3>Brand &amp; Identity</h3><p className="sub">Controls the sidebar lockup, greeting, and prices across the app.</p></div>
        </div>

        <div className="settings-grid">
          <div className="field">
            <label>Owner Name</label>
            <input value={form.owner_name || ''} onChange={e => setForm({...form, owner_name: e.target.value})} placeholder="Lily"/>
            <div className="hint">Shown in the dashboard greeting, e.g. "Welcome back, {form.owner_name || 'Lily'} 👋"</div>
          </div>
          <div className="field">
            <label>App Name (wordmark)</label>
            <input value={form.app_name || ''} onChange={e => setForm({...form, app_name: e.target.value})} placeholder="Baker|Nomics"/>
            <div className="hint">Use <code>|</code> to split into two colors: navy before, violet after.</div>
          </div>
          <div className="field">
            <label>Business Name (kicker)</label>
            <input value={form.business_name || ''} onChange={e => setForm({...form, business_name: e.target.value})} placeholder="Lily Ong Artisan"/>
            <div className="hint">Small uppercase label under the wordmark. The design calls for "LILY ONG ARTISAN".</div>
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
            <input type="number" step="1" min="1" max="100" value={form.default_target_food_cost_pct || 28} onChange={e => setForm({...form, default_target_food_cost_pct: e.target.value})}/>
            <div className="hint">Used when creating a new recipe if you don't set one explicitly.</div>
          </div>
        </div>

        <div style={{marginTop:22, display:'flex', gap:12, alignItems:'center'}}>
          <button className="primary" onClick={save}>Save Settings</button>
          {saved && <span className="pill ok">Saved ✓</span>}
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <div><h3>Logo</h3><p className="sub">Sits inside the berry-gradient tile in the sidebar. Auto-resized to 256px.</p></div>
        </div>
        <div style={{display:'flex', gap:20, alignItems:'center', flexWrap:'wrap'}}>
          <div className="brand-tile-preview">
            <img src={currentLogo} alt="Logo preview" style={{height:48, width:'auto'}}/>
          </div>
          <div style={{flex:1, minWidth:240}}>
            <div style={{fontSize:13.5, fontWeight:600, marginBottom:4}}>
              {hasCustomLogo ? 'Custom logo (uploaded)' : 'Default: Lily Ong Artisan mark'}
            </div>
            <div className="hint" style={{marginBottom:10}}>Best result: a white or light shape on a transparent background, square-ish, so it reads well on the gradient tile.</div>
            <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
              <input ref={fileRef} type="file" accept="image/*" onChange={onLogoPick} style={{display:'none'}}/>
              <button className="primary" onClick={() => fileRef.current?.click()} disabled={uploading}>
                {uploading ? 'Uploading…' : (hasCustomLogo ? 'Replace Logo' : 'Upload Logo')}
              </button>
              {hasCustomLogo && <button className="ghost" onClick={clearLogo} disabled={uploading}>Remove &amp; use default</button>}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function HeaderLinksTab() {
  const { rows: links, loading, insert, update, remove } = useTable('header_links', 'position')
  const [drafts, setDrafts] = useState({})

  useEffect(() => {
    const d = {}
    for (const l of links) d[l.id] = { label: l.label || '', url: l.url || '', icon_name: l.icon_name || 'link', open_in_new_tab: l.open_in_new_tab ?? true }
    setDrafts(d)
  }, [links])

  const setDraft = (id, patch) => setDrafts(d => ({ ...d, [id]: { ...d[id], ...patch } }))

  async function saveRow(id) {
    const d = drafts[id]; if (!d) return
    await update(id, { label: d.label.trim(), url: d.url.trim(), icon_name: d.icon_name, open_in_new_tab: !!d.open_in_new_tab })
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
        <div><h3>Header Links</h3><p className="sub">Icons in the top-right of every page. Great for WhatsApp, Instagram, storefront URL, or internal shortcuts. This will grow into a full navigation module later.</p></div>
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
          <b>Tip:</b> Leave the URL blank if you want a placeholder icon slot without a link (clicking it will bring you back here to configure it). "New tab" is on by default so external links don't navigate away from the app.
        </div>
      </div>
    </div>
  )
}

function ComingSoonTab() {
  return (
    <div className="panel">
      <div className="panel-head">
        <div><h3>Coming Soon</h3><p className="sub">Placeholders for future customization.</p></div>
      </div>
      <div className="settings-grid">
        <div style={{padding:16, border:'1px dashed var(--line)', borderRadius:10, color:'var(--muted)'}}>
          <strong style={{color:'var(--ink)'}}>Tax Rate</strong><br/>Add a tax/GST percentage for invoicing.
        </div>
        <div style={{padding:16, border:'1px dashed var(--line)', borderRadius:10, color:'var(--muted)'}}>
          <strong style={{color:'var(--ink)'}}>Multi-user Access</strong><br/>Invite staff with role-based permissions.
        </div>
        <div style={{padding:16, border:'1px dashed var(--line)', borderRadius:10, color:'var(--muted)'}}>
          <strong style={{color:'var(--ink)'}}>Export / Backup</strong><br/>Download all recipes &amp; ingredients as CSV.
        </div>
        <div style={{padding:16, border:'1px dashed var(--line)', borderRadius:10, color:'var(--muted)'}}>
          <strong style={{color:'var(--ink)'}}>Custom Portrait</strong><br/>Replace the hero portrait &amp; top-bar avatar.
        </div>
        <div style={{padding:16, border:'1px dashed var(--line)', borderRadius:10, color:'var(--muted)'}}>
          <strong style={{color:'var(--ink)'}}>Notification Center</strong><br/>Low-stock alerts, price change history, deploy notices.
        </div>
        <div style={{padding:16, border:'1px dashed var(--line)', borderRadius:10, color:'var(--muted)'}}>
          <strong style={{color:'var(--ink)'}}>Full Navigation Module</strong><br/>Reorderable header links, nav groups, per-page shortcuts.
        </div>
      </div>
    </div>
  )
}
