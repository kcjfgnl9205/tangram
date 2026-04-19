import type { RouteRecordRaw } from 'vue-router'
import { RouteNames } from '@/app/router/router-name'

// catch-all — 반드시 라우트 목록 마지막에 배치
export const notFoundRoute: RouteRecordRaw = {
  path: ':pathMatch(.*)*',
  name: RouteNames.NOT_FOUND,
  component: () => import('./ui/NotFoundView.vue'),
  meta: { titleKey: 'meta.notFound.title' },
}
