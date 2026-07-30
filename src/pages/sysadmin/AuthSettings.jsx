import { useEffect, useMemo, useState } from 'react'
import { listEmailTemplates, updateEmailTemplate } from '../../lib/sysadmin-api'

// Sample values used in the preview pane
const SAMPLE_VALUES = {
  name:               'Jane Baker',
  sender_name:        'Anthony',
  action_link:        'https://lilyartisan.netlify.app/reset-password?token=abc123',
  subscription_link:  'https://lilyartisan.netlify.app/app/settings',
  end_date:           new Date(Date.now() + 3*24*60*60*1000).toLocaleDateString(),
  days_left:          '3',
  business_name:      'Swim Revelation Trading',
}

function render(template, values = SAMPLE_VALUES) {
  return (template || '').replace(/\{\{(\w+)\}\}/g, (m, key) => values[key] ?? m)
}

function extractVars(subject, body) {
  const vars = new Set()
  const re = /\{\{(\w+)\}\}/g
  for (const src of [subject, body]) {
    let m
    while ((m = re.exec(src || '')) !== null) vars.add(m[1])
  }
  return Array.from(vars)
}

export default function AuthSettings() {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading]     = useState(true)
  const [activeKey, setActiveKey] = useState(null)
  const [flash, setFlash]         = useState(null)

  async function reload() {
    setLoading(true)
    const { data } = await listEmailTemplates()
    setTemplates(data || [])
    if (data?.length && !activeKey) setActiveKey(data[0].key)
    setLoading(false)
  }

  useEffect(() => { reload() }, [])

  const active = templates.find(t => t.key === activeKey)

  async function save(patch) {
    const { error } = await updateEmailTemplate(activeKey, patch)
    if (error) { alert(error.message); return }
    await reload()
    setFlash({ type: 'ok', msg: 'Template saved.' })
    setTimeout(() => setFlash(null), 2000)
  }

  return (
    <div className="panel">
      <div className="panel-head">
        <div>
          <h3>Auth & Login</h3>
          <p className="sub">Email templates with <code style={{background:'#f0eef8', padding:'1px 5px', borderRadius:3, fontSize:11}}>{'{{variable}}'}</code> substitution. Session length and other auth settings live in Supabase Dashboard directly.</p>
        </div>
      </div>

      <div className="smtp-notice">
        <div className="smtp-notice-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <div>
          <strong>Templates are stored but not yet sent.</strong> Until you configure custom SMTP in Supabase (Auth → Emails → SMTP Settings), Supabase's default email templates are used. Once SMTP is configured, we'll flip a switch to send these instead.
        </div>
      </div>

      {flash && <div className={`flash flash-${flash.type}`} style={{marginBottom:14}}>{flash.msg}</div>}

      {loading ? (
        <p className="empty">Loading templates…</p>
      ) : (
        <>
          <div className="settings-tabs">
            {templates.map(t => (
              <button
                key={t.key}
                className={t.key === activeKey ? 'active' : ''}
                onClick={() => setActiveKey(t.key)}
              >{t.label}</button>
            ))}
          </div>
          {active && <TemplateEditor key={active.key} template={active} onSave={save}/>}
        </>
      )}
    </div>
  )
}


function TemplateEditor({ template, onSave }) {
  const [subject, setSubject] = useState(template.subject || '')
  const [body, setBody]       = useState(template.body || '')
  const [preview, setPreview] = useState(false)

  useEffect(() => {
    setSubject(template.subject || '')
    setBody(template.body || '')
  }, [template.key])

  const usedVars = useMemo(() => extractVars(subject, body), [subject, body])

  function insertVar(v) {
    setBody(prev => (prev || '') + `{{${v}}}`)
  }

  return (
    <div>
      <div style={{background:'var(--accent-soft)', padding:'10px 14px', borderRadius:8, marginBottom:16, fontSize:13, color:'var(--ink-soft)', border:'1px solid #dedafc'}}>
        <strong style={{color:'var(--accent-dark)'}}>{template.label}</strong> — {template.description}
      </div>

      <div style={{display:'flex', gap:10, marginBottom:14, flexWrap:'wrap'}}>
        <button type="button" className={preview ? 'ghost' : 'primary'} onClick={() => setPreview(false)}
          style={preview ? {border:'1px solid var(--line)', color:'var(--ink-soft)'} : {}}>Edit</button>
        <button type="button" className={!preview ? 'ghost' : 'primary'} onClick={() => setPreview(true)}
          style={!preview ? {border:'1px solid var(--line)', color:'var(--ink-soft)'} : {}}>Preview</button>
      </div>

      {!preview ? (
        <form className="admin-form" onSubmit={(e) => { e.preventDefault(); onSave({ subject, body }) }}>
          <label className="field"><span>Subject</span>
            <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject line"/>
          </label>
          <label className="field"><span>Body (plain text — line breaks preserved)</span>
            <textarea rows="12" value={body} onChange={e => setBody(e.target.value)}
              style={{fontFamily:"'SF Mono', Menlo, Monaco, Consolas, monospace", fontSize:13, lineHeight:1.6}}/>
          </label>

          <div>
            <label style={{fontSize:11, fontWeight:600, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.4px', display:'block', marginBottom:8}}>Available variables (click to insert)</label>
            <div className="var-chips">
              {Object.keys(SAMPLE_VALUES).map(v => (
                <button type="button" key={v}
                  className={'var-chip' + (usedVars.includes(v) ? ' used' : '')}
                  onClick={() => insertVar(v)}
                  title={`Sample: "${SAMPLE_VALUES[v]}"`}
                >
                  {'{{' + v + '}}'}
                </button>
              ))}
            </div>
            <p className="hint" style={{marginTop:8}}>Variables are replaced with real values at send time. Preview uses sample data.</p>
          </div>

          <button type="submit" className="primary">Save template</button>
        </form>
      ) : (
        <div className="email-preview">
          <div className="email-preview-head">
            <div><label>To</label> <span>{SAMPLE_VALUES.name.toLowerCase().replace(' ', '.')}@example.com</span></div>
            <div><label>From</label> <span>{SAMPLE_VALUES.sender_name} &lt;noreply@{'{yourdomain}'}&gt;</span></div>
            <div><label>Subject</label> <span><strong>{render(subject)}</strong></span></div>
          </div>
          <div className="email-preview-body">
            {render(body).split('\n').map((line, i) => (
              <div key={i}>{line || '\u00A0'}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
