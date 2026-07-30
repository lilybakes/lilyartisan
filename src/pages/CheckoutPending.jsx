import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getOrderPublic, setOrderProof } from '../lib/checkout-api.js'
import { supabase } from '../lib/supabase.js'
import Logo from '../components/Logo.jsx'

export default function CheckoutPending() {
  const { orderId } = useParams()
  const [order, setOrder]     = useState(null)
  const [platform, setPlatform] = useState(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [err, setErr] = useState('')
  const [tab, setTab] = useState('qr')     // 'qr' | 'bank'

  useEffect(() => {
    ;(async () => {
      const [{ data: orderRows }, { data: platformRow }] = await Promise.all([
        getOrderPublic(orderId),
        supabase.from('platform_settings').select('*').eq('id', 1).maybeSingle(),
      ])
      setOrder(Array.isArray(orderRows) ? orderRows[0] : orderRows)
      setPlatform(platformRow)
      setLoading(false)
    })()
  }, [orderId])

  async function uploadProof(file) {
    if (!file || !order) return
    setUploading(true)
    setErr('')
    try {
      const ext = file.name.split('.').pop() || 'jpg'
      const path = `orders/${order.id}/${Date.now()}.${ext}`
      const { error: upErr } = await supabase.storage
        .from('lilyartisan-images')
        .upload(path, file, { upsert: false, cacheControl: '3600' })
      if (upErr) throw upErr
      const { data: urlData } = supabase.storage.from('lilyartisan-images').getPublicUrl(path)
      const { error: rpcErr } = await setOrderProof(order.id, urlData.publicUrl)
      if (rpcErr) throw rpcErr
      // Refresh order
      const { data: refreshed } = await getOrderPublic(orderId)
      setOrder(Array.isArray(refreshed) ? refreshed[0] : refreshed)
    } catch (e) {
      setErr(e.message)
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <p className="empty" style={{padding:'80px 20px'}}>Loading your order…</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="checkout-card">
            <h1 style={{margin:0}}>Order not found</h1>
            <p>The order id in the URL doesn't match any order. If you just placed one, try refreshing.</p>
            <Link to="/checkout" className="checkout-btn" style={{textAlign:'center', textDecoration:'none', display:'block'}}>Start over</Link>
          </div>
        </div>
      </div>
    )
  }

  // ============ APPROVED ============
  if (order.status === 'approved') {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="checkout-brand"><Link to="/"><Logo size={44} showWordmark/></Link></div>
          <div className="checkout-card checkout-card-success">
            <div className="checkout-big-icon">✅</div>
            <h1>Payment verified!</h1>
            <p>Your BakeOnomics subscription is active. We've sent your login credentials to <strong>{order.customer_email}</strong>.</p>
            <Link to="/login" className="checkout-btn" style={{textDecoration:'none', textAlign:'center', display:'block'}}>Sign in →</Link>
          </div>
        </div>
      </div>
    )
  }

  // ============ REJECTED ============
  if (order.status === 'rejected') {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="checkout-brand"><Link to="/"><Logo size={44} showWordmark/></Link></div>
          <div className="checkout-card">
            <div className="checkout-big-icon">⚠️</div>
            <h1>Order couldn't be verified</h1>
            <p>Order <strong>{order.reference}</strong> was declined. Please contact support or start a new order.</p>
            <Link to="/checkout" className="checkout-btn" style={{textDecoration:'none', textAlign:'center', display:'block'}}>Start a new order</Link>
          </div>
        </div>
      </div>
    )
  }

  // ============ PROOF UPLOADED (awaiting sysadmin) ============
  if (order.status === 'proof_uploaded') {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="checkout-brand"><Link to="/"><Logo size={44} showWordmark/></Link></div>
          <div className="checkout-card checkout-card-success">
            <div className="checkout-big-icon">📮</div>
            <h1>Payment received — verifying now</h1>
            <p>Thanks! We got your payment proof for order <strong>{order.reference}</strong>. We'll verify within 24 hours and send your login credentials to <strong>{order.customer_email}</strong>.</p>
            <p className="checkout-hint">You can close this page. Everything happens in the background.</p>
          </div>
        </div>
      </div>
    )
  }

  // ============ PENDING — the payment instructions view ============
  const qrUrl = platform?.payment_qr_url
  const bank  = platform?.payment_bank_name    || 'Maybank'
  const acct  = platform?.payment_account_no   || ''
  const acctName = platform?.payment_account_name || 'Swim Revelation Trading'
  const instructions = platform?.payment_instructions || ''
  const amount = Number(order.amount).toFixed(2)

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-brand">
          <Link to="/" style={{textDecoration:'none'}}>
            <Logo size={44} showWordmark/>
          </Link>
        </div>

        <div className="checkout-summary-card">
          <div className="checkout-summary-row">
            <span className="checkout-summary-label">Order reference</span>
            <span className="checkout-summary-ref">{order.reference}</span>
          </div>
          <div className="checkout-summary-row">
            <span className="checkout-summary-label">Amount</span>
            <span className="checkout-summary-amt">RM{amount}</span>
          </div>
          <div className="checkout-summary-row">
            <span className="checkout-summary-label">For</span>
            <span>{order.customer_name} · {order.customer_email}</span>
          </div>
        </div>

        <div className="checkout-card">
          <h2 style={{margin:'0 0 6px', fontSize:20}}>Pay RM{amount} via one of these methods</h2>
          <p className="checkout-hint" style={{margin:'0 0 18px'}}>Include the order reference <strong>{order.reference}</strong> in your payment note.</p>

          <div className="checkout-method-tabs">
            <button className={tab === 'qr' ? 'active' : ''}   onClick={() => setTab('qr')}>DuitNow QR</button>
            <button className={tab === 'bank' ? 'active' : ''} onClick={() => setTab('bank')}>Bank Transfer</button>
          </div>

          {tab === 'qr' && (
            <div className="checkout-qr-panel">
              {qrUrl ? (
                <>
                  <img src={qrUrl} alt="DuitNow QR" className="checkout-qr-img"/>
                  <p className="checkout-hint">Scan with any Malaysian banking app</p>
                </>
              ) : (
                <div className="checkout-qr-missing">
                  QR code hasn't been uploaded yet. Please use bank transfer instead.
                </div>
              )}
            </div>
          )}

          {tab === 'bank' && (
            <div className="checkout-bank-panel">
              <BankRow label="Bank"           value={bank}/>
              <BankRow label="Account name"   value={acctName}/>
              <BankRow label="Account number" value={acct} copy/>
              <BankRow label="Amount"         value={`RM${amount}`}/>
              <BankRow label="Reference"      value={order.reference} copy/>
              {instructions && (
                <div className="checkout-bank-instructions">
                  <strong>Instructions</strong>
                  <p>{instructions}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="checkout-card">
          <h2 style={{margin:'0 0 6px', fontSize:20}}>Upload proof of payment</h2>
          <p className="checkout-hint" style={{margin:'0 0 18px'}}>Screenshot or photo of the successful transfer — anything showing the amount and date works.</p>

          <label className={'checkout-upload' + (uploading ? ' loading' : '')}>
            <input type="file" accept="image/*,application/pdf" hidden disabled={uploading}
              onChange={e => uploadProof(e.target.files?.[0])}/>
            <div className="checkout-upload-icon">📷</div>
            <div>
              <div className="checkout-upload-title">{uploading ? 'Uploading…' : 'Click or tap to upload'}</div>
              <div className="checkout-upload-hint">PNG, JPG, or PDF — up to 10 MB</div>
            </div>
          </label>

          {err && <div className="auth-error" style={{marginTop:14}}>{err}</div>}

          <p className="checkout-hint" style={{marginTop:16}}>
            After upload, we'll verify within 24 hours and email your login to <strong>{order.customer_email}</strong>.
          </p>
        </div>
      </div>
    </div>
  )
}

function BankRow({ label, value, copy }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="checkout-bank-row">
      <span className="checkout-bank-label">{label}</span>
      <span className="checkout-bank-value">
        <span>{value}</span>
        {copy && value && (
          <button type="button" className="checkout-copy-btn"
            onClick={() => {
              navigator.clipboard?.writeText(value)
              setCopied(true)
              setTimeout(() => setCopied(false), 1200)
            }}
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        )}
      </span>
    </div>
  )
}
