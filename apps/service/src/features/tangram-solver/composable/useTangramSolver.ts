import { computed, ref, watch, type Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCanvasStore } from '@/entities/canvas'
import { type AnswerObject } from '@/shared/lib'
import { answersToMultiPolygon } from '../lib/answerToPolygon'
import { validateTangram, type ValidationResult } from '../lib/validate'

interface UseTangramSolverOptions {
  // 모든 조각이 target 영역 안에 들어온 뒤에만 자동 검증을 시작할지
  // 기본: 항상 체크. 큰 프로젝트면 false로 두고 명시적 check() 호출 권장
  autoCheck?: boolean
  // 이벤트마다 검증 결과 콜백 (이동/회전/반전 전부)
  onProgress?: (result: ValidationResult) => void
  // 정답 도달 시 콜백 (한 번만 발화)
  onSolved?: (result: ValidationResult) => void
}

export const useTangramSolver = (options: UseTangramSolverOptions = {}) => {
  const { autoCheck = true, onProgress, onSolved } = options
  const canvasStore = useCanvasStore()
  const { objects } = storeToRefs(canvasStore)

  const result: Ref<ValidationResult | null> = ref(null)
  const solved = ref(false)

  const tangramPieces = computed(() => objects.value.filter((o) => o.type === 'tangram'))
  const answerObjects = computed(
    () => objects.value.filter((o) => o.type === 'answer') as AnswerObject[],
  )

  const target = computed(() => answersToMultiPolygon(answerObjects.value))

  const check = () => {
    if (!tangramPieces.value.length || !target.value.length) return null
    const r = validateTangram(tangramPieces.value, target.value)
    result.value = r
    // GA 이벤트용 현재 점수 업데이트 (Toolbar 등 다른 위젯이 참조)
    canvasStore.currentScore = Math.round(r.score * 100)
    onProgress?.(r)
    if (r.isCorrect && !solved.value) {
      solved.value = true
      onSolved?.(r)
    }
    return r
  }

  if (autoCheck) {
    // pointermove 중에는 체크 X, "조작 끝" 이벤트(actionCount)에만 반응
    const { actionCount } = storeToRefs(canvasStore)
    watch(actionCount, () => queueMicrotask(check))
  }

  return { result, solved, check }
}
