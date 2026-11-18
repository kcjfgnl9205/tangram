import type { RouteRecordRaw } from 'vue-router'
import { ROUTE_NAME } from '@/shared/config/routes'

export const usersRoute: RouteRecordRaw = {
  name: ROUTE_NAME.USERS,
  path: '/users',
  component: () => import('./UserPage.vue'),
}
