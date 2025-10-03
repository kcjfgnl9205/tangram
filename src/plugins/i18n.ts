import { createI18n, type LocaleMessages } from 'vue-i18n'
import ko from '@/locales/ko.json'
import en from '@/locales/en.json'
import ja from '@/locales/ja.json'
import metaKo from '@/locales/meta/ko.json'
import metaEn from '@/locales/meta/en.json'
import metaJa from '@/locales/meta/ja.json'

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
