import type { RouteRecordRaw } from 'vue-router'
import { RouteNames } from '@/app/router/router-name'

export const shopRoute: RouteRecordRaw = {
  path: 'shop',
  name: RouteNames.SHOP,
  component: () => import('./ui/ShopView.vue'),
  meta: {
    titleKey: 'meta.shop.title',
    descriptionKey: 'meta.shop.description',
    keywordsKey: 'meta.shop.keywords',
  },
}
