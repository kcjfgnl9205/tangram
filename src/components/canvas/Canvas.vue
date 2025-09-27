<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCanvasStore } from '@/stores'
import { useDND, useRotate } from '@/composable'
import { Button } from '@/components/ui'
import { getPath, getVertices, getSize } from '@/utils/common/utils'
import { TangramObject } from '@/utils/objects/tangram'
import type { AnswerObject } from '@/utils/objects/answer'
import { createObject } from '@/utils/objects/create'
import { useMultiSelect } from '@/composable/useMultiSelect'
import { RouteNames } from '@/router'

const route = useRoute()
const isCreatePage = route.name === RouteNames.TANGRAM_CREATE
const isDetailPage = route.name === RouteNames.TANGRAM_DETAIL

const container = ref<HTMLElement | null>(null)
const width = ref(400)
const height = ref(225) // 16:9 기본값

const dnd = useDND()
const rotateComposable = useRotate()
const multiSelectComposable = useMultiSelect()
const svgRef = ref<HTMLElement | null>(null)
const isAnswerPreview = ref(false)

const canvasStore = useCanvasStore()
const { viewBox, gap, objects, selectedObjects } = storeToRefs(canvasStore)

const tangramObjects = computed(
  () => objects.value.filter((o) => o.type === 'tangram') as TangramObject[],
)
const answerObjects = computed(
  () => objects.value.filter((o) => o.type === 'answer') as AnswerObject[],
)

let observer: ResizeObserver | null = null
const updateSize = (entry: ResizeObserverEntry) => {
  const { width: parentW, height: parentH } = entry.contentRect

  const maxWidth = parentW
  const maxHeight = parentH

  // 16:9 비율 계산
  const widthBasedHeight = (maxWidth * 9) / 16
  const heightBasedWidth = (maxHeight * 16) / 9

  if (widthBasedHeight <= maxHeight) {
    width.value = Math.floor(maxWidth)
    height.value = Math.floor(widthBasedHeight)
  } else {
    width.value = Math.floor(heightBasedWidth)
    height.value = Math.floor(maxHeight)
  }
}

onMounted(() => {
  if (container.value) {
    observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        updateSize(entry)
      }
    })
    observer.observe(container.value)
  }
})

onUnmounted(() => {
  if (observer && container.value) {
    observer.unobserve(container.value)
  }
})

const onBackgroundDown = (e: PointerEvent) => {
  selectedObjects.value = []

  if (isCreatePage) {
    multiSelectComposable.handlePointerDown(e)
  }
}

const SvgViewBox = computed(() => {
  const { x, y, width, height } = viewBox.value
  return `${x} ${y} ${width} ${height}`
})

const handleCreateBluePrint = () => {
  const coordinatesArr: number[][][] = []
  for (const object of objects.value) {
    coordinatesArr.push(getVertices(object))
  }
  createObject('answer', { coordinatesArr })
}

const handleCreateTangram = () => {
  canvasStore.init()
}

const handleSubmit = () => {
  localStorage.setItem('test', JSON.stringify(objects.value))
}

const handleAnswerPreview = () => {
  console.log('Adsf')
  isAnswerPreview.value = !isAnswerPreview.value
}
</script>

<template>
  <div ref="container" class="w-full h-full flex flex-col gap-4 justify-center items-center">
    <div v-if="isCreatePage" class="w-full flex gap-2">
      <Button variant="btn-blue" @click="handleCreateTangram">칠교판생성</Button>
      <Button variant="btn-blue" @click="handleCreateBluePrint">도면생성</Button>
      <Button variant="btn-blue" @click="handleSubmit">정답만들기</Button>
    </div>

    <div v-if="isDetailPage" class="w-full flex gap-2">
      <Button variant="btn-blue" @click="handleAnswerPreview">정답 미리보기</Button>
    </div>

    <div
      class="border-2 p-4 flex items-center justify-center bg-gray-100"
      :style="{ width: `${width}px`, height: `${height}px` }"
    >
      <svg
        ref="svgRef"
        :viewBox="SvgViewBox"
        class="canvas w-full h-full"
        preserveAspectRatio="none"
        @pointerdown="onBackgroundDown"
      >
        <!-- 정답영역 -->
        <g class="answer-area">
          <rect
            :x="0"
            :y="0"
            :width="viewBox.width / 2 - gap"
            :height="viewBox.height"
            fill="transparent"
            stroke="#000"
            stroke-width="1"
            rx="12"
          />
          <!-- 정답 도형 -->
          <template v-for="(obj, i) in answerObjects" :key="obj.id">
            <template v-for="(coordinates, j) in obj.coordinatesArr" :key="j">
              <path :d="getPath(coordinates)" fill="gray" />
            </template>
          </template>
          <template v-if="isAnswerPreview">
            <template v-for="(obj, i) in answerObjects" :key="obj.id">
              <template v-for="(coordinates, j) in obj.coordinatesArr" :key="j">
                <path :d="getPath(coordinates)" fill="gray" stroke="#000" stroke-width="2" />
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
                  stroke-width="1"
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
                :transform="`translate(-20, ${-getSize(obj.coordinates).height / 2 - 50})`"
              >
                3
                <rect x="2" y="2" width="36" height="36" rx="18" fill="#404654"></rect>
                <rect
                  x="2"
                  y="2"
                  width="36"
                  height="36"
                  rx="18"
                  fill="none"
                  stroke="#061025"
                  stroke-width="4"
                ></rect>
                <path
                  d="M11.75 20C11.75 15.4534 15.4642 11.75 20.0679 11.75C21.9994 11.75 23.7762 12.4026 25.1875 13.4972L22.25 15.5L30.5 18.875V9.875L27.7571 11.7452C25.738 9.886 23.0358 8.75 20.0679 8.75C13.827 8.75 8.75 13.777 8.75 20C8.75 26.223 13.827 31.25 20.0679 31.25C25.6693 31.25 30.3289 27.2034 31.229 21.8749L28.271 21.3751C27.6131 25.2692 24.196 28.25 20.0679 28.25C15.4642 28.25 11.75 24.5466 11.75 20Z"
                  fill="#BCC1CC"
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
      </svg>
    </div>
  </div>
</template>
