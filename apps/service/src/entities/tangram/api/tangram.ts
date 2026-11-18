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

// 다운로드 횟수 증가 (localStorage 기반 throttle — 같은 브라우저 1시간 1회)
const DOWNLOAD_THROTTLE_MS = 60 * 60 * 1000
const DOWNLOAD_STORAGE_KEY = (id: number) => `tangram_download_${id}_at`

export const incrementTangramDownload = async (tangramId: number) => {
  try {
    const storageKey = DOWNLOAD_STORAGE_KEY(tangramId)
    const lastAt = Number(localStorage.getItem(storageKey) ?? 0)
    const now = Date.now()

    if (now - lastAt < DOWNLOAD_THROTTLE_MS) return

    const { error } = await supabase.rpc('increment_tangram_download', {
      p_tangram_id: tangramId,
    })
    if (error) throw error

    localStorage.setItem(storageKey, String(now))
  } catch (e) {
    // 다운로드 카운트 실패는 다운로드 자체를 막지 않도록 로깅만
    console.warn('다운로드 카운트 증가 실패:', e)
  }
}

// Tangram 생성 — 로그인 사용자는 user_id 매핑, 익명은 NULL
export const createTangram = async (payload: TangramPayload) => {
  const user = (await supabase.auth.getUser()).data.user

  const { data, error } = await supabase
    .from('tangrams')
    .insert({
      key: payload.key,
      json_url: payload.json_url,
      thumbnail_url: payload.thumbnail_url,
      difficulty: payload.difficulty,
      show_answer_preview: payload.show_answer_preview,
      user_id: user?.id ?? null,
    })
    .select()

  if (!data || error) throw new Error(`Tangram 생성 실패: ${error?.message}`)

  return data?.[0] as Tangram
}

// Tangram 소프트 삭제 — 로그인 사용자 전용 (deleted_at 채움). 목록/상세 조회는 deleted_at IS NULL 만 노출
export const deleteTangrams = async (ids: number[]) => {
  if (ids.length === 0) return

  const { error } = await supabase
    .from('tangrams')
    .update({ deleted_at: new Date().toISOString() })
    .in('id', ids)

  if (error) throw new Error(`Tangram 삭제 실패: ${error.message}`)
}
