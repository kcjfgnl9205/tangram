import { CommonObject, type CommonObjectProps, ObjectRegistry } from '@/utils'

const CENTER = { cx: 1490, cy: 540 }

export type PolyominoType =
  | 'tetromino01'
  | 'tetromino02'
  | 'tetromino03'
  | 'tetromino04'
  | 'tetromino05'
  | 'pentomino01'
  | 'pentomino02'
  | 'pentomino03'
  | 'pentomino04'
  | 'pentomino05'
  | 'pentomino06'
  | 'pentomino07'
  | 'pentomino08'
  | 'pentomino09'
  | 'pentomino10'
  | 'pentomino11'
  | 'pentomino12'

export interface PolyominoObjectProps extends CommonObjectProps {
  polyominoType: PolyominoType
  size: number
  bounds?: { minX: number; maxX: number; minY: number; maxY: number }
}

// 사각형은 900x900
export class PolyominoObject extends CommonObject {
  public polyominoType: PolyominoType
  public size: number
  public bounds: { minX: number; maxX: number; minY: number; maxY: number }

  constructor(props: PolyominoObjectProps) {
    super(props)
    this.type = 'polyomino'
    this.polyominoType = props.polyominoType
    const { x, y } = this.initXY(this.polyominoType)
    this.x = props.x ?? x
    this.y = props.y ?? y
    this.size = props.size
    this.coordinates =
      props.coordinates ?? this.getInitCoordinates(this.polyominoType, Number(this.size))
    this.bounds = this.getBounds(this.coordinates)
    this.fill = this.getInitFill(this.polyominoType)
  }

  private initXY(type: PolyominoType) {
    const { cx, cy } = CENTER

    return { x: cx, y: cy }
  }

  private getBounds = (coordinates: number[][]) => {
    const xs = coordinates.map((p) => p[0])
    const ys = coordinates.map((p) => p[1])
    return {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: Math.min(...ys),
      maxY: Math.max(...ys),
    }
  }

  // 폴리오미노 색상
  private getInitFill(type: PolyominoType) {
    switch (type) {
      case 'tetromino01':
        return '#80CFA9'
      case 'tetromino02':
        return '#C97D8C'
      case 'tetromino03':
        return '#7A8B58'
      case 'tetromino04':
        return '#E3C9A8'
      case 'tetromino05':
        return '#E76F51'
      default:
        return '#80CFA9'
    }
  }

  // 폴리오미노 좌표
  private getInitCoordinates(type: PolyominoType, size: number) {
    const w = Number(size)
    const hw = Number(size) / 2
    switch (type) {
      case 'tetromino01':
        return [
          [-w * 2, -hw],
          [w * 2, -hw],
          [w * 2, hw],
          [-w * 2, hw],
        ]
      case 'tetromino02':
        return [
          [-w, -w],
          [w, -w],
          [w, w],
          [-w, w],
        ]
      case 'tetromino03':
        return [
          [-w - hw, -w],
          [w + hw, -w],
          [w + hw, 0],
          [hw, 0],
          [hw, w],
          [-hw, w],
          [-hw, 0],
          [-w - hw, 0],
        ]
      case 'tetromino04':
        return [
          [-w, -w - hw],
          [0, -w - hw],
          [0, hw],
          [w, hw],
          [w, hw + w],
          [0, hw + w],
          [-w, hw + w],
        ]
      case 'tetromino05':
        return [
          [-w - hw, -w],
          [hw, -w],
          [hw, 0],
          [hw + w, 0],
          [hw + w, w],
          [-hw, w],
          [-hw, 0],
          [-hw - w, 0],
        ]
      default:
        return [
          [-w - hw, -hw],
          [w + hw, -hw],
          [w + hw, hw],
          [-w - hw, hw],
        ]
    }
  }
}

ObjectRegistry.register('polyomino', PolyominoObject)
