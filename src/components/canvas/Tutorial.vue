<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useCanvasStore } from '@/stores'

const canvasStore = useCanvasStore()
const { viewBox } = storeToRefs(canvasStore)

const { t } = useI18n()

const toolbars = [
  'tangram.detail.toolbar.answerPreview',
  'tangram.detail.toolbar.leftRotate',
  'tangram.detail.toolbar.rightRotate',
  'tangram.detail.toolbar.horizontalFlip',
  'tangram.detail.toolbar.verticalFlip',
]
</script>

<template>
  <g>
    <rect
      :x="viewBox.x"
      :y="viewBox.y"
      :width="viewBox.width"
      :height="viewBox.height"
      fill="#9d9d9d"
      opacity="0.8"
    />

    <text
      x="1840"
      :y="64 + (index + 1) * 120"
      font-size="32"
      text-anchor="end"
      dominant-baseline="middle"
      v-for="(toolbar, index) in toolbars"
      :key="index"
    >
      {{ t(toolbar) }}
    </text>
  </g>
</template>
