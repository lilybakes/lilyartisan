import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth.jsx'
import Logo from '../components/Logo.jsx'

export default function ResetPassword() {
  const { updatePassword } = useAuth()
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [hasRecoverySession, setHasRecoverySession] = useState(false)

  // Supabase Auth adds a recovery token to the URL hash automatically.
  // We wait for the session to be picked up.
  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) setHasRecoverySession(true)
    }
    check()
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        setHasRecoverySession(true)
      }
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }
    setLoading(true)
    const { error } = await updatePassword(password)
    setLoading(false)
    if (error) setError(error.message)
    else {
      setSuccess(true)
      setTimeout(() => navigate('/login', { replace: true }), 2000)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div style={{display:'flex', justifyContent:'center', marginBottom:14}}>
            <Logo size={56}/>
          </div>
          <h1 className="auth-title">
            <span className="part1">Bake</span><span className="part2">Onomics</span>
          </h1>
          <p className="auth-tagline">Choose a new password</p>
        </div>

        {success ? (
          <div className="auth-form">
            <div className="auth-success">
              Password updated. Redirecting to sign in…
            </div>
          </div>
        ) : !hasRecoverySession ? (
          <div className="auth-form">
            <div className="auth-error">
              This reset link is invalid or has expired. Please request a new one.
            </div>
            <Link to="/forgot-password" className="primary" style={{textAlign:'center', display:'block', padding:'12px 18px', textDecoration:'none'}}>
              Request new link
            </Link>
          </div>
        ) : (
          <form className="auth-form" onSubmit={onSubmit}>
            <label className="field">
              <span>New password</span>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                autoComplete="new-password"
                required
                autoFocus
              />
            </label>

            <label className="field">
              <span>Confirm new password</span>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Repeat it"
                autoComplete="new-password"
                required
              />
            </label>

            {error && <div className="auth-error">{error}</div>}

            <button className="primary" type="submit" disabled={loading}>
              {loading ? 'Updating…' : 'Update password'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
