import { createI18n, type LocaleMessages } from 'vue-i18n'
import metaKo from '@/shared/config/locales/ko/meta.json'
import metaEn from '@/shared/config/locales/en/meta.json'
import metaJa from '@/shared/config/locales/ja/meta.json'

import contactKo from '@/shared/config/locales/ko/contact.json'
import contactEn from '@/shared/config/locales/en/contact.json'
import contactJa from '@/shared/config/locales/ja/contact.json'

import commonKo from '@/shared/config/locales/ko/common.json'
import commonEn from '@/shared/config/locales/en/common.json'
import commonJa from '@/shared/config/locales/ja/common.json'

import ko from '@/shared/config/locales/ko.json'
import en from '@/shared/config/locales/en.json'
import ja from '@/shared/config/locales/ja.json'

const messages: LocaleMessages<any> = {
  ko: { ...ko, ...metaKo, ...contactKo, ...commonKo },
  en: { ...en, ...metaEn, ...contactEn, ...commonEn },
  ja: { ...ja, ...metaJa, ...contactJa, ...commonJa },
}

export const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('lang') || 'ko',
  fallbackLocale: 'ko',
  messages,
})
