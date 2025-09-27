export type ObjectType = 'tangram' | 'answer'

export interface CommonObjectProps {
  type: ObjectType
  id?: string
  x?: number
  y?: number
  rotate?: number
  fill?: string
  coordinates?: number[][]
}

export class CommonObject {
  public type: ObjectType
  public id: string
  public x: number
  public y: number
  public rotate: number
  public fill: string
  public coordinates: number[][] //

  constructor(obj: CommonObjectProps) {
    const { type, id, x, y, rotate, fill, coordinates } = obj
    this.id = id ?? crypto.randomUUID()
    this.type = type
    this.x = x ?? 100
    this.y = y ?? 100
    this.rotate = rotate ?? 0
    this.fill = fill ?? 'transparent'
    this.coordinates = coordinates ?? []
  }

  public setFill(fill: string) {
    this.fill = fill
  }

  // 도형의 회전된 꼭지점 좌표
  public getVertices(): [number, number][] {
    const rad = ((this.rotate ?? 0) * Math.PI) / 180

    return this.coordinates.map(([x, y]) => {
      // 회전
      const rx = x * Math.cos(rad) - y * Math.sin(rad)
      const ry = x * Math.sin(rad) + y * Math.cos(rad)

      // 이동
      return [rx + this.x, ry + this.y]
    })
  }
}
