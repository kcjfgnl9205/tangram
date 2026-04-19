import type { RouteRecordRaw } from 'vue-router'
import { RouteNames } from '@/app/router/router-name'

export const adminUsersRoute: RouteRecordRaw = {
  path: 'users',
  name: RouteNames.ADMIN_USERS,
  component: () => import('./ui/AdminUsersView.vue'),
}
