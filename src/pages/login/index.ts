import type { RouteRecordRaw } from 'vue-router'
import { RouteNames } from '@/app/router/router-name'
import LoginView from './ui/LoginView.vue'

export { LoginView }

export const loginRoute: RouteRecordRaw = {
  path: 'login',
  name: RouteNames.LOGIN,
  component: LoginView,
}
