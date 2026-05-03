import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { i18n } from '@/app/providers/i18n'
import App from '@/app/App.vue'
import router from '@/app/router'
import '@/app/styles/base.css'
import { useThemeStore } from '@/entities/theme'
import { RouteNames } from '@/app/router/router-name'

const pinia = createPinia()

const initApp = async () => {
  const app = createApp(App)

  app.use(pinia)
  app.use(router)
  app.use(i18n)

  // 에러 페이지로 리다이렉트
  app.config.errorHandler = (err, _, info) => {
    console.error('Error:', err, 'Info:', info)
    const query = { code: '500', message: '예상치 못한 오류가 발생했습니다.' }
    router.push({ name: RouteNames.ERROR, query })
  }

  // 테마 적용
  useThemeStore().initialize()

  app.mount('#app')
}

initApp()
