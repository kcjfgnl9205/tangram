import { computed, onMounted } from 'vue'
import { useRoute, useRouter, type LocationQuery } from 'vue-router'

type ParamValue = string | string[] | number | number[] // 숫자형 추가
type QueryParamDefaults = Record<string, ParamValue>

interface UseQueryParamsOptions {
  showDefaults?: boolean
}

export function useQueryParams<T extends QueryParamDefaults>(
  defaults: T,
  options?: UseQueryParamsOptions,
) {
  const route = useRoute()
  const router = useRouter()
  const showDefaults = options?.showDefaults ?? false

  const params = computed(() => {
    const result: Record<string, ParamValue> = {}
    for (const key in defaults) {
      const defaultValue = defaults[key] as ParamValue // for-in 키라 항상 존재
      const queryValue = route.query[key]

      // noUncheckedIndexedAccess: 인덱스 접근은 undefined 를 포함한다
      if (defaultValue === undefined) continue

      if (Array.isArray(defaultValue)) {
        const raw = queryValue
        const arr = Array.isArray(raw) ? raw : raw ? [raw] : [...defaultValue]
        // 기본값이 숫자 배열이면 쿼리값도 숫자로 변환
        result[key] = typeof defaultValue[0] === 'number' ? (arr as string[]).map(Number) : (arr as string[])
      } else {
        if (queryValue === undefined || queryValue === null) {
          result[key] = defaultValue
        } else {
          // 기본값이 숫자면 쿼리값도 숫자로 변환
          result[key] =
            typeof defaultValue === 'number' ? Number(queryValue) : (queryValue as string)
        }
      }
    }
    return result as T
  })

  function buildQuery(newParams: Partial<T>) {
    const query: LocationQuery = { ...route.query }
    // 새로 설정할 파라미터와 기존 파라미터를 합침
    const mergedParams = { ...params.value, ...newParams }

    for (const key in mergedParams) {
      const value = (mergedParams as any)[key]
      const defaultValue = defaults[key]

      // 삭제 조건: 값이 없거나, (showDefaults가 꺼져있고 기본값과 같을 때)
      const isDefault = Array.isArray(value)
        ? JSON.stringify(value) === JSON.stringify(defaultValue)
        : value === defaultValue

      if (value === undefined || value === '' || (!showDefaults && isDefault)) {
        delete query[key]
      } else {
        query[key] = Array.isArray(value) ? value.map(String) : String(value)
      }
    }
    return query
  }

  function setParams(newParams: Partial<T>) {
    router.replace({ query: buildQuery(newParams) })
  }

  function resetParams() {
    router.replace({ query: showDefaults ? (buildQuery(defaults) as any) : {} })
  }

  // 초기 진입 시 URL 동기화 로직을 onMounted로 보호
  onMounted(() => {
    if (showDefaults) {
      const currentQuery = { ...route.query }
      let needsUpdate = false

      for (const key in defaults) {
        if (currentQuery[key] === undefined) {
          needsUpdate = true
          break
        }
      }

      if (needsUpdate) {
        const missingParams: Partial<T> = {}
        for (const key in defaults) {
          if (currentQuery[key] === undefined) {
            ;(missingParams as any)[key] = defaults[key]
          }
        }
        setParams(missingParams)
      }
    }
  })

  return { params, setParams, resetParams }
}
