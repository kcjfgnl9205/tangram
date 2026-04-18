import polygonClipping, { type Geom, type MultiPolygon } from 'polygon-clipping'
import type { CommonObject } from '@/shared/lib'
import { pieceToPolygon } from './pieceToPolygon'
import { multiPolygonArea, polygonArea } from './area'

export interface ValidationResult {
  isCorrect: boolean
  score: number // 0..1
  uncovered: number // target에서 안 채워진 비율
  overflow: number // target 밖으로 삐져나간 비율
  overlap: number // 조각끼리 겹친 비율
}

const EMPTY_RESULT: ValidationResult = {
  isCorrect: false,
  score: 0,
  uncovered: 1,
  overflow: 0,
  overlap: 0,
}

export const validateTangram = (
  pieces: CommonObject[],
  target: Geom,
  epsilon = 0.01, // 1% 허용 (난이도에 따라 조정)
): ValidationResult => {
  if (!pieces.length) return EMPTY_RESULT

  const targetArea = Array.isArray(target[0]?.[0]?.[0])
    ? multiPolygonArea(target as MultiPolygon)
    : polygonArea(target as number[][][])
  if (targetArea <= 0) return EMPTY_RESULT

  const geoms = pieces.map(pieceToPolygon)
  if (!geoms.length) return EMPTY_RESULT

  let userUnion: MultiPolygon
  let intersection: MultiPolygon
  let totalUnion: MultiPolygon
  try {
    const [first, ...rest] = geoms
    userUnion = polygonClipping.union(first, ...rest)
    if (!userUnion.length) return EMPTY_RESULT
    intersection = polygonClipping.intersection(target, userUnion)
    totalUnion = polygonClipping.union(target, userUnion)
  } catch {
    return EMPTY_RESULT
  }

  const userArea = multiPolygonArea(userUnion)
  const intersectionArea = multiPolygonArea(intersection)
  const totalUnionArea = multiPolygonArea(totalUnion)

  // 개별 조각 합 − union = 조각끼리 겹친 면적
  const individualSum = geoms.reduce((s, g) => s + polygonArea(g), 0)
  const overlapArea = Math.max(0, individualSum - userArea)

  const uncoveredArea = Math.max(0, targetArea - intersectionArea)
  const overflowArea = Math.max(0, userArea - intersectionArea)

  const uncoveredR = uncoveredArea / targetArea
  const overflowR = overflowArea / targetArea
  const overlapR = overlapArea / targetArea

  // IoU (Jaccard): 0~1 범위의 부드러운 점수
  // overlap은 IoU에 안 들어가서 별도 감점
  const iou = totalUnionArea > 0 ? intersectionArea / totalUnionArea : 0
  const score = Math.max(0, iou - overlapR * 0.5)

  const isCorrect = uncoveredR < epsilon && overflowR < epsilon && overlapR < epsilon

  return { isCorrect, score, uncovered: uncoveredR, overflow: overflowR, overlap: overlapR }
}
