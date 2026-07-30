import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useAuth } from './auth.jsx'
import { supabase } from './supabase'

const DEFAULTS = {
  hero_mode:  'default',
  hero_url:   null,
  avatar_url: null,
}

const PersonalizationContext = createContext(null)

export function PersonalizationProvider({ children }) {
  const { profile } = useAuth() || {}
  const [state, setState] = useState(DEFAULTS)

  // Mirror the auth profile whenever it changes
  useEffect(() => {
    if (profile) {
      setState({
        hero_mode:  profile.hero_mode  || 'default',
        hero_url:   profile.hero_url   || null,
        avatar_url: profile.avatar_url || null,
      })
    } else {
      setState(DEFAULTS)
    }
  }, [profile?.hero_mode, profile?.hero_url, profile?.avatar_url, profile?.user_id])

  const update = useCallback(async (patch) => {
    const next = { ...state, ...patch }
    setState(next)  // optimistic
    const { error } = await supabase.rpc('update_my_personalization', {
      p_hero_mode:  next.hero_mode,
      p_hero_url:   next.hero_url,
      p_avatar_url: next.avatar_url,
    })
    if (error) {
      setState(state)  // revert
      throw error
    }
  }, [state])

  return (
    <PersonalizationContext.Provider value={{ ...state, update }}>
      {children}
    </PersonalizationContext.Provider>
  )
}

export const usePersonalization = () => useContext(PersonalizationContext) || { ...DEFAULTS, update: async () => {} }
