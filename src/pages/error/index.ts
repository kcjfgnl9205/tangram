import type { RouteRecordRaw } from 'vue-router'
import { RouteNames } from '@/app/router/router-name'
import ErrorView from './ui/ErrorView.vue'

export { ErrorView }

export const errorRoute: RouteRecordRaw = {
  path: 'error',
  name: RouteNames.ERROR,
  component: ErrorView,
  meta: { titleKey: 'meta.error.title' },
}
