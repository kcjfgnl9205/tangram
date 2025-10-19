import { supabase } from '@/lib/supabase/supabaseClient'
import type { Polyomino, PolyominoUpdate } from '@/types'

// 1. Polyomino 목록 조회
export const fetchPolyominoList = async () => {
  const { data, error } = await supabase
    .from('polyominoes')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
  if (error) throw new Error(`Polyomino 목록 조회 실패: ${error.message}`)
  return data as Polyomino[]
}

// Polyomino 상세 조회
export const fetchPolyominoDetail = async (id: number) => {
  const { data, error } = await supabase
    .from('polyominoes')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  if (error) throw new Error(`Polyomino 상세 조회 실패: ${error.message}`)
  return data as Polyomino
}

// Polyomino 생성
export const createPolyomino = async (payload: PolyominoUpdate) => {
  const user = (await supabase.auth.getUser()).data.user
  if (!user) throw new Error('로그인이 필요합니다.')

  const { data, error } = await supabase
    .from('polyominoes')
    .insert({
      key: payload.key,
      json_url: payload.json_url,
      thumbnail_url: payload.thumbnail_url,
      type: payload.type,
      user_id: user.id,
    })
    .select()

  if (!data || error) throw new Error(`Polyomino 생성 실패: ${error?.message}`)

  return data?.[0] as Polyomino
}
