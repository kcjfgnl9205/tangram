import type { RouteRecordRaw } from 'vue-router'
import { RouteNames } from '@/app/router/router-name'
import AdminContacts from './ui/AdminContacts.vue'

export { AdminContacts }

export const adminContactsRoute: RouteRecordRaw = {
  path: '',
  name: RouteNames.ADMIN_CONTACTS,
  component: AdminContacts,
}
