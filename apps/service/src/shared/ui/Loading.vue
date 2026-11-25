<script setup lang="ts">
export type LoadingSize = 'sm' | 'md'

interface Props {
  size?: LoadingSize
}
const { size = 'md' } = defineProps<Props>()

// 버튼 안(sm)과 목록 하단(md)은 필요한 크기가 다르다.
// 예전엔 40px 로 고정돼 있어 버튼에 넣으면 밖으로 삐져나왔다.
const sizeClasses: Record<LoadingSize, string> = {
  sm: 'w-4 h-4 border-2',
  md: 'w-10 h-10 border-4',
}
</script>

<template>
  <div class="flex items-center justify-center">
    <div
      class="rounded-full border-gray-300 animate-spin border-t-[#5DB7FC]"
      :class="sizeClasses[size]"
      role="status"
      aria-label="불러오는 중"
    ></div>
  </div>
</template>
