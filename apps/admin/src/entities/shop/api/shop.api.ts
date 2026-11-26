import { supabase } from '@/shared/lib/supabase'
import type { ShopLink, ShopLinkInsert, ShopLinkUpdate } from '@/shared/types/types'

/** 관리자 목록 — 비노출 항목도 함께 보여준다 */
export async function fetchShopLinks(): Promise<{ links: ShopLink[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('shop_links')
      .select('*')
      .is('deleted_at', null)
      .order('sort_order', { ascending: true })
      .order('id', { ascending: true })

    if (error) throw error
    return { links: data ?? [] }
  } catch (err) {
    console.error('fetchShopLinks error:', err)
    return { links: [], error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

export async function createShopLink(
  payload: ShopLinkInsert,
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from('shop_links').insert(payload)
  if (error) {
    console.error('createShopLink error:', error)
    return { success: false, error: error.message }
  }
  return { success: true }
}

export async function updateShopLink(
  id: number,
  updates: ShopLinkUpdate,
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('shop_links')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    console.error('updateShopLink error:', error)
    return { success: false, error: error.message }
  }
  return { success: true }
}

/** 소프트 삭제 — 실수로 지워도 DB 에서 되살릴 수 있게 한다 */
export async function deleteShopLink(id: number): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('shop_links')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    console.error('deleteShopLink error:', error)
    return { success: false, error: error.message }
  }
  return { success: true }
}
