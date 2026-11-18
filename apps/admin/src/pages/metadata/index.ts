import type { RouteRecordRaw } from 'vue-router'
import { ROUTE_NAME } from '@/shared/config/routes'

export const metadataRoute: RouteRecordRaw = {
  name: ROUTE_NAME.METADATA,
  path: '/metadata',
  component: () => import('./MetadataPage.vue'),
}
