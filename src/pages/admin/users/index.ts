import type { RouteRecordRaw } from 'vue-router'
import { RouteNames } from '@/app/router/router-name'
import AdminUsersView from './ui/AdminUsersView.vue'

export { AdminUsersView }

export const adminUsersRoute: RouteRecordRaw = {
  path: 'users',
  name: RouteNames.ADMIN_USERS,
  component: AdminUsersView,
}
