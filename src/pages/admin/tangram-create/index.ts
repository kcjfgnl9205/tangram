import type { RouteRecordRaw } from 'vue-router'
import { RouteNames } from '@/app/router/router-name'

export const adminTangramCreateRoute: RouteRecordRaw = {
  path: 'create',
  name: RouteNames.ADMIN_TANGRAM_CREATE,
  component: () => import('./ui/AdminTangramCreateView.vue'),
}
