// ============================================================
// Custom auth storage adapter for "Remember me" behavior.
//
//   Checked   → session persists in localStorage (survives browser close, up to 6 months)
//   Unchecked → session persists in sessionStorage (dies on browser close)
//
// We stash the user's choice under REMEMBER_KEY in localStorage.
// The Supabase client is configured to use this adapter (see supabase.js).
// ============================================================

const REMEMBER_KEY = 'br-remember-me'

export function setRememberMe(remember) {
  try {
    if (remember) localStorage.setItem(REMEMBER_KEY, '1')
    else          localStorage.removeItem(REMEMBER_KEY)
  } catch { /* ignore */ }
}

export function shouldRemember() {
  try { return localStorage.getItem(REMEMBER_KEY) === '1' }
  catch { return false }
}

export const authStorage = {
  getItem(key) {
    try { return localStorage.getItem(key) ?? sessionStorage.getItem(key) }
    catch { return null }
  },
  setItem(key, value) {
    try {
      if (shouldRemember()) {
        localStorage.setItem(key, value)
        sessionStorage.removeItem(key)
      } else {
        sessionStorage.setItem(key, value)
        localStorage.removeItem(key)
      }
    } catch { /* ignore */ }
  },
  removeItem(key) {
    try {
      localStorage.removeItem(key)
      sessionStorage.removeItem(key)
    } catch { /* ignore */ }
  },
}
