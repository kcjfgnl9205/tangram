import type { RouteRecordRaw } from 'vue-router'
import { RouteNames } from '@/app/router/router-name'
import AdminTangramMetaView from './ui/AdminTangramMetaView.vue'

export { AdminTangramMetaView }

export const adminMetadataRoute: RouteRecordRaw = {
  path: 'metadata',
  name: RouteNames.ADMIN_METADATA,
  component: AdminTangramMetaView,
}
