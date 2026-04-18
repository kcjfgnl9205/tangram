import type { RouteRecordRaw } from 'vue-router'
import { RouteNames } from '@/app/router/router-name'
import SignUpView from './ui/SignUpView.vue'

export { SignUpView }

export const signupRoute: RouteRecordRaw = {
  path: 'signup',
  name: RouteNames.SIGNUP,
  component: SignUpView,
}
