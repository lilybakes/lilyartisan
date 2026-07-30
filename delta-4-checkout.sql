import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createOrder } from '../lib/checkout-api.js'
import { supabase } from '../lib/supabase.js'
import Logo from '../components/Logo.jsx'

export default function Checkout() {
  const nav = useNavigate()
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [business, setBusiness] = useState('')
  const [address,  setAddress]  = useState('')
  const [loading,  setLoading]  = useState(false)
  const [err,      setErr]      = useState('')
  const [amount,   setAmount]   = useState(149)

  // Fetch current price so it always matches platform_settings
  useEffect(() => {
    supabase.from('platform_settings')
      .select('annual_price')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.annual_price) setAmount(Number(data.annual_price))
      })
  }, [])

  async function submit(e) {
    e.preventDefault()
    setErr('')
    setLoading(true)
    const { data, error } = await createOrder(name, email, business, address)
    setLoading(false)
    if (error) { setErr(error.message); return }
    const row = Array.isArray(data) ? data[0] : data
    if (!row?.order_id) { setErr('Something went wrong — no order id returned.'); return }
    nav(`/checkout/${row.order_id}`)
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-brand">
          <Link to="/" style={{textDecoration:'none'}}>
            <Logo size={44} showWordmark/>
          </Link>
        </div>

        <div className="checkout-card">
          <div className="checkout-header">
            <h1>Subscribe to BakerNomics</h1>
            <p>Full access, one year — <strong>RM{amount.toFixed(2)}</strong>. Pay via DuitNow or Maybank transfer after this step.</p>
          </div>

          <form className="checkout-form" onSubmit={submit}>
            <label className="field">
              <span>Your full name</span>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Jane Baker"
                required
                autoFocus
              />
            </label>

            <label className="field">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@yourdomain.com"
                required
              />
              <div className="field-hint">This is where your login credentials will be sent.</div>
            </label>

            <label className="field">
              <span>Bakery / business name <em style={{color:'var(--muted)'}}>(optional)</em></span>
              <input
                type="text"
                value={business}
                onChange={e => setBusiness(e.target.value)}
                placeholder="Sunrise Cakes"
              />
            </label>

            <label className="field">
              <span>Address <em style={{color:'var(--muted)'}}>(optional, for your invoice)</em></span>
              <textarea
                rows="3"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="12 Jalan Merdeka, 30000 Ipoh, Perak"
              />
            </label>

            {err && <div className="auth-error">{err}</div>}

            <button type="submit" className="checkout-btn" disabled={loading}>
              {loading ? 'Creating order…' : `Continue — RM${amount.toFixed(2)}`}
            </button>

            <div className="checkout-fineprint">
              <p>By continuing you'll get an order reference and payment instructions. Nothing is charged yet.</p>
              <p style={{marginTop:8}}>
                Already have an account? <Link to="/login">Sign in →</Link>
              </p>
              <p style={{marginTop:4}}>
                Want to try before paying? <Link to="/signup">Start 14-day free trial →</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
