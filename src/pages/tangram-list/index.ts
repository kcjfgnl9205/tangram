import type { RouteRecordRaw } from 'vue-router'
import { RouteNames } from '@/app/router/router-name'
import TangramListView from './ui/TangramListView.vue'

export { TangramListView }

export const tangramListRoute: RouteRecordRaw = {
  path: '',
  name: RouteNames.TANGRAM_LIST,
  component: TangramListView,
  meta: {
    titleKey: 'meta.tangram.list.title',
    descriptionKey: 'meta.tangram.list.description',
    keywordsKey: 'meta.tangram.list.keywords',
  },
}
