import { supabase } from '@/shared/lib/supabase'
import type { Contact } from '@/shared/types/types'

export type { Contact }

/**
 * 문의사항 목록 조회
 */
export const fetchContactList = async (
  page: number = 1,
  limit: number = 20,
): Promise<{ list: Contact[]; totalCount: number }> => {
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await supabase
    .from('contacts')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw new Error(`문의사항 목록 조회 실패: ${error.message}`)

  return { list: (data ?? []) as Contact[], totalCount: count ?? 0 }
}

export async function fetchContacts(
  page: number = 1,
  limit: number = 20,
): Promise<{ contacts: Contact[]; total: number; error?: string }> {
  try {
    const { list, totalCount } = await fetchContactList(page, limit)
    return { contacts: list, total: totalCount }
  } catch (err) {
    console.error('fetchContacts error:', err)
    return { contacts: [], total: 0, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

/**
 * 문의사항 상세 조회
 */
export async function fetchContactById(
  id: number,
): Promise<{ contact: Contact | null; error?: string }> {
  try {
    const { data, error } = await supabase.from('contacts').select('*').eq('id', id).single()

    if (error) {
      if (error.code === 'PGRST116') {
        return { contact: null }
      }
      console.error('Failed to fetch contact:', error)
      return { contact: null, error: error.message }
    }

    return { contact: data }
  } catch (err) {
    console.error('fetchContactById error:', err)
    return { contact: null, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

/**
 * 문의사항 상태 업데이트
 */
export async function updateContactStatus(
  id: number,
  status: number,
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('contacts').update({ status }).eq('id', id)

    if (error) {
      console.error('Failed to update contact status:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    console.error('updateContactStatus error:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}
