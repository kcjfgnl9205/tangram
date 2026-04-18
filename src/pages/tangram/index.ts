import { RouterView, type RouteRecordRaw } from 'vue-router'
import { tangramListRoute } from '@/pages/tangram-list'
import { tangramDetailRoute } from '@/pages/tangram-detail'

export const tangramRoute: RouteRecordRaw = {
  path: 'tangram',
  component: RouterView,
  children: [tangramListRoute, tangramDetailRoute],
}
