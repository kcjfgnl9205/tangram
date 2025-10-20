<script setup lang="ts">
import { markRaw, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { cloneDeep } from 'lodash-es'
import { useCanvasStore } from '@/stores'
import { setSymmetryHorizontal, setSymmetryVertical } from '@/utils'
import {
  CanvasEyeOn,
  CanvasEyeOff,
  CanvasRotateLeft,
  CanvasRotateRight,
  CanvasHorizontalFlip,
  CanvasVerticalFlip,
  CanvasRefresh,
} from '@/assets/icon'

const { t } = useI18n()
const canvasStore = useCanvasStore()
const { selectedObjects, isAnswerPreview, originalObjects, objects } = storeToRefs(canvasStore)

const iconSize = 90
const gap = 40

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

const handleReset = () => {
  objects.value = cloneDeep(originalObjects.value)
  selectedObjects.value = []
  isAnswerPreview.value = false
}

const toolbars = computed(() =>
  [
    {
      component: markRaw(CanvasRefresh),
      onClick: handleReset,
      isVisible: true,
      text: 'tangram.detail.toolbar.reset',
    },
    {
      component: markRaw(CanvasEyeOn),
      onClick: toggleAnswerPreview,
      isVisible: !isAnswerPreview.value,
      text: 'tangram.detail.toolbar.answerPreview',
    },
    {
      component: markRaw(CanvasEyeOff),
      onClick: toggleAnswerPreview,
      isVisible: isAnswerPreview.value,
      text: 'tangram.detail.toolbar.answerPreview',
    },
  ].filter((item) => item.isVisible),
)

const bottomToolbars = computed(() => [
  {
    component: markRaw(CanvasRotateLeft),
    onPointerDown: startRotateLeft,
    text: 'tangram.detail.toolbar.leftRotate',
  },
  {
    component: markRaw(CanvasRotateRight),
    onPointerDown: startRotateRight,
    text: 'tangram.detail.toolbar.rightRotate',
  },
  {
    component: markRaw(CanvasHorizontalFlip),
    onClick: setSymmetryHorizontal,
    text: 'tangram.detail.toolbar.horizontalFlip',
  },
  {
    component: markRaw(CanvasVerticalFlip),
    onClick: setSymmetryVertical,
    text: 'tangram.detail.toolbar.verticalFlip',
  },
])
</script>

<template>
  <template v-for="(toolbar, index) in toolbars" :key="index">
    <g
      v-if="toolbar.isVisible"
      class="cursor-pointer toolbar group"
      :transform="`translate(1872, ${8 + index * 120})`"
      v-on="{
        click: toolbar.onClick,
      }"
      @pointerup="stopRotate"
      @pointerleave="stopRotate"
    >
      <component :is="toolbar.component" />
      <text
        x="-20"
        :y="iconSize / 2 + 8"
        text-anchor="end"
        dominant-baseline="middle"
        class="hidden group-hover:block"
        font-size="24"
        font-weight="500"
        fill="#000"
      >
        {{ t(toolbar.text) }}
      </text>
    </g>
  </template>

  <template v-if="selectedObjects.length > 0">
    <template v-for="(toolbar, index) in bottomToolbars" :key="index">
      <g
        class="cursor-pointer toolbar group"
        :transform="`translate(${950 - ((bottomToolbars.length - 1) * (iconSize + gap)) / 2 + index * (iconSize + gap)}, 960)`"
        v-on="{
          pointerdown: toolbar.onPointerDown,
          click: toolbar.onClick,
        }"
        @pointerup="stopRotate"
        @pointerleave="stopRotate"
      >
        <component :is="toolbar.component" />
        <text
          :x="iconSize / 2"
          y="-18"
          text-anchor="middle"
          dominant-baseline="middle"
          class="hidden group-hover:block"
          font-size="24"
          font-weight="500"
          fill="#000"
        >
          {{ t(toolbar.text) }}
        </text>
      </g>
    </template>
  </template>
</template>
