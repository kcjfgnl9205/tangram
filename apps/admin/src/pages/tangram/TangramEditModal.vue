<script setup lang="ts">
import { ref, computed } from 'vue'
import { useModalStore } from '@/shared/stores/modal.store'
import { updateTangram } from '@/entities/tangram/api/tangram.api'
import type { Tangram } from '@/shared/types/types'

interface Props {
  tangram: Tangram
  onSuccess?: () => void
}

const props = defineProps<Props>()
const modalStore = useModalStore()

// 사용자 생성 도안은 key 가 비어 있다 — 운영자가 공식 승격하며 채운다
const key = ref(props.tangram.key ?? '')
const difficulty = ref(props.tangram.difficulty)
const showAnswerPreview = ref(props.tangram.show_answer_preview)
const isLoading = ref(false)
const error = ref<string | null>(null)

const isDirty = computed(() => {
  return (
    key.value !== props.tangram.key ||
    difficulty.value !== props.tangram.difficulty ||
    showAnswerPreview.value !== props.tangram.show_answer_preview
  )
})

const handleSave = async () => {
  error.value = null

  if (!key.value.trim()) {
    error.value = 'key를 입력해주세요'
    return
  }

  isLoading.value = true
  try {
    const result = await updateTangram(props.tangram.id, {
      key: key.value,
      difficulty: difficulty.value,
      show_answer_preview: showAnswerPreview.value,
    })

    if (result.error) {
      error.value = result.error
    } else {
      alert('저장되었습니다')
      props.onSuccess?.()
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Save failed'
    console.error('handleSave error:', err)
  } finally {
    isLoading.value = false
  }
}

const handleClose = () => {
  modalStore.onClose()
}
</script>

<template>
  <div class="flex justify-center gap-2 min-w-96 min-h-96">
    <div class="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
      <!-- 헤더 -->
      <div
        class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center"
      >
        <h2 class="text-heading-md text-gray-900">칠교놀이 편집</h2>
        <button @click="handleClose" class="text-gray-500 hover:text-gray-700 transition-colors">
          ✕
        </button>
      </div>

      <!-- 내용 -->
      <div class="p-6 space-y-4">
        <!-- 에러 -->
        <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {{ error }}
        </div>

        <!-- Key -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Key</label>
          <input v-model="key" type="text" class="input-base" :disabled="isLoading" />
        </div>

        <!-- 난이도 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">난이도</label>
          <select v-model.number="difficulty" class="input-base" :disabled="isLoading">
            <option :value="1">1 - 매우 쉬움</option>
            <option :value="2">2 - 쉬움</option>
            <option :value="3">3 - 보통</option>
            <option :value="4">4 - 어려움</option>
            <option :value="5">5 - 매우 어려움</option>
          </select>
        </div>

        <!-- 답변 미리보기 -->
        <div class="flex items-center">
          <input
            v-model="showAnswerPreview"
            type="checkbox"
            id="showAnswerPreview"
            class="w-4 h-4 rounded border-gray-300 cursor-pointer"
            :disabled="isLoading"
          />
          <label
            for="showAnswerPreview"
            class="ml-2 text-sm font-medium text-gray-700 cursor-pointer"
          >
            답변 미리보기 표시
          </label>
        </div>
      </div>

      <!-- 푸터 -->
      <div
        class="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3 justify-end"
      >
        <button
          @click="handleClose"
          :disabled="isLoading"
          class="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          취소
        </button>
        <button
          @click="handleSave"
          :disabled="isLoading || !isDirty"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {{ isLoading ? '저장 중...' : '저장' }}
        </button>
      </div>
    </div>
  </div>
</template>
