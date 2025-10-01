import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCanvasStore } from '@/stores'
import { type CommonObject, distPointPoint, getCurrentCoordinates, getVertices } from '@/utils'
import type { Point } from '@/types'

export function useDND() {
  const canvasStore = useCanvasStore()
  const { selectedObjects } = storeToRefs(canvasStore)
  const isDrag = ref(false)
  const currentPoint = ref<Point>({ x: 0, y: 0 })
  const originalPos = ref<Point | null>(null)
  const dragOrigin = ref<Point | null>(null) // pointerDown 시 포인터 기준점
  const startPositions = ref<Map<string, Point>>(new Map()) // 각 오브젝트의 시작 좌표

  const onPointerDown = (e: PointerEvent, obj: CommonObject) => {
    try {
      if (e.button !== 0) return // 마우스 좌클릭만 허용

      // z-index 가장 위로 올리기(맨 위로 랜더링)
      const idx = canvasStore.objects.findIndex((o) => o.id === obj.id)
      if (idx !== -1) {
        const [picked] = canvasStore.objects.splice(idx, 1)
        canvasStore.objects.push(picked)
      }

      // 선택된 객체 업데이트
      if (selectedObjects.value.length < 2) {
        selectedObjects.value = [obj]
      }

      // 처음 좌표 저장
      originalPos.value = { x: obj.x, y: obj.y }

      // 클릭 했을 때 좌표
      const p = getCurrentCoordinates(e)
      if (p) {
        dragOrigin.value = { x: p.x, y: p.y }
      }

      // 드래그 시작 시점의 각 선택 오브젝트 원본 좌표 저장
      startPositions.value.clear()
      for (const o of selectedObjects.value) {
        startPositions.value.set(o.id, { x: o.x, y: o.y })
      }

      isDrag.value = true
    } catch (e) {
      console.error('DND pointerdown 에러: ', e)
    } finally {
      document.addEventListener('pointermove', onPointerMove)
      document.addEventListener('pointerup', onPointerUp)
    }
  }

  const onPointerMove = (e: PointerEvent) => {
    try {
      if (!isDrag.value || !dragOrigin.value) return
      const p = getCurrentCoordinates(e)
      if (!p) return

      const dx = p.x - dragOrigin.value.x
      const dy = p.y - dragOrigin.value.y

      for (const object of selectedObjects.value) {
        const start = startPositions.value.get(object.id)
        if (!start) continue

        // 이번 프레임 ‘제안 좌표’ (스냅 전)
        const proposedX = start.x + dx
        const proposedY = start.y + dy

        let finalX = proposedX
        let finalY = proposedY

        if (selectedObjects.value.length === 1) {
          const snap = findSnapOffset(
            { ...object, x: proposedX, y: proposedY },
            canvasStore.objects.filter((o) => o.id !== object.id),
            10, // threshold
          )
          if (snap) {
            finalX = proposedX + snap.dx
            finalY = proposedY + snap.dy
          }
        }

        // 누적 += 금지. 이번 프레임 결과만 직접 대입
        object.x = finalX
        object.y = finalY
      }
      currentPoint.value.x = p.x
      currentPoint.value.y = p.y
    } catch (e) {
      console.error('DND pointermove 에러: ', e)
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerup', onPointerUp)
    }
  }

  const onPointerUp = (e: PointerEvent) => {
    try {
      dragOrigin.value = null

      const el = document.elementFromPoint(e.clientX, e.clientY)
      const isInsideSvg = el instanceof SVGElement
      if (!isInsideSvg && originalPos.value) {
        for (const object of selectedObjects.value) {
          object.x = originalPos.value.x
          object.y = originalPos.value.y
        }
      }

      isDrag.value = false
      originalPos.value = null
      dragOrigin.value = null
      startPositions.value.clear()
    } catch (e) {
      console.error('DND pointerup 에러: ', e)
    } finally {
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerup', onPointerUp)
    }
  }

  return { onPointerDown }
}

// 스냅되는 후보 검색
const findSnapOffset = (movingObj: CommonObject, otherObjs: CommonObject[], threshold = 10) => {
  const movingVertices = getVertices(movingObj)
  const candidates: { dx: number; dy: number; dist: number }[] = []

  for (const [mx, my] of movingVertices) {
    for (const other of otherObjs) {
      const otherVertices = getVertices(other)
      // 꼭짓점–변
      // for (let i = 0; i < otherVertices.length; i++) {
      //   const [x1, y1] = otherVertices[i]
      //   const [x2, y2] = otherVertices[(i + 1) % otherVertices.length]

      //   // 투영점 찾기
      //   const [vx, vy] = [x2 - x1, y2 - y1]
      //   const [wx, wy] = [mx - x1, my - y1]
      //   const [c1, c2] = [vx * wx + vy * wy, vx * vx + vy * vy]
      //   let [qx, qy] = [x1, y1]

      //   if (c1 <= 0) {
      //     qx = x1
      //     qy = y1
      //   } else if (c2 <= c1) {
      //     qx = x2
      //     qy = y2
      //   } else {
      //     const t = c1 / c2
      //     qx = x1 + t * vx
      //     qy = y1 + t * vy
      //   }

      //   const d = Math.hypot(mx - qx, my - qy)
      //   if (d <= threshold) {
      //     candidates.push({ dx: qx - mx, dy: qy - my, dist: d })
      //   }
      // }

      // 꼭짓점–꼭짓점
      for (const [ox, oy] of otherVertices) {
        // distPointPoint가 ‘제곱거리’면 Math.hypot로 교체하거나 threshold^2 비교로 바꿔주세요.
        const d = Math.hypot(mx - ox, my - oy) // 안전하게 실제거리 사용
        if (d <= threshold) {
          candidates.push({ dx: ox - mx, dy: oy - my, dist: d })
        }
      }
    }
  }

  if (!candidates.length) return null
  candidates.sort((a, b) => a.dist - b.dist)
  return candidates[0]
}
