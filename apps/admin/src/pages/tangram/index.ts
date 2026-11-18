import type { RouteRecordRaw } from 'vue-router'
import { ROUTE_NAME } from '@/shared/config/routes'

export const tangramsRoute: RouteRecordRaw = {
  name: ROUTE_NAME.TANGRAMS,
  path: '/tangrams',
  component: () => import('./TangramListPage.vue'),
}
