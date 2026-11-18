import { onMounted, onUnmounted, type Ref } from 'vue'
export function useResizeObserver(
  target: Ref<HTMLElement | null>,
  callback: (entry: ResizeObserverEntry) => void,
) {
  let observer: ResizeObserver | null = null

  onMounted(() => {
    if (target.value) {
      observer = new ResizeObserver((entries) => {
        for (const entry of entries) callback(entry)
      })
      observer.observe(target.value)
    }
  })

  onUnmounted(() => {
    if (observer && target.value) {
      observer.unobserve(target.value)
      observer.disconnect()
    }
  })
}
