import type { RouteRecordRaw } from 'vue-router'
import { RouteNames } from '@/app/router/router-name'
import AdminDashBoardView from './ui/AdminDashBoardView.vue'

export { AdminDashBoardView }

export const adminDashboardRoute: RouteRecordRaw = {
  path: 'dashboard',
  name: RouteNames.ADMIN_DASHBOARD,
  component: AdminDashBoardView,
}
