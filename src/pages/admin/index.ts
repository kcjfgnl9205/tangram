import { RouterView, type RouteRecordRaw } from 'vue-router'
import { AdminLayout } from '@/widgets/admin-layout'
import { adminDashboardRoute } from './dashboard'
import { adminUsersRoute } from './users'
import { adminMetadataRoute } from './tangram-meta'
import { adminTangramCreateRoute } from './tangram-create'
import { adminContactsRoute } from './contacts'
import { adminContactsDetailRoute } from './contact-detail'

export const adminRoute: RouteRecordRaw = {
  path: 'admin',
  component: AdminLayout,
  meta: { requiresAdmin: true, requiresAuth: true },
  children: [
    adminDashboardRoute,
    adminUsersRoute,
    adminMetadataRoute,
    {
      path: 'contacts',
      component: RouterView,
      children: [adminContactsRoute, adminContactsDetailRoute],
    },
    {
      path: 'tangram',
      component: RouterView,
      children: [adminTangramCreateRoute],
    },
  ],
}
