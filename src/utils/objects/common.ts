import { getPathDistanceAttribute } from '../common/utils'

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
}
