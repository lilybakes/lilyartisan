import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth.jsx'
import { setRememberMe } from '../lib/rememberMe'

export default function Signup() {
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const [name, setName]         = useState('')
  const [business, setBusiness] = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    if (password !== confirm)   { setError('Passwords do not match.'); return }
    if (password.length < 6)    { setError('Password must be at least 6 characters.'); return }
    if (!name.trim())           { setError('Please tell us your name.'); return }

    setLoading(true)
    // 1. Create the auth user. The handle_new_user trigger will auto-create
    //    profile, settings, header_links with 14-day trial.
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { display_name: name.trim(), business_name: business.trim() },
      },
    })
    if (signUpError) {
      setLoading(false)
      setError(signUpError.message)
      return
    }

    // Trial signups default to "remember me" so they stay logged in.
    setRememberMe(true)

    // 2. Sign in (email confirmation is off, so this works immediately).
    //    Supabase may already have created the session from signUp — check first.
    if (!signUpData.session) {
      const { error: signInError } = await signIn(email.trim(), password)
      if (signInError) {
        setLoading(false)
        setError(signInError.message)
        return
      }
    }

    // 3. Personalize their settings with the name and business they provided.
    //    This runs against RLS with the new session, so it only touches their own row.
    if (signUpData.user) {
      await supabase.from('settings').update({
        owner_name:    name.trim(),
        business_name: business.trim() || 'My Bakery',
      }).eq('user_id', signUpData.user.id)
    }

    setLoading(false)
    navigate('/app', { replace: true })
  }

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <div className="auth-brand">
          <div className="brand-stamp" style={{margin:'0 auto 14px'}}>
            <img src="/assets/lily-mark-white.png" alt=""/>
          </div>
          <h1 className="auth-title">
            Start your <span className="part2">free trial</span>
          </h1>
          <p className="auth-tagline">14 days · no credit card · full access</p>
        </div>

        <form className="auth-form" onSubmit={onSubmit}>
          <div className="auth-form-row">
            <label className="field">
              <span>Your name</span>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Jane Baker"
                autoComplete="name"
                required
                autoFocus
              />
            </label>
            <label className="field">
              <span>Bakery name (optional)</span>
              <input
                type="text"
                value={business}
                onChange={e => setBusiness(e.target.value)}
                placeholder="Jane's Kitchen"
                autoComplete="organization"
              />
            </label>
          </div>

          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>

          <div className="auth-form-row">
            <label className="field">
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                autoComplete="new-password"
                required
              />
            </label>
            <label className="field">
              <span>Confirm</span>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Repeat it"
                autoComplete="new-password"
                required
              />
            </label>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button className="primary" type="submit" disabled={loading}>
            {loading ? 'Creating your account…' : 'Start 14-day Free Trial'}
          </button>
          <p className="auth-fineprint">
            By signing up you agree we can email you about your account.
            No spam.
          </p>
        </form>

        <div className="auth-links">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  )
}
