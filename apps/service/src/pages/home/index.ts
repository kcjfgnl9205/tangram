import type { RouteRecordRaw } from 'vue-router'
import { RouteNames } from '@/app/router/router-name'

export const homeRoute: RouteRecordRaw = {
  path: '',
  name: RouteNames.HOME,
  component: () => import('./ui/HomeView.vue'),
  meta: {
    titleKey: 'meta.home.title',
    descriptionKey: 'meta.home.description',
    keywordsKey: 'meta.home.keywords',
  },
}
