import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { TEMPLATES } from '../../components/templates/index.js'
import { STYLE_VARIANTS } from '../../lib/template-styles.js'

const TABS = [
  { id: 'exclusivity', label: 'Exclusivity' },
  { id: 'grants',      label: 'Grants' },
]

export default function TemplateAccess() {
  const [tab, setTab] = useState('exclusivity')
  const [visibility, setVisibility] = useState({})  // {'template:classic': true, 'style:kraft': true, ...}
  const [grants, setGrants]         = useState([])
  const [users, setUsers]           = useState([])
  const [loading, setLoading]       = useState(true)
  const [saving, setSaving]         = useState('')

  async function reload() {
    setLoading(true)
    const [visRes, grantsRes, usersRes] = await Promise.all([
      supabase.rpc('sysadmin_list_template_visibility'),
      supabase.rpc('sysadmin_list_template_grants'),
      supabase.rpc('sysadmin_users_for_grant'),
    ])
    const vis = {}
    for (const row of visRes.data || []) vis[`${row.scope}:${row.identifier}`] = row.is_exclusive
    setVisibility(vis)
    setGrants(grantsRes.data || [])
    setUsers(usersRes.data || [])
    setLoading(false)
  }
  useEffect(() => { reload() }, [])

  async function toggleExclusive(scope, identifier, current) {
    setSaving(`${scope}:${identifier}`)
    await supabase.rpc('sysadmin_set_template_visibility', {
      p_scope: scope, p_identifier: identifier, p_is_exclusive: !current,
    })
    setSaving('')
    reload()
  }

  return (
    <>
      <div className="panel-head">
        <div>
          <h3>Template Access</h3>
          <p className="sub">Mark specific templates or style variants as exclusive — they'll only appear for users you explicitly grant.</p>
        </div>
      </div>

      <div className="settings-tabs">
        {TABS.map(t => (
          <button key={t.id} className={tab === t.id ? 'active' : ''} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {loading && <div className="panel"><p className="loading">Loading…</p></div>}

      {!loading && tab === 'exclusivity' && (
        <ExclusivityTab
          visibility={visibility}
          onToggle={toggleExclusive}
          saving={saving}
        />
      )}

      {!loading && tab === 'grants' && (
        <GrantsTab
          visibility={visibility}
          grants={grants}
          users={users}
          onReload={reload}
        />
      )}
    </>
  )
}

/* ============================================================
   Exclusivity — mark items as public / exclusive
   ============================================================ */
function ExclusivityTab({ visibility, onToggle, saving }) {
  const isEx = (scope, key) => !!visibility[`${scope}:${key}`]
  const isSaving = (scope, key) => saving === `${scope}:${key}`

  const templateCount = TEMPLATES.filter(t => isEx('template', t.key)).length
  const styleCount    = STYLE_VARIANTS.filter(s => isEx('style', s.key)).length

  return (
    <div className="panel">
      <div className="access-note">
        <b>How this works.</b> Everything is public by default. Toggling an item to <b>Exclusive</b> hides it from every user until you grant access on the Grants tab.
      </div>

      <div className="access-section">
        <div className="access-section-head">
          <h4>Templates</h4>
          <span className="pill">{templateCount} of {TEMPLATES.length} exclusive</span>
        </div>
        <div className="access-list">
          {TEMPLATES.map(t => (
            <div key={t.key} className={'access-item' + (isEx('template', t.key) ? ' exclusive' : '')}>
              <div className="access-item-body">
                <div className="access-item-name">
                  {t.name}
                  {isEx('template', t.key) && <span className="access-badge">EXCLUSIVE</span>}
                </div>
                <div className="access-item-desc">{t.description}</div>
              </div>
              <ToggleSwitch
                checked={isEx('template', t.key)}
                onChange={() => onToggle('template', t.key, isEx('template', t.key))}
                disabled={isSaving('template', t.key)}
                labels={['Public', 'Exclusive']}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="access-section">
        <div className="access-section-head">
          <h4>Style variants</h4>
          <span className="pill">{styleCount} of {STYLE_VARIANTS.length} exclusive</span>
        </div>
        <div className="access-list">
          {STYLE_VARIANTS.map(s => (
            <div key={s.key} className={'access-item' + (isEx('style', s.key) ? ' exclusive' : '')}>
              <div className="access-item-body">
                <div className="access-item-name">
                  {s.name}
                  {s.isDefault && <span className="access-default">DEFAULT</span>}
                  {isEx('style', s.key) && <span className="access-badge">EXCLUSIVE</span>}
                </div>
                <div className="access-item-desc">{s.description}</div>
              </div>
              <ToggleSwitch
                checked={isEx('style', s.key)}
                onChange={() => onToggle('style', s.key, isEx('style', s.key))}
                disabled={isSaving('style', s.key) || s.isDefault}
                title={s.isDefault ? 'The default style is always available to everyone.' : ''}
                labels={['Public', 'Exclusive']}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   Grants — assign exclusive items to specific users
   ============================================================ */
function GrantsTab({ visibility, grants, users, onReload }) {
  const [pickUser, setPickUser]         = useState('')
  const [pickScope, setPickScope]       = useState('template')
  const [pickIdent, setPickIdent]       = useState('')
  const [pickNote, setPickNote]         = useState('')
  const [saving, setSaving]             = useState(false)

  const exclusiveItems = useMemo(() => {
    const list = []
    for (const t of TEMPLATES)       if (visibility[`template:${t.key}`]) list.push({ scope: 'template', identifier: t.key, name: t.name })
    for (const s of STYLE_VARIANTS)  if (visibility[`style:${s.key}`])    list.push({ scope: 'style',    identifier: s.key, name: s.name })
    return list
  }, [visibility])

  const scopeItems = exclusiveItems.filter(i => i.scope === pickScope)

  async function grant() {
    if (!pickUser || !pickIdent) return
    setSaving(true)
    await supabase.rpc('sysadmin_grant_template', {
      p_user_id: pickUser,
      p_scope: pickScope,
      p_identifier: pickIdent,
      p_note: pickNote.trim() || null,
    })
    setPickUser(''); setPickIdent(''); setPickNote('')
    setSaving(false)
    onReload()
  }

  async function revoke(g) {
    if (!confirm(`Revoke ${g.scope} "${g.identifier}" from ${g.user_email}?`)) return
    await supabase.rpc('sysadmin_revoke_template', {
      p_user_id: g.user_id, p_scope: g.scope, p_identifier: g.identifier,
    })
    onReload()
  }

  const nameOf = (scope, ident) => {
    const src = scope === 'template' ? TEMPLATES : STYLE_VARIANTS
    return src.find(x => x.key === ident)?.name || ident
  }

  return (
    <div className="panel">
      {exclusiveItems.length === 0 && (
        <div className="access-note">
          No items are currently marked exclusive. Head to the Exclusivity tab and toggle at least one template or style before you can grant access.
        </div>
      )}

      {exclusiveItems.length > 0 && (
        <div className="access-grant-form">
          <h4>Grant access</h4>
          <div className="access-grant-grid">
            <div className="field">
              <label>User</label>
              <select value={pickUser} onChange={e => setPickUser(e.target.value)}>
                <option value="">Choose a user…</option>
                {users.map(u => <option key={u.user_id} value={u.user_id}>{u.email}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Scope</label>
              <select value={pickScope} onChange={e => { setPickScope(e.target.value); setPickIdent('') }}>
                <option value="template">Template</option>
                <option value="style">Style variant</option>
              </select>
            </div>
            <div className="field">
              <label>Item</label>
              <select value={pickIdent} onChange={e => setPickIdent(e.target.value)}>
                <option value="">Choose…</option>
                {scopeItems.map(i => <option key={i.identifier} value={i.identifier}>{i.name}</option>)}
              </select>
            </div>
            <div className="field" style={{gridColumn:'1 / -1'}}>
              <label>Note (optional)</label>
              <input value={pickNote} onChange={e => setPickNote(e.target.value)} placeholder="e.g. VIP partner · 2026-Q3 promo"/>
            </div>
          </div>
          <button className="primary" onClick={grant} disabled={!pickUser || !pickIdent || saving}>
            {saving ? 'Granting…' : 'Grant access'}
          </button>
        </div>
      )}

      <div className="access-section">
        <div className="access-section-head">
          <h4>Current grants</h4>
          <span className="pill">{grants.length}</span>
        </div>
        {grants.length === 0 && <p className="empty">No grants yet.</p>}
        {grants.length > 0 && (
          <table className="access-grants-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Scope</th>
                <th>Item</th>
                <th>Granted</th>
                <th>Note</th>
                <th style={{width:80}}></th>
              </tr>
            </thead>
            <tbody>
              {grants.map(g => (
                <tr key={g.grant_id}>
                  <td>{g.user_email}</td>
                  <td><span className="scope-pill">{g.scope}</span></td>
                  <td>{nameOf(g.scope, g.identifier)}</td>
                  <td className="muted">{new Date(g.granted_at).toLocaleDateString()}</td>
                  <td className="muted">{g.note || <span style={{opacity:0.5}}>—</span>}</td>
                  <td><button className="ghost small" onClick={() => revoke(g)}>Revoke</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

/* ============================================================
   Small reusable toggle switch
   ============================================================ */
function ToggleSwitch({ checked, onChange, disabled, labels = ['Off', 'On'], title }) {
  return (
    <label className={'access-toggle' + (checked ? ' on' : '') + (disabled ? ' disabled' : '')} title={title || ''}>
      <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled}/>
      <span className="access-toggle-track">
        <span className="access-toggle-thumb"/>
      </span>
      <span className="access-toggle-label">{checked ? labels[1] : labels[0]}</span>
    </label>
  )
}
