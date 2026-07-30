import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase.js'

// Human-readable action labels
const ACTION_LABELS = {
  invite_user:              'Invited user',
  extend_subscription:      'Changed subscription',
  suspend:                  'Suspended user',
  unsuspend:                'Reactivated user',
  detach_email:             'Detached email',
  reattach_email:           'Reattached email',
  generate_temp_password:   'Generated temp password',
  trigger_password_reset:   'Sent password reset',
  delete_user:              'Deleted user',
  impersonate_start:        'Started impersonation',
  impersonate_stop:         'Stopped impersonation',
}

const ACTION_TONE = {
  invite_user:            'info',
  extend_subscription:    'info',
  suspend:                'warning',
  unsuspend:              'ok',
  detach_email:           'warning',
  reattach_email:         'info',
  generate_temp_password: 'info',
  trigger_password_reset: 'info',
  delete_user:            'danger',
  impersonate_start:      'warning',
  impersonate_stop:       'ok',
}

function relTime(iso) {
  if (!iso) return '—'
  const then = new Date(iso).getTime()
  const now = Date.now()
  const sec = Math.floor((now - then) / 1000)
  if (sec < 60)       return `${sec}s ago`
  if (sec < 3600)     return `${Math.floor(sec / 60)}m ago`
  if (sec < 86400)    return `${Math.floor(sec / 3600)}h ago`
  if (sec < 86400*7)  return `${Math.floor(sec / 86400)}d ago`
  return new Date(iso).toLocaleDateString()
}

function fmtFullTime(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleString()
}


export default function AuditLog() {
  const [rows, setRows]           = useState([])
  const [actions, setActions]     = useState([])   // for filter dropdown
  const [loading, setLoading]     = useState(true)
  const [err, setErr]             = useState('')
  const [expanded, setExpanded]   = useState({})   // { id: true } for expanded details

  const [filterAction, setFilterAction] = useState('')
  const [search, setSearch]             = useState('')
  const [limit, setLimit]               = useState(100)

  async function reload() {
    setLoading(true)
    setErr('')
    const { data, error } = await supabase.rpc('sysadmin_list_audit_log', {
      p_action:        filterAction || null,
      p_target_search: search.trim() || null,
      p_limit:         limit,
    })
    if (error) setErr(error.message)
    else setRows(data || [])
    setLoading(false)
  }

  async function loadActions() {
    const { data } = await supabase.rpc('sysadmin_list_audit_actions')
    setActions(data || [])
  }

  useEffect(() => { loadActions() }, [])
  useEffect(() => { reload() }, [filterAction, limit])

  function toggle(id) {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="panel">
      <div className="panel-head">
        <div>
          <h3>Audit Log</h3>
          <p className="sub">Every sysadmin action, timestamped. Read-only.</p>
        </div>
      </div>

      <div className="audit-filters">
        <select value={filterAction} onChange={e => setFilterAction(e.target.value)} style={{maxWidth:260}}>
          <option value="">All actions ({rows.length > 0 ? '—' : ''})</option>
          {actions.map(a => (
            <option key={a.action} value={a.action}>
              {ACTION_LABELS[a.action] || a.action} ({a.count})
            </option>
          ))}
        </select>
        <input
          placeholder="Search actor or target email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') reload() }}
          style={{maxWidth:280}}
        />
        <button className="ghost" onClick={reload} style={{border:'1px solid var(--line)', color:'var(--ink-soft)'}}>Search</button>
        <select value={limit} onChange={e => setLimit(parseInt(e.target.value))} style={{maxWidth:110}}>
          <option value="50">50 rows</option>
          <option value="100">100 rows</option>
          <option value="250">250 rows</option>
          <option value="500">500 rows</option>
        </select>
      </div>

      {err && <div className="flash flash-err" style={{marginBottom:14}}>{err}</div>}

      <table className="responsive-table audit-table">
        <thead>
          <tr>
            <th>When</th>
            <th>Actor</th>
            <th>Action</th>
            <th>Target</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {loading && <tr><td colSpan="5" className="empty">Loading…</td></tr>}
          {!loading && rows.length === 0 && (
            <tr><td colSpan="5" className="empty">
              {filterAction || search ? 'No matching audit events.' : 'No audit events yet.'}
            </td></tr>
          )}
          {!loading && rows.map(row => {
            const label = ACTION_LABELS[row.action] || row.action
            const tone  = ACTION_TONE[row.action]    || 'info'
            const isExpanded = !!expanded[row.id]
            const hasDetails = row.details && Object.keys(row.details).length > 0
            return (
              <>
                <tr key={row.id}>
                  <td data-label="When" title={fmtFullTime(row.created_at)} style={{whiteSpace:'nowrap'}}>{relTime(row.created_at)}</td>
                  <td data-label="Actor" style={{fontSize:13}}>
                    {row.actor_email || <span style={{color:'var(--muted)'}}>—</span>}
                  </td>
                  <td data-label="Action">
                    <span className={`pill audit-pill-${tone}`}>{label}</span>
                  </td>
                  <td data-label="Target" style={{fontSize:13}}>
                    {row.target_email || <span style={{color:'var(--muted)'}}>—</span>}
                  </td>
                  <td>
                    {hasDetails ? (
                      <button className="edit" onClick={() => toggle(row.id)}>
                        {isExpanded ? 'Hide' : 'Details'}
                      </button>
                    ) : null}
                  </td>
                </tr>
                {isExpanded && hasDetails && (
                  <tr className="audit-details-row" key={row.id + '-details'}>
                    <td colSpan="5">
                      <pre className="audit-details">{JSON.stringify(row.details, null, 2)}</pre>
                    </td>
                  </tr>
                )}
              </>
            )
          })}
        </tbody>
      </table>

      {!loading && rows.length >= limit && (
        <p className="hint" style={{textAlign:'center', marginTop:14}}>
          Showing the most recent {limit} rows. Raise the limit above or narrow with a filter to see more.
        </p>
      )}
    </div>
  )
}
