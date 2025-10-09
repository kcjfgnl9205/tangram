<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { RouteNames } from '@/router'
import { useCanvasStore } from '@/stores'
import { useDND, useRotate, useMultiSelect, useResizeObserver } from '@/composable'
import { Toolbar, Tutorial } from '@/components/canvas'
import {
  getPath,
  getSize,
  type TangramObject,
  type AnswerObject,
  onKeyDownHandler,
  updateSize,
} from '@/utils'

interface Props {
  loaded: boolean
}
const props = defineProps<Props>()

const route = useRoute()
const isCreatePage = route.name === RouteNames.ADMIN_TANGRAM_CREATE

const container = ref<HTMLElement | null>(null)

const dnd = useDND()
const rotateComposable = useRotate()
const multiSelectComposable = useMultiSelect()

const canvasStore = useCanvasStore()
const {
  width,
  height,
  viewBox,
  gap,
  objects,
  selectedObjects,
  isAnswerPreview,
  isTutorialPreview,
} = storeToRefs(canvasStore)

const tangramObjects = computed(
  () => objects.value.filter((o) => o.type === 'tangram') as TangramObject[],
)
const answerObjects = computed(
  () => objects.value.filter((o) => o.type === 'answer') as AnswerObject[],
)

useResizeObserver(container, updateSize)

onMounted(() => {
  isAnswerPreview.value = false
  isTutorialPreview.value = false

  if (isCreatePage) {
    document.addEventListener('keydown', onKeyDownHandler)
  }
})

onUnmounted(() => {
  if (isCreatePage) {
    document.removeEventListener('keydown', onKeyDownHandler)
  }
})

const onBackgroundDown = (e: PointerEvent) => {
  const target = e.target as HTMLElement
  if (target.closest('.toolbar')) return

  selectedObjects.value = []
  if (isCreatePage) {
    multiSelectComposable.handlePointerDown(e)
  }
}

const SvgViewBox = computed(() => {
  const { x, y, width, height } = viewBox.value
  return `${x} ${y} ${width} ${height}`
})
</script>

<template>
  <div ref="container" class="w-full h-full flex flex-col items-center justify-center gap-2">
    <!-- 로딩중.. -->
    <template v-if="!loaded">
      <div
        :style="{ width: `${width}px`, height: `${height}px` }"
        class="flex justify-center items-center"
      >
        <div class="flex items-center justify-center pt-6">
          <div
            style="border-top-color: transparent"
            class="w-16 h-16 border-4 border-blue-500 rounded-full animate-spin"
          ></div>
        </div>
      </div>
    </template>
    <svg
      v-else
      :style="{ width: `${width}px`, height: `${height}px` }"
      :viewBox="SvgViewBox"
      class="canvas w-full h-full border-2 border-neutral-200 rounded-2xl flex flex-col items-center justify-center bg-neutral-50"
      preserveAspectRatio="none"
      @pointerdown="onBackgroundDown"
    >
      <rect
        v-if="isCreatePage"
        :x="0"
        :y="0"
        :width="viewBox.width / 2 - gap"
        :height="viewBox.height"
        fill="transparent"
        stroke="#000"
        stroke-width="1"
        rx="12"
      />
      <!-- 정답영역 -->
      <g class="answer-area">
        <!-- 정답 도형 -->
        <template v-for="(obj, i) in answerObjects" :key="obj.id">
          <template v-for="(coordinates, j) in obj.coordinatesArr" :key="j">
            <g :transform="`translate(${obj.x}, ${obj.y}) rotate(${obj.rotate})`">
              <g class="item" @pointerdown.stop="(e) => isCreatePage && dnd.onPointerDown(e, obj)">
                <path :d="getPath(coordinates)" fill="gray" stroke-width="1" stroke="gray" />
              </g>
            </g>
          </template>
        </template>
        <template v-if="isAnswerPreview">
          <template v-for="(obj, i) in answerObjects" :key="obj.id">
            <template v-for="(coordinates, j) in obj.coordinatesArr" :key="j">
              <g :transform="`translate(${obj.x}, ${obj.y}) rotate(${obj.rotate})`">
                <path :d="getPath(coordinates)" fill="gray" stroke="#000" stroke-width="2" />
              </g>
            </template>
          </template>
        </template>
      </g>

      <!-- 문제영역 -->
      <g class="problem-area">
        <rect
          :x="viewBox.width / 2 + gap"
          y="0"
          :width="viewBox.width / 2 - gap"
          :height="viewBox.height"
          fill="transparent"
          rx="12"
        />

        <!-- 칠교판 도형 -->
        <template v-for="(obj, i) in tangramObjects" :key="obj.id">
          <g :transform="`translate(${obj.x}, ${obj.y}) rotate(${obj.rotate})`">
            <g class="cursor-pointer item" @pointerdown.stop="(e) => dnd.onPointerDown(e, obj)">
              <path
                :d="getPath(obj.coordinates)"
                :fill="obj.fill"
                :stroke="obj.fill"
                stroke-width="0"
              />
              <path
                v-if="selectedObjects.some((o) => o.id === obj.id)"
                :d="getPath(obj.coordinates)"
                :fill="obj.fill"
                stroke="#000"
                stroke-width="4"
              />
            </g>
            <!-- 회전 -->
            <g
              v-if="selectedObjects.some((o) => o.id === obj.id)"
              @pointerdown.stop="(e) => rotateComposable.onPointerDown(e)"
              class="rotate cursor-pointer"
              fill="none"
              :transform="`translate(0, ${-getSize(obj.coordinates).height / 2})`"
            >
              <circle cx="0" cy="-50" r="32" fill="#000" />
            </g>
          </g>
        </template>
      </g>

      <!-- 드래그 박스 -->
      <g v-if="isCreatePage" class="drag-box">
        <rect
          id="multi-rect"
          class="hidden"
          x="0"
          y="0"
          width="0"
          height="0"
          fill="#2194FF4D"
          stroke="#2194FF"
        />
        <rect
          id="multi-bounding-rect"
          class="hidden pointer-events-none"
          x="0"
          y="0"
          width="0"
          height="0"
          stroke-width="4"
          stroke="#292D35"
          fill="#1A92FF"
          fill-opacity="0.1"
          rx="4"
        />
      </g>

      <Tutorial v-if="isTutorialPreview" />
      <Toolbar />
    </svg>
  </div>
</template>
