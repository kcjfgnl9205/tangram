import type { Database } from '@/shared/lib/supabase'

// =====================================
// 다국어 설정
// =====================================
export type Locale = 'ko' | 'en'

export interface LocaleSelect {
  value: Locale
  label: string
}

// =====================================
// UI 타입
// =====================================
export type BadgeType = 'yellow' | 'red' | 'green'

// =====================================
// 캔버스 좌표
// =====================================
export interface Point {
  x: number
  y: number
}

// =====================================
// 다국어 메타 (Translation Meta)
// =====================================
export type TranslationMeta = Database['public']['Tables']['translation_meta']['Row']
export type TranslationMetaInsert = Omit<TranslationMeta, 'id' | 'created_at'>
export type TranslationMetaUpdate = Partial<
  Omit<TranslationMeta, 'id' | 'created_at' | 'updated_at'>
>

// =====================================
// 유저 (Profile)
// =====================================
export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Omit<Profile, 'id' | 'created_at' | 'updated_at'>
export type ProfileUpdate = Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>

// =====================================
// 문의사항 (Contact)
// =====================================
export enum CONTACT_STATUS {
  REQUEST = 1,
  COMPLETED = 2,
}

export const CONTACT_STATUS_LABEL: Record<number, string> = {
  [CONTACT_STATUS.REQUEST]: '신청',
  [CONTACT_STATUS.COMPLETED]: '답변완료',
}

export type Contact = Database['public']['Tables']['contacts']['Row']
export type ContactInsert = Omit<Contact, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>
export type ContactUpdate = Partial<Omit<Contact, 'id' | 'created_at' | 'updated_at'>>

// =====================================
// 칠교놀이 (Tangram)
// =====================================
export type Tangram = Database['public']['Tables']['tangrams']['Row']
export type TangramInsert = Omit<Tangram, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>
export type TangramUpdate = Partial<
  Omit<Tangram, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'user_id'>
>
export type TangramPayload = Pick<
  Tangram,
  'key' | 'json_url' | 'thumbnail_url' | 'difficulty' | 'show_answer_preview'
>

// =====================================
// 구매처 (Shop Link)
// =====================================
export type ShopLink = Database['public']['Tables']['shop_links']['Row']
export type ShopLinkInsert = Database['public']['Tables']['shop_links']['Insert']
export type ShopLinkUpdate = Database['public']['Tables']['shop_links']['Update']
