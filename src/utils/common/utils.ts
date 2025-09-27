import type { Point } from '@/types'

// 다각형 꼭지점을 잇는 path 경로
export const getPathDistanceAttribute = (arr: number[][]) => {
  return (
    arr.reduce((acc, [x, y], index) => {
      return index === 0 ? `M${x},${y}` : `${acc} L${x},${y}`
    }, '') + ' Z'
  )
}

// svg위에서의 현재 좌표
export const getCurrentCoordinates = (e: PointerEvent) => {
  const svg = document.querySelector('svg')
  if (svg) {
    const pt = svg.createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    const p = pt.matrixTransform(svg.getScreenCTM()?.inverse())
    return p
  }
}

// 두 점 사이의 거리
export const distPointPoint = (point1: Point, point2: Point) => {
  const { x: x1, y: y1 } = point1
  const { x: x2, y: y2 } = point2
  return Math.hypot(x1 - x2, y1 - y2)
}

// 한 점과 선분 사이의 최단 거리를 계산
export const distPointSegment = (point: Point, point1: Point, point2: Point) => {
  const { x: px, y: py } = point
  const { x: x1, y: y1 } = point1
  const { x: x2, y: y2 } = point2

  const vx = x2 - x1
  const vy = y2 - y1
  const wx = px - x1
  const wy = py - y1

  const c1 = vx * wx + vy * wy
  if (c1 <= 0) return Math.hypot(px - x1, py - y1)

  const c2 = vx * vx + vy * vy
  if (c2 <= c1) return Math.hypot(px - x2, py - y2)

  const t = c1 / c2
  const qx = x1 + t * vx
  const qy = y1 + t * vy
  return Math.hypot(px - qx, py - qy)
}
