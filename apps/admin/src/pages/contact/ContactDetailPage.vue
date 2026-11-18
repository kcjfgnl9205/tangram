<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ROUTE_NAME } from '@/shared/config/routes'
import {
  fetchContactById,
  updateContactStatus,
  type Contact,
} from '@/entities/contact/api/contact.api'

const route = useRoute()
const router = useRouter()

const contact = ref<Contact | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)
const selectedStatus = ref<string>('대기')
const isUpdating = ref(false)

const statusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    대기: '대기 중',
    답변완료: '답변 완료',
    보류: '보류',
  }
  return labels[status] || status
}

const statusColor = (status: string): string => {
  const colors: Record<string, string> = {
    대기: 'bg-yellow-100 text-yellow-800',
    답변완료: 'bg-green-100 text-green-800',
    보류: 'bg-gray-100 text-gray-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

async function loadContact() {
  const id = route.params.id as string
  isLoading.value = true
  error.value = null
  try {
    const result = await fetchContactById(id)
    if (result.error) {
      error.value = result.error
    } else if (result.contact) {
      contact.value = result.contact
      selectedStatus.value = result.contact.status
    } else {
      error.value = '문의사항을 찾을 수 없습니다'
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load contact'
    console.error('loadContact error:', err)
  } finally {
    isLoading.value = false
  }
}

const handleStatusUpdate = async () => {
  if (!contact.value) return

  isUpdating.value = true
  try {
    const result = await updateContactStatus(contact.value.id, selectedStatus.value)
    if (result.error) {
      alert(`업데이트 실패: ${result.error}`)
    } else {
      alert('상태가 업데이트되었습니다')
      loadContact()
    }
  } catch (err) {
    console.error('handleStatusUpdate error:', err)
    alert('업데이트 중 오류가 발생했습니다')
  } finally {
    isUpdating.value = false
  }
}

const handleGoBack = () => {
  router.push({ name: ROUTE_NAME.CONTACTS })
}

onMounted(loadContact)
</script>

<template>
  <div>
    <!-- 헤더 -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <button
          @click="handleGoBack"
          class="mb-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
        >
          ← 목록으로 돌아가기
        </button>
        <h1 class="text-display-md text-gray-900">문의사항 상세</h1>
      </div>
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

    <!-- 상세 내용 -->
    <div v-else-if="contact" class="bg-white border border-gray-200 rounded-lg p-8">
      <!-- 상단 정보 -->
      <div class="grid grid-cols-2 gap-6 mb-8 pb-8 border-b border-gray-200">
        <div>
          <p class="text-caption mb-1">이메일</p>
          <p class="text-heading-sm text-gray-900">{{ contact.email }}</p>
        </div>
        <div>
          <p class="text-caption mb-1">작성 날짜</p>
          <p class="text-heading-sm text-gray-900">
            {{
              new Date(contact.created_at).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            }}
          </p>
        </div>
      </div>

      <!-- 제목 -->
      <div class="mb-8">
        <p class="text-caption mb-2">제목</p>
        <h2 class="text-heading-lg text-gray-900">{{ contact.title }}</h2>
      </div>

      <!-- 내용 -->
      <div class="mb-8">
        <p class="text-caption mb-3">내용</p>
        <div
          class="p-4 bg-gray-50 rounded-lg border border-gray-200 text-body-md text-gray-700 whitespace-pre-wrap"
        >
          {{ contact.contents }}
        </div>
      </div>

      <!-- 상태 관리 -->
      <div class="pt-8 border-t border-gray-200">
        <p class="text-caption mb-3">상태 관리</p>
        <div class="flex items-center gap-4">
          <select v-model="selectedStatus" class="input-base max-w-xs" :disabled="isUpdating">
            <option value="대기">대기 중</option>
            <option value="답변완료">답변 완료</option>
            <option value="보류">보류</option>
          </select>
          <button
            @click="handleStatusUpdate"
            :disabled="isUpdating || selectedStatus === contact.status"
            class="btn-primary"
          >
            {{ isUpdating ? '업데이트 중...' : '상태 업데이트' }}
          </button>
          <span :class="['text-xs font-semibold px-3 py-1 rounded', statusColor(selectedStatus)]">
            {{ statusLabel(selectedStatus) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
