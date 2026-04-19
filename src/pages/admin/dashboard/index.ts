import type { RouteRecordRaw } from 'vue-router'
import { RouteNames } from '@/app/router/router-name'

export const adminDashboardRoute: RouteRecordRaw = {
  path: 'dashboard',
  name: RouteNames.ADMIN_DASHBOARD,
  component: () => import('./ui/AdminDashBoardView.vue'),
}
