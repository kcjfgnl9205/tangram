import type { RouteRecordRaw } from 'vue-router'
import { ROUTE_NAME } from '@/shared/config/routes'

export const shopLinksRoute: RouteRecordRaw = {
  name: ROUTE_NAME.SHOP_LINKS,
  path: '/shop-links',
  component: () => import('./ShopLinkListPage.vue'),
}
