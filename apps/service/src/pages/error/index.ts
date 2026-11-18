import type { RouteRecordRaw } from 'vue-router'
import { RouteNames } from '@/app/router/router-name'

export const errorRoute: RouteRecordRaw = {
  path: 'error',
  name: RouteNames.ERROR,
  component: () => import('./ui/ErrorView.vue'),
  meta: { titleKey: 'meta.error.title' },
}
