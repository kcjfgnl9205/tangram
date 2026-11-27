import { getResourceUrl } from '@/shared/lib'
import type { ShopLink } from '@/shared/types'

/**
 * 로고 주소 해석.
 *
 * admin 에서 업로드하면 R2 상대 경로(shop/...)가 저장되고,
 * 손으로 넣은 기존 데이터는 절대 주소일 수 있다. 둘 다 받는다.
 */
export const getShopLogoUrl = (link: Pick<ShopLink, 'logo_url'>): string => {
  const raw = link.logo_url?.trim()
  if (!raw) return ''
  // 저장은 https 만 허용하지만, 판별은 느슨하게 둔다 —
  // 제약이 바뀌어도 상대 경로를 절대 주소로 잘못 읽지 않는다
  return /^https?:\/\//i.test(raw) ? raw : getResourceUrl(raw)
}
