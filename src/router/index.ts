import { createRouter, createWebHistory, RouterView } from 'vue-router'
import { i18n } from '@/plugins/i18n'
import {
  ErrorView,
  NotFoundView,
  TangramDetailView,
  TangramCreateView,
  TangramListView,
} from '@/views'
import { useTangramStore } from '@/stores'
import type { Locale } from '@/types'
import { updateCanonical, updateMetaTag, updateOgTag } from '@/utils'

export enum RouteNames {
  TANGRAM_LIST = 'tangramList',
  TANGRAM_CREATE = 'tangramCreate',
  TANGRAM_DETAIL = 'tangramDetail',
  NOT_FOUND = 'notFound', // 404 페이지
  ERROR = 'error', // 에러 페이지
}

export const SUPPORTED_LOCALES = ['en', 'ko', 'ja'] as const

const routes = [
  {
    path: `/:locale(${SUPPORTED_LOCALES.join('|')})?`,
    children: [
      {
        path: '',
        redirect: { name: RouteNames.TANGRAM_LIST },
      },
      {
        path: 'tangram',
        component: RouterView,
        children: [
          {
            path: '',
            name: RouteNames.TANGRAM_LIST,
            component: TangramListView,
            meta: {
              titleKey: 'meta.tangram.list.title',
              descriptionKey: 'meta.tangram.list.description',
              keywordsKey: 'meta.tangram.list.keywords',
            },
          },
          {
            path: 'create',
            name: RouteNames.TANGRAM_CREATE,
            component: TangramCreateView,
            meta: {
              titleKey: 'meta.tangram.create.title',
              descriptionKey: 'meta.tangram.create.description',
              keywordsKey: 'meta.tangram.list.keywords',
              footer: false,
            },
          },
          {
            path: ':id',
            name: RouteNames.TANGRAM_DETAIL,
            component: TangramDetailView,
            meta: {
              titleKey: 'meta.tangram.detail.title',
              descriptionKey: 'meta.tangram.detail.description',
              keywordsKey: 'meta.tangram.list.keywords',
              footer: false,
            },
          },
        ],
      },

      {
        path: 'error',
        name: RouteNames.ERROR,
        component: ErrorView,
        meta: { titleKey: 'meta.error.title' },
      },
      {
        path: ':pathMatch(.*)*',
        name: RouteNames.NOT_FOUND,
        component: NotFoundView,
        meta: { titleKey: 'meta.notFound.title' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, _, next) => {
  const tangramStore = useTangramStore()
  if (!tangramStore.items.length) await tangramStore.init()

  let locale = to.params.locale as Locale | undefined

  if (!locale || !SUPPORTED_LOCALES.includes(locale)) {
    locale = (localStorage.getItem('lang') as Locale) || 'ko'
    return next(`/${locale}${to.fullPath}`)
  }

  i18n.global.locale.value = locale
  localStorage.setItem('lang', locale)

  // 페이지 타이틀 i18n 지원

  // Title
  const titleKey = to.meta?.titleKey as string
  console.log(titleKey)
  if (titleKey) {
    document.title = i18n.global.t(titleKey)
    updateOgTag('og:title', i18n.global.t(titleKey))
  }

  // Description
  const descKey = to.meta?.descriptionKey as string
  if (descKey) {
    const desc = i18n.global.t(descKey)
    updateMetaTag('description', desc)
    updateOgTag('og:description', desc)
  }

  // Keywords
  const keywordsKey = to.meta?.keywordsKey as string
  if (keywordsKey) {
    updateMetaTag('keywords', i18n.global.t(keywordsKey))
  }

  // OG Image
  if (to.meta?.ogImage) {
    updateOgTag('og:image', to.meta.ogImage as string)
  }

  // Canonical
  const canonical = (to.meta?.canonical as string) || `https://www.puzmu.com${to.fullPath}`
  if (canonical) {
    updateCanonical(canonical)
    updateOgTag('og:url', canonical)
  }

  next()
})

export default router
