import { ref } from 'vue'
import { defineStore } from 'pinia'

export type ToastType = 'info' | 'success' | 'warning' | 'error'
export type ToastPosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'top'
  | 'bottom'

export interface ToastItem {
  id: number
  message: string
  type: ToastType
  duration: number
}

let _nextId = 0

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<ToastItem[]>([])
  const maxCount = ref(5)
  const position = ref<ToastPosition>('top-right')

  function add(
    message: string,
    type: ToastType = 'info',
    options: { duration?: number } = {},
  ) {
    if (toasts.value.length >= maxCount.value) {
      toasts.value.shift()
    }

    const id = _nextId++
    const duration = options.duration ?? 3000

    toasts.value.push({ id, message, type, duration })

    if (duration > 0) {
      setTimeout(() => remove(id), duration)
    }
  }

  function remove(id: number) {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index !== -1) toasts.value.splice(index, 1)
  }

  return { toasts, maxCount, position, add, remove }
})
