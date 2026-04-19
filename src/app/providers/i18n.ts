import { createI18n, type LocaleMessages } from 'vue-i18n'
import metaKo from '@/shared/config/locales/ko/meta.json'
import metaEn from '@/shared/config/locales/en/meta.json'
import metaJa from '@/shared/config/locales/ja/meta.json'

import ko from '@/shared/config/locales/ko.json'
import en from '@/shared/config/locales/en.json'
import ja from '@/shared/config/locales/ja.json'

const messages: LocaleMessages<any> = {
  ko: { ...ko, ...metaKo },
  en: { ...en, ...metaEn },
  ja: { ...ja, ...metaJa },
}

export const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('lang') || 'ko',
  fallbackLocale: 'ko',
  messages,
})
