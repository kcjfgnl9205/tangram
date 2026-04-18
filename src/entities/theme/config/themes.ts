import type { TangramType } from '@/shared/lib/objects/tangram'

export type ThemeId = 'modern-pastel' | 'vivid-bauhaus' | 'nordic-mute'

export interface Theme {
  id: ThemeId
  label: string
  bg: string
  board: string
  border: string
  outline: string
  tangram: Record<TangramType, string>
}

export const THEMES: Theme[] = [
  {
    id: 'modern-pastel',
    label: '모던 파스텔',
    bg: '#F8F9FA',
    board: '#E9ECEF',
    border: '#DEE2E6',
    outline: '#495057',
    tangram: {
      tangram01: '#FFD1BA',
      tangram02: '#B9E2FA',
      tangram03: '#FFF5BA',
      tangram04: '#E3DFF2',
      tangram05: '#B2C9AB',
      tangram06: '#C0E8D5',
      tangram07: '#E7AFAF',
    },
  },
  {
    id: 'vivid-bauhaus',
    label: '비비드 바우하우스',
    bg: '#FFFFFF',
    board: '#F1F3F5',
    border: '#212529',
    outline: '#212529',
    tangram: {
      tangram01: '#00539C',
      tangram02: '#EE4E34',
      tangram03: '#2E7D32',
      tangram04: '#F5F5F5',
      tangram05: '#37474F',
      tangram06: '#FBC02D',
      tangram07: '#FB8C00',
    },
  },
  {
    id: 'nordic-mute',
    label: '노르딕 뮤트',
    bg: '#F2F0EB',
    board: '#DCD7CC',
    border: '#C7C1B5',
    outline: '#4A5A77',
    tangram: {
      tangram01: '#4A5A77',
      tangram02: '#D7C9B4',
      tangram03: '#A2B5BB',
      tangram04: '#C9A799',
      tangram05: '#8D8681',
      tangram06: '#8B8C68',
      tangram07: '#3E5C59',
    },
  },
]

export const DEFAULT_THEME_ID: ThemeId = 'modern-pastel'
