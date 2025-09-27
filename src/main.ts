import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { i18n } from '@/plugins/i18n'
import App from './App.vue'
import router from './router'
import '@/assets/css/base.css'
import { RouteNames } from '@/router'

const initApp = async () => {
  const app = createApp(App)

  app.use(createPinia())
  app.use(router)
  app.use(i18n)

  // 에러 페이지로 리다이렉트
  app.config.errorHandler = (err, _, info) => {
    console.error('Error:', err, 'Info:', info)
    const query = { code: '500', message: '예상치 못한 오류가 발생했습니다.' }
    router.push({ name: RouteNames.ERROR, query })
  }
  app.mount('#app')
}

initApp()
