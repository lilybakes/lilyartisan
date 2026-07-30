import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import { listOrders, orderCounts, approveOrder, rejectOrder } from '../../lib/checkout-api.js'

const STATUS_LABELS = {
  pending:        { label: 'Awaiting payment',   tone: 'info' },
  proof_uploaded: { label: 'Awaiting review',    tone: 'warning' },
  approved:       { label: 'Approved',           tone: 'ok' },
  rejected:       { label: 'Rejected',           tone: 'danger' },
  cancelled:      { label: 'Cancelled',          tone: 'low' },
}

function fmt(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString(undefined, { dateStyle:'medium', timeStyle:'short' })
}

function money(n, cur = 'RM') {
  return `${cur}${Number(n || 0).toFixed(2)}`
}

export default function Orders() {
  const [tab,      setTab]      = useState('proof_uploaded')  // default to what needs review
  const [rows,     setRows]     = useState([])
  const [counts,   setCounts]   = useState({})
  const [loading,  setLoading]  = useState(true)
  const [err,      setErr]      = useState('')
  const [modal,    setModal]    = useState(null)  // { kind: 'view'|'approve-result'|'reject', order, result? }
  const [flash,    setFlash]    = useState(null)

  async function reload() {
    setLoading(true)
    const [{ data: rowsData }, { data: countsData }] = await Promise.all([
      listOrders(tab === 'all' ? null : tab),
      orderCounts(),
    ])
    setRows(rowsData || [])
    const map = {}
    for (const c of (countsData || [])) map[c.status] = c.count
    setCounts(map)
    setLoading(false)
  }

  useEffect(() => { reload() }, [tab])

  function ok(msg)  { setFlash({ type:'ok',  msg }); setTimeout(() => setFlash(null), 3200) }
  function bad(msg) { setFlash({ type:'err', msg }); setTimeout(() => setFlash(null), 4500) }

  const tabs = [
    { key: 'proof_uploaded', label: 'To review',       showCount: true },
    { key: 'pending',        label: 'Awaiting payment', showCount: true },
    { key: 'approved',       label: 'Approved',         showCount: true },
    { key: 'rejected',       label: 'Rejected',         showCount: true },
    { key: 'all',            label: 'All',              showCount: false },
  ]

  return (
    <div className="panel">
      <div className="panel-head">
        <div>
          <h3>Orders</h3>
          <p className="sub">Public checkout submissions. Review payment proofs and approve to activate the subscription.</p>
        </div>
      </div>

      {flash && <div className={`flash flash-${flash.type}`} style={{marginBottom:14}}>{flash.msg}</div>}

      <div className="orders-tabs">
        {tabs.map(t => (
          <button key={t.key}
            className={tab === t.key ? 'active' : ''}
            onClick={() => setTab(t.key)}>
            {t.label}
            {t.showCount && counts[t.key] !== undefined && (
              <span className="orders-tab-count">{counts[t.key]}</span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="empty">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="empty" style={{padding:'40px 20px'}}>
          {tab === 'proof_uploaded' && "No orders waiting for review."}
          {tab === 'pending'        && "No orders currently awaiting payment."}
          {tab === 'approved'       && "No approved orders yet."}
          {tab === 'rejected'       && "No rejected orders."}
          {tab === 'all'            && "No orders yet — share your Landing page to get started."}
        </p>
      ) : (
        <table className="responsive-table">
          <thead>
            <tr>
              <th>Reference</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
              <th>When</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(o => {
              const s = STATUS_LABELS[o.status] || { label: o.status, tone: 'info' }
              return (
                <tr key={o.id}>
                  <td>
                    <div style={{fontFamily:'monospace', fontWeight:700, color:'var(--accent-dark)'}}>{o.reference}</div>
                    {o.invoice_number && (
                      <div style={{fontSize:11, color:'var(--muted)', marginTop:2}}>Invoice: {o.invoice_number}</div>
                    )}
                  </td>
                  <td data-label="Customer">
                    <div style={{fontWeight:600}}>{o.customer_name}</div>
                    <div style={{fontSize:12.5, color:'var(--ink-soft)'}}>{o.customer_email}</div>
                    {o.customer_business && (
                      <div style={{fontSize:11.5, color:'var(--muted)'}}>{o.customer_business}</div>
                    )}
                  </td>
                  <td data-label="Amount" style={{fontWeight:700}}>{money(o.amount, o.currency)}</td>
                  <td data-label="Status"><span className={`pill audit-pill-${s.tone}`}>{s.label}</span></td>
                  <td data-label="When" style={{fontSize:12.5}}>{fmt(o.created_at)}</td>
                  <td>
                    <button className="edit" onClick={() => setModal({ kind:'view', order: o })}>
                      {(o.status === 'proof_uploaded' || o.status === 'pending') ? 'Review' : 'View'}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}

      {modal?.kind === 'view' && (
        <OrderDetailModal
          order={modal.order}
          onClose={() => setModal(null)}
          onApprove={async () => {
            const { data, error } = await approveOrder(modal.order.id)
            if (error) { bad(error.message); return }
            const result = Array.isArray(data) ? data[0] : data
            setModal({ kind: 'approve-result', order: modal.order, result })
            reload()
          }}
          onReject={(reason) => setModal({ kind:'reject-confirm', order: modal.order, reason })}
        />
      )}

      {modal?.kind === 'reject-confirm' && (
        <RejectConfirmModal
          order={modal.order}
          reason={modal.reason}
          onCancel={() => setModal({ kind:'view', order: modal.order })}
          onConfirm={async (reason) => {
            const { error } = await rejectOrder(modal.order.id, reason)
            if (error) { bad(error.message); return }
            setModal(null)
            ok(`Order ${modal.order.reference} rejected.`)
            reload()
          }}
        />
      )}

      {modal?.kind === 'approve-result' && (
        <ApproveResultModal
          order={modal.order}
          result={modal.result}
          onClose={() => { setModal(null); ok(`Order ${modal.order.reference} approved. Subscription active.`) }}
        />
      )}
    </div>
  )
}


// ============================================================
function ModalFrame({ title, children, onClose, wide }) {
  useEffect(() => {
    const onEsc = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [onClose])
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className={'modal-card' + (wide ? ' modal-card-wide' : '')} onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}


function OrderDetailModal({ order, onClose, onApprove, onReject }) {
  const [confirmingApprove, setConfirmingApprove] = useState(false)

  return (
    <ModalFrame title={`Order ${order.reference}`} onClose={onClose} wide>
      <div className="order-detail">
        <div className="order-detail-section">
          <h4>Customer</h4>
          <div className="order-detail-grid">
            <div><label>Name</label><span>{order.customer_name}</span></div>
            <div><label>Email</label><span>{order.customer_email}</span></div>
            {order.customer_business && <div><label>Business</label><span>{order.customer_business}</span></div>}
            {order.customer_address && <div style={{gridColumn:'1 / -1'}}><label>Address</label><span>{order.customer_address}</span></div>}
          </div>
        </div>

        <div className="order-detail-section">
          <h4>Payment</h4>
          <div className="order-detail-grid">
            <div><label>Amount</label><span style={{fontWeight:700}}>{money(order.amount, order.currency)}</span></div>
            <div><label>Status</label><span>{STATUS_LABELS[order.status]?.label || order.status}</span></div>
            <div><label>Created</label><span>{fmt(order.created_at)}</span></div>
            {order.proof_uploaded_at && <div><label>Proof uploaded</label><span>{fmt(order.proof_uploaded_at)}</span></div>}
            {order.approved_at && <div><label>Approved</label><span>{fmt(order.approved_at)}</span></div>}
            {order.rejected_at && <div><label>Rejected</label><span>{fmt(order.rejected_at)}</span></div>}
          </div>
        </div>

        {order.proof_url && (
          <div className="order-detail-section">
            <h4>Payment proof</h4>
            <a href={order.proof_url} target="_blank" rel="noopener noreferrer" className="order-proof-link">
              <img src={order.proof_url} alt="Payment proof" className="order-proof-img"/>
              <div className="order-proof-hint">Click to open full-size in new tab</div>
            </a>
          </div>
        )}

        {order.rejected_reason && (
          <div className="order-detail-section">
            <h4>Rejection reason</h4>
            <p style={{margin:0, color:'var(--danger)'}}>{order.rejected_reason}</p>
          </div>
        )}

        {order.invoice_number && (
          <div className="order-detail-section">
            <h4>Invoice</h4>
            <p style={{margin:0, fontFamily:'monospace', fontWeight:700}}>{order.invoice_number}</p>
          </div>
        )}

        {(order.status === 'proof_uploaded' || order.status === 'pending') && (
          <div className="order-detail-actions">
            {!confirmingApprove ? (
              <>
                <button className="primary" onClick={() => setConfirmingApprove(true)}>
                  ✓ Approve & activate subscription
                </button>
                <button className="ghost" onClick={() => onReject('')} style={{border:'1px solid var(--line)', color:'var(--danger)'}}>
                  Reject
                </button>
              </>
            ) : (
              <div style={{width:'100%'}}>
                <div className="danger-box" style={{marginBottom:12}}>
                  <strong>Confirm approval</strong>
                  <p>This will create a paid account for <strong>{order.customer_email}</strong>, generate an invoice number, and set a 1-year subscription. You'll get temp credentials to share with them (or click "Send reset email" after).</p>
                </div>
                <div style={{display:'flex', gap:8}}>
                  <button className="primary" onClick={onApprove}>Yes — approve and activate</button>
                  <button className="ghost" onClick={() => setConfirmingApprove(false)} style={{border:'1px solid var(--line)', color:'var(--ink-soft)'}}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ModalFrame>
  )
}


function RejectConfirmModal({ order, reason: initialReason, onCancel, onConfirm }) {
  const [reason, setReason] = useState(initialReason || '')
  const [loading, setLoading] = useState(false)

  return (
    <ModalFrame title={`Reject order ${order.reference}`} onClose={onCancel}>
      <form className="admin-form" onSubmit={async (e) => { e.preventDefault(); setLoading(true); await onConfirm(reason.trim() || null); setLoading(false) }}>
        <div className="danger-box">
          <strong>Are you sure?</strong>
          <p>This marks the order as rejected. The customer sees "Order couldn't be verified" and no account is created. You can approve a fresh order from them later.</p>
        </div>
        <label className="field">
          <span>Reason (optional, internal only)</span>
          <input value={reason} onChange={e => setReason(e.target.value)} placeholder="Payment amount didn't match / proof unclear / etc."/>
        </label>
        <div style={{display:'flex', gap:8}}>
          <button type="submit" className="primary danger" disabled={loading}>
            {loading ? 'Rejecting…' : 'Yes — reject order'}
          </button>
          <button type="button" className="ghost" onClick={onCancel} style={{border:'1px solid var(--line)', color:'var(--ink-soft)'}}>
            Cancel
          </button>
        </div>
      </form>
    </ModalFrame>
  )
}


function ApproveResultModal({ order, result, onClose }) {
  const [sendingReset, setSendingReset] = useState(false)
  const [sentReset, setSentReset] = useState(false)
  const [err, setErr] = useState('')

  async function sendReset() {
    setSendingReset(true)
    setErr('')
    const { error } = await supabase.auth.resetPasswordForEmail(result.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setSendingReset(false)
    if (error) setErr(error.message)
    else       setSentReset(true)
  }

  return (
    <ModalFrame title="Order approved" onClose={onClose}>
      <div className="admin-form">
        <div className="auth-success">
          <strong>Subscription activated for {order.customer_email}.</strong>
          <p style={{margin:'6px 0 0'}}>Invoice: <code style={{background:'#fff', padding:'2px 8px', borderRadius:4, fontSize:12}}>{result.invoice_number}</code></p>
        </div>

        <p style={{margin:0, fontSize:13}}>
          Now share the login. The cleanest path is <strong>Send reset email</strong> — they set their own password. Or copy the temp password below and share it directly.
        </p>

        <div className="credential-box">
          <div><label>Email</label><code>{result.email}</code></div>
          <div><label>Temporary password</label><code>{result.temp_password}</code></div>
        </div>

        {err && <div className="auth-error">{err}</div>}

        {!sentReset ? (
          <button type="button" className="primary" onClick={sendReset} disabled={sendingReset}>
            {sendingReset ? 'Sending…' : 'Send password reset email'}
          </button>
        ) : (
          <div className="auth-success">Reset email sent to {result.email}.</div>
        )}
        <button type="button" className="ghost" onClick={onClose} style={{border:'1px solid var(--line)', color:'var(--ink-soft)'}}>
          Done
        </button>
      </div>
    </ModalFrame>
  )
}
