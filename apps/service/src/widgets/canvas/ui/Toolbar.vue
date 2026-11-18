<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { cloneDeep } from 'lodash-es'
import { useCanvasStore } from '@/entities/canvas'
import { useModalStore } from '@/shared/stores/modal.store'
import { setSymmetryHorizontal, setSymmetryVertical, trackEvent } from '@/shared/lib'
import { Icon } from '@/shared/ui'
import { SettingsModal, SaveModal } from '@/widgets/canvas'
import { RouteNames } from '@/app/router/router-name'

const router = useRouter()
const modalStore = useModalStore()

const canvasStore = useCanvasStore()
const { selectedObjects, isAnswerPreview, originalObjects, objects, currentPuzzle, viewBox } =
  storeToRefs(canvasStore)

const iconSize = 90
const gap = 20

const handleBack = () => {
  router.push({ name: RouteNames.TANGRAM_LIST })
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
