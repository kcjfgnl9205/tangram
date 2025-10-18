import { createRouter, createWebHistory, RouterView } from 'vue-router'
import { storeToRefs } from 'pinia'
import { i18n } from '@/plugins/i18n'
import {
  ErrorView,
  NotFoundView,
  TangramDetailView,
  TangramListView,
  LoginView,
  SignUpView,
  HomeView,
  ContactView,
} from '@/views'
import { useAuthStore, useMetaStore } from '@/stores'
import type { Locale } from '@/types'
import { updateCanonical, updateMetaTag, updateOgTag } from '@/utils'
import { AdminLayout } from '@/components/Layout'
import {
  AdminDashBoardView,
  AdminUsersView,
  AdminTangramCreateView,
  AdminTangramMetaView,
  AdminContacts,
  AdminContactsDetail,
} from '@/views/Admin'
import { fetchTranslationMeta } from '@/api/metadata'
import { RouteNames } from '@/router/router-name'

export const SUPPORTED_LOCALES = ['en', 'ko', 'ja'] as const

const routes = [
  {
    path: `/:locale(${SUPPORTED_LOCALES.join('|')})?`,
    children: [
      {
        path: '',
        name: RouteNames.HOME,
        component: HomeView,
        meta: {
          titleKey: 'meta.home.title',
          descriptionKey: 'meta.home.description',
          keywordsKey: 'meta.home.keywords',
        },
      },
      {
        path: 'login',
        name: RouteNames.LOGIN,
        component: LoginView,
      },
      {
        path: 'signup',
        name: RouteNames.SIGNUP,
        component: SignUpView,
      },
      {
        path: 'contact',
        name: RouteNames.CONTACT,
        component: ContactView,
        meta: {
          titleKey: 'meta.contact.title',
          descriptionKey: 'meta.contact.description',
          keywordsKey: 'meta.contact.keywords',
        },
      },
      {
        path: 'admin',
        component: AdminLayout,
        meta: { requiresAdmin: true, requiresAuth: true },
        children: [
          { path: 'dashboard', name: RouteNames.ADMIN_DASHBOARD, component: AdminDashBoardView },
          { path: 'users', name: RouteNames.ADMIN_USERS, component: AdminUsersView },
          {
            path: 'metadata',
            name: RouteNames.ADMIN_METADATA,
            component: AdminTangramMetaView,
          },
          {
            path: 'contacts',
            component: RouterView,
            children: [
              { path: '', name: RouteNames.ADMIN_CONTACTS, component: AdminContacts },
              {
                path: ':id',
                name: RouteNames.ADMIN_CONTACTS_DETAIL,
                component: AdminContactsDetail,
              },
            ],
          },
          {
            path: 'tangram',
            component: RouterView,
            children: [
              {
                path: 'create',
                name: RouteNames.ADMIN_TANGRAM_CREATE,
                component: AdminTangramCreateView,
              },
            ],
          },
        ],
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
  scrollBehavior(to, from, savedPosition) {
    // 1. 뒤로가기/앞으로가기 시 이전 위치 복원
    if (savedPosition) {
      return savedPosition
    }
    // 2. 언어 변경 시 스크롤 유지
    // 예: /en/home → /ja/home
    const getPathWithoutLocale = (path: string) => {
      return path.replace(/^\/(ko|en|ja)(\/|$)/, '/')
    }

    const fromPath = getPathWithoutLocale(from.path)
    const toPath = getPathWithoutLocale(to.path)

    // 경로는 동일하고 언어만 바뀐 경우 → 스크롤 유지
    if (fromPath === toPath) {
      return false
    }

    // 3. 그 외의 경우는 맨 위로 이동
    return { top: 0 }
  },
})

router.beforeEach(async (to, _, next) => {
  const auth = useAuthStore()
  if (!auth.user && !auth.profile) await auth.initialize()

  let locale = to.params.locale as Locale | undefined

  if (!locale || !SUPPORTED_LOCALES.includes(locale)) {
    locale = (localStorage.getItem('lang') as Locale) || 'ko'
    return next(`/${locale}${to.fullPath}`)
  }

  i18n.global.locale.value = locale
  localStorage.setItem('lang', locale)

  // 다국어 스토어 저장
  const meta = await fetchTranslationMeta()
  const metaStore = useMetaStore()
  const { translations } = storeToRefs(metaStore)
  translations.value = meta

  // Title
  const titleKey = to.meta?.titleKey as string
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

  // 이미 로그인한 유저가 로그인 페이지에 접근하려 하면 → 홈으로 리다이렉트
  if ([RouteNames.LOGIN, RouteNames.SIGNUP].includes(to.name as RouteNames) && auth.user) {
    return next('/')
  }

  // 인증 필요 페이지 접근인데 로그인 안 됨
  if ((to.meta.requiresAuth || to.meta.requiresAdmin) && !auth.user) {
    return next({ name: RouteNames.LOGIN })
  }

  // 관리자 권한이 필요한 페이지에 접근할 때
  if (to.meta.requiresAdmin) {
    if (!auth.user) {
      // 로그인 안 됐으면 로그인 페이지로
      return next({ name: RouteNames.LOGIN })
    }

    if (auth.profile?.tier !== 1) {
      // tier가 1이 아니면 홈으로 리다이렉트
      alert('관리자 전용 페이지입니다.')
      return next({ name: RouteNames.TANGRAM_LIST })
    }
  }

  next()
})

export default router
