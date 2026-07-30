import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/auth.jsx'
import { setRememberMe, shouldRemember } from '../lib/rememberMe'

export default function Login() {
  const { signIn, session } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/app'

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(shouldRemember() || true)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  useEffect(() => {
    if (session) navigate(from, { replace: true })
  }, [session, navigate, from])

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    setRememberMe(remember)                  // set BEFORE signIn so storage routes correctly
    const { error } = await signIn(email.trim(), password)
    setLoading(false)
    if (error) setError(error.message)
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="brand-stamp" style={{margin:'0 auto 14px'}}>
            <img src="/assets/lily-mark-white.png" alt=""/>
          </div>
          <h1 className="auth-title">
            <span className="part1">Baker</span><span className="part2">Nomics</span>
          </h1>
          <p className="auth-tagline">Welcome back — sign in to continue</p>
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

          <div className="auth-row">
            <label className="auth-checkbox">
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
              />
              <span>Keep me signed in</span>
            </label>
            <Link to="/forgot-password" className="auth-inline-link">
              Forgot password?
            </Link>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button className="primary" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="auth-links">
          Don't have an account yet? <Link to="/signup">Start a free trial</Link>
        </div>
        <div className="auth-links" style={{marginTop:12, fontSize:12.5}}>
          <Link to="/" style={{color:'var(--muted)'}}>← Back to home</Link>
        </div>
      </div>
    </div>
  )
}
