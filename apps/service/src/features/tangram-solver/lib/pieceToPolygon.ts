import type { Polygon } from 'polygon-clipping'
import type { CommonObject } from '@/shared/lib'

// 조각 local 좌표 → world 좌표 polygon 변환 (translate + rotate 적용)
export const pieceToPolygon = (piece: CommonObject): Polygon => {
  const rad = (piece.rotate * Math.PI) / 180
  const cos = Math.cos(rad)
  const sin = Math.sin(rad)
  const ring = piece.coordinates.map(([lx, ly]) => {
    const rx = lx * cos - ly * sin
    const ry = lx * sin + ly * cos
    return [rx + piece.x, ry + piece.y] as [number, number]
  })
  return [ring]
}
