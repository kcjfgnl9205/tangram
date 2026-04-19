import type { RouteRecordRaw } from 'vue-router'
import { RouteNames } from '@/app/router/router-name'

export const adminContactsDetailRoute: RouteRecordRaw = {
  path: ':id',
  name: RouteNames.ADMIN_CONTACTS_DETAIL,
  component: () => import('./ui/AdminContactsDetail.vue'),
}
