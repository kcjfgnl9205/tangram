import { supabase } from '@/lib/supabase/supabaseClient'
import type { Tangram, TangramPayload } from '@/types'

// 1. Tangram 목록 조회
export const fetchTangramList = async () => {
  const { data, error } = await supabase
    .from('tangrams')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
  if (error) throw new Error(`Tangram 목록 조회 실패: ${error.message}`)
  return data as Tangram[]
}

// Tangram 상세 조회
export const fetchTangramDetail = async (id: number) => {
  const { data, error } = await supabase
    .from('tangrams')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  if (error) throw new Error(`Tangram 상세 조회 실패: ${error.message}`)
  return data as Tangram
}

// Tangram 생성
export const createTangram = async (payload: TangramPayload) => {
  const user = (await supabase.auth.getUser()).data.user
  if (!user) throw new Error('로그인이 필요합니다.')

  const { data, error } = await supabase.from('tangrams').insert([
    {
      key: payload.key,
      json_url: payload.json_url,
      thumbnail_url: payload.thumbnail_url,
      user_id: user.id,
    },
  ])

  if (!data || error) throw new Error(`Tangram 생성 실패: ${error?.message}`)

  return data?.[0] as Tangram
}
