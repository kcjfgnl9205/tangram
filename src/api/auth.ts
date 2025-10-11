import { supabase } from '@/lib/supabase/supabaseClient'

export const signUp = async (email: string, password: string) => {
  return await supabase.auth.signUp({ email, password })
}

export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({ email, password })
}

export const signOut = async () => {
  return await supabase.auth.signOut()
}

export const getUser = async () => {
  const { data, error } = await supabase.auth.getUser()
  if (error) throw error
  return data.user
}

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()

  if (error) throw error
  return data
}

export const getAllProfiles = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(`프로필 목록 조회 실패: ${error.message}`)
  return data ?? []
}
