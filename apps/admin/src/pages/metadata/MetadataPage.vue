<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  fetchMetadata,
  createMetadata,
  updateMetadata,
  deleteMetadata,
} from '@/entities/metadata/api/metadata.api'
import type { TranslationMeta } from '@/shared/types/types'

const metadata = ref<TranslationMeta[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

// 새로운 항목 추가
const showAddForm = ref(false)
const newKey = ref('')
const newKo = ref('')
const newEn = ref('')
const newJa = ref('')
const isAddingLoading = ref(false)

async function loadMetadata() {
  isLoading.value = true
  error.value = null
  try {
    const result = await fetchMetadata(1, 1000)
    if (result.error) {
      error.value = result.error
    } else {
      metadata.value = result.metadata
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load metadata'
    console.error('loadMetadata error:', err)
  } finally {
    isLoading.value = false
  }
}

const handleAddNew = async () => {
  if (!newKey.value.trim() || !newKo.value.trim()) {
    alert('key와 ko(한국어)는 필수입니다')
    return
  }

  isAddingLoading.value = true
  try {
    const result = await createMetadata({
      key: newKey.value,
      ko: newKo.value,
      en: newEn.value || newKo.value,
      ja: newJa.value || newKo.value,
    })

    if (result.error) {
      alert(`추가 실패: ${result.error}`)
    } else {
      alert('추가되었습니다')
      newKey.value = ''
      newKo.value = ''
      newEn.value = ''
      newJa.value = ''
      showAddForm.value = false
      loadMetadata()
    }
  } catch (err) {
    console.error('handleAddNew error:', err)
    alert('추가 중 오류가 발생했습니다')
  } finally {
    isAddingLoading.value = false
  }
}

const handleUpdate = async (item: TranslationMeta, field: 'ko' | 'en' | 'ja', newValue: string) => {
  try {
    const result = await updateMetadata(item.id, {
      [field]: newValue,
    })

    if (result.error) {
      alert(`업데이트 실패: ${result.error}`)
      loadMetadata()
    }
  } catch (err) {
    console.error('handleUpdate error:', err)
    alert('업데이트 중 오류가 발생했습니다')
  }
}

const handleDelete = async (id: string) => {
  if (!confirm('이 항목을 삭제하시겠습니까?')) {
    return
  }

  try {
    const result = await deleteMetadata(id)
    if (result.error) {
      alert(`삭제 실패: ${result.error}`)
    } else {
      alert('삭제되었습니다')
      loadMetadata()
    }
  } catch (err) {
    console.error('handleDelete error:', err)
    alert('삭제 중 오류가 발생했습니다')
  }
}

onMounted(loadMetadata)
</script>

<template>
  <div>
    <div class="mb-6 flex justify-between items-start">
      <div>
        <h1 class="text-display-md text-gray-900 mb-2">메타데이터 관리</h1>
        <p class="text-body-md text-gray-600">다국어 메타데이터를 관리합니다</p>
      </div>
      <button @click="showAddForm = !showAddForm" class="btn-primary">+ 새 항목</button>
    </div>

    <!-- 새 항목 추가 폼 -->
    <div v-if="showAddForm" class="mb-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 class="text-heading-sm text-blue-900 mb-4">새 항목 추가</h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <input
          v-model="newKey"
          type="text"
          placeholder="Key"
          class="input-base"
          :disabled="isAddingLoading"
        />
        <input
          v-model="newKo"
          type="text"
          placeholder="한국어"
          class="input-base"
          :disabled="isAddingLoading"
        />
        <input
          v-model="newEn"
          type="text"
          placeholder="English"
          class="input-base"
          :disabled="isAddingLoading"
        />
        <input
          v-model="newJa"
          type="text"
          placeholder="日本語"
          class="input-base"
          :disabled="isAddingLoading"
        />
      </div>
      <div class="flex gap-3 justify-end">
        <button
          @click="showAddForm = false"
          class="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          취소
        </button>
        <button @click="handleAddNew" :disabled="isAddingLoading" class="btn-primary">
          {{ isAddingLoading ? '추가 중...' : '추가' }}
        </button>
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

    <!-- 테이블 -->
    <div
      v-else-if="metadata.length > 0"
      class="bg-white border border-gray-200 rounded-lg overflow-hidden"
    >
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-200 bg-gray-50">
            <th class="table-header">Key</th>
            <th class="table-header">한국어 (ko)</th>
            <th class="table-header">English (en)</th>
            <th class="table-header">日本語 (ja)</th>
            <th class="table-header w-20">작업</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in metadata"
            :key="item.id"
            class="border-b border-gray-200 hover:bg-gray-50"
          >
            <td class="table-cell font-mono text-xs">{{ item.key }}</td>
            <td class="table-cell">
              <input
                type="text"
                :value="item.ko"
                @blur="(e) => handleUpdate(item, 'ko', (e.target as HTMLInputElement).value)"
                class="input-base text-sm"
              />
            </td>
            <td class="table-cell">
              <input
                type="text"
                :value="item.en"
                @blur="(e) => handleUpdate(item, 'en', (e.target as HTMLInputElement).value)"
                class="input-base text-sm"
              />
            </td>
            <td class="table-cell">
              <input
                type="text"
                :value="item.ja"
                @blur="(e) => handleUpdate(item, 'ja', (e.target as HTMLInputElement).value)"
                class="input-base text-sm"
              />
            </td>
            <td class="table-cell text-center">
              <button
                @click="handleDelete(item.id)"
                class="text-danger hover:text-danger-dark text-sm font-medium transition-colors"
              >
                삭제
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 빈 상태 -->
    <div v-else class="text-center py-12 bg-gray-50 border border-gray-200 rounded-lg">
      <p class="text-gray-600">메타데이터가 없습니다</p>
    </div>
  </div>
</template>
