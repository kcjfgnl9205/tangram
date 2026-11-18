<script setup lang="ts">
import { computed } from 'vue'
import { useToastStore } from '@/shared/stores/toast.store'

const store = useToastStore()

const isTop = computed(() => store.position.startsWith('top'))

const containerClass = computed(() => {
  const posMap: Record<string, string> = {
    'top-left': 'top-4 left-4 items-start',
    'top-right': 'top-4 right-4 items-end',
    top: 'top-4 left-1/2 -translate-x-1/2 items-center',
    'bottom-left': 'bottom-4 left-4 items-start',
    'bottom-right': 'bottom-4 right-4 items-end',
    bottom: 'bottom-4 left-1/2 -translate-x-1/2 items-center',
  }
  return [posMap[store.position], isTop.value ? 'flex-col-reverse' : 'flex-col']
})

const transitionName = computed(() => (isTop.value ? 'toast-top' : 'toast-bottom'))

const typeConfig = {
  info: {
    bar: 'bg-blue-400',
    icon: 'text-blue-500',
    path: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  success: {
    bar: 'bg-green-400',
    icon: 'text-green-500',
    path: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  warning: {
    bar: 'bg-yellow-400',
    icon: 'text-yellow-500',
    path: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  },
  error: {
    bar: 'bg-red-400',
    icon: 'text-red-500',
    path: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
  },
}
</script>

<template>
  <Teleport to="body">
    <TransitionGroup
      tag="div"
      :name="transitionName"
      class="fixed z-[300] flex gap-2 w-80 pointer-events-none"
      :class="containerClass"
    >
      <div
        v-for="toast in store.toasts"
        :key="toast.id"
        class="pointer-events-auto w-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden flex"
      >
        <!-- 왼쪽 컬러 바 -->
        <div class="w-1 shrink-0" :class="typeConfig[toast.type].bar" />

        <!-- 내용 -->
        <div class="flex items-start gap-3 px-4 py-3 flex-1 min-w-0">
          <!-- 아이콘 -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5 shrink-0 mt-0.5"
            :class="typeConfig[toast.type].icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path stroke-linecap="round" stroke-linejoin="round" :d="typeConfig[toast.type].path" />
          </svg>

          <!-- 메시지 -->
          <p class="text-sm text-gray-700 flex-1 leading-snug">{{ toast.message }}</p>

          <!-- 닫기 버튼 -->
          <button
            class="shrink-0 p-0.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            @click="store.remove(toast.id)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<style>
/* 위에서 나타나는 위치 (top-*) */
.toast-top-enter-active,
.toast-top-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.toast-top-enter-from,
.toast-top-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
.toast-top-leave-active {
  position: absolute;
}
.toast-top-move {
  transition: transform 0.25s ease;
}

/* 아래서 나타나는 위치 (bottom-*) */
.toast-bottom-enter-active,
.toast-bottom-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.toast-bottom-enter-from,
.toast-bottom-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
.toast-bottom-leave-active {
  position: absolute;
}
.toast-bottom-move {
  transition: transform 0.25s ease;
}
</style>
