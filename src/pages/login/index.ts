import type { RouteRecordRaw } from 'vue-router'
import { RouteNames } from '@/app/router/router-name'

export const loginRoute: RouteRecordRaw = {
  path: 'login',
  name: RouteNames.LOGIN,
  component: () => import('./ui/LoginView.vue'),
}
