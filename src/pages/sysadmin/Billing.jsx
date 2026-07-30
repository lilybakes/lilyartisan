import { useEffect, useState } from 'react'
import { getPlatformSettings, updatePlatformSettings } from '../../lib/sysadmin-api'
import { supabase } from '../../lib/supabase'

export default function Billing() {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [flash, setFlash]       = useState(null)
  const [tab, setTab]           = useState('business')

  useEffect(() => {
    ;(async () => {
      const { data, error } = await getPlatformSettings()
      if (error) console.error(error)
      else setSettings(data)
      setLoading(false)
    })()
  }, [])

  async function save(patch) {
    setSaving(true)
    const { data, error } = await updatePlatformSettings(patch)
    setSaving(false)
    if (error) { alert(error.message); return false }
    setSettings(data)
    setFlash({ type:'ok', msg: 'Saved.' })
    setTimeout(() => setFlash(null), 2000)
    return true
  }

  if (loading) return <div className="panel"><p className="empty">Loading…</p></div>
  if (!settings) return <div className="panel"><p className="empty">Could not load platform settings.</p></div>

  return (
    <>
      <div className="panel">
        <div className="panel-head">
          <div>
            <h3>Billing</h3>
            <p className="sub">Business info, invoice numbering, payment method — used across every invoice and receipt.</p>
          </div>
        </div>

        <div className="settings-tabs">
          <button className={tab==='business' ? 'active' : ''} onClick={() => setTab('business')}>Business Info</button>
          <button className={tab==='invoice'  ? 'active' : ''} onClick={() => setTab('invoice')}>Invoice Numbering</button>
          <button className={tab==='payment'  ? 'active' : ''} onClick={() => setTab('payment')}>Payment Method</button>
        </div>

        {flash && <div className={`flash flash-${flash.type}`} style={{marginBottom:14}}>{flash.msg}</div>}

        {tab === 'business' && <BusinessInfo settings={settings} save={save} saving={saving}/>}
        {tab === 'invoice'  && <InvoiceNumbering settings={settings} save={save} saving={saving}/>}
        {tab === 'payment'  && <PaymentMethod settings={settings} save={save} saving={saving}/>}
      </div>
    </>
  )
}


// ------------------------------------------------------------
function BusinessInfo({ settings, save, saving }) {
  const [f, setF] = useState({
    business_name:    settings.business_name    || '',
    business_reg_no:  settings.business_reg_no  || '',
    business_address: settings.business_address || '',
    business_email:   settings.business_email   || '',
    business_phone:   settings.business_phone   || '',
  })
  return (
    <form className="admin-form" onSubmit={(e) => { e.preventDefault(); save(f) }}>
      <label className="field"><span>Business name</span>
        <input value={f.business_name} onChange={e => setF({...f, business_name: e.target.value})}/>
      </label>
      <label className="field"><span>Registration number</span>
        <input value={f.business_reg_no} onChange={e => setF({...f, business_reg_no: e.target.value})}/>
      </label>
      <label className="field"><span>Address</span>
        <textarea rows="3" value={f.business_address} onChange={e => setF({...f, business_address: e.target.value})}/>
      </label>
      <div className="admin-form-row">
        <label className="field"><span>Business email (optional)</span>
          <input type="email" value={f.business_email} onChange={e => setF({...f, business_email: e.target.value})}/>
        </label>
        <label className="field"><span>Business phone (optional)</span>
          <input value={f.business_phone} onChange={e => setF({...f, business_phone: e.target.value})}/>
        </label>
      </div>
      <button className="primary" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save business info'}</button>
      <p className="hint">Appears on every invoice and receipt sent to customers.</p>
    </form>
  )
}

function InvoiceNumbering({ settings, save, saving }) {
  const [f, setF] = useState({
    invoice_prefix:       settings.invoice_prefix       || '',
    invoice_year_reset:   !!settings.invoice_year_reset,
    invoice_next_seq:     settings.invoice_next_seq     || 1,
    invoice_current_year: settings.invoice_current_year || new Date().getFullYear(),
  })

  const pad = String(f.invoice_next_seq).padStart(4, '0')
  const preview = f.invoice_year_reset
    ? `${f.invoice_prefix}${f.invoice_current_year}-${pad}`
    : `${f.invoice_prefix}${pad}`

  return (
    <form className="admin-form" onSubmit={(e) => { e.preventDefault(); save(f) }}>
      <label className="field"><span>Prefix (optional, e.g. "BN-")</span>
        <input value={f.invoice_prefix} onChange={e => setF({...f, invoice_prefix: e.target.value})} placeholder=""/>
      </label>
      <label className="auth-checkbox" style={{padding:'10px 0'}}>
        <input type="checkbox" checked={f.invoice_year_reset} onChange={e => setF({...f, invoice_year_reset: e.target.checked})}/>
        <span>Reset counter each year <em style={{color:'var(--muted)'}}>(recommended)</em></span>
      </label>
      <div className="admin-form-row">
        <label className="field"><span>Next invoice number</span>
          <input type="number" min="1" value={f.invoice_next_seq} onChange={e => setF({...f, invoice_next_seq: parseInt(e.target.value) || 1})}/>
        </label>
        {f.invoice_year_reset && (
          <label className="field"><span>Current invoicing year</span>
            <input type="number" value={f.invoice_current_year} onChange={e => setF({...f, invoice_current_year: parseInt(e.target.value) || new Date().getFullYear()})}/>
          </label>
        )}
      </div>
      <div className="invoice-preview">
        <label>Next invoice number will look like:</label>
        <code>{preview}</code>
      </div>
      <button className="primary" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save numbering'}</button>
    </form>
  )
}

function PaymentMethod({ settings, save, saving }) {
  const [f, setF] = useState({
    payment_bank_name:    settings.payment_bank_name    || 'Maybank',
    payment_account_name: settings.payment_account_name || '',
    payment_account_no:   settings.payment_account_no   || '',
    payment_instructions: settings.payment_instructions || '',
    payment_qr_url:       settings.payment_qr_url       || '',
  })
  const [uploading, setUploading] = useState(false)

  async function uploadQr(file) {
    if (!file) return
    setUploading(true)
    try {
      // Compress / resize? Keep it simple — direct upload.
      const ext = file.name.split('.').pop() || 'png'
      const path = `payment/qr-${Date.now()}.${ext}`
      const { error: upErr } = await supabase.storage
        .from('lilyartisan-images')
        .upload(path, file, { upsert: true })
      if (upErr) throw upErr
      const { data: urlData } = supabase.storage
        .from('lilyartisan-images')
        .getPublicUrl(path)
      setF(prev => ({ ...prev, payment_qr_url: urlData.publicUrl }))
    } catch (e) {
      alert(e.message)
    }
    setUploading(false)
  }

  return (
    <form className="admin-form" onSubmit={(e) => { e.preventDefault(); save(f) }}>
      <div className="admin-form-row">
        <label className="field"><span>Bank name</span>
          <input value={f.payment_bank_name} onChange={e => setF({...f, payment_bank_name: e.target.value})}/>
        </label>
        <label className="field"><span>Account name</span>
          <input value={f.payment_account_name} onChange={e => setF({...f, payment_account_name: e.target.value})}/>
        </label>
      </div>
      <label className="field"><span>Account number</span>
        <input value={f.payment_account_no} onChange={e => setF({...f, payment_account_no: e.target.value})}/>
      </label>
      <label className="field"><span>Payment instructions</span>
        <textarea rows="3" value={f.payment_instructions} onChange={e => setF({...f, payment_instructions: e.target.value})}/>
      </label>

      <div className="field">
        <span style={{fontSize:11, fontWeight:600, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.4px', marginBottom:6}}>DuitNow QR image</span>
        <div className="qr-upload">
          {f.payment_qr_url ? (
            <img src={f.payment_qr_url} alt="Payment QR" className="qr-preview"/>
          ) : (
            <div className="qr-placeholder">No QR uploaded</div>
          )}
          <div className="qr-actions">
            <label className="ghost" style={{cursor:'pointer', border:'1px solid var(--line)', color:'var(--ink-soft)', padding:'6px 12px', borderRadius:6, fontSize:12, fontWeight:500}}>
              {uploading ? 'Uploading…' : 'Upload new QR image'}
              <input type="file" accept="image/*" style={{display:'none'}} disabled={uploading}
                onChange={e => uploadQr(e.target.files?.[0])}/>
            </label>
            {f.payment_qr_url && (
              <button type="button" className="ghost" onClick={() => setF({...f, payment_qr_url: ''})}>Remove</button>
            )}
          </div>
        </div>
      </div>

      <button className="primary" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save payment method'}</button>
      <p className="hint">The QR and account details are shown on the checkout page and on every invoice.</p>
    </form>
  )
}
