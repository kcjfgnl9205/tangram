import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCanvasStore } from '@/stores'
import type { Point } from '@/types'
import { getCurrentCoordinates, toggleClassName } from '@/utils/common/utils'

export function useMultiSelect() {
  const canvasStore = useCanvasStore()
  const { objects, selectedObjects } = storeToRefs(canvasStore)
  const isSelect = ref(false)
  const currentPoint = ref<Point>({ x: 0, y: 0 })

  const handlePointerDown = (e: PointerEvent) => {
    try {
      isSelect.value = true

      const p = getCurrentCoordinates(e)
      if (!p) return
      currentPoint.value.x = p.x
      currentPoint.value.y = p.y

      // 다중선택 이벤트 등록
      document.addEventListener('pointermove', handlePointerMove)
      document.addEventListener('pointerup', handlePointerUp)
    } catch (e) {
      console.error(e)
    }
  }

  const handlePointerMove = (e: PointerEvent) => {
    try {
      const p = getCurrentCoordinates(e)
      if (!isSelect.value || !p) return
      // 다중선택 박스
      const selectRect = document.getElementById('multi-rect') as unknown as SVGGraphicsElement
      toggleClassName('multi-rect', 'hidden', false)

      let width = p.x - currentPoint.value.x
      let height = p.y - currentPoint.value.y

      let nx = currentPoint.value.x
      let ny = currentPoint.value.y

      if (width < 0) {
        nx -= Math.abs(width)
        width = Math.abs(width)
      }
      if (height < 0) {
        ny -= Math.abs(height)
        height = Math.abs(height)
      }

      selectRect.setAttribute('x', nx.toString())
      selectRect.setAttribute('y', ny.toString())
      selectRect.setAttribute('width', width.toString())
      selectRect.setAttribute('height', height.toString())

      // === 선택 박스 안에 들어온 객체 찾기 ===
      const inside = objects.value.filter((obj) => {
        const cx = obj.x
        const cy = obj.y
        return cx >= nx && cx <= nx + width && cy >= ny && cy <= ny + height
      })
      selectedObjects.value = inside
    } catch (e) {
      console.error(e)
      document.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerup', handlePointerUp)
      isSelect.value = false
    }
  }

  const handlePointerUp = (e: PointerEvent) => {
    try {
      isSelect.value = false
    } catch (e) {
      console.error(e)
    } finally {
      toggleClassName('multi-rect', 'hidden', true)
      document.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerup', handlePointerUp)
    }
  }

  return {
    handlePointerDown,
  }
}
