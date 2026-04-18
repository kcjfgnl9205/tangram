import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { i18n } from '@/app/providers/i18n'
import { supabase } from '@/shared/lib/supabase/supabaseClient'
import App from '@/app/App.vue'
import router from '@/app/router'
import '@/app/styles/base.css'
import { useAuthStore } from '@/entities/user'
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

  // 앱 시작 시 로그인 상태 복원
  try {
    const auth = useAuthStore()
    await auth.initialize()

    // 자동 로그인 유지 (4시간 제한)
    supabase.auth.onAuthStateChange(async (event, session: any) => {
      if (session) {
        auth.user = session.user
        auth.session = session
        const expiresAt = session.expires_at * 1000
        const now = Date.now()
        const expiresInMs = expiresAt - now

        if (expiresInMs > 4 * 60 * 60 * 1000) {
          // 4시간 넘게 유지된 세션이면 강제 로그아웃
          setTimeout(
            () => {
              auth.logout()
            },
            4 * 60 * 60 * 1000,
          )
        }
      } else {
        auth.user = null
        auth.session = null
      }
    })
  } catch (e) {
    console.error(e)
  }

  app.mount('#app')
}

initApp()
