import { supabase } from '@/shared/lib/supabase'
import type {
  TranslationMeta,
  TranslationMetaInsert,
  TranslationMetaUpdate,
} from '@/shared/types/types'

/**
 * 메타데이터 목록 조회
 */
export const fetchMetadataList = async (
  page: number = 1,
  limit: number = 20,
): Promise<{ list: TranslationMeta[]; totalCount: number }> => {
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await supabase
    .from('translation_meta')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw new Error(`메타데이터 목록 조회 실패: ${error.message}`)

  return { list: (data ?? []) as TranslationMeta[], totalCount: count ?? 0 }
}

export async function fetchMetadata(
  page: number = 1,
  limit: number = 20,
): Promise<{ metadata: TranslationMeta[]; total: number; error?: string }> {
  try {
    const { list, totalCount } = await fetchMetadataList(page, limit)
    return { metadata: list, total: totalCount }
  } catch (err) {
    console.error('fetchMetadata error:', err)
    return { metadata: [], total: 0, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

/**
 * 메타데이터 조회 (key 기준)
 */
export async function fetchMetadataByKey(
  key: string,
): Promise<{ metadata: TranslationMeta | null; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('translation_meta')
      .select('*')
      .eq('key', key)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return { metadata: null }
      }
      console.error('Failed to fetch metadata:', error)
      return { metadata: null, error: error.message }
    }

    return { metadata: data }
  } catch (err) {
    console.error('fetchMetadataByKey error:', err)
    return { metadata: null, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

/**
 * 메타데이터 생성
 */
export async function createMetadata(
  data: TranslationMetaInsert,
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('translation_meta').insert([data])

    if (error) {
      console.error('Failed to create metadata:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    console.error('createMetadata error:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

/**
 * 메타데이터 업데이트
 */
export async function updateMetadata(
  id: string,
  updates: TranslationMetaUpdate,
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('translation_meta').update(updates).eq('id', id)

    if (error) {
      console.error('Failed to update metadata:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    console.error('updateMetadata error:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

/**
 * 메타데이터 삭제
 */
export async function deleteMetadata(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('translation_meta').delete().eq('id', id)

    if (error) {
      console.error('Failed to delete metadata:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    console.error('deleteMetadata error:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}
