// GA4 커스텀 이벤트 헬퍼 (GTM dataLayer 경유)
// - 모든 이벤트는 이 파일을 통해서만 발행
// - 개발 환경에서는 console.log 로 디버그

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>
  }
}

type PuzzleBaseParams = {
  tangram_id: number
  key: string
  difficulty: number
}

export type AnalyticsEventMap = {
  // 카드 클릭으로 퍼즐 진입 (목록 내 위치 포함)
  puzzle_selected: PuzzleBaseParams & {
    card_position: number // 0-based 인덱스 (몇 번째 카드인지)
  }
  // 상세 페이지 진입 직후 (직접 URL 진입 포함)
  puzzle_started: PuzzleBaseParams
  // 정답 도달 (score ≥ 95)
  puzzle_completed: PuzzleBaseParams & {
    duration_sec: number
    final_score: number
    move_count: number
    rotate_count: number
    flip_count: number
    hint_used_count: number
  }
  // 중도 이탈 (라우트 변경 / 탭 닫힘)
  puzzle_abandoned: PuzzleBaseParams & {
    duration_sec: number
    last_score: number
    move_count: number
    rotate_count: number
    flip_count: number
    hint_used_count: number
  }
  // 힌트 토글 (ON 됐을 때만 발행)
  hint_toggled: PuzzleBaseParams & {
    current_score: number // 그 순간의 정답률 (0~100)
    time_since_start_sec: number
  }
}

type AnalyticsEventName = keyof AnalyticsEventMap

const isDev = import.meta.env?.DEV === true

export const trackEvent = <N extends AnalyticsEventName>(name: N, params: AnalyticsEventMap[N]) => {
  const payload = { event: name, ...params }

  if (isDev) {
    // 개발 환경: 콘솔에만 찍고 GTM 으로는 안 보냄
    console.debug('[analytics]', name, params)
    return
  }

  try {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push(payload)
  } catch (e) {
    console.warn('[analytics] push 실패:', e)
  }
}
