import { useCanvasStore } from '@/stores'
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

// 화면 사이즈 width, height
export const updateSize = (entry: ResizeObserverEntry) => {
  const canvasStore = useCanvasStore()
  const { width, height } = storeToRefs(canvasStore)

  const { width: parentW, height: parentH } = entry.contentRect

  const maxWidth = parentW * 0.8
  const maxHeight = parentH * 0.8

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
