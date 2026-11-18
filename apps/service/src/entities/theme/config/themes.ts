export type ThemeId = 'modern-pastel' | 'vivid-bauhaus' | 'nordic-mute'

export interface Theme {
  id: ThemeId
  label: string
}

// 색상은 base.css 의 [data-theme="..."] 블록에서 정의됨 (CSS 변수)
export const THEMES: Theme[] = [
  { id: 'modern-pastel', label: '모던 파스텔' },
  { id: 'vivid-bauhaus', label: '비비드 바우하우스' },
  { id: 'nordic-mute', label: '노르딕 뮤트' },
]

export const DEFAULT_THEME_ID: ThemeId = 'modern-pastel'
