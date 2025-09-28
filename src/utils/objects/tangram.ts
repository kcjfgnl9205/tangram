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
    this.fill = this.getInitFill(this.tangramType)
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
        return '#1E2A38'
      case 'tangram02':
        return '#C97D8C'
      case 'tangram03':
        return '#7A8B58'
      case 'tangram04':
        return '#E3C9A8'
      case 'tangram05':
        return '#E76F51'
      case 'tangram06':
        return '#E9C46A'
      case 'tangram07':
        return '#80CFA9'
      default:
        return '#1E2A38'
      // case 'tangram01':
      //   return '#FF8C94'
      // case 'tangram02':
      //   return '#6ED3B7'
      // case 'tangram03':
      //   return '#A48DD8'
      // case 'tangram04':
      //   return '#6EC6FF'
      // case 'tangram05':
      //   return '#FFD93D'
      // case 'tangram06':
      //   return '#FF9F68'
      // case 'tangram07':
      //   return '#D5D5D5'
      // default:
      //   return '#FF8C94'
      // case 'tangram01':
      //   return '#3A3A3A'
      // case 'tangram02':
      //   return '#7B2D26'
      // case 'tangram03':
      //   return '#A3B18A'
      // case 'tangram04':
      //   return '#4A6FA5'
      // case 'tangram05':
      //   return '#E9E4D4'
      // case 'tangram06':
      //   return '#F77F00'
      // case 'tangram07':
      //   return '#FFD60A'
      // default:
      //   return '#3A3A3A'
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
