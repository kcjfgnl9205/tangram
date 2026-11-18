import './assets/style/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAuthStore } from '@/shared/stores/auth.store'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)

// 앱 마운트 전에 Auth 초기화
const authStore = useAuthStore()
await authStore.initAuth()

app.use(router)
app.mount('#app')
