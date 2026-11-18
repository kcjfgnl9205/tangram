<script setup lang="ts">
import { useAuthStore } from '@/shared/stores/auth.store'

const authStore = useAuthStore()
</script>

<template>
  <div>
    <h1 class="text-display-lg text-gray-900 mb-2">대시보드에 오신 것을 환영합니다</h1>
    <p class="text-body-lg text-gray-600 mb-12">{{ authStore.user?.email }}로 로그인했습니다</p>

    <!-- 요약 카드 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white border border-gray-200 rounded-xl p-6">
        <div class="text-caption mb-2">사용자 수</div>
        <div class="text-display-sm text-primary font-bold">-</div>
        <p class="text-body-sm text-gray-500 mt-2">데이터 로드 중</p>
      </div>

      <div class="bg-white border border-gray-200 rounded-xl p-6">
        <div class="text-caption mb-2">칠교놀이 총 개수</div>
        <div class="text-display-sm text-primary font-bold">-</div>
        <p class="text-body-sm text-gray-500 mt-2">데이터 로드 중</p>
      </div>

      <div class="bg-white border border-gray-200 rounded-xl p-6">
        <div class="text-caption mb-2">답변 대기 중</div>
        <div class="text-display-sm text-warning font-bold">-</div>
        <p class="text-body-sm text-gray-500 mt-2">문의사항</p>
      </div>

      <div class="bg-white border border-gray-200 rounded-xl p-6">
        <div class="text-caption mb-2">총 조회수</div>
        <div class="text-display-sm text-success font-bold">-</div>
        <p class="text-body-sm text-gray-500 mt-2">데이터 로드 중</p>
      </div>
    </div>

    <!-- 알림 -->
    <div class="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 class="text-heading-sm text-blue-900 mb-2">🚀 시작하기</h3>
      <p class="text-body-md text-blue-800">
        왼쪽 사이드바에서 메뉴를 선택하여 관리 페이지로 이동할 수 있습니다.
      </p>
    </div>
  </div>
</template>
