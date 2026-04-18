import type { RouteRecordRaw } from 'vue-router'
import { RouteNames } from '@/app/router/router-name'
import HomeView from './ui/HomeView.vue'

export { HomeView }

export const homeRoute: RouteRecordRaw = {
  path: '',
  name: RouteNames.HOME,
  component: HomeView,
  meta: {
    titleKey: 'meta.home.title',
    descriptionKey: 'meta.home.description',
    keywordsKey: 'meta.home.keywords',
  },
}
