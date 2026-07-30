import { supabase } from './supabase'

// ------------ PUBLIC (anon can call) ------------
export const createOrder = (name, email, business, address) =>
  supabase.rpc('create_order', {
    p_name:     name,
    p_email:    email,
    p_business: business || null,
    p_address:  address  || null,
  })

export const getOrderPublic = (orderId) =>
  supabase.rpc('get_order_public', { p_order_id: orderId })

export const setOrderProof = (orderId, proofUrl) =>
  supabase.rpc('set_order_proof', { p_order_id: orderId, p_proof_url: proofUrl })

// ------------ SYSADMIN ------------
export const listOrders = (status) =>
  supabase.rpc('sysadmin_list_orders', { p_status: status || null })

export const orderCounts = () =>
  supabase.rpc('sysadmin_order_counts')

export const approveOrder = (orderId) =>
  supabase.rpc('sysadmin_approve_order', { p_order_id: orderId })

export const rejectOrder = (orderId, reason) =>
  supabase.rpc('sysadmin_reject_order', { p_order_id: orderId, p_reason: reason || null })
