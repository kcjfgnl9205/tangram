import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/shared/stores/auth.store'
import { ROUTE_NAME } from '@/shared/config/routes'
import { loginRoute } from '@/pages/login'
import { homeRoute } from '@/pages/home'
import { usersRoute } from '@/pages/user'
import { tangramsRoute } from '@/pages/tangram'
import { metadataRoute } from '@/pages/metadata'
import { contactRoutes } from '@/pages/contact'
import { shopLinksRoute } from '@/pages/shop'
import { uiComponentsRoute } from '@/pages/ui-components'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAdmin?: boolean // true면 is_admin 권한 필요
  }
}

const routes: RouteRecordRaw[] = [
  loginRoute,
  homeRoute,
  usersRoute,
  tangramsRoute,
  metadataRoute,
  ...contactRoutes,
  shopLinksRoute,
  uiComponentsRoute,
  {
    path: '/:pathMatch(.*)*',
    redirect: () => ({ name: ROUTE_NAME.HOME }),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, _from) => {
  const authStore = useAuthStore()

  // 첫 로드 시에만 인증 상태 초기화
  if (!authStore.user && !authStore.isLoading) {
    await authStore.initAuth()
  }

  // 비로그인이고 로그인 페이지가 아닌 경우 → 로그인 페이지로
  if (!authStore.isAuthenticated && to.name !== ROUTE_NAME.LOGIN) {
    return { name: ROUTE_NAME.LOGIN, query: { redirect: to.fullPath } }
  }

  // 로그인되었고 로그인 페이지 접근 시 → 홈으로
  if (authStore.isAuthenticated && to.name === ROUTE_NAME.LOGIN) {
    return { name: ROUTE_NAME.HOME }
  }

  // 관리자 권한 필요한 페이지
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    console.warn('Access denied: not an admin')
    alert('관리자 권한이 필요합니다.')
    return { name: ROUTE_NAME.LOGIN }
  }

  return true
})

export default router
