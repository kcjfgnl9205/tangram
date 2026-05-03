import { useCanvasStore } from '@/entities/canvas'
import { storeToRefs } from 'pinia'

export const onKeyDownHandler = (e: KeyboardEvent) => {
  if (e.repeat) return // 키 중복 입력 방지

  const canvasStore = useCanvasStore()
  const { selectedObjects } = storeToRefs(canvasStore)
  if (e.code === 'Backspace') {
    for (const object of selectedObjects.value) {
      canvasStore.removeElementById(object.id)
    }
  }
}

// 화면 사이즈 width, height — viewBox 비율을 그대로 유지
export const updateSize = (entry: ResizeObserverEntry) => {
  const canvasStore = useCanvasStore()
  const { width, height, viewBox } = storeToRefs(canvasStore)

  const { width: parentW, height: parentH } = entry.contentRect
  const aspect = viewBox.value.width / viewBox.value.height

  const widthBasedHeight = parentW / aspect
  const heightBasedWidth = parentH * aspect

  if (widthBasedHeight <= parentH) {
    width.value = Math.floor(parentW)
    height.value = Math.floor(widthBasedHeight)
  } else {
    width.value = Math.floor(heightBasedWidth)
    height.value = Math.floor(parentH)
  }
}
