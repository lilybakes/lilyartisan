import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth.jsx'
import UserAvatar from './UserAvatar.jsx'
import './user-menu.css'

/**
 * Clickable avatar with dropdown menu.
 *
 * Renders <UserAvatar/> as the trigger. On click, shows a small popover
 * anchored to the avatar with three actions:
 *   • Personalize   → /app/personalize
 *   • Settings      → /app/settings
 *   • Log out       → signOut() + redirect to /login
 *
 * Closes on outside click, Escape key, or any item selection.
 */
export default function UserAvatarMenu({ size = 34 }) {
  const { user, isSysadmin, signOut } = useAuth() || {}
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function onDoc(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  // Close on ESC
  useEffect(() => {
    if (!open) return
    function onKey(e) { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  function go(to) {
    setOpen(false)
    navigate(to)
  }

  async function handleSignOut() {
    setOpen(false)
    await signOut?.()
    navigate('/login', { replace: true })
  }

  const email = user?.email || ''
  const roleLabel = isSysadmin ? 'System administrator' : 'Subscriber'

  return (
    <div className="user-avatar-menu" ref={rootRef}>
      <button
        type="button"
        className="user-avatar-trigger"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
      >
        <UserAvatar size={size}/>
      </button>

      {open && (
        <div className="user-menu-popover" role="menu">
          <div className="user-menu-header">
            <div className="user-menu-email" title={email}>{email}</div>
            <div className="user-menu-role">{roleLabel}</div>
          </div>

          <div className="user-menu-sep"/>

          <button className="user-menu-item" role="menuitem"
            onClick={() => go('/app/personalize')}>
            <IconUser/><span>Personalize</span>
          </button>

          <button className="user-menu-item" role="menuitem"
            onClick={() => go('/app/settings')}>
            <IconCog/><span>Settings</span>
          </button>

          <div className="user-menu-sep"/>

          <button className="user-menu-item user-menu-item-danger" role="menuitem"
            onClick={handleSignOut}>
            <IconLogout/><span>Log out</span>
          </button>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------------- */
/* Inline SVG icons — matched stroke weight, no dependency on the Icon lib   */
/* ------------------------------------------------------------------------- */

function IconUser() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  )
}

function IconCog() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  )
}

function IconLogout() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  )
}
