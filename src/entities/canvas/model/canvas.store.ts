import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { CommonObject, createObject, type TangramType } from '@/shared/lib'

export const useCanvasStore = defineStore('canvas', () => {
  const viewBox = ref({ x: 0, y: 0, width: 1980, height: 1080 })

  const tangramSize = ref(500)
  const defaultTangramOptions = computed(() => ({
    max: tangramSize.value / 2,
    mid: tangramSize.value / 4,
    min: tangramSize.value / 8,
    ws: tangramSize.value / 4 + tangramSize.value / 8,
  }))

  const gap = ref(10) // 정답, 칠교놀이 사이 간격
  const snapDistance = ref(20) //50
  const isAnswerPreview = ref(false)
  const width = ref(0)
  const height = ref(0)

  const originalObjects = ref<CommonObject[]>([])
  const objects = ref<CommonObject[]>([])
  const selectedObjects = ref<CommonObject[]>([])
  // 이동/회전/반전 같은 "조작 완료" 이벤트 카운터 (정답률 재계산 트리거용)
  const actionCount = ref(0)

  // 세션 메트릭 (GA 이벤트 용) — 퍼즐 시작 시 reset
  const sessionStartedAt = ref<number | null>(null)
  const moveCount = ref(0)
  const rotateCount = ref(0)
  const flipCount = ref(0)
  const hintUsedCount = ref(0)
  // GA 이벤트에서 참조할 현재 퍼즐/점수 (type import 회피를 위해 primitive 로 저장)
  const currentPuzzle = ref<{ id: number; key: string; difficulty: number } | null>(null)
  const currentScore = ref(0) // 0~100

  const notifyActionEnd = (kind: 'move' | 'rotate' | 'flip' = 'move') => {
    actionCount.value++
    if (kind === 'move') moveCount.value++
    else if (kind === 'rotate') rotateCount.value++
    else if (kind === 'flip') flipCount.value++
  }

  const startSession = () => {
    sessionStartedAt.value = Date.now()
    moveCount.value = 0
    rotateCount.value = 0
    flipCount.value = 0
    hintUsedCount.value = 0
    actionCount.value = 0
  }

  const getElapsedSec = () => {
    if (!sessionStartedAt.value) return 0
    return Math.round((Date.now() - sessionStartedAt.value) / 1000)
  }

  const tangramInit = () => {
    const tangrams: TangramType[] = [
      'tangram01',
      'tangram02',
      'tangram03',
      'tangram04',
      'tangram05',
      'tangram06',
      'tangram07',
    ]

    for (const tangram of tangrams) {
      createObject('tangram', { tangramType: tangram })
    }
  }

  const removeElementById = (id: string) => {
    objects.value = objects.value.filter((object) => object.id !== id)
    selectedObjects.value = selectedObjects.value.filter((object) => object.id !== id)
  }

  return {
    tangramSize,
    defaultTangramOptions,
    width,
    height,
    viewBox,
    gap,
    snapDistance,
    objects,
    originalObjects,
    selectedObjects,
    isAnswerPreview,
    tangramInit,
    removeElementById,
    actionCount,
    notifyActionEnd,
    sessionStartedAt,
    moveCount,
    rotateCount,
    flipCount,
    hintUsedCount,
    currentPuzzle,
    currentScore,
    startSession,
    getElapsedSec,
  }
})
