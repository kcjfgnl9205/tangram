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

export interface ToastOptions {
  /** 제목 아래 작은 글씨로 붙는 부연. 길면 두 줄까지 보인다. */
  description?: string
  /** 자동으로 닫히기까지의 시간(ms). `0` 이면 사용자가 닫을 때까지 남는다. */
  duration?: number
  position?: ToastPosition
}

export interface ToastItem extends Required<Pick<ToastOptions, 'duration' | 'position'>> {
  id: number
  message: string
  description?: string
  type: ToastType
}

/** 에러·경고는 읽는 데 시간이 더 걸리므로 조금 더 오래 둔다. */
const DEFAULT_DURATION: Record<ToastType, number> = {
  info: 3000,
  success: 3000,
  warning: 5000,
  error: 5000,
}

let _nextId = 0

export const useToastStore = defineStore('v2_toast', () => {
  const toasts = ref<ToastItem[]>([])
  const maxCount = ref(5)
  const position = ref<ToastPosition>('bottom')

  // id → timer. 사용자가 먼저 닫으면 예약된 제거를 취소해야 다음 토스트의 id 를 건드리지 않는다.
  const timers = new Map<number, ReturnType<typeof setTimeout>>()

  function add(message: string, type: ToastType = 'info', options: ToastOptions = {}) {
    if (toasts.value.length >= maxCount.value) {
      const oldest = toasts.value[0]
      if (oldest) remove(oldest.id)
    }

    const id = _nextId++
    const duration = options.duration ?? DEFAULT_DURATION[type]
    const pos = options.position ?? position.value

    toasts.value.push({
      id,
      message,
      description: options.description,
      type,
      duration,
      position: pos,
    })

    if (duration > 0) {
      timers.set(
        id,
        setTimeout(() => remove(id), duration),
      )
    }

    return id
  }

  function remove(id: number) {
    const timer = timers.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.delete(id)
    }

    const index = toasts.value.findIndex((t) => t.id === id)
    if (index !== -1) toasts.value.splice(index, 1)
  }

  function clear() {
    for (const timer of timers.values()) clearTimeout(timer)
    timers.clear()
    toasts.value = []
  }

  return { toasts, maxCount, position, add, remove, clear }
})
