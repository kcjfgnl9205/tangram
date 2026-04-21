import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

// 게임 플레이 관련 사용자 환경설정 (localStorage 에 영속)
const STORAGE_KEY = 'preferences'

interface Preferences {
  showAccuracy: boolean // 플레이 중 정답률 표시 여부
}

const DEFAULTS: Preferences = {
  showAccuracy: true,
}

const load = (): Preferences => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULTS }
    const parsed = JSON.parse(raw) as Partial<Preferences>
    return { ...DEFAULTS, ...parsed }
  } catch {
    return { ...DEFAULTS }
  }
}

export const usePreferencesStore = defineStore('preferences', () => {
  const initial = load()
  const showAccuracy = ref<boolean>(initial.showAccuracy)

  // 변경될 때마다 localStorage 에 저장
  watch(showAccuracy, (value) => {
    try {
      const current = load()
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, showAccuracy: value }))
    } catch {
      // 저장 실패(쿼터 초과 등)는 조용히 무시
    }
  })

  return { showAccuracy }
})
