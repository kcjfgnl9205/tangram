import type { SUPPORTED_LOCALES } from '@/router'

// 다국어 설정
export type Locale = (typeof SUPPORTED_LOCALES)[number]
export interface LocaleSelect {
  value: Locale
  label: string
}

// 칠교놀이
export interface Tangram {
  id: number
  title: string
  thumbnail: string
}

// 캔버스 좌표
export interface Point {
  x: number
  y: number
}
