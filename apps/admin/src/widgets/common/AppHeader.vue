<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { NavLink } from '@/shared/config/navigation'
import { ROUTE_NAME } from '@/shared/config/routes'
import { useAuthStore } from '@/shared/stores/auth.store'

interface Props {
  activeNav?: NavLink
}
defineProps<Props>()

const authStore = useAuthStore()
const router = useRouter()

function handleLogout() {
  authStore.logout()
  router.push({ name: ROUTE_NAME.LOGIN })
}
</script>

<template>
  <header class="flex items-center h-16 px-8 bg-white border-b border-gray-200">
    <div
      v-if="activeNav && !('divider' in activeNav)"
      class="flex items-center gap-2 text-gray-800"
    >
      <h1 class="text-base font-semibold">{{ activeNav.label }}</h1>
    </div>

    <!-- 유저 정보 -->
    <div class="ml-auto flex items-center gap-4">
      <div class="text-right text-sm">
        <p class="font-medium text-gray-900">{{ authStore.user?.email }}</p>
        <p class="text-gray-500 text-xs">{{ authStore.isAdmin ? '관리자' : '사용자' }}</p>
      </div>

      <button
        @click="handleLogout"
        class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
      >
        로그아웃
      </button>
    </div>
  </header>
</template>
