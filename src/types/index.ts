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
export type TangramPayload = Pick<Tangram, 'key' | 'json_url' | 'thumbnail_url'>

// 폴리오미노
export type Polyomino = Database['public']['Tables']['polyominoes']['Row']
export type PolyominoUpdate = Pick<Polyomino, 'key' | 'json_url' | 'thumbnail_url' | 'type'>
export enum PolyominoType {
  TETROMINO = 1,
  PENTOMINO = 2,
  HEXOMINO = 3,
}
export const POLYOMINO_TYPE_LABEL: Record<number, string> = {
  [PolyominoType.TETROMINO]: 'Tetromino',
  [PolyominoType.PENTOMINO]: 'Pentomino',
  [PolyominoType.HEXOMINO]: 'Hexomino',
}
