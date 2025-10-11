import { supabase } from '@/lib/supabase/supabaseClient'
import type { TangramTranslationMetaInsert, TangramTranslationMetaUpdate } from '@/types'

// 칠교놀이 다국어 조회
export const fetchTangramTranslationMeta = async () => {
  const { data, error } = await supabase
    .from('tangrams_translation_meta')
    .select('*')
    .order('id', { ascending: false })

  if (error) throw new Error(`Tangram 다국어 조회 실패: ${error.message}`)
  return data
}

// 칠교놀이 다국어 메타 등록
export const createTangramTranslationMeta = async (payload: TangramTranslationMetaInsert) => {
  const user = (await supabase.auth.getUser()).data.user
  if (!user) throw new Error('로그인이 필요합니다.')

  const { data, error } = await supabase
    .from('tangrams_translation_meta')
    .insert({ ...payload })
    .select('*')

  if (error) throw new Error(`칠교놀이 메타 생성 실패: ${error.message}`)
  if (!data || data.length === 0) throw new Error('등록된 데이터가 없습니다.')

  return data[0]
}

// 칠교놀이 다국어 메타 삭제
export const deleteTangramTranslationMeta = async (id: number) => {
  const user = (await supabase.auth.getUser()).data.user
  if (!user) throw new Error('로그인이 필요합니다.')

  const { error } = await supabase.from('tangrams_translation_meta').delete().eq('id', id)

  if (error) throw new Error(`칠교놀이 메타 삭제 실패: ${error.message}`)
  return true
}

// 칠교놀이 다국어 메타 수정
export const updateTangramTranslationMeta = async (
  id: number,
  payload: TangramTranslationMetaUpdate,
) => {
  const user = (await supabase.auth.getUser()).data.user
  if (!user) throw new Error('로그인이 필요합니다.')

  const { data, error } = await supabase
    .from('tangrams_translation_meta')
    .update({ ...payload })
    .eq('id', id)
    .select()

  if (!data || error) throw new Error(`칠교놀이 메타 수정 실패: ${error?.message}`)

  return data[0]
}
