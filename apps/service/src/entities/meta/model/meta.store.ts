import { ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchTranslationMeta } from '@/entities/meta/api/metadata'
import type { Locale, TranslationMeta } from '@/shared/types'

export const useMetaStore = defineStore('meta', () => {
  const translations = ref<TranslationMeta[]>([])

  // key → row 조회를 O(1) 로. translations 가 교체될 때만 다시 만든다.
  let index = new Map<string, TranslationMeta>()
  const reindex = () => {
    index = new Map(translations.value.map((item) => [item.key, item]))
  }

  const getText = (key: string | null | undefined, lang: Locale = 'ko') => {
    if (!key) return ''
    const item = index.get(key)
    if (!item) return ''
    return item[lang] || key
  }

  // translation_meta 는 전체를 받아오므로 앱 생명주기당 1회만 로드한다.
  // (기존에는 router.beforeEach 에서 매 네비게이션마다 전체 조회 + await 했다)
  let inflight: Promise<void> | null = null

  const ensureLoaded = async (force = false) => {
    if (!force && translations.value.length > 0) return
    if (!force && inflight) return inflight

    inflight = (async () => {
      try {
        const data = await fetchTranslationMeta()
        translations.value = (data ?? []) as TranslationMeta[]
        reindex()
      } finally {
        inflight = null
      }
    })()

    return inflight
  }

  return {
    translations,
    getText,
    ensureLoaded,
  }
})
