<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ButtonIcon, Icon } from '@/shared/ui'
import { useModalStore } from '@/shared/stores/modal.store'
import SettingsModal from './SettingsModal.vue'

interface Props {
  title?: string
}
defineProps<Props>()

const router = useRouter()
const modalStore = useModalStore()

const handleBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}

const openSettings = () => {
  modalStore.onOpen(SettingsModal, {}, { transition: 'up', isBackgroundClose: true })
}
</script>

<template>
  <!-- SVG 위에 overlay. 빈 영역은 클릭 통과(pointer-events-none), 버튼만 활성화 -->
  <div
    class="absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-2 px-3 pt-3 pointer-events-none"
    :style="{ paddingTop: 'calc(env(safe-area-inset-top) + 0.75rem)' }"
  >
    <!-- 좌측: 뒤로가기 + 제목 -->
    <div
      class="pointer-events-auto flex items-center gap-1 min-w-0 rounded-full bg-white/85 backdrop-blur-md shadow-sm px-3 py-2 cursor-pointer hover:bg-neutral-200"
      @click="handleBack"
    >
      <Icon icon="chevron-left-icon" aria-label="뒤로가기" />
      <h1 v-if="title" class="text-base font-semibold text-neutral-800 truncate max-w-[40vw]">
        {{ title }}
      </h1>
    </div>

    <!-- 우측: 설정 -->
    <div
      class="pointer-events-auto rounded-full bg-white/85 backdrop-blur-md shadow-sm cursor-pointer p-3 hover:bg-neutral-200"
      @click="openSettings"
    >
      <Icon icon="setting-icon" aria-label="설정 열기" class="w-6 h-6" />
    </div>
  </div>
</template>
