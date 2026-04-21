<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Icon } from '@/shared/ui'
import { useModalStore } from '@/shared/stores/modal.store'
import { useCopyLink } from '@/shared/composables'
import SettingsModal from './SettingsModal.vue'
import { RouteNames } from '@/app/router/router-name'

interface Props {
  title?: string
  // UTM 추적용 공유 식별자 (예: 퍼즐 key) — 어떤 콘텐츠가 공유됐는지 추적
  shareKey?: string
}
const props = defineProps<Props>()

const router = useRouter()
const modalStore = useModalStore()
const { handleCopy } = useCopyLink()

const handleBack = () => {
  router.push({ name: RouteNames.TANGRAM_LIST })
}

const handleCopyLink = () => {
  const url = new URL(window.location.href)
  url.searchParams.set('utm_source', 'share')
  url.searchParams.set('utm_medium', 'copy')
  url.searchParams.set('utm_campaign', 'tangram-share')
  if (props.shareKey) {
    url.searchParams.set('utm_content', props.shareKey)
  }
  handleCopy(url.toString())
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
    <div class="flex items-center gap-2">
      <div
        class="pointer-events-auto rounded-full bg-white/85 backdrop-blur-md shadow-sm cursor-pointer p-3 hover:bg-neutral-200"
        @click="handleCopyLink"
      >
        <Icon icon="link-icon" aria-label="링크 복사" class="w-6 h-6" />
      </div>
      <div
        class="pointer-events-auto rounded-full bg-white/85 backdrop-blur-md shadow-sm cursor-pointer p-3 hover:bg-neutral-200"
        @click="openSettings"
      >
        <Icon icon="setting-icon" aria-label="설정 열기" class="w-6 h-6" />
      </div>
    </div>
  </div>
</template>
