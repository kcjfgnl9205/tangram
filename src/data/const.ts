import { RouteNames } from '@/router/router-name'
import type { NavItem } from '@/types'

export const ADMIN_SIDEBAR_NAV: NavItem[] = [
  { labelKey: 'admin.dashboard.title', name: RouteNames.ADMIN_DASHBOARD },
  {
    labelKey: 'admin.users.title',
    name: RouteNames.ADMIN_USERS,
  },
  {
    labelKey: 'admin.tangramMeta.title',
    name: RouteNames.ADMIN_TANGRAM_META,
  },
  {
    labelKey: 'admin.contact.title',
    name: RouteNames.ADMIN_CONTACTS,
  },
  // { divider: true },
]
