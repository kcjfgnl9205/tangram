import type { MultiPolygon } from 'polygon-clipping'
import type { AnswerObject } from '@/shared/lib'

// answer objects → world MultiPolygon (정답 실루엣)
export const answersToMultiPolygon = (answers: AnswerObject[]): MultiPolygon => {
  const result: MultiPolygon = []
  for (const answer of answers) {
    const rad = (answer.rotate * Math.PI) / 180
    const cos = Math.cos(rad)
    const sin = Math.sin(rad)
    for (const ring of answer.coordinatesArr) {
      const worldRing = ring.map(([lx, ly]) => {
        const rx = lx * cos - ly * sin
        const ry = lx * sin + ly * cos
        return [rx + answer.x, ry + answer.y] as [number, number]
      })
      result.push([worldRing])
    }
  }
  return result
}
