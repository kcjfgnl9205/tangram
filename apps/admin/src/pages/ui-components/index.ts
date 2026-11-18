import type { RouteRecordRaw } from 'vue-router'
import { ROUTE_NAME } from '@/shared/config/routes'

export const uiComponentsRoute: RouteRecordRaw = {
  name: ROUTE_NAME.UI_COMPONENTS,
  path: '/ui-components',
  component: () => import('./UiComponentsPage.vue'),
}
