<script setup lang="ts">
import Button from '@/shared/ui/Button.vue'

const props = withDefaults(
  defineProps<{
    title?: string
    description?: string
    confirmText?: string
    cancelText?: string
    variant?: 'danger' | 'primary'
    keepOpenOnConfirm?: boolean
    onConfirm?: () => void
  }>(),
  {
    title: '확인',
    confirmText: '확인',
    cancelText: '취소',
    variant: 'primary',
    keepOpenOnConfirm: false,
  },
)

const emit = defineEmits<{
  close: []
}>()

function handleConfirm() {
  if (!props.keepOpenOnConfirm) emit('close')
  props.onConfirm?.()
}
</script>

<template>
  <div class="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden">
    <!-- 헤더 -->
    <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
      <h2 class="text-base font-semibold text-gray-800">{{ title }}</h2>
      <button
        class="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        @click="emit('close')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- 본문 -->
    <div class="px-6 py-5">
      <p v-if="description" class="text-sm text-gray-600 leading-relaxed">{{ description }}</p>
      <slot />
    </div>

    <!-- 푸터 -->
    <div class="flex justify-end gap-2 px-6 py-4 border-t border-gray-100">
      <Button variant="secondary" size="sm" @click="emit('close')">{{ cancelText }}</Button>
      <Button :variant="variant" size="sm" @click="handleConfirm">{{ confirmText }}</Button>
    </div>
  </div>
</template>
