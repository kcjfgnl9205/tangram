<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { cloneDeep } from 'lodash-es'
import { useCanvasStore } from '@/entities/canvas'
import { setSymmetryHorizontal, setSymmetryVertical, trackEvent } from '@/shared/lib'
import { Icon } from '@/shared/ui'

const canvasStore = useCanvasStore()
const { selectedObjects, isAnswerPreview, originalObjects, objects } = storeToRefs(canvasStore)

const iconSize = 90
const gap = 20

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

const handleReset = () => {
  objects.value = cloneDeep(originalObjects.value)
  selectedObjects.value = []
  isAnswerPreview.value = false
}

const toolbars = computed(() =>
  [
    { icon: 'refresh', onClick: handleReset, isVisible: true },
    { icon: 'eye-on', onClick: toggleAnswerPreview, isVisible: !isAnswerPreview.value },
    { icon: 'eye-off', onClick: toggleAnswerPreview, isVisible: isAnswerPreview.value },
  ].filter((item) => item.isVisible),
)

const bottomToolbars = computed(() => [
  { icon: 'horizontal-flip', onClick: setSymmetryHorizontal },
  { icon: 'vertical-flip', onClick: setSymmetryVertical },
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
        :transform="`translate(${950 - ((bottomToolbars.length - 1) * (iconSize + gap)) / 2 + index * (iconSize + gap)}, 960)`"
        @click="toolbar.onClick"
      >
        <Icon :icon="toolbar.icon" />
      </g>
    </template>
  </template>
</template>
