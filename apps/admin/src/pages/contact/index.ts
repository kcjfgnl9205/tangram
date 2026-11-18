import type { RouteRecordRaw } from 'vue-router'
import { ROUTE_NAME } from '@/shared/config/routes'

export const contactRoutes: RouteRecordRaw[] = [
  {
    name: ROUTE_NAME.CONTACTS,
    path: '/contacts',
    component: () => import('./ContactListPage.vue'),
  },
  {
    name: ROUTE_NAME.CONTACT_DETAIL,
    path: '/contacts/:id',
    component: () => import('./ContactDetailPage.vue'),
  },
]
