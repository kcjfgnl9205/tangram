import { storeToRefs } from 'pinia'
import { useCanvasStore } from '@/stores'
import { CommonObject, type CommonObjectProps, ObjectRegistry } from '@/utils'

const CENTER = { cx: 1490, cy: 540 }

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
    this.coordinates = props.coordinates ?? this.getInitCoordinates(this.tangramType)
    this.fill = this.getInitFill(this.tangramType)
  }

  private initXY(type: TangramType) {
    const canvasStore = useCanvasStore()
    const { defaultTangramOptions } = storeToRefs(canvasStore)
    const { cx, cy } = CENTER
    const { min, mid, ws } = defaultTangramOptions.value

    switch (type) {
      case 'tangram01':
        return { x: cx, y: -mid + cy }
      case 'tangram02':
        return { x: mid + cx, y: cy }
      case 'tangram03':
        return { x: cx - ws, y: cy - mid }
      case 'tangram04':
        return { x: cx - mid, y: cy }
      case 'tangram05':
        return { x: cx, y: cy + min }
      case 'tangram06':
        return { x: cx - mid, y: cy + mid }
      case 'tangram07':
        return { x: cx + min, y: cy + ws }
      default:
        return { x: cx, y: -mid + cy }
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
    const canvasStore = useCanvasStore()
    const { defaultTangramOptions } = storeToRefs(canvasStore)
    const { max, min, mid, ws } = defaultTangramOptions.value

    switch (type) {
      case 'tangram01':
        return [
          [-max, -mid],
          [max, -mid],
          [0, mid],
        ]
      case 'tangram02':
        return [
          [mid, max],
          [mid, -max],
          [-mid, 0],
        ]
      case 'tangram03':
        return [
          [-min, -mid],
          [-min, mid],
          [min, 0],
        ]
      case 'tangram04':
        return [
          [0, -mid],
          [-mid, 0],
          [0, mid],
          [mid, 0],
        ]
      case 'tangram05':
        return [
          [-mid, min],
          [0, -min],
          [mid, min],
        ]
      case 'tangram06':
        return [
          [-mid, -mid],
          [-mid, mid],
          [mid, mid],
        ]
      case 'tangram07':
        return [
          [-ws, -min],
          [min, -min],
          [ws, min],
          [-min, min],
        ]
      default:
        return [
          [-max, -mid],
          [max, -mid],
          [0, mid],
        ]
    }
  }
}

ObjectRegistry.register('tangram', TangramObject)
