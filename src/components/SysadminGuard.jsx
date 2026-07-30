import { Navigate } from 'react-router-dom'
import { useAuth } from '../lib/auth.jsx'

export default function SysadminGuard({ children }) {
  const { profile, loading, isSysadmin } = useAuth() || {}

  if (loading) {
    return <div className="auth-loading"><div className="auth-loading-spinner"/></div>
  }

  // profile might still be null on first render right after login
  if (profile && !isSysadmin) {
    return <Navigate to="/app" replace/>
  }

  if (!isSysadmin) {
    return <div className="auth-loading"><div className="auth-loading-spinner"/></div>
  }

  return children
}
