import type { RouteRecordRaw } from 'vue-router'
import { RouteNames } from '@/app/router/router-name'
import AdminTangramCreateView from './ui/AdminTangramCreateView.vue'

export { AdminTangramCreateView }

export const adminTangramCreateRoute: RouteRecordRaw = {
  path: 'create',
  name: RouteNames.ADMIN_TANGRAM_CREATE,
  component: AdminTangramCreateView,
}
