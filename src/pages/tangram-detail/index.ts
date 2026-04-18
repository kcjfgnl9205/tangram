import type { RouteRecordRaw } from 'vue-router'
import { RouteNames } from '@/app/router/router-name'
import TangramDetailView from './ui/TangramDetailView.vue'

export { TangramDetailView }

export const tangramDetailRoute: RouteRecordRaw = {
  path: ':id',
  name: RouteNames.TANGRAM_DETAIL,
  component: TangramDetailView,
  meta: {
    titleKey: 'meta.tangram.detail.title',
    descriptionKey: 'meta.tangram.detail.description',
    keywordsKey: 'meta.tangram.list.keywords',
    footer: false,
  },
}
