<script setup lang="ts">
import { markRaw, computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { cloneDeep } from 'lodash-es'
import { useCanvasStore } from '@/stores'
import { setSymmetryHorizontal, setSymmetryVertical } from '@/utils'
import {
  CanvasInfo,
  CanvasEyeOn,
  CanvasEyeOff,
  CanvasRotateLeft,
  CanvasRotateRight,
  CanvasHorizontalFlip,
  CanvasVerticalFlip,
  CanvasClose,
  CanvasRefresh,
} from '@/assets/icon'

const canvasStore = useCanvasStore()
const { selectedObjects, isAnswerPreview, isTutorialPreview, originalObjects, objects } =
  storeToRefs(canvasStore)

let rotateTimer: number | null = null

// 왼쪽 회전
const startRotateLeft = () => {
  stopRotate()
  rotateTimer = window.setInterval(() => {
    const item = selectedObjects.value[0]
    if (!item) {
      stopRotate()
      return
    }

    item.rotate = (item.rotate - 1 + 360) % 360
  }, 100)
}

// 오른쪽 회전
const startRotateRight = () => {
  stopRotate()
  rotateTimer = window.setInterval(() => {
    const item = selectedObjects.value[0]
    if (!item) {
      stopRotate()
      return
    }

    item.rotate = (item.rotate + 1 + 360) % 360
  }, 100)
}

// 회전 정지
const stopRotate = () => {
  if (rotateTimer) {
    clearInterval(rotateTimer)
    rotateTimer = null
  }
}

const toggleAnswerPreview = () => {
  isAnswerPreview.value = !isAnswerPreview.value
}

const toggleTutorialPreview = () => {
  isTutorialPreview.value = !isTutorialPreview.value
}

const handleReset = () => {
  objects.value = cloneDeep(originalObjects.value)
  selectedObjects.value = []
  isAnswerPreview.value = false
}

const toolbars = computed(() =>
  [
    {
      component: markRaw(CanvasInfo),
      onClick: toggleTutorialPreview,
      isVisible: !isTutorialPreview.value,
    },
    {
      component: markRaw(CanvasClose),
      onClick: toggleTutorialPreview,
      isVisible: isTutorialPreview.value,
    },
    {
      component: markRaw(CanvasRefresh),
      onClick: handleReset,
      isVisible: true,
    },
    {
      component: markRaw(CanvasEyeOn),
      onClick: toggleAnswerPreview,
      isVisible: !isAnswerPreview.value,
    },
    {
      component: markRaw(CanvasEyeOff),
      onClick: toggleAnswerPreview,
      isVisible: isAnswerPreview.value,
    },
    { component: markRaw(CanvasRotateLeft), onPointerDown: startRotateLeft, isVisible: true },
    { component: markRaw(CanvasRotateRight), onPointerDown: startRotateRight, isVisible: true },
    { component: markRaw(CanvasHorizontalFlip), onClick: setSymmetryHorizontal, isVisible: true },
    { component: markRaw(CanvasVerticalFlip), onClick: setSymmetryVertical, isVisible: true },
  ].filter((item) => item.isVisible),
)
</script>

<template>
  <template v-for="(toolbar, index) in toolbars" :key="index">
    <g
      v-if="toolbar.isVisible"
      class="cursor-pointer toolbar"
      :transform="`translate(1872, ${8 + index * 120})`"
      v-on="{
        click: toolbar.onClick,
        pointerdown: toolbar.onPointerDown,
      }"
      @pointerup="stopRotate"
      @pointerleave="stopRotate"
    >
      <component :is="toolbar.component" />
    </g>
  </template>
</template>
