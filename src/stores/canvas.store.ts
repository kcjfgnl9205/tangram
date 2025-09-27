import { ref } from 'vue'
import { defineStore } from 'pinia'
import { createObject, type CommonObject, type TangramType } from '@/utils'

export const useCanvasStore = defineStore('canvas', () => {
  const viewBox = ref({ x: 0, y: 0, width: 1980, height: 1080 })
  const gap = ref(10) // 정답, 칠교놀이 사이 간격
  const snapDistance = ref(10)

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

  return { viewBox, gap, snapDistance, objects, selectedObjects, init }
})
