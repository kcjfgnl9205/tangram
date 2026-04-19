import { onBeforeUnmount, ref, toValue, type MaybeRefOrGetter } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { useCanvasStore } from '@/entities/canvas'
import { trackEvent } from '@/shared/lib'

interface PuzzleInfo {
  id: number
  key: string
  difficulty: number
}

/**
 * 칠교놀이 퍼즐 플레이 세션의 GA 이벤트 발행을 한곳에서 관리하는 컴포저블.
 *
 * 페이지에서는 데이터 로드 후 start(puzzle) 을 호출하고, 정답 시 completed(score) 만 부르면 됩니다.
 * - puzzle_started: start() 시점
 * - puzzle_completed: completed(score) 호출 시
 * - puzzle_abandoned: 라우트 이탈 / 탭 닫힘 / 새로고침 시 자동 (정답 도달 후엔 skip)
 */
export const usePuzzleAnalytics = (puzzle: MaybeRefOrGetter<PuzzleInfo | null>) => {
  const canvasStore = useCanvasStore()
  const solvedFlag = ref(false)

  const readPuzzle = (): PuzzleInfo | null => toValue(puzzle)

  const start = () => {
    const p = readPuzzle()
    if (!p) return
    canvasStore.startSession()
    canvasStore.currentPuzzle = { id: p.id, key: p.key, difficulty: p.difficulty }
    canvasStore.currentScore = 0
    solvedFlag.value = false

    trackEvent('puzzle_started', {
      tangram_id: p.id,
      key: p.key,
      difficulty: p.difficulty,
    })
  }

  const completed = (finalScore: number) => {
    const p = readPuzzle()
    if (!p) return
    solvedFlag.value = true

    trackEvent('puzzle_completed', {
      tangram_id: p.id,
      key: p.key,
      difficulty: p.difficulty,
      duration_sec: canvasStore.getElapsedSec(),
      final_score: finalScore,
      move_count: canvasStore.moveCount,
      rotate_count: canvasStore.rotateCount,
      flip_count: canvasStore.flipCount,
      hint_used_count: canvasStore.hintUsedCount,
    })
  }

  const abandoned = () => {
    const p = readPuzzle()
    // 정답 도달했거나 세션이 시작 안 됐으면 skip
    if (solvedFlag.value || !p || !canvasStore.sessionStartedAt) return

    trackEvent('puzzle_abandoned', {
      tangram_id: p.id,
      key: p.key,
      difficulty: p.difficulty,
      duration_sec: canvasStore.getElapsedSec(),
      last_score: canvasStore.currentScore,
      move_count: canvasStore.moveCount,
      rotate_count: canvasStore.rotateCount,
      flip_count: canvasStore.flipCount,
      hint_used_count: canvasStore.hintUsedCount,
    })
  }

  // 탭 닫힘 / 새로고침
  const handleBeforeUnload = () => abandoned()
  window.addEventListener('beforeunload', handleBeforeUnload)

  // 라우트 이탈
  onBeforeRouteLeave(() => {
    abandoned()
  })

  // cleanup
  onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload)
    canvasStore.currentPuzzle = null
  })

  return { start, completed, abandoned }
}
