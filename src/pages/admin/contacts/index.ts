import type { RouteRecordRaw } from 'vue-router'
import { RouteNames } from '@/app/router/router-name'

export const adminContactsRoute: RouteRecordRaw = {
  path: '',
  name: RouteNames.ADMIN_CONTACTS,
  component: () => import('./ui/AdminContacts.vue'),
}
