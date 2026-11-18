import type { RouteRecordRaw } from 'vue-router'
import { ROUTE_NAME } from '@/shared/config/routes'

export const loginRoute: RouteRecordRaw = {
  name: ROUTE_NAME.LOGIN,
  path: '/login',
  component: () => import('./LoginPage.vue'),
  meta: { public: true },
}
