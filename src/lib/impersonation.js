// Impersonation state — sessionStorage-backed.
// We store:
//   - impersonating: { user_id, email, session_token }
//   - sysadmin_session: the raw Supabase session object we'll restore

const KEY_IMPERSONATING     = 'br-impersonating'
const KEY_SYSADMIN_SESSION  = 'br-sysadmin-session'

export function saveImpersonationStart(sysadminSession, target) {
  try {
    sessionStorage.setItem(KEY_SYSADMIN_SESSION, JSON.stringify(sysadminSession))
    sessionStorage.setItem(KEY_IMPERSONATING,    JSON.stringify(target))
  } catch { /* ignore */ }
}

export function loadImpersonation() {
  try {
    const raw = sessionStorage.getItem(KEY_IMPERSONATING)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function loadSavedSysadminSession() {
  try {
    const raw = sessionStorage.getItem(KEY_SYSADMIN_SESSION)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function clearImpersonation() {
  try {
    sessionStorage.removeItem(KEY_IMPERSONATING)
    sessionStorage.removeItem(KEY_SYSADMIN_SESSION)
  } catch { /* ignore */ }
}
