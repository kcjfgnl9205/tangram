import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCanvasStore } from '@/stores'
import { getCurrentCoordinates } from '@/utils/common/utils'
import type { CommonObject } from '@/utils/objects/common'

export function useRotate() {
  const canvasStore = useCanvasStore()
  const { selectedObjects } = storeToRefs(canvasStore)
  const isRotate = ref(false)
  const startAngle = ref(0)
  const startRotate = ref(0)
  const selectedObject = ref<CommonObject | null>()

  const onPointerDown = (e: PointerEvent) => {
    try {
      const p = getCurrentCoordinates(e)
      if (!p) return

      selectedObject.value = selectedObjects.value[0]

      // 도형 중심점 (obj.x, obj.y 기준)
      const cx = selectedObject.value.x
      const cy = selectedObject.value.y

      // 시작 각도 계산
      startAngle.value = Math.atan2(p.y - cy, p.x - cx) * (180 / Math.PI)
      startRotate.value = selectedObject.value.rotate || 0

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

      const currentAngle = Math.atan2(p.y - cy, p.x - cx) * (180 / Math.PI)
      const delta = currentAngle - startAngle.value

      // 오브젝트 회전각도 업데이트
      selectedObject.value.rotate = startRotate.value + delta
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
