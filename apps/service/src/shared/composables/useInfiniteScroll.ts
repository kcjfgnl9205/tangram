import { type Ref, onUnmounted, ref, watch } from 'vue'

interface UseInfiniteScrollOptions<T> {
  fetchFn: (offset: number, limit: number) => Promise<{ list: T[]; totalCount: number } | null>
  limit?: number
}

export function useInfiniteScroll<T>({ fetchFn, limit = 10 }: UseInfiniteScrollOptions<T>) {
  const items = ref([]) as Ref<T[]>
  const offset = ref(1)
  const hasMore = ref(true)
  const loading = ref(false)
  const totalCount = ref(0)
  const sentinelEl = ref<HTMLElement | null>(null)

  let observer: IntersectionObserver | null = null

  const load = async () => {
    if (loading.value || !hasMore.value) return
    loading.value = true
    try {
      const data = await fetchFn(offset.value, limit)
      if (!data) return
      items.value.push(...data.list)
      totalCount.value = data.totalCount
      hasMore.value = items.value.length < data.totalCount
      offset.value++
    } finally {
      loading.value = false
    }

    // 로드 후에도 센티널이 뷰포트 안에 있으면 자동으로 다음 페이지 로드
    // (큰 모니터나 목록이 짧은 경우 첫 페이지만 로드되고 멈추는 문제 방지)
    if (hasMore.value && sentinelEl.value) {
      const rect = sentinelEl.value.getBoundingClientRect()
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight
      if (rect.top < viewportHeight) {
        await load()
      }
    }
  }

  const reset = () => {
    items.value = []
    offset.value = 1
    hasMore.value = true
    loading.value = false
    totalCount.value = 0
  }

  const setupObserver = () => {
    observer?.disconnect()
    if (!sentinelEl.value) return
    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) load()
      },
      { threshold: 0.1 },
    )
    observer.observe(sentinelEl.value)
  }

  watch(sentinelEl, (el) => {
    if (el) setupObserver()
  })

  onUnmounted(() => {
    observer?.disconnect()
  })

  return { items, loading, hasMore, totalCount, sentinelEl, load, reset }
}
