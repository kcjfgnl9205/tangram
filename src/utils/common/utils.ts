import { useCanvasStore } from '@/stores'
import type { Point } from '@/types'
import type { CommonObject } from '@/utils'
import { storeToRefs } from 'pinia'

// 해당 엘리먼트 토글
export const toggleClassName = (id: string, className: string, flg: boolean = false) => {
  const element = document.getElementById(id) as unknown as SVGGraphicsElement
  if (element) element.classList.toggle(className, flg)
}

// 꼭지점으로 패스 그림
export const getPath = (coordinates: number[][]) => {
  return getPathDistanceAttribute(coordinates)
}

// 도형의 회전된 꼭지점 좌표
export const getVertices = (object: CommonObject): [number, number][] => {
  const rad = ((object.rotate ?? 0) * Math.PI) / 180

  return object.coordinates.map(([x, y]) => {
    // 회전
    const rx = x * Math.cos(rad) - y * Math.sin(rad)
    const ry = x * Math.sin(rad) + y * Math.cos(rad)

    // 이동
    return [rx + object.x, ry + object.y]
  })
}

// 좌표에 해당하는 x,y,width,height구ㅎ
export const getSize = (coordinates: number[][]) => {
  if (!coordinates.length) return { x: 0, y: 0, width: 0, height: 0 }

  const xs = coordinates.map(([x]) => x)
  const ys = coordinates.map(([_, y]) => y)

  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  }
}

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

// 두 점 사이의 각도
export const getCalculateRotation = (
  point1: { x: number; y: number },
  point2: { x: number; y: number },
) => {
  const deltaX = point2.x - point1.x
  const deltaY = point2.y - point1.y
  const angleRad = Math.atan2(deltaX, -deltaY)
  let angleDeg = (angleRad * 180) / Math.PI
  if (angleDeg < 0) {
    angleDeg += 360
  }
  return Math.round(angleDeg)
}

// 회전각도에 스냅
export const snapAngle = (angle: number) => {
  const snapPoints = [0, 45, 90, 135, 180, 225, 270, 315, 360]

  const tolerance = 5
  for (const snap of snapPoints) {
    if (Math.abs(angle - snap) <= tolerance) {
      return snap
    }
  }
  return angle // 스냅 각도 내에 없으면 원래 각도 유지
}

// x, y축 대칭된 좌표 계산
export function getSymmetricPoints(
  [x, y]: number[],
  type: 'horizontal' | 'vertical',
  [_x, _y] = [0, 0],
) {
  if (type === 'horizontal') return [2 * _x - x, y]
  else return [x, 2 * _y - y]
}

// 오브젝트 수평 뒤집기
export const setSymmetryHorizontal = () => {
  const canvasStore = useCanvasStore()
  const { selectedObjects } = storeToRefs(canvasStore)
  for (const object of selectedObjects.value) {
    object.coordinates = object.coordinates.map((coordinate: number[]) =>
      getSymmetricPoints(coordinate, 'horizontal'),
    )
    object.rotate = 360 - object.rotate
  }
}

// 오브젝트 수직 뒤집기
export const setSymmetryVertical = () => {
  const canvasStore = useCanvasStore()
  const { selectedObjects } = storeToRefs(canvasStore)
  for (const object of selectedObjects.value) {
    object.coordinates = object.coordinates.map((coordinate: number[]) =>
      getSymmetricPoints(coordinate, 'vertical'),
    )
    object.rotate = 360 - object.rotate
  }
}
