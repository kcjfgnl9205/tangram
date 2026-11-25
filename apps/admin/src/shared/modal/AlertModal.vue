<script setup lang="ts">
import Button from '@/shared/ui/Button.vue'

withDefaults(
  defineProps<{
    title?: string
    message?: string
    type?: 'info' | 'success' | 'warning' | 'error'
    confirmText?: string
  }>(),
  {
    title: '알림',
    type: 'info',
    confirmText: '확인',
  },
)

defineEmits<{
  close: []
}>()

const iconConfig = {
  info: {
    bg: 'bg-blue-50',
    text: 'text-blue-500',
    path: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  success: {
    bg: 'bg-green-50',
    text: 'text-green-500',
    path: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  warning: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-500',
    path: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  },
  error: {
    bg: 'bg-red-50',
    text: 'text-red-500',
    path: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
  },
}
</script>

<template>
  <div class="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden">
    <!-- 헤더 -->
    <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
      <h2 class="text-base font-semibold text-gray-800">{{ title }}</h2>
      <button
        class="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        @click="$emit('close')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- 본문 -->
    <div class="px-6 py-5">
      <div class="flex flex-col items-center gap-3 py-2 text-center">
        <div class="p-3 rounded-full" :class="iconConfig[type].bg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-7 h-7"
            :class="iconConfig[type].text"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path stroke-linecap="round" stroke-linejoin="round" :d="iconConfig[type].path" />
          </svg>
        </div>
        <p v-if="message" class="text-sm text-gray-600 leading-relaxed">{{ message }}</p>
        <slot />
      </div>
    </div>

    <!-- 푸터 -->
    <div class="flex justify-end gap-2 px-6 py-4 border-t border-gray-100">
      <Button class="w-full" size="sm" @click="$emit('close')">{{ confirmText }}</Button>
    </div>
  </div>
</template>
