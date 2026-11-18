export const ringArea = (ring: number[][]): number => {
  let s = 0
  const n = ring.length
  if (n < 3) return 0
  for (let i = 0; i < n; i++) {
    const [x1, y1] = ring[i]
    const [x2, y2] = ring[(i + 1) % n]
    s += x1 * y2 - x2 * y1
  }
  return Math.abs(s) / 2
}

export const polygonArea = (poly: number[][][]): number =>
  poly.reduce((sum, ring, i) => sum + (i === 0 ? ringArea(ring) : -ringArea(ring)), 0)

export const multiPolygonArea = (mp: number[][][][]): number =>
  mp.reduce((sum, poly) => sum + polygonArea(poly), 0)
