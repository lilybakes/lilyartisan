import { supabase } from './supabase'

// ==========================================================================
// USERS (Delta 3a)
// ==========================================================================
export const listUsers = () => supabase.rpc('sysadmin_list_users')

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

export const suspendUser   = (userId, reason) => supabase.rpc('sysadmin_suspend_user',   { p_target_user_id: userId, p_reason: reason })
export const unsuspendUser = (userId)         => supabase.rpc('sysadmin_unsuspend_user', { p_target_user_id: userId })
export const detachEmail   = (userId)         => supabase.rpc('sysadmin_detach_email',   { p_target_user_id: userId })
export const reattachEmail = (userId, email)  => supabase.rpc('sysadmin_reattach_email', { p_target_user_id: userId, p_new_email: email })
export const generateTempPassword = (userId)  => supabase.rpc('sysadmin_generate_temp_password', { p_target_user_id: userId })
export const getUserEmail = (userId)          => supabase.rpc('sysadmin_get_user_email', { p_target_user_id: userId })

export const sendPasswordResetEmail = async (userId) => {
  const { data: email, error } = await getUserEmail(userId)
  if (error) return { data: null, error }
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
}

export const deleteUser = (userId, confirmEmail) =>
  supabase.rpc('sysadmin_delete_user', { p_target_user_id: userId, p_confirm_email: confirmEmail })

// ==========================================================================
// IMPERSONATION (Delta 3a)
// ==========================================================================
export const startImpersonation = (userId)             => supabase.rpc('sysadmin_start_impersonation', { p_target_user_id: userId })
export const stopImpersonation  = (userId, sessionTok) => supabase.rpc('sysadmin_stop_impersonation',  { p_target_user_id: userId, p_session_token: sessionTok })

// ==========================================================================
// PLATFORM SETTINGS (Delta 3a)
// ==========================================================================
export const getPlatformSettings    = () =>
  supabase.from('platform_settings').select('*').eq('id', 1).single()
export const updatePlatformSettings = (patch) =>
  supabase.from('platform_settings').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', 1).select().single()

// ==========================================================================
// AUDIT LOG (Delta 3a)
// ==========================================================================
export const listAuditLog = (limit = 50) =>
  supabase.from('audit_log').select('*').order('created_at', { ascending: false }).limit(limit)


// ==========================================================================
// CONTENT BLOCKS (Delta 3b)
// ==========================================================================

/**
 * Fetch all content blocks in one call.
 * Returns a map: { 'landing.hero': {...}, ... }
 */
export async function fetchAllContent() {
  const { data, error } = await supabase.from('content_blocks').select('*')
  if (error) return { data: {}, error }
  const map = {}
  for (const row of (data || [])) map[row.key] = row.content
  return { data: map, error: null }
}

export const getContentBlock = (key) =>
  supabase.from('content_blocks').select('*').eq('key', key).maybeSingle()

/** Upsert a content block. Sysadmin only (RLS enforced). */
export const upsertContentBlock = (key, content) =>
  supabase.from('content_blocks')
    .upsert({ key, content, updated_at: new Date().toISOString() }, { onConflict: 'key' })
    .select()
    .single()

// ==========================================================================
// EMAIL TEMPLATES (Delta 3b)
// ==========================================================================
export const listEmailTemplates = () =>
  supabase.from('email_templates').select('*').order('key')

export const updateEmailTemplate = (key, patch) =>
  supabase.from('email_templates')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('key', key)
    .select()
    .single()
