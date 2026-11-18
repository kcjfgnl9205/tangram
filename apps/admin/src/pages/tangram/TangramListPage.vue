<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useModalStore } from '@/shared/stores/modal.store'
import { fetchTangrams, deleteTangram } from '@/entities/tangram/api/tangram.api'
import type { Tangram } from '@/shared/types/types'
import TangramEditModal from './TangramEditModal.vue'
import { getResourceUrl } from '@/shared/lib/storage'

const tangrams = ref<Tangram[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const currentPage = ref(1)
const pageSize = 12
const totalTangrams = ref(0)

const modalStore = useModalStore()

async function loadTangrams() {
  isLoading.value = true
  error.value = null
  try {
    const result = await fetchTangrams(currentPage.value, pageSize)
    if (result.error) {
      error.value = result.error
    } else {
      console.log(result)
      tangrams.value = result.tangrams
      totalTangrams.value = result.total
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load tangrams'
    console.error('loadTangrams error:', err)
  } finally {
    isLoading.value = false
  }
}

const handleEditClick = (tangram: Tangram) => {
  modalStore.onOpen(TangramEditModal, {
    tangram,
    onSuccess: () => {
      loadTangrams()
      modalStore.onClose()
    },
  })
}

const handleDeleteClick = async (id: number) => {
  if (!confirm('이 칠교놀이를 삭제하시겠습니까? R2 스토리지의 파일도 함께 삭제됩니다.')) {
    return
  }

  try {
    const result = await deleteTangram(id)
    if (result.error) {
      alert(`삭제 실패: ${result.error}`)
    } else {
      alert('삭제되었습니다')
      loadTangrams()
    }
  } catch (err) {
    console.error('handleDeleteClick error:', err)
    alert('삭제 중 오류가 발생했습니다')
  }
}

onMounted(loadTangrams)
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-display-md text-gray-900 mb-2">칠교놀이 관리</h1>
      <p class="text-body-md text-gray-600">칠교놀이 콘텐츠를 관리하고 편집합니다</p>
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
      v-else-if="tangrams.length > 0"
      class="overflow-hidden rounded-xl border border-gray-200 bg-white"
    >
      <table class="min-w-full">
        <thead>
          <tr
            class="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-600"
          >
            <th class="table-header">썸네일</th>
            <th class="table-header">Key</th>
            <th class="table-header">조회/다운로드</th>
            <th class="table-header">생성일</th>
            <th class="table-header">작업</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="tangram in tangrams"
            :key="tangram.id"
            class="border-b border-gray-200 hover:bg-gray-50"
          >
            <td class="table-cell w-24 p-2">
              <div class="h-16 w-24 overflow-hidden rounded-lg bg-gray-100">
                <img
                  v-if="tangram.thumbnail_url"
                  :src="getResourceUrl(tangram.thumbnail_url)"
                  :alt="tangram.key"
                  class="h-full w-full object-cover"
                />
                <div v-else class="flex h-full items-center justify-center text-gray-400 text-xs">
                  없음
                </div>
              </div>
            </td>
            <td class="table-cell">
              <div class="text-sm font-medium text-gray-900 truncate max-w-[180px]">
                {{ tangram.key }}
              </div>
              <div class="text-caption text-gray-500">{{ String(tangram.id).slice(0, 8) }}...</div>
            </td>

            <td class="table-cell text-sm text-gray-700">
              <div class="flex flex-col gap-1">
                <span>조회 {{ tangram.view_count }}</span>
                <span>다운 {{ tangram.download_count }}</span>
              </div>
            </td>
            <td class="table-cell text-sm text-gray-700">
              {{ new Date(tangram.created_at).toLocaleDateString('ko-KR') }}
            </td>
            <td class="table-cell py-3">
              <div class="flex flex gap-2">
                <button @click="handleEditClick(tangram)" class="btn-primary text-xs py-2">
                  수정
                </button>
                <button @click="handleDeleteClick(tangram.id)" class="btn-danger text-xs py-2">
                  삭제
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 빈 상태 -->
    <div v-else class="text-center py-12 bg-gray-50 border border-gray-200 rounded-lg">
      <p class="text-gray-600">칠교놀이가 없습니다</p>
    </div>
  </div>
</template>
