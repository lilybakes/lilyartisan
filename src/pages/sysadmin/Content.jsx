import { useEffect, useState } from 'react'
import { fetchAllContent, upsertContentBlock } from '../../lib/sysadmin-api'
import {
  CONTENT_DEFAULTS,
  HERO_DEFAULT, FEATURES_HEAD_DEFAULT, FEATURES_DEFAULT,
  PRICING_HEAD_DEFAULT, PRICING_DEFAULT, FAQ_HEAD_DEFAULT, FAQ_DEFAULT,
  CTA_DEFAULT, COMING_SOON_DEFAULT,
  FEATURE_ICON_OPTIONS, FEATURE_TONE_OPTIONS,
} from '../../lib/content-defaults'

const TABS = [
  { key: 'hero',        label: 'Hero' },
  { key: 'features',    label: 'Features' },
  { key: 'pricing',     label: 'Pricing' },
  { key: 'faq',         label: 'FAQ' },
  { key: 'cta',         label: 'Final CTA' },
  { key: 'coming_soon', label: 'Coming Soon' },
]

export default function Content() {
  const [content, setContent] = useState(CONTENT_DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [tab, setTab]         = useState('hero')
  const [flash, setFlash]     = useState(null)

  async function reload() {
    setLoading(true)
    const { data } = await fetchAllContent()
    setContent({ ...CONTENT_DEFAULTS, ...data })
    setLoading(false)
  }

  useEffect(() => { reload() }, [])

  async function save(key, next) {
    const { error } = await upsertContentBlock(key, next)
    if (error) { alert(error.message); return false }
    setContent(prev => ({ ...prev, [key]: next }))
    setFlash({ type: 'ok', msg: 'Saved. Refresh the landing page to see changes.' })
    setTimeout(() => setFlash(null), 3000)
    return true
  }

  async function resetToDefault(key) {
    if (!confirm('Reset this section to default content?')) return
    await save(key, CONTENT_DEFAULTS[key])
  }

  if (loading) return <div className="panel"><p className="empty">Loading content…</p></div>

  return (
    <div className="panel">
      <div className="panel-head">
        <div>
          <h3>Content</h3>
          <p className="sub">Edit landing page copy, pricing, FAQ, and the Coming Soon widget. Changes are live immediately.</p>
        </div>
      </div>

      <div className="settings-tabs">
        {TABS.map(t => (
          <button
            key={t.key}
            className={tab === t.key ? 'active' : ''}
            onClick={() => setTab(t.key)}
          >{t.label}</button>
        ))}
      </div>

      {flash && <div className={`flash flash-${flash.type}`} style={{marginBottom:14}}>{flash.msg}</div>}

      {tab === 'hero'        && <HeroEditor        value={content['landing.hero']}          onSave={v => save('landing.hero', v)}          onReset={() => resetToDefault('landing.hero')}/>}
      {tab === 'features'    && <FeaturesEditor    head={content['landing.features_head']} items={content['landing.features']}
                                                    onSaveHead={v => save('landing.features_head', v)}
                                                    onSaveItems={v => save('landing.features', v)}
                                                    onReset={() => { resetToDefault('landing.features_head'); resetToDefault('landing.features') }}/>}
      {tab === 'pricing'     && <PricingEditor     head={content['landing.pricing_head']} value={content['landing.pricing']}
                                                    onSaveHead={v => save('landing.pricing_head', v)}
                                                    onSaveValue={v => save('landing.pricing', v)}
                                                    onReset={() => { resetToDefault('landing.pricing_head'); resetToDefault('landing.pricing') }}/>}
      {tab === 'faq'         && <FaqEditor         head={content['landing.faq_head']} items={content['landing.faq']}
                                                    onSaveHead={v => save('landing.faq_head', v)}
                                                    onSaveItems={v => save('landing.faq', v)}
                                                    onReset={() => { resetToDefault('landing.faq_head'); resetToDefault('landing.faq') }}/>}
      {tab === 'cta'         && <CtaEditor         value={content['landing.cta']}           onSave={v => save('landing.cta', v)}           onReset={() => resetToDefault('landing.cta')}/>}
      {tab === 'coming_soon' && <ComingSoonEditor  items={content['coming_soon']}           onSave={v => save('coming_soon', v)}           onReset={() => resetToDefault('coming_soon')}/>}
    </div>
  )
}


// ============================================================
// HERO
// ============================================================
function HeroEditor({ value, onSave, onReset }) {
  const [f, setF] = useState({ ...HERO_DEFAULT, ...value })
  return (
    <form className="admin-form" onSubmit={(e) => { e.preventDefault(); onSave(f) }}>
      <label className="field"><span>Eyebrow tag</span>
        <input value={f.eyebrow || ''} onChange={e => setF({...f, eyebrow: e.target.value})} placeholder="🎂 Made for artisan bakers"/>
      </label>
      <div className="admin-form-row">
        <label className="field"><span>Title — line 1</span>
          <input value={f.title_line_1 || ''} onChange={e => setF({...f, title_line_1: e.target.value})}/>
        </label>
        <label className="field"><span>Title — line 2 (accent color)</span>
          <input value={f.title_line_2 || ''} onChange={e => setF({...f, title_line_2: e.target.value})}/>
        </label>
      </div>
      <label className="field"><span>Tagline</span>
        <input value={f.tagline || ''} onChange={e => setF({...f, tagline: e.target.value})}/>
      </label>
      <label className="field"><span>Body paragraph</span>
        <textarea rows="4" value={f.body || ''} onChange={e => setF({...f, body: e.target.value})}/>
      </label>
      <div className="admin-form-row">
        <label className="field"><span>Primary CTA button</span>
          <input value={f.cta_primary || ''} onChange={e => setF({...f, cta_primary: e.target.value})}/>
        </label>
        <label className="field"><span>Secondary CTA button</span>
          <input value={f.cta_secondary || ''} onChange={e => setF({...f, cta_secondary: e.target.value})}/>
        </label>
      </div>
      <label className="field"><span>Fine print (below CTAs)</span>
        <input value={f.fineprint || ''} onChange={e => setF({...f, fineprint: e.target.value})}/>
      </label>
      <FormFooter onReset={onReset}/>
    </form>
  )
}


// ============================================================
// FEATURES
// ============================================================
function FeaturesEditor({ head, items, onSaveHead, onSaveItems, onReset }) {
  const [h, setH] = useState({ ...FEATURES_HEAD_DEFAULT, ...head })
  const [list, setList] = useState(items || FEATURES_DEFAULT)

  function updateItem(i, patch) {
    setList(prev => prev.map((it, idx) => idx === i ? { ...it, ...patch } : it))
  }
  function moveItem(i, dir) {
    setList(prev => {
      const next = [...prev]
      const j = i + dir
      if (j < 0 || j >= next.length) return prev
      ;[next[i], next[j]] = [next[j], next[i]]
      return next
    })
  }
  function removeItem(i) {
    setList(prev => prev.filter((_, idx) => idx !== i))
  }
  function addItem() {
    setList(prev => [...prev, { icon: 'sparkle', tone: 'a', title: 'New feature', body: 'Describe the benefit here.' }])
  }

  async function saveAll(e) {
    e.preventDefault()
    await onSaveHead(h)
    await onSaveItems(list)
  }

  return (
    <form className="admin-form" onSubmit={saveAll}>
      <div className="admin-section">
        <h4>Section header</h4>
        <label className="field"><span>Eyebrow</span>
          <input value={h.eyebrow || ''} onChange={e => setH({...h, eyebrow: e.target.value})}/>
        </label>
        <label className="field"><span>Title</span>
          <input value={h.title || ''} onChange={e => setH({...h, title: e.target.value})}/>
        </label>
        <label className="field"><span>Subtitle</span>
          <textarea rows="2" value={h.subtitle || ''} onChange={e => setH({...h, subtitle: e.target.value})}/>
        </label>
      </div>

      <div className="admin-section">
        <h4>Feature cards ({list.length})</h4>
        {list.map((it, i) => (
          <div key={i} className="admin-item-card">
            <div className="admin-item-head">
              <span className="admin-item-num">#{i + 1}</span>
              <div className="admin-item-controls">
                <button type="button" className="edit" onClick={() => moveItem(i, -1)} disabled={i === 0}>↑</button>
                <button type="button" className="edit" onClick={() => moveItem(i, +1)} disabled={i === list.length - 1}>↓</button>
                <button type="button" className="ghost" onClick={() => removeItem(i)}>Remove</button>
              </div>
            </div>
            <div className="admin-form-row">
              <label className="field"><span>Icon</span>
                <select value={it.icon} onChange={e => updateItem(i, { icon: e.target.value })}>
                  {FEATURE_ICON_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </label>
              <label className="field"><span>Color tone</span>
                <select value={it.tone} onChange={e => updateItem(i, { tone: e.target.value })}>
                  {FEATURE_TONE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </label>
            </div>
            <label className="field"><span>Title</span>
              <input value={it.title} onChange={e => updateItem(i, { title: e.target.value })}/>
            </label>
            <label className="field"><span>Body</span>
              <textarea rows="2" value={it.body} onChange={e => updateItem(i, { body: e.target.value })}/>
            </label>
          </div>
        ))}
        <button type="button" className="ghost" onClick={addItem} style={{border:'1px dashed var(--line)', padding:'10px 16px', width:'100%', borderRadius:8, color:'var(--accent)'}}>
          + Add feature card
        </button>
      </div>

      <FormFooter onReset={onReset}/>
    </form>
  )
}


// ============================================================
// PRICING
// ============================================================
function PricingEditor({ head, value, onSaveHead, onSaveValue, onReset }) {
  const [h, setH]  = useState({ ...PRICING_HEAD_DEFAULT, ...head })
  const [p, setP]  = useState({ ...PRICING_DEFAULT,      ...value })
  const [features, setFeatures] = useState(p.features || PRICING_DEFAULT.features)

  function updateFeature(i, txt) { setFeatures(prev => prev.map((f, idx) => idx === i ? txt : f)) }
  function addFeature()          { setFeatures(prev => [...prev, 'New benefit']) }
  function removeFeature(i)      { setFeatures(prev => prev.filter((_, idx) => idx !== i)) }
  function moveFeature(i, dir)   {
    setFeatures(prev => {
      const next = [...prev]; const j = i + dir
      if (j < 0 || j >= next.length) return prev
      ;[next[i], next[j]] = [next[j], next[i]]; return next
    })
  }

  async function saveAll(e) {
    e.preventDefault()
    await onSaveHead(h)
    await onSaveValue({ ...p, features })
  }

  return (
    <form className="admin-form" onSubmit={saveAll}>
      <div className="admin-section">
        <h4>Section header</h4>
        <label className="field"><span>Eyebrow</span>
          <input value={h.eyebrow || ''} onChange={e => setH({...h, eyebrow: e.target.value})}/>
        </label>
        <label className="field"><span>Title</span>
          <input value={h.title || ''} onChange={e => setH({...h, title: e.target.value})}/>
        </label>
        <label className="field"><span>Subtitle</span>
          <textarea rows="2" value={h.subtitle || ''} onChange={e => setH({...h, subtitle: e.target.value})}/>
        </label>
      </div>

      <div className="admin-section">
        <h4>Pricing card</h4>
        <label className="field"><span>Plan name</span>
          <input value={p.plan_name || ''} onChange={e => setP({...p, plan_name: e.target.value})}/>
        </label>
        <div className="admin-form-row">
          <label className="field"><span>Currency</span>
            <input value={p.currency || ''} onChange={e => setP({...p, currency: e.target.value})}/>
          </label>
          <label className="field"><span>Amount</span>
            <input value={p.amount || ''} onChange={e => setP({...p, amount: e.target.value})}/>
          </label>
          <label className="field"><span>Period</span>
            <input value={p.period || ''} onChange={e => setP({...p, period: e.target.value})}/>
          </label>
        </div>
        <label className="field"><span>Per-month note</span>
          <input value={p.per_note || ''} onChange={e => setP({...p, per_note: e.target.value})}/>
        </label>

        <div style={{marginTop:12}}>
          <label style={{fontSize:11, fontWeight:600, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.4px', display:'block', marginBottom:8}}>Features included</label>
          {features.map((feat, i) => (
            <div key={i} style={{display:'flex', gap:6, marginBottom:6, alignItems:'center'}}>
              <input value={feat} onChange={e => updateFeature(i, e.target.value)} style={{flex:1}}/>
              <button type="button" className="edit" onClick={() => moveFeature(i, -1)} disabled={i === 0}>↑</button>
              <button type="button" className="edit" onClick={() => moveFeature(i, +1)} disabled={i === features.length - 1}>↓</button>
              <button type="button" className="ghost" onClick={() => removeFeature(i)}>×</button>
            </div>
          ))}
          <button type="button" className="ghost" onClick={addFeature} style={{border:'1px dashed var(--line)', padding:'8px 14px', color:'var(--accent)', borderRadius:6, marginTop:4}}>+ Add feature</button>
        </div>

        <label className="field" style={{marginTop:14}}><span>CTA button text</span>
          <input value={p.cta || ''} onChange={e => setP({...p, cta: e.target.value})}/>
        </label>
        <label className="field"><span>Fine print (below CTA)</span>
          <input value={p.fineprint || ''} onChange={e => setP({...p, fineprint: e.target.value})}/>
        </label>
      </div>

      <FormFooter onReset={onReset}/>
    </form>
  )
}


// ============================================================
// FAQ
// ============================================================
function FaqEditor({ head, items, onSaveHead, onSaveItems, onReset }) {
  const [h, setH] = useState({ ...FAQ_HEAD_DEFAULT, ...head })
  const [list, setList] = useState(items || FAQ_DEFAULT)

  const update = (i, patch) => setList(prev => prev.map((it, idx) => idx === i ? { ...it, ...patch } : it))
  const move   = (i, dir)   => setList(prev => {
    const next = [...prev]; const j = i + dir
    if (j < 0 || j >= next.length) return prev
    ;[next[i], next[j]] = [next[j], next[i]]; return next
  })
  const remove = (i) => setList(prev => prev.filter((_, idx) => idx !== i))
  const add    = () => setList(prev => [...prev, { q: 'New question?', a: 'Your answer here.' }])

  async function saveAll(e) {
    e.preventDefault()
    await onSaveHead(h)
    await onSaveItems(list)
  }

  return (
    <form className="admin-form" onSubmit={saveAll}>
      <div className="admin-section">
        <h4>Section header</h4>
        <label className="field"><span>Eyebrow</span>
          <input value={h.eyebrow || ''} onChange={e => setH({...h, eyebrow: e.target.value})}/>
        </label>
        <label className="field"><span>Title</span>
          <input value={h.title || ''} onChange={e => setH({...h, title: e.target.value})}/>
        </label>
      </div>

      <div className="admin-section">
        <h4>Questions ({list.length})</h4>
        {list.map((it, i) => (
          <div key={i} className="admin-item-card">
            <div className="admin-item-head">
              <span className="admin-item-num">#{i + 1}</span>
              <div className="admin-item-controls">
                <button type="button" className="edit" onClick={() => move(i, -1)} disabled={i === 0}>↑</button>
                <button type="button" className="edit" onClick={() => move(i, +1)} disabled={i === list.length - 1}>↓</button>
                <button type="button" className="ghost" onClick={() => remove(i)}>Remove</button>
              </div>
            </div>
            <label className="field"><span>Question</span>
              <input value={it.q} onChange={e => update(i, { q: e.target.value })}/>
            </label>
            <label className="field"><span>Answer</span>
              <textarea rows="3" value={it.a} onChange={e => update(i, { a: e.target.value })}/>
            </label>
          </div>
        ))}
        <button type="button" className="ghost" onClick={add} style={{border:'1px dashed var(--line)', padding:'10px 16px', width:'100%', borderRadius:8, color:'var(--accent)'}}>
          + Add question
        </button>
      </div>

      <FormFooter onReset={onReset}/>
    </form>
  )
}


// ============================================================
// FINAL CTA
// ============================================================
function CtaEditor({ value, onSave, onReset }) {
  const [f, setF] = useState({ ...CTA_DEFAULT, ...value })
  return (
    <form className="admin-form" onSubmit={(e) => { e.preventDefault(); onSave(f) }}>
      <label className="field"><span>Title</span>
        <input value={f.title || ''} onChange={e => setF({...f, title: e.target.value})}/>
      </label>
      <label className="field"><span>Subtitle</span>
        <input value={f.subtitle || ''} onChange={e => setF({...f, subtitle: e.target.value})}/>
      </label>
      <label className="field"><span>CTA button text</span>
        <input value={f.cta || ''} onChange={e => setF({...f, cta: e.target.value})}/>
      </label>
      <FormFooter onReset={onReset}/>
    </form>
  )
}


// ============================================================
// COMING SOON
// ============================================================
function ComingSoonEditor({ items, onSave, onReset }) {
  const [list, setList] = useState(items || [])

  const update = (i, patch) => setList(prev => prev.map((it, idx) => idx === i ? { ...it, ...patch } : it))
  const move   = (i, dir)   => setList(prev => {
    const next = [...prev]; const j = i + dir
    if (j < 0 || j >= next.length) return prev
    ;[next[i], next[j]] = [next[j], next[i]]; return next
  })
  const remove     = (i) => setList(prev => prev.filter((_, idx) => idx !== i))
  const toggleShow = (i) => update(i, { visible: list[i].visible === false })
  const add        = () => setList(prev => [...prev, { title: 'New upcoming feature', description: 'A brief note about what\'s coming.', visible: true }])

  const visibleCount = list.filter(it => it.visible !== false).length
  const hiddenCount  = list.length - visibleCount

  return (
    <form className="admin-form" onSubmit={(e) => { e.preventDefault(); onSave(list) }}>
      <div className="admin-section">
        <div style={{background:'var(--accent-soft)', border:'1px solid #dedafc', borderRadius:8, padding:'12px 14px', marginBottom:16, fontSize:13, color:'var(--ink-soft)', lineHeight:1.55}}>
          <strong style={{color:'var(--accent-dark)'}}>What appears here:</strong> Cards shown to all logged-in users in their Settings page. Use it to tell them what's coming next. <strong>Hide</strong> to keep an item saved but out of the user view.
        </div>
        <h4>Items ({visibleCount} visible{hiddenCount > 0 ? `, ${hiddenCount} hidden` : ''})</h4>
        {list.length === 0 && (
          <p className="empty" style={{padding:'20px 0'}}>No items yet. Add one to get started.</p>
        )}
        {list.map((it, i) => {
          const isHidden = it.visible === false
          return (
            <div key={i} className={'admin-item-card' + (isHidden ? ' admin-item-hidden' : '')}>
              <div className="admin-item-head">
                <span className="admin-item-num">#{i + 1}{isHidden && <em style={{marginLeft:8, fontStyle:'normal', color:'var(--muted)'}}>· Hidden</em>}</span>
                <div className="admin-item-controls">
                  <button type="button" className="edit" onClick={() => move(i, -1)} disabled={i === 0}>↑</button>
                  <button type="button" className="edit" onClick={() => move(i, +1)} disabled={i === list.length - 1}>↓</button>
                  <button type="button" className="edit" onClick={() => toggleShow(i)}>
                    {isHidden ? 'Show' : 'Hide'}
                  </button>
                  <button type="button" className="ghost" onClick={() => remove(i)}>Remove</button>
                </div>
              </div>
              <label className="field"><span>Title</span>
                <input value={it.title} onChange={e => update(i, { title: e.target.value })}/>
              </label>
              <label className="field"><span>Description</span>
                <textarea rows="2" value={it.description} onChange={e => update(i, { description: e.target.value })}/>
              </label>
            </div>
          )
        })}
        <button type="button" className="ghost" onClick={add} style={{border:'1px dashed var(--line)', padding:'10px 16px', width:'100%', borderRadius:8, color:'var(--accent)'}}>
          + Add Coming Soon item
        </button>
      </div>

      <FormFooter onReset={onReset}/>
    </form>
  )
}


// ============================================================
// Shared form footer
// ============================================================
function FormFooter({ onReset }) {
  return (
    <div style={{display:'flex', gap:10, alignItems:'center', paddingTop:6}}>
      <button type="submit" className="primary">Save changes</button>
      <button type="button" className="ghost" onClick={onReset} style={{border:'1px solid var(--line)', color:'var(--ink-soft)'}}>Reset to default</button>
    </div>
  )
}
