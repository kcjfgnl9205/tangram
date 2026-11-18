<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/shared/stores/auth.store'
import { ROUTE_NAME } from '@/shared/config/routes'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)

async function handleSubmit() {
  if (!email.value || !password.value) {
    alert('이메일과 비밀번호를 입력해주세요.')
    return
  }

  loading.value = true
  try {
    await authStore.login(email.value, password.value)

    // is_admin 확인
    if (!authStore.isAdmin) {
      alert('관리자 권한이 없습니다.')
      await authStore.logout()
      return
    }

    // 로그인 성공 → redirect 또는 홈으로
    const redirect = route.query.redirect as string | undefined
    await router.push(redirect || { name: ROUTE_NAME.HOME })
  } catch (err) {
    console.error('Login error:', err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center px-4">
    <div class="w-full max-w-sm bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <h1 class="text-xl font-bold text-gray-900 mb-1">관리자 로그인</h1>
      <p class="text-sm text-gray-500 mb-6">이메일과 비밀번호로 로그인하세요</p>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">이메일</label>
          <input
            v-model="email"
            type="email"
            autocomplete="email"
            placeholder="admin@example.com"
            :disabled="loading"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
          <input
            v-model="password"
            type="password"
            autocomplete="current-password"
            placeholder="••••••••"
            :disabled="loading"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />
        </div>

        <div
          v-if="authStore.error"
          class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"
        >
          {{ authStore.error }}
        </div>

        <button
          type="submit"
          :disabled="loading || authStore.isLoading"
          class="w-full py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {{ loading || authStore.isLoading ? '로그인 중...' : '로그인' }}
        </button>
      </form>

      <p class="mt-5 text-xs text-gray-400 text-center">
        Supabase Authentication으로 보안 로그인을 제공합니다.
      </p>
    </div>
  </div>
</template>
