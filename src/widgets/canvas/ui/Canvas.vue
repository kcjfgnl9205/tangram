<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { RouteNames } from '@/app/router/router-name'
import { useCanvasStore } from '@/entities/canvas'
import { usePreferencesStore } from '@/entities/preferences'
import { useDND, useRotate, useMultiSelect } from '@/features/canvas'
import { useResizeObserver } from '@/shared/lib/composable'
import { Toolbar, Timer } from '@/widgets/canvas'
import {
  getPath,
  getSize,
  type AnswerObject,
  onKeyDownHandler,
  updateSize,
  type TangramObject,
} from '@/shared/lib'

interface Props {
  loaded: boolean
}
defineProps<Props>()

const route = useRoute()
const { t } = useI18n()
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
  currentScore,
  sessionStartedAt,
} = storeToRefs(canvasStore)

const preferencesStore = usePreferencesStore()
const { showAccuracy } = storeToRefs(preferencesStore)

// 점수 표시: 플레이 세션이 시작됐고 사용자가 표시 옵션을 켠 경우에만
const isScoreVisible = computed(() => sessionStartedAt.value != null && showAccuracy.value)
const scoreColor = computed(() => {
  if (currentScore.value >= 99) return '#16a34a' // green-600
  if (currentScore.value >= 80) return '#2563eb' // blue-600
  return '#525252' // neutral-600
})

const tangramFill = (obj: TangramObject) => ({ fill: `var(--theme-${obj.tangramType})` })
const tangramFillStroke = (obj: TangramObject) => ({
  fill: `var(--theme-${obj.tangramType})`,
  stroke: `var(--theme-${obj.tangramType})`,
})

const tangramObjects = computed(() => objects.value.filter((o) => o.type === 'tangram'))
const answerObjects = computed(
  () => objects.value.filter((o) => o.type === 'answer') as AnswerObject[],
)

useResizeObserver(container, updateSize)

onMounted(() => {
  isAnswerPreview.value = false

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
      class="canvas w-full h-full border-2 rounded-2xl flex flex-col items-center justify-center bg-[var(--theme-bg)] border-[var(--theme-border)]"
      preserveAspectRatio="none"
      @pointerdown="onBackgroundDown"
    >
      <Timer />
      <text
        v-if="isScoreVisible"
        x="1050"
        y="50"
        text-anchor="start"
        dominant-baseline="middle"
        font-size="28"
        font-weight="600"
        :fill="scoreColor"
      >
        ({{ t('tangram.detail.accuracy') }}: {{ currentScore }}%)
      </text>
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
                <path :d="getPath(coordinates)" class="answer-board" stroke-width="1" />
              </g>
            </g>
          </template>
        </template>
        <template v-if="isAnswerPreview">
          <template v-for="(obj, i) in answerObjects" :key="obj.id">
            <template v-for="(coordinates, j) in obj.coordinatesArr" :key="j">
              <g :transform="`translate(${obj.x}, ${obj.y}) rotate(${obj.rotate})`">
                <path
                  :d="getPath(coordinates)"
                  class="answer-board-preview"
                  stroke="#000"
                  stroke-width="2"
                />
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
          <defs>
            <clipPath :id="`${obj.id}-clippath`">
              <path :d="getPath(obj.coordinates)" />
            </clipPath>
          </defs>

          <g :transform="`translate(${obj.x}, ${obj.y}) rotate(${obj.rotate})`">
            <g class="cursor-pointer item" @pointerdown.stop="(e) => dnd.onPointerDown(e, obj)">
              <path
                :d="getPath(obj.coordinates)"
                :style="tangramFillStroke(obj as TangramObject)"
                stroke-width="0"
              />
              <path
                v-if="selectedObjects.some((o) => o.id === obj.id)"
                :d="getPath(obj.coordinates)"
                :style="tangramFill(obj as TangramObject)"
                stroke="#000"
                stroke-width="4"
              />
            </g>

            <!-- 회전 -->
            <g
              v-if="selectedObjects.some((o) => o.id === obj.id)"
              @pointerdown.stop="(e) => rotateComposable.onPointerDown(e)"
              class="rotate cursor-pointer"
              :transform="`translate(-30, ${-getSize(obj.coordinates).height / 2 - 70}) scale(1.5)`"
            >
              <rect x="2" y="2" width="36" height="36" rx="18" fill="var(--theme-outline)"></rect>
              <rect
                x="2"
                y="2"
                width="36"
                height="36"
                rx="18"
                fill="none"
                stroke="#000"
                stroke-opacity="0.3"
                stroke-width="4"
              ></rect>
              <path
                d="M11.75 20C11.75 15.4534 15.4642 11.75 20.0679 11.75C21.9994 11.75 23.7762 12.4026 25.1875 13.4972L22.25 15.5L30.5 18.875V9.875L27.7571 11.7452C25.738 9.886 23.0358 8.75 20.0679 8.75C13.827 8.75 8.75 13.777 8.75 20C8.75 26.223 13.827 31.25 20.0679 31.25C25.6693 31.25 30.3289 27.2034 31.229 21.8749L28.271 21.3751C27.6131 25.2692 24.196 28.25 20.0679 28.25C15.4642 28.25 11.75 24.5466 11.75 20Z"
                fill="#ffffff"
              ></path>
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

      <Toolbar />

      <!-- 회전 중 툴팁 -->
      <g
        v-if="rotateComposable.isRotate.value && selectedObjects[0]"
        :transform="`translate(${rotateComposable.currentPoint.value.x + 24}, ${rotateComposable.currentPoint.value.y - 24})`"
        class="pointer-events-none"
      >
        <rect x="0" y="-28" width="84" height="36" rx="6" fill="var(--theme-outline)" />
        <text x="42" y="0" fill="#ffffff" font-size="22" font-weight="600" text-anchor="middle">
          {{ Math.round(selectedObjects[0].rotate) }}°
        </text>
      </g>
    </svg>
  </div>
</template>
