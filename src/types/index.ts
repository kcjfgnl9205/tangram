import type { SUPPORTED_LOCALES } from '@/router'

// 다국어 설정
export type Locale = (typeof SUPPORTED_LOCALES)[number]
export interface LocaleSelect {
  value: Locale
  label: string
}

// UI타입
export type BadgeType = 'yellow' | 'red' | 'green'

// 칠교놀이
export interface Tangram {
  id: number
  key: string
  level: number
  title: {
    ko: string
    en: string
    ja: string
  }
  json: string
  thumbnail: string
}

// 캔버스 좌표
export interface Point {
  x: number
  y: number
}
