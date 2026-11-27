import { supabase } from '@/shared/lib/supabase/supabaseClient'
import type { ShopLink } from '@/shared/types'

/**
 * 노출 중인 구매처 목록.
 * RLS 가 is_active · deleted_at 을 이미 거르지만, 정책이 바뀌어도 화면이
 * 흔들리지 않도록 쿼리에서도 같은 조건을 건다.
 */
export const fetchShopLinks = async (): Promise<ShopLink[]> => {
  const { data, error } = await supabase
    .from('shop_links')
    .select('*')
    .is('deleted_at', null)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('id', { ascending: true })

  if (error) throw new Error(`구매처 목록 조회 실패: ${error.message}`)
  return (data ?? []) as ShopLink[]
}
