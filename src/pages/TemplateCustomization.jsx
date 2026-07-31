import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useSettings } from '../lib/settings.jsx'

/**
 * Template Customization page
 *
 * Edits the per-user, per-template snippets stored in the
 * `template_customization` table plus a few settings fields that only
 * matter for templates (head baker name, wholesale defaults, care/allergen
 * defaults).
 *
 * Sections:
 *   1. Recipe content defaults  → settings table
 *   2. Head baker              → settings table (name + signature file)
 *   3. Wholesale defaults      → settings table (discount, MOQ, terms)
 *   4. Delivery Tag            → template_customization['delivery']
 *   5. Social Media Card       → template_customization['social']
 *   6. Certificate of Craft    → template_customization['cert']
 *   7. Menu Insert             → template_customization['menu']
 */
export default function TemplateCustomization() {
  const settingsCtx = useSettings() || {}
  const settings = settingsCtx.settings || {}
  const updateSettings = settingsCtx.update || (async () => {})

  const [customs, setCustoms]     = useState({})
  const [loading, setLoading]     = useState(true)
  const [savingSection, setSaving] = useState('')
  const [uploadingSig, setUploadingSig] = useState(false)
  const [toast, setToast] = useState(null)

  // Local edit drafts for settings-backed fields
  const [defs, setDefs] = useState({
    default_storage_notes: '',
    default_care_text: '',
    default_allergen_notice: '',
    head_baker_name: '',
    head_baker_signature_url: '',
    wholesale_discount_pct: 30,
    wholesale_moq: 10,
    wholesale_terms_text: '',
  })

  useEffect(() => {
    ;(async () => {
      const { data } = await supabase.from('template_customization').select('*')
      const map = {}
      for (const row of data || []) map[row.template_key] = row.custom || {}
      setCustoms(map)
      setLoading(false)
    })()
  }, [])

  useEffect(() => {
    setDefs({
      default_storage_notes:    settings.default_storage_notes    || '',
      default_care_text:        settings.default_care_text        || '',
      default_allergen_notice:  settings.default_allergen_notice  || '',
      head_baker_name:          settings.head_baker_name          || '',
      head_baker_signature_url: settings.head_baker_signature_url || '',
      wholesale_discount_pct:   settings.wholesale_discount_pct ?? 30,
      wholesale_moq:            settings.wholesale_moq         ?? 10,
      wholesale_terms_text:     settings.wholesale_terms_text    || '',
    })
  }, [settings])

  function flash(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 2400)
  }

  async function saveSettings(fields, label) {
    setSaving(label)
    const patch = {}
    for (const k of fields) patch[k] = defs[k]
    await updateSettings(patch)
    setSaving('')
    flash(`${label} saved`)
  }

  async function saveCustom(templateKey, next) {
    setSaving(templateKey)
    const { error } = await supabase
      .from('template_customization')
      .upsert({ user_id: (await supabase.auth.getUser()).data.user.id,
                template_key: templateKey,
                custom: next,
                updated_at: new Date().toISOString() },
              { onConflict: 'user_id,template_key' })
    if (error) {
      flash(`Save failed: ${error.message}`)
    } else {
      setCustoms(c => ({ ...c, [templateKey]: next }))
      flash(`${templateKey} saved`)
    }
    setSaving('')
  }

  async function uploadSignature(file) {
    if (!file) return
    setUploadingSig(true)
    try {
      const user = (await supabase.auth.getUser()).data.user
      const path = `${user.id}/signature-${Date.now()}.${file.name.split('.').pop()}`
      const { error: upErr } = await supabase.storage
        .from('lilyartisan-images')
        .upload(path, file, { upsert: false, contentType: file.type })
      if (upErr) throw upErr
      const { data: urlData } = supabase.storage
        .from('lilyartisan-images')
        .getPublicUrl(path)
      setDefs(d => ({ ...d, head_baker_signature_url: urlData.publicUrl }))
      await updateSettings({ head_baker_signature_url: urlData.publicUrl })
      flash('Signature uploaded')
    } catch (e) {
      flash(`Upload failed: ${e.message}`)
    }
    setUploadingSig(false)
  }

  const setC = (key, field, value) =>
    setCustoms(c => ({ ...c, [key]: { ...(c[key] || {}), [field]: value } }))

  if (loading) return <div className="panel"><p className="loading">Loading…</p></div>

  const del  = customs.delivery || {}
  const soc  = customs.social   || {}
  const cert = customs.cert     || {}
  const menu = customs.menu     || {}

  return (
    <>
      {toast && <div className="toast">{toast}</div>}

      <div className="panel">
        <div className="panel-head">
          <div>
            <h3>Template Customization</h3>
            <p className="sub">
              Content that appears on your customer-facing templates. Edit once here and every template picks it up.
              Recipe-specific overrides live inside each recipe's <em>Content</em> drawer on the Recipe Master page.
            </p>
          </div>
        </div>
      </div>

      {/* ================================================================
          1. Recipe content defaults
          ================================================================ */}
      <div className="panel">
        <div className="panel-head">
          <div>
            <h3>Recipe content defaults</h3>
            <p className="sub">
              Fallback text when a recipe hasn't set its own — used on Care Cards, Product Labels, and Delivery Tags.
            </p>
          </div>
        </div>

        <div className="field">
          <label>Default care text</label>
          <textarea rows={2} value={defs.default_care_text}
            onChange={e => setDefs(d => ({ ...d, default_care_text: e.target.value }))}
            placeholder="Best day of baking. Store in an airtight container up to 3 days."/>
        </div>
        <div className="field">
          <label>Default storage notes</label>
          <textarea rows={2} value={defs.default_storage_notes}
            onChange={e => setDefs(d => ({ ...d, default_storage_notes: e.target.value }))}
            placeholder="Refrigerate in hot weather; back to room temp 30 min before serving."/>
        </div>
        <div className="field">
          <label>Default allergen notice</label>
          <textarea rows={2} value={defs.default_allergen_notice}
            onChange={e => setDefs(d => ({ ...d, default_allergen_notice: e.target.value }))}
            placeholder="Contains: wheat, dairy, eggs. May contain traces of nuts."/>
        </div>
        <div className="templates-actions">
          <button className="primary"
            disabled={savingSection === 'defaults'}
            onClick={() => saveSettings(['default_care_text', 'default_storage_notes', 'default_allergen_notice'], 'defaults')}>
            {savingSection === 'defaults' ? 'Saving…' : 'Save defaults'}
          </button>
        </div>
      </div>

      {/* ================================================================
          2. Head baker
          ================================================================ */}
      <div className="panel">
        <div className="panel-head">
          <div>
            <h3>Head baker</h3>
            <p className="sub">Appears on the Certificate of Craft. Signature is a transparent PNG on the certificate.</p>
          </div>
        </div>

        <div className="field">
          <label>Head baker name</label>
          <input value={defs.head_baker_name}
            onChange={e => setDefs(d => ({ ...d, head_baker_name: e.target.value }))}
            placeholder="Lily Ong" style={{ maxWidth: 320 }}/>
        </div>
        <div className="field">
          <label>Signature (image upload)</label>
          {defs.head_baker_signature_url && (
            <div style={{ background: '#F5EAD3', padding: 12, borderRadius: 6, marginBottom: 8, maxWidth: 320 }}>
              <img src={defs.head_baker_signature_url} alt="signature"
                style={{ maxHeight: 60, maxWidth: '100%', display: 'block' }}/>
            </div>
          )}
          <input type="file" accept="image/*"
            onChange={e => uploadSignature(e.target.files?.[0])} disabled={uploadingSig}/>
          {uploadingSig && <div className="hint" style={{ marginTop: 6 }}>Uploading…</div>}
        </div>
        <div className="templates-actions">
          <button className="primary"
            disabled={savingSection === 'baker'}
            onClick={() => saveSettings(['head_baker_name'], 'baker')}>
            {savingSection === 'baker' ? 'Saving…' : 'Save head baker'}
          </button>
        </div>
      </div>

      {/* ================================================================
          3. Wholesale defaults
          ================================================================ */}
      <div className="panel">
        <div className="panel-head">
          <div>
            <h3>Wholesale defaults</h3>
            <p className="sub">Discount, MOQ, and ordering terms used on the Wholesale Price List.</p>
          </div>
        </div>

        <div className="row-add">
          <div className="field" style={{ maxWidth: 140 }}>
            <label>Discount %</label>
            <input type="number" min="0" max="100" value={defs.wholesale_discount_pct}
              onChange={e => setDefs(d => ({ ...d, wholesale_discount_pct: Number(e.target.value) }))}/>
          </div>
          <div className="field" style={{ maxWidth: 140 }}>
            <label>MOQ (units/SKU)</label>
            <input type="number" min="1" value={defs.wholesale_moq}
              onChange={e => setDefs(d => ({ ...d, wholesale_moq: Number(e.target.value) }))}/>
          </div>
          <div style={{ alignSelf: 'flex-end', color: 'var(--muted)', fontSize: 13, paddingBottom: 8 }}>
            e.g. RM 10 retail × (1 − {defs.wholesale_discount_pct}%) = <b>RM {(10 * (1 - defs.wholesale_discount_pct / 100)).toFixed(2)}</b> wholesale
          </div>
        </div>
        <div className="field">
          <label>Ordering terms (separate with <code>·</code> or new line)</label>
          <textarea rows={4} value={defs.wholesale_terms_text}
            onChange={e => setDefs(d => ({ ...d, wholesale_terms_text: e.target.value }))}
            placeholder="Prices valid 30 days · Minimum order 10 units per SKU · Orders placed by 6pm are ready next morning · Nett 14 days, or cash on collection · Custom flavours on request"/>
        </div>
        <div className="templates-actions">
          <button className="primary"
            disabled={savingSection === 'wholesale'}
            onClick={() => saveSettings(['wholesale_discount_pct', 'wholesale_moq', 'wholesale_terms_text'], 'wholesale')}>
            {savingSection === 'wholesale' ? 'Saving…' : 'Save wholesale'}
          </button>
        </div>
      </div>

      {/* ================================================================
          4. Delivery Tag
          ================================================================ */}
      <div className="panel">
        <div className="panel-head">
          <div><h3>Delivery Tag</h3><p className="sub">Every text snippet on the hang tag.</p></div>
        </div>
        <div className="field">
          <label>Eyebrow (small caps above product name)</label>
          <input value={del.eyebrow_text || ''}
            onChange={e => setC('delivery', 'eyebrow_text', e.target.value)}
            placeholder="Handmade for you" style={{ maxWidth: 320 }}/>
        </div>
        <div className="field">
          <label>Care box title</label>
          <input value={del.care_title_text || ''}
            onChange={e => setC('delivery', 'care_title_text', e.target.value)}
            placeholder="Keep me happy" style={{ maxWidth: 320 }}/>
        </div>
        <div className="field">
          <label>Closing line (italic)</label>
          <input value={del.thanks_text || ''}
            onChange={e => setC('delivery', 'thanks_text', e.target.value)}
            placeholder="Thank you for supporting a small kitchen."/>
        </div>
        <div className="templates-actions">
          <button className="primary"
            disabled={savingSection === 'delivery'}
            onClick={() => saveCustom('delivery', customs.delivery || {})}>
            {savingSection === 'delivery' ? 'Saving…' : 'Save Delivery Tag'}
          </button>
        </div>
      </div>

      {/* ================================================================
          5. Social Media Card
          ================================================================ */}
      <div className="panel">
        <div className="panel-head">
          <div><h3>Social Media Card</h3><p className="sub">Instagram/Facebook 1080×1080 post.</p></div>
        </div>
        <div className="field">
          <label>Eyebrow (small caps above product name)</label>
          <input value={soc.eyebrow_text || ''}
            onChange={e => setC('social', 'eyebrow_text', e.target.value)}
            placeholder="Fresh from our kitchen" style={{ maxWidth: 320 }}/>
        </div>
        <div className="field">
          <label>CTA prefix (before the price)</label>
          <input value={soc.cta_prefix || ''}
            onChange={e => setC('social', 'cta_prefix', e.target.value)}
            placeholder="From (renders as: From RM 10.00)" style={{ maxWidth: 320 }}/>
        </div>
        <div className="templates-actions">
          <button className="primary"
            disabled={savingSection === 'social'}
            onClick={() => saveCustom('social', customs.social || {})}>
            {savingSection === 'social' ? 'Saving…' : 'Save Social Card'}
          </button>
        </div>
      </div>

      {/* ================================================================
          6. Certificate of Craft
          ================================================================ */}
      <div className="panel">
        <div className="panel-head">
          <div><h3>Certificate of Craft</h3><p className="sub">Landscape A4 certificate.</p></div>
        </div>
        <div className="field">
          <label>Title (italic slab-serif)</label>
          <input value={cert.title || ''}
            onChange={e => setC('cert', 'title', e.target.value)}
            placeholder="Certificate of Craft" style={{ maxWidth: 320 }}/>
        </div>
        <div className="field">
          <label>Intro line (before product name)</label>
          <input value={cert.intro_line || ''}
            onChange={e => setC('cert', 'intro_line', e.target.value)}
            placeholder="This is to certify that"/>
        </div>
        <div className="field">
          <label>Outro line (after product name)</label>
          <input value={cert.outro_line || ''}
            onChange={e => setC('cert', 'outro_line', e.target.value)}
            placeholder="was crafted with care in the kitchen of"/>
        </div>
        <div className="field">
          <label>Head baker name override (blank = use Head baker section above)</label>
          <input value={cert.head_baker_name || ''}
            onChange={e => setC('cert', 'head_baker_name', e.target.value)}
            placeholder={defs.head_baker_name || 'Head Baker'} style={{ maxWidth: 320 }}/>
        </div>
        <div className="field">
          <label>Seal text (slash-separated for 3 lines)</label>
          <input value={cert.seal_text || ''}
            onChange={e => setC('cert', 'seal_text', e.target.value)}
            placeholder="BAKED / WITH / CARE" style={{ maxWidth: 320 }}/>
        </div>
        <div className="templates-actions">
          <button className="primary"
            disabled={savingSection === 'cert'}
            onClick={() => saveCustom('cert', customs.cert || {})}>
            {savingSection === 'cert' ? 'Saving…' : 'Save Certificate'}
          </button>
        </div>
      </div>

      {/* ================================================================
          7. Menu Insert
          ================================================================ */}
      <div className="panel">
        <div className="panel-head">
          <div>
            <h3>Menu Insert</h3>
            <p className="sub">
              Which recipes appear on the Menu is controlled per-recipe (<em>Content</em> drawer → Menu Display).
              Header eyebrow and footer line customise the printed menu itself.
            </p>
          </div>
        </div>
        <div className="field">
          <label>Header eyebrow (small caps above brand name)</label>
          <input value={menu.header_eyebrow || ''}
            onChange={e => setC('menu', 'header_eyebrow', e.target.value)}
            placeholder="e.g. Today's Bakes" style={{ maxWidth: 320 }}/>
        </div>
        <div className="field">
          <label>Footer line (italic under items)</label>
          <input value={menu.footer_line || ''}
            onChange={e => setC('menu', 'footer_line', e.target.value)}
            placeholder="e.g. Ask about custom orders at hello@thedailycrumb.com"/>
        </div>
        <div className="templates-actions">
          <button className="primary"
            disabled={savingSection === 'menu'}
            onClick={() => saveCustom('menu', customs.menu || {})}>
            {savingSection === 'menu' ? 'Saving…' : 'Save Menu'}
          </button>
        </div>
      </div>
    </>
  )
}
