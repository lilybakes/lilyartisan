import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/auth.jsx'

export default function Login() {
  const { signIn, session } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session) navigate(from, { replace: true })
  }, [session, navigate, from])

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(email.trim(), password)
    setLoading(false)
    if (error) setError(error.message)
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="brand-stamp" style={{margin:'0 auto 14px'}}>
            <img src="/assets/lily-mark-white.png" alt="" />
          </div>
          <h1 className="auth-title">
            <span className="part1">Baker</span><span className="part2">Nomics</span>
          </h1>
          <p className="auth-tagline">Sign in to continue</p>
        </div>

        <form className="auth-form" onSubmit={onSubmit}>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
              autoFocus
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </label>

          {error && <div className="auth-error">{error}</div>}

          <button className="primary" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/forgot-password">Forgot your password?</Link>
        </div>
      </div>
    </div>
  )
}
