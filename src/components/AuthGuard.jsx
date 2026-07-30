import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/auth.jsx'

export default function AuthGuard({ children }) {
  const { session, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="auth-loading">
        <div className="auth-loading-spinner"/>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace/>
  }

  return children
}
