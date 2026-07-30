import { useEffect, useState } from 'react'
import { getPlatformSettings, updatePlatformSettings } from '../../lib/sysadmin-api.js'

export default function Platform() {
  const [settings, setSettings] = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [flash,    setFlash]    = useState(null)

  useEffect(() => {
    ;(async () => {
      const { data } = await getPlatformSettings()
      setSettings(data)
      setLoading(false)
    })()
  }, [])

  function ok(msg)  { setFlash({ type:'ok',  msg }); setTimeout(() => setFlash(null), 2200) }
  function err(msg) { setFlash({ type:'err', msg }); setTimeout(() => setFlash(null), 4000) }

  async function save(patch, successMsg) {
    const { data, error } = await updatePlatformSettings(patch)
    if (error) { err(error.message); return }
    setSettings(data)
    ok(successMsg || 'Saved.')
  }

  if (loading) return <div className="panel"><p className="empty">Loading platform settings…</p></div>
  if (!settings) return <div className="panel"><p className="empty">Could not load settings.</p></div>

  return (
    <div className="panel">
      <div className="panel-head">
        <div>
          <h3>Platform Settings</h3>
          <p className="sub">Platform-wide toggles that affect every user immediately.</p>
        </div>
      </div>

      {flash && <div className={`flash flash-${flash.type}`} style={{marginBottom:14}}>{flash.msg}</div>}

      {/* ============ Signup rules ============ */}
      <div className="admin-section">
        <h4>Signup Rules</h4>
        <p className="hint" style={{marginTop:0}}>Control whether new people can create accounts.</p>
        <ToggleRow
          label="Signups open"
          desc="When off, the Signup page redirects to a friendly 'signups closed' notice."
          checked={settings.signups_enabled}
          onChange={(v) => save({ signups_enabled: v }, v ? 'Signups now open.' : 'Signups closed.')}
        />
        <ToggleRow
          label="Free trial enabled"
          desc="When off, the Signup page only allows paid signup (checkout flow). Currently reserved — enforced in Delta 4."
          checked={settings.trial_enabled}
          onChange={(v) => save({ trial_enabled: v }, v ? 'Trial enabled.' : 'Trial disabled.')}
          disabled
        />
      </div>

      {/* ============ Maintenance mode ============ */}
      <div className="admin-section">
        <h4>Maintenance Mode</h4>
        <p className="hint" style={{marginTop:0}}>
          When on, regular users see the maintenance page instead of the app. Sysadmins bypass it and see a red strip at the top.
        </p>
        <ToggleRow
          label="Maintenance mode active"
          desc="Blocks all non-sysadmin traffic to the app immediately."
          checked={settings.maintenance_mode}
          onChange={(v) => save({ maintenance_mode: v }, v ? 'Maintenance mode ON. Users are now blocked.' : 'Maintenance mode OFF. Users have access again.')}
        />
        <EditableTextField
          label="Message shown to users"
          value={settings.maintenance_message}
          rows={2}
          onSave={(v) => save({ maintenance_message: v }, 'Message updated.')}
        />
      </div>

      {/* ============ Announcement ============ */}
      <div className="admin-section">
        <h4>Platform Announcement</h4>
        <p className="hint" style={{marginTop:0}}>
          A banner shown at the top of every authenticated page. Users can dismiss it for the session.
        </p>
        <ToggleRow
          label="Announcement active"
          desc="Enable to show the banner. Users see it on their next page load."
          checked={settings.announcement_enabled}
          onChange={(v) => save({ announcement_enabled: v }, v ? 'Announcement live.' : 'Announcement hidden.')}
        />
        <EditableTextField
          label="Message"
          value={settings.announcement_message}
          rows={2}
          placeholder="Scheduled maintenance Sunday 2am — expect 30 min downtime."
          onSave={(v) => save({ announcement_message: v }, 'Message updated.')}
        />
        <SeverityPicker
          value={settings.announcement_severity}
          onChange={(v) => save({ announcement_severity: v }, 'Severity updated.')}
        />
      </div>

      {/* ============ Backups (info only) ============ */}
      <div className="admin-section">
        <h4>Backups</h4>
        <p className="hint" style={{marginTop:0}}>
          Managed by Supabase. Point-in-time recovery is available on Pro plan. Manual snapshots are always safe.
        </p>
        <div className="backup-card">
          <div>
            <strong>Manage backups</strong>
            <div style={{fontSize:12.5, color:'var(--muted)', marginTop:2}}>Dashboard → Database → Backups</div>
          </div>
          <a
            className="ghost"
            href={`https://supabase.com/dashboard/project/_/database/backups`}
            target="_blank"
            rel="noopener noreferrer"
            style={{border:'1px solid var(--line)', color:'var(--ink-soft)', padding:'8px 14px', borderRadius:6, textDecoration:'none'}}
          >
            Open Supabase Dashboard →
          </a>
        </div>
      </div>
    </div>
  )
}


// ============================================================
function ToggleRow({ label, desc, checked, onChange, disabled }) {
  return (
    <div className={'toggle-row' + (disabled ? ' toggle-row-disabled' : '')}>
      <div className="toggle-row-text">
        <div className="toggle-row-label">{label}</div>
        {desc && <div className="toggle-row-desc">{desc}</div>}
      </div>
      <label className="switch">
        <input
          type="checkbox"
          checked={!!checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="switch-slider"/>
      </label>
    </div>
  )
}

function EditableTextField({ label, value, onSave, rows = 2, placeholder = '' }) {
  const [local, setLocal] = useState(value || '')
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    setLocal(value || '')
    setDirty(false)
  }, [value])

  return (
    <div className="field" style={{marginTop:10}}>
      <span>{label}</span>
      <textarea
        rows={rows}
        value={local}
        placeholder={placeholder}
        onChange={(e) => { setLocal(e.target.value); setDirty(true) }}
      />
      {dirty && (
        <div style={{display:'flex', gap:8, marginTop:6}}>
          <button className="primary" style={{padding:'6px 14px', fontSize:12.5}} onClick={() => { onSave(local); setDirty(false) }}>
            Save
          </button>
          <button className="ghost" style={{padding:'6px 12px', fontSize:12}} onClick={() => { setLocal(value || ''); setDirty(false) }}>
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}

function SeverityPicker({ value, onChange }) {
  const opts = [
    { v: 'info',     label: '💡 Info',     desc: 'Product news, tips' },
    { v: 'warning',  label: '⚠️ Warning',   desc: 'Scheduled maintenance, degraded service' },
    { v: 'critical', label: '🚨 Critical', desc: 'Outages, urgent action required' },
  ]
  return (
    <div className="field" style={{marginTop:10}}>
      <span>Severity</span>
      <div className="severity-picker">
        {opts.map(o => (
          <button
            type="button"
            key={o.v}
            className={'severity-btn' + (value === o.v ? ' selected' : '')}
            onClick={() => onChange(o.v)}
          >
            <span className="severity-btn-label">{o.label}</span>
            <span className="severity-btn-desc">{o.desc}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
