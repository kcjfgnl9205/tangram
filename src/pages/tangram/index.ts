import { RouterView, type RouteRecordRaw } from 'vue-router'
import { RouteNames } from '@/app/router/router-name'

export const tangramRoute: RouteRecordRaw = {
  path: 'tangram',
  component: RouterView,
  children: [
    {
      path: '',
      name: RouteNames.TANGRAM_LIST,
      component: () => import('./ui/TangramListView.vue'),
      meta: {
        titleKey: 'meta.tangram.list.title',
        descriptionKey: 'meta.tangram.list.description',
        keywordsKey: 'meta.tangram.list.keywords',
      },
    },
    {
      path: ':id',
      name: RouteNames.TANGRAM_DETAIL,
      component: () => import('./ui/TangramDetailView.vue'),
      meta: {
        titleKey: 'meta.tangram.detail.title',
        descriptionKey: 'meta.tangram.detail.description',
        keywordsKey: 'meta.tangram.list.keywords',
        footer: false,
      },
    },
  ],
}
