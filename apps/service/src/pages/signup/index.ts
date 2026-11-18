import type { RouteRecordRaw } from 'vue-router'
import { RouteNames } from '@/app/router/router-name'

export const signupRoute: RouteRecordRaw = {
  path: 'signup',
  name: RouteNames.SIGNUP,
  component: () => import('./ui/SignUpView.vue'),
}
