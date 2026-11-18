import type { RouteRecordRaw } from 'vue-router'
import { ROUTE_NAME } from '@/shared/config/routes'

export const homeRoute: RouteRecordRaw = {
  name: ROUTE_NAME.HOME,
  path: '/',
  component: () => import('./HomePage.vue'),
}
