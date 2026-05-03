<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { cloneDeep } from 'lodash-es'
import { useCanvasStore } from '@/entities/canvas'
import { useMetaStore } from '@/entities/meta'
import { incrementTangramDownload } from '@/entities/tangram/api/tangram'
import { useModalStore } from '@/shared/stores/modal.store'
import { useCopyLink } from '@/shared/composables'
import {
  downloadCanvasPdf,
  setSymmetryHorizontal,
  setSymmetryVertical,
  trackEvent,
} from '@/shared/lib'
import { Icon } from '@/shared/ui'
import { SettingsModal, SaveModal } from '@/widgets/canvas'
import { RouteNames } from '@/app/router/router-name'
import type { Locale } from '@/shared/types'

const { locale } = useI18n()
const router = useRouter()
const modalStore = useModalStore()
const { handleCopy } = useCopyLink()

const canvasStore = useCanvasStore()
const metaStore = useMetaStore()
const { selectedObjects, isAnswerPreview, originalObjects, objects, currentPuzzle, viewBox } =
  storeToRefs(canvasStore)

// 퍼즐 key → 번역된 제목 (다운로드 파일명에 사용)
const title = computed(() =>
  currentPuzzle.value ? metaStore.getText(currentPuzzle.value.key, locale.value as Locale) : '',
)

const iconSize = 90
const gap = 20

const handleBack = () => {
  router.push({ name: RouteNames.TANGRAM_LIST })
}

const handleCopyLink = () => {
  const url = new URL(window.location.href)
  url.searchParams.set('utm_source', 'share')
  url.searchParams.set('utm_medium', 'copy')
  url.searchParams.set('utm_campaign', 'tangram-share')
  if (currentPuzzle.value?.key) {
    url.searchParams.set('utm_content', currentPuzzle.value.key)
  }
  handleCopy(url.toString())
}

const handleDownloadPdf = async () => {
  try {
    const filename = title.value ? `칠교놀이(${title.value}).pdf` : '칠교놀이.pdf'
    await downloadCanvasPdf(filename)

    // 다운로드 성공 시에만 카운트 증가 (실패한 다운로드는 노이즈)
    if (currentPuzzle.value?.id) {
      await incrementTangramDownload(currentPuzzle.value.id)
    }
  } catch (error) {
    console.error('PDF 다운로드 실패:', error)
  }
}

const handleReset = () => {
  objects.value = cloneDeep(originalObjects.value)
  selectedObjects.value = []
  isAnswerPreview.value = false
}

const toggleAnswerPreview = () => {
  const willEnable = !isAnswerPreview.value
  isAnswerPreview.value = willEnable

  // 힌트 ON 으로 바뀌는 순간만 이벤트 발행 (OFF 는 노이즈)
  if (willEnable && canvasStore.currentPuzzle) {
    canvasStore.hintUsedCount++
    trackEvent('hint_toggled', {
      tangram_id: canvasStore.currentPuzzle.id,
      key: canvasStore.currentPuzzle.key,
      difficulty: canvasStore.currentPuzzle.difficulty,
      current_score: canvasStore.currentScore,
      time_since_start_sec: canvasStore.getElapsedSec(),
    })
  }
}

const openSettings = () => {
  modalStore.onOpen(SettingsModal, {}, { transition: 'up', isBackgroundClose: true })
}

const handleSave = () => {
  modalStore.onOpen(SaveModal, {}, { transition: 'up', isBackgroundClose: true })
}

// playground (자유 놀이) 모드 — currentPuzzle 이 없으면 정답/다운로드는 의미 없음
const isPlayground = computed(() => !currentPuzzle.value)

const toolbars = computed(() => {
  // playground 모드: 저장 버튼만 노출
  if (isPlayground.value) {
    return [{ icon: 'save-icon', onClick: handleSave }]
  }

  return [
    { icon: 'chevron-left-icon', onClick: handleBack, isVisible: true },
    { icon: 'link-icon', onClick: handleCopyLink, isVisible: true },
    { icon: 'download-icon', onClick: handleDownloadPdf, isVisible: true },
    { icon: 'refresh-icon', onClick: handleReset, isVisible: true },
    { icon: 'eye-on-icon', onClick: toggleAnswerPreview, isVisible: !isAnswerPreview.value },
    { icon: 'eye-off-icon', onClick: toggleAnswerPreview, isVisible: isAnswerPreview.value },
    { icon: 'setting-icon', onClick: openSettings, isVisible: true },
  ].filter((item) => item.isVisible)
})

const bottomToolbars = computed(() => [
  { icon: 'horizontal-flip-icon', onClick: setSymmetryHorizontal },
  { icon: 'vertical-flip-icon', onClick: setSymmetryVertical },
])
</script>

<template>
  <template v-for="(toolbar, index) in toolbars" :key="index">
    <g
      class="cursor-pointer toolbar group"
      :transform="`translate(${12 + index * (iconSize + gap)}, ${12})`"
      @click="toolbar.onClick"
    >
      <Icon :icon="toolbar.icon" />
    </g>
  </template>

  <template v-if="selectedObjects.length > 0">
    <template v-for="(toolbar, index) in bottomToolbars" :key="index">
      <g
        class="cursor-pointer toolbar group"
        :transform="`translate(${viewBox.width / 2 - (bottomToolbars.length * iconSize + (bottomToolbars.length - 1) * gap) / 2 + index * (iconSize + gap)}, ${viewBox.height - iconSize - 20})`"
        @click="toolbar.onClick"
      >
        <Icon :icon="toolbar.icon" />
      </g>
    </template>
  </template>
</template>
