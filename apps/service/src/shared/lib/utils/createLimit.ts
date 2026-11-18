// 나만의 칠교놀이 만들기 — 하루 생성 개수 제한 (localStorage 기반)
export const DAILY_CREATE_LIMIT = 5

const STORAGE_KEY = 'tangram_create_daily'

interface DailyCreateRecord {
  date: string // 'YYYY-MM-DD' (로컬 기준)
  count: number
}

// 로컬 타임존 기준 오늘 날짜 (YYYY-MM-DD)
const getTodayKey = (): string => {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// 오늘 기록을 읽어옴. 날짜가 바뀌었으면 0 으로 리셋된 값 반환
const readTodayRecord = (): DailyCreateRecord => {
  const today = getTodayKey()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as DailyCreateRecord
      if (parsed.date === today && Number.isFinite(parsed.count)) {
        return { date: today, count: parsed.count }
      }
    }
  } catch {
    // 손상된 값은 무시하고 초기화
  }
  return { date: today, count: 0 }
}

// 오늘 생성한 개수
export const getTodayCreateCount = (): number => readTodayRecord().count

// 오늘 더 만들 수 있는 남은 개수
export const getRemainingCreateCount = (): number =>
  Math.max(0, DAILY_CREATE_LIMIT - getTodayCreateCount())

// 오늘 더 만들 수 있는지 여부
export const canCreateTangramToday = (): boolean => getTodayCreateCount() < DAILY_CREATE_LIMIT

// 생성 성공 후 카운트 증가
export const incrementTodayCreateCount = (): void => {
  const record = readTodayRecord()
  const next: DailyCreateRecord = { date: record.date, count: record.count + 1 }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // 저장 실패는 무시 (시크릿 모드 등)
  }
}
