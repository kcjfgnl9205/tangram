import { supabase } from '@/shared/lib/supabase'
import type { Profile } from '@/shared/types/types'

/**
 * 사용자 목록 조회 (페이지네이션)
 */
export const fetchUserList = async (
  page: number = 1,
  limit: number = 20,
  searchEmail?: string,
): Promise<{ list: Profile[]; totalCount: number }> => {
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase
    .from('profiles')
    .select('id, email, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })

  if (searchEmail) {
    query = query.ilike('email', `%${searchEmail}%`)
  }

  const { data, error, count } = await query.range(from, to)

  if (error) throw new Error(`사용자 목록 조회 실패: ${error.message}`)

  return { list: (data ?? []) as Profile[], totalCount: count ?? 0 }
}

export async function fetchUsers(
  page: number = 1,
  limit: number = 20,
  searchEmail?: string,
): Promise<{ users: Profile[]; total: number; error?: string }> {
  try {
    const { list, totalCount } = await fetchUserList(page, limit, searchEmail)
    return { users: list, total: totalCount }
  } catch (err) {
    console.error('fetchUsers error:', err)
    return { users: [], total: 0, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}
