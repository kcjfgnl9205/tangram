<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/shared/stores/auth.store'
import AppLayout from '@/widgets/common/AppLayout.vue'
import Modal from '@/shared/modal/Modal.vue'
import Toast from '@/shared/ui/Toast.vue'
import { ROUTE_NAME } from '@/shared/config/routes'

const route = useRoute()
const authStore = useAuthStore()

// 로그인 페이지는 레이아웃 없이 보임
const isLoginPage = computed(() => route.name === ROUTE_NAME.LOGIN)
</script>

<template>
  <!-- 로그인 페이지: 레이아웃 없이 직접 렌더링 -->
  <RouterView v-if="isLoginPage" />

  <!-- 인증된 페이지: AppLayout 내부에서 렌더링 -->
  <AppLayout v-else-if="authStore.isAuthenticated">
    <RouterView />
  </AppLayout>

  <!-- 로딩 또는 미인증 상태 -->
  <div v-else class="h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <div
        class="inline-flex h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mb-4"
      ></div>
      <p class="text-gray-600">로딩 중...</p>
    </div>
  </div>

  <!-- 모달 포탈: 전역에서 항상 마운트 -->
  <Modal />

  <!-- 토스트 포탈: 전역에서 항상 마운트 -->
  <Toast />
</template>
