<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useCanvasStore } from '@/entities/canvas'
import { createTangram } from '@/entities/tangram/api/tangram'
import { Button, ButtonIcon, SelectBox } from '@/shared/ui'
import { generateJsonBlob, generatePlaygroundPng, getVertices } from '@/shared/lib'
import { uploadViaSupabase } from '@/shared/lib/r2/upload'

const emit = defineEmits<{ close: [] }>()
const { t } = useI18n()

const canvasStore = useCanvasStore()
const { objects, selectedObjects, tangramSize } = storeToRefs(canvasStore)

const difficulty = ref<number>(3)
const submitting = ref(false)

const difficultyOptions = computed(() => [
  { label: t('tangram.playground.save.level1'), value: 1 },
  { label: t('tangram.playground.save.level2'), value: 2 },
  { label: t('tangram.playground.save.level3'), value: 3 },
  { label: t('tangram.playground.save.level4'), value: 4 },
  { label: t('tangram.playground.save.level5'), value: 5 },
])

// puzzle 모드의 기본 7조각 데이터를 store 변경 없이 직접 구성
// (canvasStore 를 건드리면 뒤쪽 캔버스가 재렌더되어 화면이 깜빡임)
const buildPuzzleTangrams = (size: number) => {
  const max = size / 2
  const mid = size / 4
  const min = size / 8
  const ws = mid + min
  // puzzle 모드 viewBox 1980x1080, 우측 문제영역 중심
  const cx = 1490
  const cy = 540

  const fills = [
    '#1E2A38',
    '#C97D8C',
    '#7A8B58',
    '#E3C9A8',
    '#E76F51',
    '#E9C46A',
    '#80CFA9',
  ] as const

  const pieces = [
    {
      tangramType: 'tangram01',
      x: cx,
      y: cy - mid,
      coordinates: [
        [-max, -mid],
        [max, -mid],
        [0, mid],
      ],
    },
    {
      tangramType: 'tangram02',
      x: cx + mid,
      y: cy,
      coordinates: [
        [mid, max],
        [mid, -max],
        [-mid, 0],
      ],
    },
    {
      tangramType: 'tangram03',
      x: cx - ws,
      y: cy - mid,
      coordinates: [
        [-min, -mid],
        [-min, mid],
        [min, 0],
      ],
    },
    {
      tangramType: 'tangram04',
      x: cx - mid,
      y: cy,
      coordinates: [
        [0, -mid],
        [-mid, 0],
        [0, mid],
        [mid, 0],
      ],
    },
    {
      tangramType: 'tangram05',
      x: cx,
      y: cy + min,
      coordinates: [
        [-mid, min],
        [0, -min],
        [mid, min],
      ],
    },
    {
      tangramType: 'tangram06',
      x: cx - mid,
      y: cy + mid,
      coordinates: [
        [-mid, -mid],
        [-mid, mid],
        [mid, mid],
      ],
    },
    {
      tangramType: 'tangram07',
      x: cx + min,
      y: cy + ws,
      coordinates: [
        [-ws, -min],
        [min, -min],
        [ws, min],
        [-min, min],
      ],
    },
  ]

  return pieces.map((p, i) => ({
    type: 'tangram',
    tangramType: p.tangramType,
    x: p.x,
    y: p.y,
    rotate: 0,
    coordinates: p.coordinates,
    fill: fills[i],
  }))
}

// AnswerObject.initCoordinates 와 동일한 dedupe 로직
const dedupeCoords = (arr: number[][][]) => {
  const flat = arr.flat()
  const seen = new Set<string>()
  const result: number[][] = []
  for (const [x, y] of flat) {
    const key = `${x.toFixed(5)},${y.toFixed(5)}`
    if (!seen.has(key)) {
      seen.add(key)
      result.push([x, y])
    }
  }
  return result
}

const handleSubmit = async () => {
  try {
    submitting.value = true

    // 캡처 전 선택 해제 — 회전 핸들 등 UI 요소가 PNG 에 찍히지 않도록
    selectedObjects.value = []
    await new Promise((r) => requestAnimationFrame(() => r(null)))

    // 1) 현재 playground 상태로 PNG(실루엣) 캡처
    const pngBlob = await generatePlaygroundPng()

    // 2) 정답(silhouette) 좌표 = 현재 7조각의 회전된 절대 좌표
    const coordinatesArr: number[][][] = []
    for (const obj of objects.value) {
      coordinatesArr.push(getVertices(obj))
    }

    // 3) JSON 객체를 store 변경 없이 직접 구성:
    //    - 정답: 현재 좌표 (왼쪽 정답영역) — x:0, y:0 으로 transform 비적용
    //    - 7조각: puzzle 기본 위치 (오른쪽 문제영역)
    const answer = {
      type: 'answer',
      x: 0,
      y: 0,
      rotate: 0,
      coordinatesArr,
      coordinates: dedupeCoords(coordinatesArr),
    }
    const puzzleTangrams = buildPuzzleTangrams(tangramSize.value)
    const finalObjects = [answer, ...puzzleTangrams]

    // 4) JSON 직렬화
    const key = `playground-${Date.now()}`
    const jsonBlob = generateJsonBlob(finalObjects)

    // 5) Storage 업로드 + tangrams insert
    const [jsonResponse, imgResponse] = await Promise.all([
      uploadViaSupabase(jsonBlob, `tangram/data/${key}.json`, 'application/json'),
      uploadViaSupabase(pngBlob, `tangram/thumbnail/${key}.png`, 'image/png'),
    ])
    if (!jsonResponse.fileName || !imgResponse.fileName) throw new Error('upload failed')

    await createTangram({
      key,
      json_url: jsonResponse.fileName,
      thumbnail_url: imgResponse.fileName,
      difficulty: Number(difficulty.value),
      show_answer_preview: true,
    })

    alert(t('tangram.playground.save.success'))
    emit('close')
  } catch (e) {
    console.error(e)
    alert('저장에 실패했습니다.')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div
    class="bg-white shadow-2xl flex flex-col overflow-hidden w-full h-full md:w-[min(92vw,480px)] md:h-auto md:max-h-[90vh] md:rounded-2xl"
    role="dialog"
    :aria-label="t('tangram.playground.save.title')"
  >
    <!-- 헤더 -->
    <div class="flex items-center justify-between px-5 h-14 border-b border-neutral-200">
      <h2 class="text-heading-sm">{{ t('tangram.playground.save.title') }}</h2>
      <ButtonIcon
        icon="close-icon"
        size="md"
        :aria-label="t('tangram.playground.save.close')"
        @click="emit('close')"
      />
    </div>

    <!-- 본문 -->
    <form class="flex-1 overflow-y-auto px-6 py-6 space-y-5" @submit.prevent="handleSubmit">
      <p class="text-body-sm text-neutral-500">
        {{ t('tangram.playground.save.description') }}
      </p>

      <SelectBox
        v-model="difficulty"
        :label="t('tangram.playground.save.difficulty')"
        :options="difficultyOptions"
      />

      <div class="flex justify-end gap-2 pt-2">
        <Button type="button" variant="btn-default" @click="emit('close')">
          {{ t('tangram.playground.save.cancel') }}
        </Button>
        <Button type="submit" variant="btn-blue" :is-loading="submitting">
          {{ t('tangram.playground.save.submit') }}
        </Button>
      </div>
    </form>
  </div>
</template>
