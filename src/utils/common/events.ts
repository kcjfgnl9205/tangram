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
  console.log(e.code)
}
