import type { SUPPORTED_LOCALES } from '@/router'
import { RouteNames } from '@/router/router-name'
import type { Database } from './supabase'

// 다국어 설정
export type Locale = (typeof SUPPORTED_LOCALES)[number]
export interface LocaleSelect {
  value: Locale
  label: string
}

// UI타입
export type BadgeType = 'yellow' | 'red' | 'green'

// 칠교놀이
export interface TangramPayload {
  key: string
  json_url: string
  thumbnail_url: string
}

export interface Tangram {
  id: number
  key: string
  json_url: string
  thumbnail_url: string
  user_id: string
  created_at?: string
}

// 캔버스 좌표
export interface Point {
  x: number
  y: number
}

export type NavItem = {
  labelKey?: string
  icon?: string
  name?: RouteNames // 라우트 이름 기반
  exact?: boolean // 정확 매칭할지
  divider?: boolean
  onClick?: () => void
}

// 칠교놀이 다국어 메타
export type TangramTranslationMeta =
  Database['public']['Tables']['tangrams_translation_meta']['Row']
export type TangramTranslationMetaInsert = Omit<TangramTranslationMeta, 'id' | 'created_at'>
export type TangramTranslationMetaUpdate = Partial<
  Omit<TangramTranslationMeta, 'id' | 'created_at' | 'updated_at'>
>

// 유저
export type Profile = Database['public']['Tables']['profiles']['Row']
