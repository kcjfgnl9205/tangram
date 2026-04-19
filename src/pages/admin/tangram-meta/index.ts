import type { RouteRecordRaw } from 'vue-router'
import { RouteNames } from '@/app/router/router-name'

export const adminMetadataRoute: RouteRecordRaw = {
  path: 'metadata',
  name: RouteNames.ADMIN_METADATA,
  component: () => import('./ui/AdminTangramMetaView.vue'),
}
