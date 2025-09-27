import { createRouter, createWebHistory } from 'vue-router'
import { i18n } from '@/plugins/i18n'
import { HomeView, ErrorView, NotFoundView, TangramDetailView } from '@/views'
import type { Locale } from '@/types'

export enum RouteNames {
  HOME = 'home',
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
        redirect: { name: RouteNames.HOME },
      },
      {
        path: 'tangram',
        name: RouteNames.HOME,
        component: HomeView,
        meta: { titleKey: 'home.meta.title' },
      },
      {
        path: 'tangram/:id',
        name: RouteNames.TANGRAM_DETAIL,
        component: TangramDetailView,
        meta: { titleKey: 'home.meta.title' },
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

router.beforeEach((to, _, next) => {
  let locale = to.params.locale as Locale | undefined

  if (!locale || !SUPPORTED_LOCALES.includes(locale)) {
    locale = (localStorage.getItem('lang') as Locale) || 'ko'
    return next(`/${locale}${to.fullPath}`)
  }

  i18n.global.locale.value = locale
  localStorage.setItem('lang', locale)

  // 페이지 타이틀 i18n 지원
  const titleKey = to.meta?.titleKey as string | undefined
  document.title = titleKey ? `${i18n.global.t(titleKey)}` : '칠교놀이'

  next()
})

export default router
