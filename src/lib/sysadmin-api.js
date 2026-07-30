import { supabase } from './supabase'

// -------- USERS --------
export const listUsers = () =>
  supabase.rpc('sysadmin_list_users')

export const inviteUser = (email, subStart, subEnd, planType = 'yearly') =>
  supabase.rpc('sysadmin_invite_user', {
    p_email: email,
    p_subscription_start: subStart,
    p_subscription_end:   subEnd,
    p_plan_type:          planType,
  })

export const extendSubscription = (userId, subStart, subEnd, planType) =>
  supabase.rpc('sysadmin_extend_subscription', {
    p_target_user_id:     userId,
    p_subscription_start: subStart,
    p_subscription_end:   subEnd,
    p_plan_type:          planType,
  })

export const suspendUser = (userId, reason) =>
  supabase.rpc('sysadmin_suspend_user',   { p_target_user_id: userId, p_reason: reason })
export const unsuspendUser = (userId) =>
  supabase.rpc('sysadmin_unsuspend_user', { p_target_user_id: userId })

export const detachEmail = (userId) =>
  supabase.rpc('sysadmin_detach_email',   { p_target_user_id: userId })
export const reattachEmail = (userId, newEmail) =>
  supabase.rpc('sysadmin_reattach_email', { p_target_user_id: userId, p_new_email: newEmail })

export const generateTempPassword = (userId) =>
  supabase.rpc('sysadmin_generate_temp_password', { p_target_user_id: userId })

export const getUserEmail = (userId) =>
  supabase.rpc('sysadmin_get_user_email', { p_target_user_id: userId })

export const sendPasswordResetEmail = async (userId) => {
  const { data: email, error } = await getUserEmail(userId)
  if (error) return { data: null, error }
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
}

export const deleteUser = (userId, confirmEmail) =>
  supabase.rpc('sysadmin_delete_user', { p_target_user_id: userId, p_confirm_email: confirmEmail })

// -------- IMPERSONATION --------
export const startImpersonation = (userId) =>
  supabase.rpc('sysadmin_start_impersonation', { p_target_user_id: userId })
export const stopImpersonation = (userId, sessionToken) =>
  supabase.rpc('sysadmin_stop_impersonation', { p_target_user_id: userId, p_session_token: sessionToken })

// -------- PLATFORM SETTINGS --------
export const getPlatformSettings = () =>
  supabase.from('platform_settings').select('*').eq('id', 1).single()
export const updatePlatformSettings = (patch) =>
  supabase.from('platform_settings').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', 1).select().single()

// -------- AUDIT LOG --------
export const listAuditLog = (limit = 50) =>
  supabase.from('audit_log').select('*').order('created_at', { ascending: false }).limit(limit)
