import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Initial session check + subscribe to auth changes
  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setSession(data.session)
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
    })
    return () => { mounted = false; sub.subscription.unsubscribe() }
  }, [])

  // Load profile when session changes
  useEffect(() => {
    if (!session?.user?.id) { setProfile(null); return }
    let cancelled = false
    ;(async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle()
      if (cancelled) return
      if (error) console.error('[profile fetch]', error)
      setProfile(data || null)
    })()
    return () => { cancelled = true }
  }, [session?.user?.id])

  const signIn = async (email, password) =>
    supabase.auth.signInWithPassword({ email, password })

  const signOut = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setProfile(null)
  }

  const sendPasswordReset = async (email) =>
    supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

  const updatePassword = async (newPassword) =>
    supabase.auth.updateUser({ password: newPassword })

  const isSysadmin = profile?.role === 'sysadmin'

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user || null,
        profile,
        loading,
        isSysadmin,
        signIn,
        signOut,
        sendPasswordReset,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
