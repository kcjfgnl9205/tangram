import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { CommonObject, createObject, type TangramType } from '@/utils'

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
  const isTutorialPreview = ref(false)
  const width = ref(0)
  const height = ref(0)

  const originalObjects = ref<CommonObject[]>([])
  const objects = ref<CommonObject[]>([])
  const selectedObjects = ref<CommonObject[]>([])

  const init = () => {
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
    isTutorialPreview,
    init,
    removeElementById,
  }
})
