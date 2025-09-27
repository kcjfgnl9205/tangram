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
