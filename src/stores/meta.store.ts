import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Locale, TangramTranslation } from '@/types'

export const useMetaStore = defineStore('meta', () => {
  const translations = ref<TangramTranslation[]>([])

  const getText = (key: string, lang: Locale = 'ko') => {
    const item = translations.value.find((item) => item.key === key)
    if (!item) return ''
    return item[lang] || key
  }

  return {
    translations,
    getText,
  }
})
