import { supabase } from '@/shared/lib/supabase'
import type { Tangram, TangramInsert, TangramUpdate } from '@/shared/types/types'

/**
 * 칠교놀이 목록 조회 (삭제되지 않은 것만)
 */
export const fetchTangramList = async (
  page: number = 1,
  limit: number = 12,
): Promise<{ list: Tangram[]; totalCount: number }> => {
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await supabase
    .from('tangrams')
    .select('*', { count: 'exact' })
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw new Error(`칠교놀이 목록 조회 실패: ${error.message}`)

  return { list: (data ?? []) as Tangram[], totalCount: count ?? 0 }
}

export async function fetchTangrams(
  page: number = 1,
  limit: number = 12,
): Promise<{ tangrams: Tangram[]; total: number; error?: string }> {
  try {
    const { list, totalCount } = await fetchTangramList(page, limit)
    return { tangrams: list, total: totalCount }
  } catch (err) {
    console.error('fetchTangrams error:', err)
    return { tangrams: [], total: 0, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

/**
 * 칠교놀이 상세 조회
 */
export async function fetchTangramById(
  id: number,
): Promise<{ tangram: Tangram | null; error?: string }> {
  try {
    const { data, error } = await supabase.from('tangrams').select('*').eq('id', id).single()

    if (error) {
      if (error.code === 'PGRST116') {
        return { tangram: null }
      }
      console.error('Failed to fetch tangram:', error)
      return { tangram: null, error: error.message }
    }

    return { tangram: data }
  } catch (err) {
    console.error('fetchTangramById error:', err)
    return { tangram: null, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

/**
 * 칠교놀이 생성
 */
export async function createTangram(
  data: Omit<TangramInsert, 'id' | 'user_id' | 'created_at' | 'updated_at'>,
): Promise<{ tangram: Tangram | null; error?: string }> {
  try {
    // 현재 사용자 ID 가져오기
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { tangram: null, error: 'User not authenticated' }
    }

    // user_id를 자동으로 설정
    const insertData = {
      ...data,
      user_id: user.id,
    }

    const { data: tangram, error } = await supabase
      .from('tangrams')
      .insert([insertData])
      .select()
      .single()

    if (error) {
      console.error('Failed to create tangram:', error)
      return { tangram: null, error: error.message }
    }

    return { tangram }
  } catch (err) {
    console.error('createTangram error:', err)
    return { tangram: null, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

/**
 * 칠교놀이 업데이트
 */
export async function updateTangram(
  id: number,
  updates: TangramUpdate,
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('tangrams').update(updates).eq('id', id)

    if (error) {
      console.error('Failed to update tangram:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    console.error('updateTangram error:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

/**
 * 칠교놀이 삭제 (소프트 삭제)
 * 1) R2에서 파일 삭제
 * 2) deleted_at 업데이트
 */
export async function deleteTangram(id: number): Promise<{ success: boolean; error?: string }> {
  try {
    // 먼저 tangram 정보 조회
    const { tangram, error: fetchError } = await fetchTangramById(id)

    if (fetchError || !tangram) {
      return { success: false, error: fetchError || 'Tangram not found' }
    }

    // R2에서 파일 삭제
    if (tangram.json_url || tangram.thumbnail_url) {
      const fileNames: string[] = []

      if (tangram.json_url) {
        const jsonMatch = tangram.json_url.match(/\/([^/]+)$/)
        if (jsonMatch?.[1]) fileNames.push(jsonMatch[1])
      }

      if (tangram.thumbnail_url) {
        const thumbMatch = tangram.thumbnail_url.match(/\/([^/]+)$/)
        if (thumbMatch?.[1]) fileNames.push(thumbMatch[1])
      }

      if (fileNames.length > 0) {
        const { error: deleteError } = await supabase.functions.invoke('delete-from-r2', {
          body: { fileNames },
        })

        if (deleteError) {
          console.warn('Failed to delete files from R2:', deleteError)
          // R2 삭제 실패해도 계속 진행 (DB만 업데이트)
        }
      }
    }

    // DB에서 소프트 삭제
    const { error: updateError } = await supabase
      .from('tangrams')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)

    if (updateError) {
      console.error('Failed to soft delete tangram:', updateError)
      return { success: false, error: updateError.message }
    }

    return { success: true }
  } catch (err) {
    console.error('deleteTangram error:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}
