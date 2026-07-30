import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../lib/auth.jsx'
import {
  listUsers, inviteUser,
  extendSubscription,
  suspendUser, unsuspendUser,
  detachEmail, reattachEmail,
  generateTempPassword, sendPasswordResetEmail,
  deleteUser,
  startImpersonation,
} from '../../lib/sysadmin-api'
import { supabase } from '../../lib/supabase'
import { saveImpersonationStart } from '../../lib/impersonation'
import { setRememberMe } from '../../lib/rememberMe'

const STATUS_PILL = {
  active:    { label: 'Active',    cls: 'ok' },
  trial:     { label: 'Trial',     cls: 'info' },
  expired:   { label: 'Expired',   cls: 'low' },
  suspended: { label: 'Suspended', cls: 'err' },
}

const EMAIL_PILL = {
  active:    null,
  suspended: { label: 'Suspended', cls: 'err' },
  detached:  { label: 'Detached',  cls: 'low' },
}

function fmtDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString(undefined, { year:'numeric', month:'short', day:'numeric' })
}

function toDateInput(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toISOString().slice(0, 10)
}

export default function Users() {
  const [rows, setRows]         = useState([])
  const [loading, setLoading]   = useState(true)
  const [err, setErr]           = useState('')
  const [filter, setFilter]     = useState('')
  const [inviteOpen, setInviteOpen] = useState(false)
  const [modal, setModal]       = useState(null)   // { kind, user }
  const [flash, setFlash]       = useState(null)

  async function refresh() {
    setLoading(true)
    const { data, error } = await listUsers()
    if (error) setErr(error.message)
    else       setRows(data || [])
    setLoading(false)
  }

  useEffect(() => { refresh() }, [])

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(r =>
      (r.email || '').toLowerCase().includes(q) ||
      (r.role || '').toLowerCase().includes(q) ||
      (r.plan_type || '').toLowerCase().includes(q)
    )
  }, [rows, filter])

  return (
    <>
      <div className="panel">
        <div className="panel-head">
          <div>
            <h3>User Management</h3>
            <p className="sub">Every subscriber, trial, and admin on the platform.</p>
          </div>
          <button className="primary" onClick={() => setInviteOpen(true)}>+ Invite user</button>
        </div>

        <div style={{marginBottom:16, display:'flex', gap:10, flexWrap:'wrap'}}>
          <input
            placeholder="Filter by email, role, plan…"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            style={{maxWidth:340}}
          />
          <button className="ghost" onClick={refresh} style={{border:'1px solid var(--line)', color:'var(--ink-soft)'}}>Refresh</button>
        </div>

        {flash && <div className={`flash flash-${flash.type}`}>{flash.msg}</div>}

        <table className="responsive-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Plan</th>
              <th>Status</th>
              <th>Subscription</th>
              <th>Signed up</th>
              <th>Last login</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan="8" className="empty">Loading…</td></tr>}
            {err && !loading && <tr><td colSpan="8" className="empty">{err}</td></tr>}
            {!loading && !err && filtered.length === 0 && <tr><td colSpan="8" className="empty">No users match your filter.</td></tr>}
            {filtered.map(u => (
              <UserRow key={u.user_id} u={u} onAction={(kind) => setModal({ kind, user: u })}/>
            ))}
          </tbody>
        </table>
      </div>

      {inviteOpen && (
        <InviteModal
          onClose={() => setInviteOpen(false)}
          onDone={(msg) => { setInviteOpen(false); setFlash({type:'ok', msg}); refresh() }}
        />
      )}

      {modal?.kind === 'extend' && (
        <ExtendModal user={modal.user}
          onClose={() => setModal(null)}
          onDone={(msg) => { setModal(null); setFlash({type:'ok', msg}); refresh() }}
        />
      )}
      {modal?.kind === 'reset' && (
        <ResetPasswordModal user={modal.user}
          onClose={() => setModal(null)}
          onDone={(msg) => { setModal(null); setFlash({type:'ok', msg}) }}
        />
      )}
      {modal?.kind === 'temp' && (
        <TempPasswordModal user={modal.user}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.kind === 'suspend' && (
        <SuspendModal user={modal.user}
          onClose={() => setModal(null)}
          onDone={(msg) => { setModal(null); setFlash({type:'ok', msg}); refresh() }}
        />
      )}
      {modal?.kind === 'detach' && (
        <DetachModal user={modal.user}
          onClose={() => setModal(null)}
          onDone={(msg) => { setModal(null); setFlash({type:'ok', msg}); refresh() }}
        />
      )}
      {modal?.kind === 'reattach' && (
        <ReattachModal user={modal.user}
          onClose={() => setModal(null)}
          onDone={(msg) => { setModal(null); setFlash({type:'ok', msg}); refresh() }}
        />
      )}
      {modal?.kind === 'delete' && (
        <DeleteModal user={modal.user}
          onClose={() => setModal(null)}
          onDone={(msg) => { setModal(null); setFlash({type:'ok', msg}); refresh() }}
        />
      )}
      {modal?.kind === 'impersonate' && (
        <ImpersonateModal user={modal.user}
          onClose={() => setModal(null)}
        />
      )}
    </>
  )
}


// ============================================================
// User row (with actions dropdown)
// ============================================================
function UserRow({ u, onAction }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const stat = STATUS_PILL[u.subscription_status] || { label: u.subscription_status || '?', cls: 'info' }
  const emailPill = EMAIL_PILL[u.email_status]
  const isSelf = u.email === (JSON.parse(sessionStorage.getItem('br-sysadmin-session') || 'null')?.user?.email)

  useEffect(() => {
    if (!menuOpen) return
    const close = () => setMenuOpen(false)
    setTimeout(() => document.addEventListener('click', close, { once: true }), 0)
    return () => document.removeEventListener('click', close)
  }, [menuOpen])

  const isSysadmin  = u.role === 'sysadmin'
  const isDetached  = u.email_status === 'detached'
  const isSuspended = u.email_status === 'suspended'

  return (
    <tr>
      <td>
        <div className="row-name">
          <div className={'user-avatar' + (isSysadmin ? ' user-avatar-admin' : '')}>
            {(u.email || 'U').substring(0, 1).toUpperCase()}
          </div>
          <div>
            <strong style={{display:'block'}}>{u.email || <em style={{color:'var(--muted)'}}>{'<detached>'}</em>}</strong>
            {emailPill && <span className={`pill ${emailPill.cls}`} style={{marginTop:3, display:'inline-block'}}>{emailPill.label}</span>}
          </div>
        </div>
      </td>
      <td data-label="Role"><span className={`pill ${isSysadmin ? 'bridge' : 'info'}`}>{isSysadmin ? 'Sysadmin' : 'User'}</span></td>
      <td data-label="Plan">{u.plan_type || '—'}</td>
      <td data-label="Status"><span className={`pill ${stat.cls}`}>{stat.label}</span></td>
      <td data-label="Subscription">
        {u.subscription_start ? (
          <div style={{fontSize:12.5}}>
            {fmtDate(u.subscription_start)} <span style={{color:'var(--muted)'}}>→</span> {fmtDate(u.subscription_end)}
          </div>
        ) : '—'}
      </td>
      <td data-label="Signed up">{fmtDate(u.original_signup_date || u.created_at)}</td>
      <td data-label="Last login">{u.last_sign_in_at ? fmtDate(u.last_sign_in_at) : <span style={{color:'var(--muted)'}}>Never</span>}</td>
      <td>
        <div style={{position:'relative'}}>
          <button className="edit" onClick={(e) => { e.stopPropagation(); setMenuOpen(v => !v) }}>Actions ▾</button>
          {menuOpen && (
            <div className="actions-menu" onClick={e => e.stopPropagation()}>
              <button onClick={() => { setMenuOpen(false); onAction('extend') }}>Extend / change dates</button>
              <button onClick={() => { setMenuOpen(false); onAction('reset') }}>Send password reset email</button>
              <button onClick={() => { setMenuOpen(false); onAction('temp') }}>Generate temp password</button>
              {!isDetached && !isSysadmin && (
                <button onClick={() => { setMenuOpen(false); onAction('impersonate') }}>Impersonate</button>
              )}
              <div className="actions-menu-divider"/>
              {!isSuspended ? (
                <button onClick={() => { setMenuOpen(false); onAction('suspend') }}>Suspend</button>
              ) : (
                <button onClick={async () => {
                  setMenuOpen(false)
                  const { error } = await unsuspendUser(u.user_id)
                  if (error) alert(error.message)
                  else window.location.reload()
                }}>Reactivate</button>
              )}
              {!isDetached ? (
                <button onClick={() => { setMenuOpen(false); onAction('detach') }}>Detach email</button>
              ) : (
                <button onClick={() => { setMenuOpen(false); onAction('reattach') }}>Reattach email</button>
              )}
              <div className="actions-menu-divider"/>
              <button className="danger" onClick={() => { setMenuOpen(false); onAction('delete') }}>Delete permanently</button>
            </div>
          )}
        </div>
      </td>
    </tr>
  )
}


// ============================================================
// Modals
// ============================================================
function ModalFrame({ title, children, onClose, wide = false }) {
  useEffect(() => {
    const onEsc = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [onClose])
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className={'modal-card' + (wide ? ' modal-card-wide' : '')} onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  )
}

// ---------- Invite ----------
function InviteModal({ onClose, onDone }) {
  const [email, setEmail] = useState('')
  const [start, setStart] = useState(toDateInput(new Date().toISOString()))
  const [end,   setEnd]   = useState(toDateInput(new Date(Date.now() + 365*24*60*60*1000).toISOString()))
  const [plan,  setPlan]  = useState('yearly')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const [result, setResult] = useState(null)   // { email, temp_password }

  async function submit(e) {
    e.preventDefault()
    setErr(''); setLoading(true)
    const { data, error } = await inviteUser(
      email.trim(),
      new Date(start).toISOString(),
      new Date(end).toISOString(),
      plan,
    )
    setLoading(false)
    if (error) { setErr(error.message); return }
    setResult(data?.[0])
  }

  async function sendResetEmail() {
    if (!result?.email) return
    const { error } = await supabase.auth.resetPasswordForEmail(result.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) alert(error.message)
    else onDone(`Invite sent — password reset email dispatched to ${result.email}.`)
  }

  return (
    <ModalFrame title="Invite a new user" onClose={onClose}>
      {!result ? (
        <form onSubmit={submit} className="admin-form">
          <label className="field"><span>Email</span>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus/>
          </label>
          <div className="admin-form-row">
            <label className="field"><span>Subscription starts</span>
              <input type="date" value={start} onChange={e => setStart(e.target.value)} required/>
            </label>
            <label className="field"><span>Subscription ends</span>
              <input type="date" value={end} onChange={e => setEnd(e.target.value)} required/>
            </label>
          </div>
          <label className="field"><span>Plan</span>
            <select value={plan} onChange={e => setPlan(e.target.value)}>
              <option value="yearly">Yearly</option>
              <option value="trial">Trial</option>
            </select>
          </label>
          {err && <div className="auth-error">{err}</div>}
          <button type="submit" className="primary" disabled={loading}>{loading ? 'Creating…' : 'Create user'}</button>
          <p className="hint">The user will need to set their password via the reset email you send next.</p>
        </form>
      ) : (
        <div className="admin-form">
          <div className="auth-success">
            <strong>User created.</strong> Send them a password reset email so they can set their own password.
          </div>
          <div className="credential-box">
            <div><label>Email</label><code>{result.email}</code></div>
            <div><label>Temporary password (fallback if reset email fails)</label><code>{result.temp_password}</code></div>
          </div>
          <button type="button" className="primary" onClick={sendResetEmail}>Send password reset email</button>
          <button type="button" className="ghost" onClick={() => onDone('User invited. No email sent — share credentials manually.')} style={{border:'1px solid var(--line)', color:'var(--ink-soft)'}}>Skip — I'll share credentials manually</button>
        </div>
      )}
    </ModalFrame>
  )
}

// ---------- Extend ----------
function ExtendModal({ user, onClose, onDone }) {
  const [start, setStart] = useState(toDateInput(user.subscription_start))
  const [end,   setEnd]   = useState(toDateInput(user.subscription_end))
  const [plan,  setPlan]  = useState(user.plan_type || 'yearly')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  async function submit(e) {
    e.preventDefault()
    setErr(''); setLoading(true)
    const { error } = await extendSubscription(user.user_id, new Date(start).toISOString(), new Date(end).toISOString(), plan)
    setLoading(false)
    if (error) setErr(error.message)
    else       onDone(`Subscription updated for ${user.email}.`)
  }
  return (
    <ModalFrame title={`Subscription dates — ${user.email}`} onClose={onClose}>
      <form onSubmit={submit} className="admin-form">
        <div className="admin-form-row">
          <label className="field"><span>Starts</span>
            <input type="date" value={start} onChange={e => setStart(e.target.value)} required/>
          </label>
          <label className="field"><span>Ends</span>
            <input type="date" value={end} onChange={e => setEnd(e.target.value)} required/>
          </label>
        </div>
        <label className="field"><span>Plan</span>
          <select value={plan} onChange={e => setPlan(e.target.value)}>
            <option value="yearly">Yearly</option>
            <option value="trial">Trial</option>
            <option value="admin">Admin (no expiry)</option>
          </select>
        </label>
        {err && <div className="auth-error">{err}</div>}
        <button type="submit" className="primary" disabled={loading}>{loading ? 'Saving…' : 'Save'}</button>
      </form>
    </ModalFrame>
  )
}

// ---------- Reset password ----------
function ResetPasswordModal({ user, onClose, onDone }) {
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  async function send() {
    setErr(''); setLoading(true)
    const { error } = await sendPasswordResetEmail(user.user_id)
    setLoading(false)
    if (error) setErr(error.message)
    else       onDone(`Password reset email sent to ${user.email}.`)
  }
  return (
    <ModalFrame title="Send password reset email" onClose={onClose}>
      <div className="admin-form">
        <p>Supabase will send a password reset link to <strong>{user.email}</strong>. They click it and set a new password themselves.</p>
        {err && <div className="auth-error">{err}</div>}
        <button className="primary" onClick={send} disabled={loading}>{loading ? 'Sending…' : 'Send reset email'}</button>
      </div>
    </ModalFrame>
  )
}

// ---------- Temp password ----------
function TempPasswordModal({ user, onClose }) {
  const [creds, setCreds] = useState(null)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  async function generate() {
    setErr(''); setLoading(true)
    const { data, error } = await generateTempPassword(user.user_id)
    setLoading(false)
    if (error) { setErr(error.message); return }
    setCreds(data?.[0])
  }
  return (
    <ModalFrame title="Generate temporary password" onClose={onClose}>
      <div className="admin-form">
        <p>Overwrites the user's current password with a random one. Share it with them out-of-band. The reset email path is more secure — use that when possible.</p>
        {err && <div className="auth-error">{err}</div>}
        {!creds ? (
          <button className="primary" onClick={generate} disabled={loading}>{loading ? 'Generating…' : 'Generate temp password'}</button>
        ) : (
          <div className="credential-box">
            <div><label>Email</label><code>{creds.email}</code></div>
            <div><label>Temporary password</label><code>{creds.temp_password}</code></div>
          </div>
        )}
      </div>
    </ModalFrame>
  )
}

// ---------- Suspend ----------
function SuspendModal({ user, onClose, onDone }) {
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  async function submit(e) {
    e.preventDefault()
    setErr(''); setLoading(true)
    const { error } = await suspendUser(user.user_id, reason.trim() || null)
    setLoading(false)
    if (error) setErr(error.message)
    else       onDone(`${user.email} suspended. They cannot log in.`)
  }
  return (
    <ModalFrame title={`Suspend ${user.email}`} onClose={onClose}>
      <form onSubmit={submit} className="admin-form">
        <p>Reversible. Their data stays, login is blocked. Use for temporary freezes (billing disputes, misuse investigation).</p>
        <label className="field"><span>Reason (optional, internal only)</span>
          <input value={reason} onChange={e => setReason(e.target.value)} placeholder="Billing dispute pending review"/>
        </label>
        {err && <div className="auth-error">{err}</div>}
        <button type="submit" className="primary" disabled={loading}>{loading ? 'Suspending…' : 'Suspend user'}</button>
      </form>
    </ModalFrame>
  )
}

// ---------- Detach ----------
function DetachModal({ user, onClose, onDone }) {
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  async function submit() {
    setErr(''); setLoading(true)
    const { error } = await detachEmail(user.user_id)
    setLoading(false)
    if (error) setErr(error.message)
    else       onDone(`Email detached from ${user.email}. All data preserved. Reattach any time.`)
  }
  return (
    <ModalFrame title={`Detach email — ${user.email}`} onClose={onClose}>
      <div className="admin-form">
        <p>Clears the email + password on this account. Login becomes impossible until reattached.
        All data stays linked to the underlying user ID and returns when reattached.</p>
        <p>Use for expired-but-recoverable customers who may come back.</p>
        {err && <div className="auth-error">{err}</div>}
        <button className="primary" onClick={submit} disabled={loading}>{loading ? 'Detaching…' : 'Detach email'}</button>
      </div>
    </ModalFrame>
  )
}

// ---------- Reattach ----------
function ReattachModal({ user, onClose, onDone }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  async function submit(e) {
    e.preventDefault()
    setErr(''); setLoading(true)
    const { error } = await reattachEmail(user.user_id, email.trim())
    if (error) { setErr(error.message); setLoading(false); return }
    // Send reset email so they can set a new password
    const { error: rErr } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setLoading(false)
    if (rErr) setErr(`Reattached, but reset email failed: ${rErr.message}`)
    else       onDone(`Reattached. Password reset email sent to ${email.trim()}.`)
  }
  return (
    <ModalFrame title="Reattach email" onClose={onClose}>
      <form onSubmit={submit} className="admin-form">
        <p>Assign an email to this account so the user can log in again. They'll receive a password reset link.</p>
        <label className="field"><span>New email</span>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus/>
        </label>
        {err && <div className="auth-error">{err}</div>}
        <button type="submit" className="primary" disabled={loading}>{loading ? 'Reattaching…' : 'Reattach & send reset'}</button>
      </form>
    </ModalFrame>
  )
}

// ---------- Delete (destructive) ----------
function DeleteModal({ user, onClose, onDone }) {
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const match = confirm.trim().toLowerCase() === (user.email || '').toLowerCase()
  async function submit(e) {
    e.preventDefault()
    if (!match) return
    setErr(''); setLoading(true)
    const { error } = await deleteUser(user.user_id, confirm.trim())
    setLoading(false)
    if (error) setErr(error.message)
    else       onDone(`${user.email} permanently deleted.`)
  }
  return (
    <ModalFrame title="Delete account permanently" onClose={onClose}>
      <form onSubmit={submit} className="admin-form">
        <div className="danger-box">
          <strong>This is irreversible.</strong>
          <p>All of {user.email}'s data — recipes, ingredients, BOMs, settings, uploads — will be deleted.
          If you want to keep the data but revoke access, use <strong>Detach email</strong> instead.</p>
        </div>
        <label className="field"><span>Type <code>{user.email}</code> to confirm</span>
          <input value={confirm} onChange={e => setConfirm(e.target.value)} placeholder={user.email} autoFocus/>
        </label>
        {err && <div className="auth-error">{err}</div>}
        <button type="submit" className="primary danger" disabled={!match || loading}>
          {loading ? 'Deleting…' : 'Delete permanently'}
        </button>
      </form>
    </ModalFrame>
  )
}

// ---------- Impersonate ----------
function ImpersonateModal({ user, onClose }) {
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  async function start() {
    setErr(''); setLoading(true)
    // 1. Save current sysadmin session (we'll restore it after)
    const { data: sessData } = await supabase.auth.getSession()
    if (!sessData.session) { setErr('No active session to preserve.'); setLoading(false); return }

    // 2. Start impersonation server-side (returns temp password + token)
    const { data, error } = await startImpersonation(user.user_id)
    if (error) { setErr(error.message); setLoading(false); return }
    const { email, temp_password, session_token } = data?.[0] || {}
    if (!email || !temp_password || !session_token) {
      setErr('Malformed response from server.'); setLoading(false); return
    }

    // 3. Save sysadmin's session + impersonation info before we sign in as target
    saveImpersonationStart(sessData.session, { user_id: user.user_id, email, session_token })
    // Ensure the impersonated session lives only for this browser session
    setRememberMe(false)

    // 4. Sign out sysadmin, sign in as target
    await supabase.auth.signOut()
    const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password: temp_password })
    if (signInErr) {
      setErr(`Sign-in as target failed: ${signInErr.message}. Original session preserved — refresh to restore.`)
      setLoading(false)
      return
    }

    // 5. Redirect to /app — banner will appear because impersonation flag is in sessionStorage
    window.location.href = '/app'
  }
  return (
    <ModalFrame title={`Impersonate ${user.email}`} onClose={onClose}>
      <div className="admin-form">
        <p>You'll be signed in <strong>as this user</strong>. Every action you take is logged to the audit trail and attributed to them.</p>
        <p>Session auto-expires in <strong>15 minutes</strong>. Click <strong>Stop Impersonating</strong> in the red banner to end early. If you forget, the user can always reset via <code>Forgot password</code>.</p>
        {err && <div className="auth-error">{err}</div>}
        <button className="primary" onClick={start} disabled={loading}>
          {loading ? 'Starting…' : `Impersonate ${user.email}`}
        </button>
      </div>
    </ModalFrame>
  )
}
