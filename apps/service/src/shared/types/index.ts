import type { SUPPORTED_LOCALES } from '@/app/router'
import type { Database } from '@tangram/shared'

// 다국어 설정
export type Locale = (typeof SUPPORTED_LOCALES)[number]
export interface LocaleSelect {
  value: Locale
  label: string
}

// UI타입
export type BadgeType = 'yellow' | 'red' | 'green'

// 캔버스 좌표
export interface Point {
  x: number
  y: number
}

// 다국어 메타
export type TranslationMeta = Database['public']['Tables']['translation_meta']['Row']
export type TranslationMetaInsert = Omit<TranslationMeta, 'id' | 'created_at'>
export type TranslationMetaUpdate = Partial<
  Omit<TranslationMeta, 'id' | 'created_at' | 'updated_at'>
>

// 유저
export type Profile = Database['public']['Tables']['profiles']['Row']

// 문의하기
export enum CONTACT_STATUS {
  REQUEST = 1,
  COMPLETED = 2,
}
export const CONTACT_STATUS_LABEL: Record<number, string> = {
  [CONTACT_STATUS.REQUEST]: '신청',
  [CONTACT_STATUS.COMPLETED]: '답변완료',
}
export type Contact = Database['public']['Tables']['contacts']['Row']
export type ContactUpdate = Pick<Contact, 'email' | 'title' | 'contents'>

// 칠교놀이
export type Tangram = Database['public']['Tables']['tangrams']['Row']
export type TangramPayload = Pick<
  Tangram,
  'json_url' | 'thumbnail_url' | 'difficulty' | 'show_answer_preview'
> & {
  // 사용자 도안은 title 로 식별한다. key(=번역 키)는 운영자가 공식 승격할 때만 채운다.
  title: string
  title_lang: Locale
}

// 구매처
export type ShopLink = Database['public']['Tables']['shop_links']['Row']
