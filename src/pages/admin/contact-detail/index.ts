import type { RouteRecordRaw } from 'vue-router'
import { RouteNames } from '@/app/router/router-name'
import AdminContactsDetail from './ui/AdminContactsDetail.vue'

export { AdminContactsDetail }

export const adminContactsDetailRoute: RouteRecordRaw = {
  path: ':id',
  name: RouteNames.ADMIN_CONTACTS_DETAIL,
  component: AdminContactsDetail,
}
