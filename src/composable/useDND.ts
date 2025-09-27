import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCanvasStore } from '@/stores'
import type { TangramObject } from '@/utils/objects/tangram'
import { getCurrentCoordinates } from '@/utils/common/utils'
import type { Point } from '@/types'

export function useDND() {
  const canvasStore = useCanvasStore()
  const { selectedObjects } = storeToRefs(canvasStore)
  const isDrag = ref(false)
  const currentPoint = ref<Point>({ x: 0, y: 0 })
  const originalPos = ref<Point | null>(null)

  const onPointerDown = (e: PointerEvent, obj: TangramObject) => {
    try {
      if (e.button !== 0) return // 마우스 좌클릭만 허용

      // z-index 가장 위로 올리기(맨 위로 랜더링)
      const idx = canvasStore.objects.findIndex((o) => o.id === obj.id)
      if (idx !== -1) {
        const [picked] = canvasStore.objects.splice(idx, 1)
        canvasStore.objects.push(picked)
      }

      // 선택된 객체 업데이트
      selectedObjects.value = [obj]

      // 처음 좌표 저장
      originalPos.value = { x: obj.x, y: obj.y }

      // 클릭 했을 때 좌표
      const p = getCurrentCoordinates(e)
      if (p) {
        currentPoint.value.x = p.x
        currentPoint.value.y = p.y
      }

      isDrag.value = true
    } catch (e) {
      console.error('DND pointerdown 에러: ', e)
    } finally {
      document.addEventListener('pointermove', onPointerMove)
      document.addEventListener('pointerup', onPointerUp)
    }
  }

  const onPointerMove = (e: PointerEvent) => {
    try {
      if (!isDrag.value) return

      const p = getCurrentCoordinates(e)
      if (p) {
        const dx = p.x - currentPoint.value.x
        const dy = p.y - currentPoint.value.y

        for (const object of selectedObjects.value) {
          object.x += dx
          object.y += dy
        }

        currentPoint.value.x += dx
        currentPoint.value.y += dy
      }
    } catch (e) {
      console.error('DND pointermove 에러: ', e)
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerup', onPointerUp)
    }
  }

  const onPointerUp = (e: PointerEvent) => {
    try {
      const target = e.target as HTMLElement
      if (target && !target.closest('svg')) {
        for (const object of selectedObjects.value) {
          // 영역 벗어나면 원래 자리로 복원
          if (originalPos.value) {
            object.x = originalPos.value.x
            object.y = originalPos.value.y
          }
        }
      }

      isDrag.value = false
    } catch (e) {
      console.error('DND pointerup 에러: ', e)
    } finally {
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerup', onPointerUp)
    }
  }

  return { onPointerDown }
}
