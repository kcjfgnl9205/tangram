import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCanvasStore } from '@/stores'
import { getCalculateRotation, getCurrentCoordinates, snapAngle, type CommonObject } from '@/utils'
import type { Point } from '@/types'

export function useRotate() {
  const canvasStore = useCanvasStore()
  const { selectedObjects } = storeToRefs(canvasStore)
  const isRotate = ref(false)
  const selectedObject = ref<CommonObject | null>()
  const currentPoint = ref<Point>({ x: 0, y: 0 })

  const onPointerDown = (e: PointerEvent) => {
    try {
      const p = getCurrentCoordinates(e)
      if (!p) return

      selectedObject.value = selectedObjects.value[0]
      currentPoint.value.x = p.x
      currentPoint.value.y = p.y

      isRotate.value = true
    } catch (e) {
      console.error('오브젝트 회전 pointerdown 에러: ', e)
    } finally {
      document.addEventListener('pointermove', onPointerMove)
      document.addEventListener('pointerup', onPointerUp)
    }
  }

  const onPointerMove = (e: PointerEvent) => {
    try {
      if (!isRotate.value || !selectedObject.value) return
      const p = getCurrentCoordinates(e)
      if (!p) return

      const cx = selectedObject.value.x
      const cy = selectedObject.value.y

      const angle = snapAngle(getCalculateRotation({ x: cx, y: cy }, p))
      selectedObject.value.rotate = angle
    } catch (e) {
      console.error('오브젝트 회전 pointermove 에러: ', e)
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerup', onPointerUp)
    }
  }

  const onPointerUp = () => {
    try {
      isRotate.value = false
    } catch (e) {
      console.error('오브젝트 회전 pointerup 에러: ', e)
    } finally {
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerup', onPointerUp)
    }
  }

  return { onPointerDown }
}
