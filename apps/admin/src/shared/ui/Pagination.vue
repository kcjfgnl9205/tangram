<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@/shared/ui'

const props = defineProps<{
  currentPage: number
  totalPages: number
}>()

const emit = defineEmits<{
  'update:currentPage': [value: number]
}>()

const GROUP_SIZE = 10

const currentGroup = computed(() => Math.floor((props.currentPage - 1) / GROUP_SIZE))
const lastGroup = computed(() => Math.floor((props.totalPages - 1) / GROUP_SIZE))

const pageNumbers = computed(() => {
  const start = currentGroup.value * GROUP_SIZE + 1
  const end = Math.min(start + GROUP_SIZE - 1, props.totalPages)
  const pages: number[] = []
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

const changePage = (page: number) => {
  if (page !== props.currentPage && page >= 1 && page <= props.totalPages) {
    emit('update:currentPage', page)
  }
}

const navigateToGroup = (direction: 'prev' | 'next') => {
  const nextGroup = direction === 'prev' ? currentGroup.value - 1 : currentGroup.value + 1
  if (nextGroup >= 0 && nextGroup <= lastGroup.value) {
    changePage(Math.min(nextGroup * GROUP_SIZE + 1, props.totalPages))
  }
}
</script>

<template>
  <div v-if="totalPages > 0" class="flex items-center justify-center gap-1 text-body-sm-normal">
    <!-- 첫 그룹으로 -->
    <!-- <button
      v-if="currentGroup > 0"
      class="flex items-center justify-center w-8 h-8 rounded-md hover:bg-vslideGray-86 cursor-pointer"
      @click="navigateToGroup('prev')"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M7.333 11.333 4 8l3.333-3.333M12 11.333 8.667 8 12 4.667"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button> -->

    <!-- 이전 페이지 -->
    <button
      class="flex items-center justify-center w-8 h-8 rounded-md"
      :class="
        currentGroup === 0
          ? 'opacity-40 cursor-not-allowed'
          : 'hover:bg-vslideGray-86 cursor-pointer'
      "
      :disabled="currentGroup === 0"
      @click="navigateToGroup('prev')"
    >
      <Icon icon="chevron-left" class="w-5 h-5" />
    </button>

    <!-- 페이지 번호 -->
    <button
      v-for="page in pageNumbers"
      :key="page"
      class="flex items-center justify-center w-8 h-8 border rounded-md cursor-pointer text-body-sm-normal"
      :class="
        currentPage === page
          ? 'bg-[#E8F4FF] text-mathblue-500 border-vslideGray-86 font-medium'
          : 'bg-white text-vslideGray-30 border-vslideGray-86 hover:bg-vslideGray-86 font-normal'
      "
      @click="changePage(page)"
    >
      {{ page }}
    </button>

    <!-- 다음 페이지 -->
    <button
      class="flex items-center justify-center w-8 h-8 rounded-md"
      :class="
        currentGroup === lastGroup
          ? 'opacity-40 cursor-not-allowed'
          : 'hover:bg-vslideGray-86 cursor-pointer'
      "
      :disabled="currentGroup === lastGroup"
      @click="navigateToGroup('next')"
    >
      <Icon icon="chevron-right" class="w-5 h-5" />
    </button>

    <!-- 다음 그룹으로 -->
    <!-- <button
      v-if="lastGroup > currentGroup"
      class="flex items-center justify-center w-8 h-8 rounded-md hover:bg-vslideGray-86 cursor-pointer"
      @click="navigateToGroup('next')"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M8.667 11.333 12 8 8.667 4.667M4 11.333 7.333 8 4 4.667"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button> -->
  </div>
</template>
