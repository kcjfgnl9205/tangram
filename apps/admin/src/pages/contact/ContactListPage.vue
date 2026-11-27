<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ROUTE_NAME } from '@/shared/config/routes'
import { fetchContacts, type Contact } from '@/entities/contact/api/contact.api'
import { CONTACT_STATUS, CONTACT_STATUS_LABEL } from '@/shared/types/types'

const contacts = ref<Contact[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const currentPage = ref(1)
const pageSize = 20
const totalContacts = ref(0)

const router = useRouter()

const statusLabel = (status: number): string =>
  CONTACT_STATUS_LABEL[status] ?? `알 수 없음(${status})`

const statusColor = (status: number): string =>
  status === CONTACT_STATUS.COMPLETED
    ? 'bg-green-100 text-green-800'
    : 'bg-yellow-100 text-yellow-800'

async function loadContacts() {
  isLoading.value = true
  error.value = null
  try {
    const result = await fetchContacts(currentPage.value, pageSize)
    if (result.error) {
      error.value = result.error
    } else {
      contacts.value = result.contacts
      totalContacts.value = result.total
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load contacts'
    console.error('loadContacts error:', err)
  } finally {
    isLoading.value = false
  }
}

const handleViewDetail = (id: number) => {
  router.push({ name: ROUTE_NAME.CONTACT_DETAIL, params: { id: String(id) } })
}

onMounted(loadContacts)
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-display-md text-gray-900 mb-2">문의사항 관리</h1>
      <p class="text-body-md text-gray-600">사용자 문의사항을 확인하고 관리합니다</p>
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
      v-else-if="contacts.length > 0"
      class="bg-white border border-gray-200 rounded-lg overflow-hidden"
    >
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-200 bg-gray-50">
            <th class="table-header">이메일</th>
            <th class="table-header">제목</th>
            <th class="table-header">상태</th>
            <th class="table-header">작성 날짜</th>
            <th class="table-header w-20">작업</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="contact in contacts"
            :key="contact.id"
            class="border-b border-gray-200 hover:bg-gray-50"
          >
            <td class="table-cell text-sm">{{ contact.email }}</td>
            <td class="table-cell font-medium truncate">{{ contact.title }}</td>
            <td class="table-cell">
              <span
                :class="['text-xs font-semibold px-2 py-1 rounded', statusColor(contact.status)]"
              >
                {{ statusLabel(contact.status) }}
              </span>
            </td>
            <td class="table-cell text-sm">
              {{ new Date(contact.created_at).toLocaleDateString('ko-KR') }}
            </td>
            <td class="table-cell text-center">
              <button
                @click="handleViewDetail(contact.id)"
                class="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
              >
                보기
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 빈 상태 -->
    <div v-else class="text-center py-12 bg-gray-50 border border-gray-200 rounded-lg">
      <p class="text-gray-600">문의사항이 없습니다</p>
    </div>
  </div>
</template>
