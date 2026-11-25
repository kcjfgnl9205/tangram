import { useI18n } from 'vue-i18n'
import { useMetaStore } from '@/entities/meta'
import type { Locale, Tangram } from '@/shared/types'

/**
 * 도안 제목 해석 — 공식 도안과 사용자 도안은 제목 체계가 다르다.
 *
 *   1) 공식 도안   : key → translation_meta 에서 현재 언어로 번역
 *   2) 사용자 도안 : title → 작성자가 입력한 원문 그대로 (번역하지 않음)
 *   3) 폴백        : "이름 없는 도안"
 *
 * 두 경로를 한 곳에서만 해석하도록 모아 둔다.
 */
export type TitleSource = Pick<Tangram, 'key' | 'title'>

export const useTangramTitle = () => {
  const metaStore = useMetaStore()
  const { t, locale } = useI18n()

  const getTitle = (item: TitleSource | null | undefined): string => {
    if (!item) return ''
    const translated = metaStore.getText(item.key, locale.value as Locale)
    if (translated) return translated
    const own = item.title?.trim()
    if (own) return own
    return t('tangram.untitled')
  }

  return { getTitle }
}
