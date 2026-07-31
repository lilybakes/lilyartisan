import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/auth.jsx'
import Logo from '../components/Logo.jsx'

export default function ForgotPassword() {
  const { sendPasswordReset } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await sendPasswordReset(email.trim())
    setLoading(false)
    if (error) setError(error.message)
    else setSent(true)
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
          <p className="auth-tagline">Reset your password</p>
        </div>

        {sent ? (
          <div className="auth-form">
            <div className="auth-success">
              If an account exists for <strong>{email}</strong>, we've sent a password reset link.
              Check your inbox (and spam folder just in case).
            </div>
            <Link to="/login" className="primary" style={{textAlign:'center', display:'block', padding:'12px 18px', textDecoration:'none'}}>
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
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

              {error && <div className="auth-error">{error}</div>}

              <button className="primary" type="submit" disabled={loading}>
                {loading ? 'Sending…' : 'Send reset link'}
              </button>
            </form>

            <div className="auth-links">
              <Link to="/login">Back to sign in</Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
