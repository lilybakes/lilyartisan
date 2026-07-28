import { useEffect, useRef, useState } from 'react'
import { useSettings } from '../lib/settings.jsx'

const CURRENCIES = ['RM', 'USD', 'SGD', 'GBP', 'EUR', 'AUD', 'JPY', 'IDR', 'THB', 'PHP']

// Resize an uploaded image to max 256px on longest side and return a compact PNG data URL.
// Keeps the settings row lean even if user uploads a 4MB photo.
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
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/png'))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

export default function Settings() {
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
    } catch (err) {
      alert('Upload failed: ' + err.message)
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
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
          <div>
            <h3>Brand &amp; Identity</h3>
            <p className="sub">Controls what appears in the sidebar lockup, greeting, and prices across the app.</p>
          </div>
        </div>

        <div className="settings-grid">
          <div className="field">
            <label>Owner Name</label>
            <input value={form.owner_name || ''} onChange={e => setForm({...form, owner_name: e.target.value})} placeholder="Lily"/>
            <div style={{fontSize:11.5, color:'var(--muted)', marginTop:4}}>Shown in the dashboard greeting, e.g. "Welcome back, {form.owner_name || 'Lily'} 👋"</div>
          </div>

          <div className="field">
            <label>App Name (wordmark)</label>
            <input value={form.app_name || ''} onChange={e => setForm({...form, app_name: e.target.value})} placeholder="Baker|Nomics"/>
            <div style={{fontSize:11.5, color:'var(--muted)', marginTop:4}}>
              Use <code>|</code> to split into two colors: the part before <code>|</code> shows in navy, after in violet.
              e.g. <code>Baker|Nomics</code>. No pipe = single color.
            </div>
          </div>

          <div className="field">
            <label>Business Name (kicker)</label>
            <input value={form.business_name || ''} onChange={e => setForm({...form, business_name: e.target.value})} placeholder="Lily Artisan"/>
            <div style={{fontSize:11.5, color:'var(--muted)', marginTop:4}}>Small uppercase label under the wordmark, e.g. "LILY ARTISAN".</div>
          </div>

          <div className="field">
            <label>Currency</label>
            <select value={form.currency || 'RM'} onChange={e => setForm({...form, currency: e.target.value})}>
              {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div style={{fontSize:11.5, color:'var(--muted)', marginTop:4}}>Displayed as a prefix on prices and costs. Changing this doesn't convert values.</div>
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
            <h3>Logo</h3>
            <p className="sub">Sits inside the navy circle in the sidebar. Uploaded logos replace the default mark. Auto-resized to 256px so they don't bloat the database.</p>
          </div>
        </div>

        <div style={{display:'flex', gap:20, alignItems:'center', flexWrap:'wrap'}}>
          {/* Preview: the actual stamp as it appears in the sidebar */}
          <div style={{
            width:80, height:80, borderRadius:'50%', background:'#2F3349',
            display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0
          }}>
            <img src={currentLogo} alt="Logo preview" style={{height:48, width:'auto'}}/>
          </div>

          <div style={{flex:1, minWidth:240}}>
            <div style={{fontSize:13.5, fontWeight:600, marginBottom:4}}>
              {hasCustomLogo ? 'Custom logo (uploaded)' : 'Default: Lily Ong Artisan mark'}
            </div>
            <div style={{fontSize:12, color:'var(--muted)', marginBottom:10}}>
              Best result: a white or light shape on a transparent background, square-ish, at least 256×256.
            </div>
            <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={onLogoPick}
                style={{display:'none'}}
              />
              <button className="primary" onClick={() => fileRef.current?.click()} disabled={uploading}>
                {uploading ? 'Uploading…' : (hasCustomLogo ? 'Replace Logo' : 'Upload Logo')}
              </button>
              {hasCustomLogo && (
                <button className="ghost" onClick={clearLogo} disabled={uploading}>
                  Remove &amp; use default
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <div>
            <h3>Coming Soon</h3>
            <p className="sub">Placeholders for future customization.</p>
          </div>
        </div>
        <div className="settings-grid">
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
            Download all recipes &amp; ingredients as CSV.
          </div>
          <div style={{padding:16, border:'1px dashed var(--line)', borderRadius:10, color:'var(--muted)'}}>
            <strong style={{color:'var(--ink)'}}>Custom Portrait</strong><br/>
            Replace the hero portrait &amp; top-bar avatar.
          </div>
        </div>
      </div>
    </>
  )
}
