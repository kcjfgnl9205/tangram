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
              titleKey: 'tangram.meta.tangram.title',
              subTitleKey: 'tangram.meta.tangram.list.title',
              descriptionKey: 'tangram.meta.tangram.list.description',
            },
          },
          {
            path: 'create',
            name: RouteNames.TANGRAM_CREATE,
            component: TangramCreateView,
            meta: {
              titleKey: 'tangram.meta.tangram.title',
              subTitleKey: 'tangram.meta.tangram.create.title',
              descriptionKey: 'tangram.meta.tangram.create.description',
              footer: false,
            },
          },
          {
            path: ':id',
            name: RouteNames.TANGRAM_DETAIL,
            component: TangramDetailView,
            meta: {
              titleKey: 'tangram.meta.tangram.title',
              subTitleKey: 'tangram.meta.tangram.detail.title',
              descriptionKey: 'tangram.meta.tangram.detail.description',
              footer: false,
            },
          },
        ],
      },

      {
        path: 'error',
        name: RouteNames.ERROR,
        component: ErrorView,
        meta: { titleKey: 'error.meta.title' },
      },
      {
        path: ':pathMatch(.*)*',
        name: RouteNames.NOT_FOUND,
        component: NotFoundView,
        meta: { titleKey: 'notFound.meta.title' },
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
  const titleKey = to.meta?.titleKey as string | undefined
  const subTitleKey = to.meta?.subTitleKey as string | undefined
  const descKey = to.meta?.descriptionKey as string | undefined

  const subTitle = subTitleKey ? ` | ${i18n.global.t(subTitleKey)}` : ''
  document.title = titleKey ? `${i18n.global.t(titleKey)} ${subTitle}` : '칠교놀이'

  if (descKey) {
    const metaDesc = document.querySelector("meta[name='description']")
    if (metaDesc) {
      metaDesc.setAttribute('content', i18n.global.t(descKey))
    } else {
      const descTag = document.createElement('meta')
      descTag.name = 'description'
      descTag.content = i18n.global.t(descKey)
      document.head.appendChild(descTag)
    }
  }

  next()
})

export default router
