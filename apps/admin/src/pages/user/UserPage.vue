<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { fetchUsers } from '@/entities/user/api/user.api'
import type { Profile } from '@/shared/types/types'
import { Pagination } from '@/shared/ui'

const users = ref<Profile[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const pageSize = 20
const totalUsers = ref(0)
const currentPage = ref(1)

const totalPages = computed(() => Math.ceil(totalUsers.value / pageSize))

async function loadUsers() {
  isLoading.value = true
  error.value = null
  try {
    const result = await fetchUsers(currentPage.value, pageSize)
    if (result.error) {
      error.value = result.error
    } else {
      users.value = result.users
      totalUsers.value = result.total
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load users'
    console.error('loadUsers error:', err)
  } finally {
    isLoading.value = false
  }
}

watch(
  currentPage,
  () => {
    loadUsers()
  },
  { immediate: true },
)
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-display-md text-gray-900 mb-2">유저 관리</h1>
      <p class="text-body-md text-gray-600">모든 사용자 계정을 확인하고 관리합니다</p>
    </div>

    <!-- 에러 알림 -->
    <div
      v-if="error"
      class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
    >
      {{ error }}
    </div>

    <!-- 로딩 상태 -->
    <div v-if="isLoading" class="text-center py-12">
      <div
        class="inline-flex h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mb-4"
      ></div>
      <p class="text-gray-600">로딩 중...</p>
    </div>

    <!-- 테이블 -->
    <div
      v-else-if="users.length > 0"
      class="bg-white border border-gray-200 rounded-lg overflow-hidden"
    >
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-200 bg-gray-50">
            <th class="table-header">ID</th>
            <th class="table-header">이메일</th>
            <th class="table-header">가입 날짜</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in users"
            :key="user.id"
            class="border-b border-gray-200 hover:bg-gray-50"
          >
            <td class="table-cell font-mono text-xs">{{ user.id.substring(0, 8) }}...</td>
            <td class="table-cell">{{ user.email }}</td>
            <td class="table-cell text-sm">
              {{ new Date(user.created_at).toLocaleDateString('ko-KR') }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 빈 상태 -->
    <div v-else class="text-center py-12 bg-gray-50 border border-gray-200 rounded-lg">
      <p class="text-gray-600">사용자가 없습니다</p>
    </div>

    <!-- 페이지네이션 -->
    <div v-if="totalPages > 1" class="mt-6">
      <Pagination v-model:currentPage="currentPage" :totalPages="totalPages" />
    </div>
  </div>
</template>
