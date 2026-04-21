import { supabase } from '@/shared/lib/supabase/supabaseClient'
import type { Tangram, TangramPayload } from '@/shared/types'

// 1. Tangram 목록 페이지네이션 조회 (useInfiniteScroll 형식에 맞춤)
export const fetchTangramList = async (
  page = 1,
  limit = 20,
): Promise<{ list: Tangram[]; totalCount: number }> => {
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await supabase
    .from('tangrams')
    .select('*', { count: 'exact' })
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw new Error(`Tangram 목록 조회 실패: ${error.message}`)

  return { list: (data ?? []) as Tangram[], totalCount: count ?? 0 }
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

// 조회수 증가 (localStorage 기반 1시간 throttle)
const VIEW_THROTTLE_MS = 24 * 60 * 60 * 1000 // 24시간 (같은 브라우저에서 하루 1회만 카운트)
const VIEW_STORAGE_KEY = (id: number) => `tangram_view_${id}_at`

export const incrementTangramView = async (tangramId: number) => {
  try {
    const storageKey = VIEW_STORAGE_KEY(tangramId)
    const lastViewedAt = Number(localStorage.getItem(storageKey) ?? 0)
    const now = Date.now()

    if (now - lastViewedAt < VIEW_THROTTLE_MS) return

    const { error } = await supabase.rpc('increment_tangram_view', {
      p_tangram_id: tangramId,
    })
    if (error) throw error

    localStorage.setItem(storageKey, String(now))
  } catch (e) {
    // 조회수 증가 실패는 사용자 흐름을 막지 않도록 조용히 로깅만
    console.warn('조회수 증가 실패:', e)
  }
}

// Tangram 생성
export const createTangram = async (payload: TangramPayload) => {
  const user = (await supabase.auth.getUser()).data.user
  if (!user) throw new Error('로그인이 필요합니다.')

  const { data, error } = await supabase
    .from('tangrams')
    .insert({
      key: payload.key,
      json_url: payload.json_url,
      thumbnail_url: payload.thumbnail_url,
      difficulty: payload.difficulty,
      show_answer_preview: payload.show_answer_preview,
      user_id: user.id,
    })
    .select()

  if (!data || error) throw new Error(`Tangram 생성 실패: ${error?.message}`)

  return data?.[0] as Tangram
}
