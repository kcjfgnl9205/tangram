import { supabase } from '@/shared/lib/supabase/supabaseClient'
import type { Tangram, TangramPayload } from '@/shared/types'

export interface TangramListFilter {
  /** true = 운영자가 승격한 추천 도안, false = 사용자 작품 */
  official?: boolean
  /** 1~5. 세 단계(쉬움 1~2 / 보통 3 / 어려움 4~5)로 묶어 넘긴다 */
  difficulty?: [number, number]
  /** animal | thing | people | number | shape */
  category?: string
}

// 1. Tangram 목록 페이지네이션 조회 (useInfiniteScroll 형식에 맞춤)
export const fetchTangramList = async (
  page = 1,
  limit = 20,
  filter: TangramListFilter = {},
): Promise<{ list: Tangram[]; totalCount: number }> => {
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase.from('tangrams').select('*', { count: 'exact' }).is('deleted_at', null)

  if (filter.official !== undefined) query = query.eq('is_official', filter.official)

  if (filter.difficulty) {
    const [min, max] = filter.difficulty
    query = query.gte('difficulty', min).lte('difficulty', max)
  }

  // category 컬럼은 20261125000003 마이그레이션에서 추가된다.
  // 적용 전이라면 이 필터를 쓰지 않는 한(= '전체') 목록은 정상 동작한다.
  if (filter.category) query = query.eq('category', filter.category)

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw new Error(`Tangram 목록 조회 실패: ${error.message}`)

  return { list: (data ?? []) as Tangram[], totalCount: count ?? 0 }
}

/**
 * 탭별 개수 — 두 탭 모두 개수를 항상 보여주기 위해 따로 센다.
 * head: true 라 행은 받지 않고 count 만 받는다.
 * 난이도·주제 필터는 그대로 반영해서, 보고 있는 조건의 개수를 보여준다.
 */
export const fetchTangramCounts = async (
  filter: Omit<TangramListFilter, 'official'> = {},
): Promise<{ official: number; community: number }> => {
  const countFor = async (official: boolean) => {
    let query = supabase
      .from('tangrams')
      .select('id', { count: 'exact', head: true })
      .is('deleted_at', null)
      .eq('is_official', official)

    if (filter.difficulty) {
      const [min, max] = filter.difficulty
      query = query.gte('difficulty', min).lte('difficulty', max)
    }
    if (filter.category) query = query.eq('category', filter.category)

    const { count, error } = await query
    if (error) throw new Error(`Tangram 개수 조회 실패: ${error.message}`)
    return count ?? 0
  }

  const [official, community] = await Promise.all([countFor(true), countFor(false)])
  return { official, community }
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
// 사용자 생성 도안이므로 key(번역 키)는 비우고 title(원문)만 채운다.
// 운영자가 공식으로 승격할 때 translation_meta 행을 추가하고 key 를 부여한다.
export const createTangram = async (payload: TangramPayload) => {
  const user = (await supabase.auth.getUser()).data.user

  const { data, error } = await supabase
    .from('tangrams')
    .insert({
      key: null,
      title: payload.title,
      title_lang: payload.title_lang,
      is_official: false,
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
