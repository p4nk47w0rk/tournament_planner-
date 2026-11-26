'use client'

import {createClient} from '@/lib/supabase/client'
import {useEffect, useState, useCallback} from 'react'

export function useSupabase() {
  return createClient()
}

export function useSession() {
  const [session, setSession] = useState<import('@supabase/supabase-js').Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getSession().then(({data: {session}}) => {
      setSession(session)
      setLoading(false)
    })

    const {data: {subscription}} = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return {session, loading}
}

export function useUser() {
  const [user, setUser] = useState<import('@supabase/supabase-js').User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({data: {user}}) => {
      setUser(user)
      setLoading(false)
    })

    const {data: {subscription}} = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return {user, loading}
}

export function useAuth() {
  const {session, loading: sessionLoading} = useSession()
  const {user, loading: userLoading} = useUser()

  const signIn = useCallback(async (email: string, password: string) => {
    const supabase = createClient()
    const {data, error} = await supabase.auth.signInWithPassword({email, password})
    if (error) throw error
    return data
  }, [])

  const signOut = useCallback(async () => {
    const supabase = createClient()
    const {error} = await supabase.auth.signOut()
    if (error) throw error
  }, [])

  const isLoading = sessionLoading || userLoading

  return {
    session,
    user,
    isLoading,
    isAuthenticated: !!session,
    signIn,
    signOut,
  }
}
