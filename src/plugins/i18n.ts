import { createI18n, type LocaleMessages } from 'vue-i18n'
import ko from '@/locales/ko.json'
import en from '@/locales/en.json'
import ja from '@/locales/ja.json'

const messages: LocaleMessages<any> = { ko, en, ja }

export const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('lang') || 'ko',
  fallbackLocale: 'ko',
  messages,
})
