import { useEffect, useRef, useState } from 'react'
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

const BRAND_TABS = [
  { id: 'identity', label: 'Identity' },
  { id: 'contact',  label: 'Contact & Address' },
  { id: 'defaults', label: 'Recipe defaults' },
]

function resizeToDataUrl(file, maxSize = 512) {
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

/* ---------------- GENERAL TAB (Brand & Identity, expanded) ---------------- */
function GeneralTab() {
  const { settings, updateSettings, loading } = useSettings()
  const [form, setForm] = useState(settings)
  const [subTab, setSubTab] = useState('identity')
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef(null)

  useEffect(() => { setForm(settings) }, [settings])
  if (loading) return <div className="panel"><p className="loading">Loading settings…</p></div>

  const set = (patch) => setForm(f => ({...f, ...patch}))

  async function save() {
    await updateSettings({
      // Identity
      owner_name:              (form.owner_name    || '').trim() || 'Baker',
      business_name:           (form.business_name || '').trim() || '',
      tagline:                 (form.tagline       || '').trim() || null,
      brand_color:             form.brand_color || '#6C5CE7',
      currency:                form.currency || 'RM',
      default_target_food_cost_pct: parseFloat(form.default_target_food_cost_pct) || 28,
      // Contact
      contact_phone:           (form.contact_phone || '').trim() || null,
      contact_email:           (form.contact_email || '').trim() || null,
      website:                 (form.website       || '').trim() || null,
      address:                 (form.address       || '').trim() || null,
      instagram:               (form.instagram     || '').trim().replace(/^@/, '') || null,
      facebook:                (form.facebook      || '').trim() || null,
      // Recipe defaults
      default_storage_notes:   (form.default_storage_notes   || '').trim() || null,
      default_allergen_notice: (form.default_allergen_notice || '').trim() || null,
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
      const dataUrl = await resizeToDataUrl(file, 512)
      await updateSettings({ logo_data_url: dataUrl })
    } catch (err) { alert('Upload failed: ' + err.message) }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = '' }
  }
  async function clearLogo() {
    if (!confirm('Remove your logo?')) return
    await updateSettings({ logo_data_url: null })
  }

  return (
    <div className="panel">
      <div className="panel-head">
        <div>
          <h3>Brand &amp; Identity</h3>
          <p className="sub">Your logo, colors, and contact info appear on customer-facing recipe cards and care sheets in the Templates page.</p>
        </div>
        <div style={{display:'flex', gap:10, alignItems:'center'}}>
          {saved && <span className="pill ok">Saved ✓</span>}
          <button className="primary" onClick={save}>Save Settings</button>
        </div>
      </div>

      <div className="settings-subtabs">
        {BRAND_TABS.map(t => (
          <button key={t.id} className={subTab === t.id ? 'active' : ''} onClick={() => setSubTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {subTab === 'identity' && (
        <>
          {/* Logo + brand color side by side */}
          <div className="brand-identity-row">
            <div className="brand-logo-block">
              <label>Logo</label>
              <div className="brand-logo-preview">
                {settings.logo_data_url ? (
                  <img src={settings.logo_data_url} alt=""/>
                ) : (
                  <span className="brand-logo-empty">No logo</span>
                )}
              </div>
              <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
                <input ref={fileRef} type="file" accept="image/*" onChange={onLogoPick} style={{display:'none'}}/>
                <button className="primary" type="button" onClick={() => fileRef.current?.click()} disabled={uploading}>
                  {uploading ? 'Uploading…' : (settings.logo_data_url ? 'Replace' : 'Upload')}
                </button>
                {settings.logo_data_url && <button className="ghost" type="button" onClick={clearLogo}>Remove</button>}
              </div>
              <div className="hint">Square-ish PNG or JPG on transparent or white background. Auto-resized to 512px.</div>
            </div>

            <div className="brand-color-block">
              <label>Brand color</label>
              <div className="brand-color-picker">
                <input
                  type="color"
                  value={form.brand_color || '#6C5CE7'}
                  onChange={e => set({brand_color: e.target.value})}
                />
                <input
                  type="text"
                  value={form.brand_color || ''}
                  onChange={e => set({brand_color: e.target.value})}
                  placeholder="#6C5CE7"
                  style={{fontFamily:'monospace', flex:1}}
                />
              </div>
              <div className="hint">Used as the accent color on recipe templates — headings, borders, and highlights.</div>
            </div>
          </div>

          <div className="settings-grid">
            <div className="field">
              <label>Owner name</label>
              <input value={form.owner_name || ''} onChange={e => set({owner_name: e.target.value})} placeholder="Anthony"/>
              <div className="hint">Dashboard greeting, e.g. "Welcome back, {form.owner_name || 'Anthony'} 👋"</div>
            </div>
            <div className="field">
              <label>Business name</label>
              <input value={form.business_name || ''} onChange={e => set({business_name: e.target.value})} placeholder="The Daily Crumb"/>
              <div className="hint">Appears on every recipe and care sheet as the brand header.</div>
            </div>
            <div className="field" style={{gridColumn:'1 / -1'}}>
              <label>Tagline</label>
              <input value={form.tagline || ''} onChange={e => set({tagline: e.target.value})} placeholder="Artisan sourdough &amp; pastries — Ipoh"/>
              <div className="hint">One-line description under your business name on templates. Optional.</div>
            </div>
            <div className="field">
              <label>Currency</label>
              <select value={form.currency || 'RM'} onChange={e => set({currency: e.target.value})}>
                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <div className="hint">Prefix on all prices. Doesn't convert values.</div>
            </div>
            <div className="field">
              <label>Default target food cost %</label>
              <input type="number" step="1" min="1" max="100" value={form.default_target_food_cost_pct || 28} onChange={e => set({default_target_food_cost_pct: e.target.value})}/>
              <div className="hint">Used when creating a new recipe if you don't set one explicitly.</div>
            </div>
          </div>
        </>
      )}

      {subTab === 'contact' && (
        <div className="settings-grid">
          <div className="field">
            <label>Phone</label>
            <input value={form.contact_phone || ''} onChange={e => set({contact_phone: e.target.value})} placeholder="+60 5-123 4567"/>
          </div>
          <div className="field">
            <label>Contact email</label>
            <input type="email" value={form.contact_email || ''} onChange={e => set({contact_email: e.target.value})} placeholder="hello@yourbakery.com"/>
            <div className="hint">Separate from your login email. Shown on customer-facing sheets.</div>
          </div>
          <div className="field">
            <label>Website</label>
            <input value={form.website || ''} onChange={e => set({website: e.target.value})} placeholder="yourbakery.com"/>
          </div>
          <div className="field">
            <label>Instagram</label>
            <input value={form.instagram || ''} onChange={e => set({instagram: e.target.value})} placeholder="thedailycrumb"/>
            <div className="hint">Handle only, no @.</div>
          </div>
          <div className="field">
            <label>Facebook</label>
            <input value={form.facebook || ''} onChange={e => set({facebook: e.target.value})} placeholder="TheDailyCrumb"/>
          </div>
          <div className="field" style={{gridColumn:'1 / -1'}}>
            <label>Physical address</label>
            <textarea rows="3" value={form.address || ''} onChange={e => set({address: e.target.value})} placeholder="12 Jalan Merdeka&#10;30000 Ipoh, Perak"/>
            <div className="hint">Multi-line supported. Appears on printable sheets and invoices.</div>
          </div>
        </div>
      )}

      {subTab === 'defaults' && (
        <div className="settings-grid">
          <div className="field" style={{gridColumn:'1 / -1'}}>
            <label>Default storage instructions</label>
            <textarea rows="3" value={form.default_storage_notes || ''} onChange={e => set({default_storage_notes: e.target.value})}
              placeholder="Keep refrigerated. Best consumed within 3 days of purchase."/>
            <div className="hint">Used on Care &amp; Storage cards when a recipe doesn't override it.</div>
          </div>
          <div className="field" style={{gridColumn:'1 / -1'}}>
            <label>Default allergen notice</label>
            <textarea rows="3" value={form.default_allergen_notice || ''} onChange={e => set({default_allergen_notice: e.target.value})}
              placeholder="Contains: wheat, dairy, eggs. May contain traces of nuts."/>
            <div className="hint">Used on Product Label templates when a recipe doesn't override it.</div>
          </div>
        </div>
      )}

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
        <div>
          <h3>Header Links</h3>
          <p className="sub">Icons in the top-right of every page. Great for quick links to your storefront, WhatsApp, or Instagram.</p>
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
    </div>
  )
}
