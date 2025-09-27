import { CommonObject, type CommonObjectProps, ObjectRegistry } from '@/utils'

const CENTER = { cx: 1490, cy: 540 }
const TANGRAM_SIZE = 500
const maxSize = TANGRAM_SIZE / 2
const midSize = TANGRAM_SIZE / 4
const minSize = TANGRAM_SIZE / 8
const ws = midSize + minSize

export type TangramType =
  | 'tangram01' // 큰 삼각형1
  | 'tangram02' // 큰 삼각형2
  | 'tangram03' // 작은 삼각형1
  | 'tangram04' // 작은 삼각형2
  | 'tangram05' // 사각형
  | 'tangram06' // 중간 삼각형
  | 'tangram07' // 평행사변형

export interface TangramObjectProps extends CommonObjectProps {
  tangramType: TangramType
}

// 사각형은 900x900
export class TangramObject extends CommonObject {
  public tangramType: TangramType

  constructor(props: TangramObjectProps) {
    super(props)
    this.type = 'tangram'
    this.tangramType = props.tangramType
    const { x, y } = this.initXY(this.tangramType)
    this.x = props.x ?? x
    this.y = props.y ?? y
    this.coordinates = this.getInitCoordinates(this.tangramType)
    this.fill = props.fill ?? this.getInitFill(this.tangramType)
  }

  private initXY(type: TangramType) {
    const { cx, cy } = CENTER

    switch (type) {
      case 'tangram01':
        return { x: cx, y: -midSize + cy }
      case 'tangram02':
        return { x: midSize + cx, y: cy }
      case 'tangram03':
        return { x: cx - ws, y: cy - midSize }
      case 'tangram04':
        return { x: cx - midSize, y: cy }
      case 'tangram05':
        return { x: cx, y: cy + minSize }
      case 'tangram06':
        return { x: cx - midSize, y: cy + midSize }
      case 'tangram07':
        return { x: cx + minSize, y: cy + ws }
      default:
        return { x: cx, y: -midSize + cy }
    }
  }

  // 칠교놀이 색상
  private getInitFill(type: TangramType) {
    switch (type) {
      case 'tangram01':
        return '#7FD50F'
      case 'tangram02':
        return '#FF5862'
      case 'tangram03':
        return '#FF6EAD'
      case 'tangram04':
        return '#FFE100'
      case 'tangram05':
        return '#32CCFF'
      case 'tangram06':
        return '#FF8E25'
      case 'tangram07':
        return '#B675FF'
      default:
        return '#7FD50F'
    }
  }

  // 칠교놀이 좌표
  private getInitCoordinates(type: TangramType) {
    switch (type) {
      case 'tangram01':
        return [
          [-maxSize, -midSize],
          [maxSize, -midSize],
          [0, midSize],
        ]
      case 'tangram02':
        return [
          [midSize, maxSize],
          [midSize, -maxSize],
          [-midSize, 0],
        ]
      case 'tangram03':
        return [
          [-minSize, -midSize],
          [-minSize, midSize],
          [minSize, 0],
        ]
      case 'tangram04':
        return [
          [0, -midSize],
          [-midSize, 0],
          [0, midSize],
          [midSize, 0],
        ]
      case 'tangram05':
        return [
          [-midSize, minSize],
          [0, -minSize],
          [midSize, minSize],
        ]
      case 'tangram06':
        return [
          [-midSize, -midSize],
          [-midSize, midSize],
          [midSize, midSize],
        ]
      case 'tangram07':
        return [
          [-ws, -minSize],
          [minSize, -minSize],
          [ws, minSize],
          [-minSize, minSize],
        ]
      default:
        return [
          [-maxSize, -midSize],
          [maxSize, -midSize],
          [0, midSize],
        ]
    }
  }
}

ObjectRegistry.register('tangram', TangramObject)
