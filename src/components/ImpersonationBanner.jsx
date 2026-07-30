import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { loadImpersonation, loadSavedSysadminSession, clearImpersonation } from '../lib/impersonation'
import { stopImpersonation } from '../lib/sysadmin-api'

export default function ImpersonationBanner() {
  const [target, setTarget] = useState(loadImpersonation())
  const [stopping, setStopping] = useState(false)
  const [error, setError] = useState('')

  // Poll for changes to sessionStorage from other places
  useEffect(() => {
    const check = () => setTarget(loadImpersonation())
    window.addEventListener('storage', check)
    window.addEventListener('impersonation-changed', check)
    return () => {
      window.removeEventListener('storage', check)
      window.removeEventListener('impersonation-changed', check)
    }
  }, [])

  async function handleStop() {
    if (!target) return
    setStopping(true)
    setError('')
    try {
      // 1. Restore original password on the target user
      const { error: stopErr } = await stopImpersonation(target.user_id, target.session_token)
      if (stopErr) throw stopErr

      // 2. Restore sysadmin's session
      const saved = loadSavedSysadminSession()
      if (saved) {
        await supabase.auth.setSession({
          access_token:  saved.access_token,
          refresh_token: saved.refresh_token,
        })
      } else {
        // No saved session — sysadmin will need to log in again
        await supabase.auth.signOut()
      }

      // 3. Clear impersonation flag
      clearImpersonation()
      window.dispatchEvent(new CustomEvent('impersonation-changed'))

      // 4. Navigate back to users list
      window.location.href = '/app/sysadmin/users'
    } catch (e) {
      setError(e.message || String(e))
      setStopping(false)
    }
  }

  if (!target) return null

  return (
    <div className="impersonation-banner">
      <div className="impersonation-banner-inner">
        <div className="impersonation-banner-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <div className="impersonation-banner-text">
          <strong>Impersonating {target.email}</strong>
          <span className="impersonation-banner-note">Any changes are made as this user. Session auto-expires in 15 minutes.</span>
        </div>
        <button className="impersonation-banner-btn" onClick={handleStop} disabled={stopping}>
          {stopping ? 'Stopping…' : 'Stop Impersonating'}
        </button>
      </div>
      {error && <div className="impersonation-banner-error">{error}</div>}
    </div>
  )
}
