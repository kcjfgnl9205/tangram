<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { cloneDeep } from 'lodash-es'
import { useCanvasStore } from '@/entities/canvas'
import { Canvas } from '@/widgets/canvas'

const { t } = useI18n()
const canvasStore = useCanvasStore()
const { objects, originalObjects, currentPuzzle, viewBox, mode, tangramSize, width } =
  storeToRefs(canvasStore)
const loaded = ref(false)

onMounted(() => {
  // 자유 놀이 모드 — 정답/세션/퍼즐 식별자 없이 7조각만 정사각 캔버스에 초기화
  mode.value = 'playground'
  viewBox.value = { x: 0, y: 0, width: 1080, height: 1080 }
  tangramSize.value = 400
  objects.value = []
  currentPuzzle.value = null
  canvasStore.tangramInit()
  originalObjects.value = cloneDeep(objects.value)
  loaded.value = true
})

onBeforeUnmount(() => {
  // 다른 페이지에 영향 안 주도록 기본값 복원
  mode.value = 'puzzle'
  viewBox.value = { x: 0, y: 0, width: 1980, height: 1080 }
  tangramSize.value = 500
  objects.value = []
  originalObjects.value = []
})
</script>

<template>
  <div class="w-full h-[100dvh] flex flex-col p-4 gap-3 overflow-hidden">
    <!-- Canvas 영역: 남은 공간을 차지하되 안내문 자리는 비워둠 -->
    <div class="flex-1 min-h-0 flex justify-center items-center">
      <Canvas :loaded="loaded" />
    </div>
    <!-- 안내문: 캔버스 측정 완료 후 동일 너비로 맞춤 (측정 전엔 부모 너비) -->
    <div
      :style="width > 0 ? { width: `${width}px` } : {}"
      class="self-center w-full max-w-full text-body-xs text-neutral-500 leading-snug space-y-0.5"
    >
      <p>{{ t('tangram.playground.disclaimer1') }}</p>
      <p>{{ t('tangram.playground.disclaimer2') }}</p>
    </div>
  </div>
</template>
