export type Type = 'polyomino' | 'tangram' | 'answer'

export interface CommonObjectProps {
  type: Type
  id?: string
  x?: number
  y?: number
  rotate?: number
  fill?: string
  coordinates?: number[][]
}

export class CommonObject {
  public type: Type
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
  // 자식을 모름 → 레지스트리에 위임
  static fromJSON<T extends CommonObject = CommonObject>(data: any): T {
    return ObjectRegistry.create<T>(data)
  }
}

// Registry
type Ctor<T extends CommonObject = CommonObject> = new (props: any) => T

export class ObjectRegistry {
  private static map = new Map<string, Ctor>()

  static register(type: string, ctor: Ctor) {
    this.map.set(type, ctor)
  }

  static create<T extends CommonObject = CommonObject>(data: any): T {
    const ctor = this.map.get(data.type)
    if (!ctor) {
      throw new Error(`Unknown object type: ${data.type}`)
    }
    return new ctor(data) as T
  }
}
