import { CommonObject, type CommonObjectProps, ObjectRegistry } from '@/utils/objects/common'

export interface AnswerObjectProps extends CommonObjectProps {
  coordinatesArr: number[][][]
}

export class AnswerObject extends CommonObject {
  public coordinatesArr: number[][][]

  constructor(props: AnswerObjectProps) {
    super(props)
    const { coordinatesArr } = props
    this.type = 'answer'
    this.coordinatesArr = coordinatesArr
    this.coordinates = this.initCoordinates()
  }

  private initCoordinates() {
    const arr = this.coordinatesArr.flat()

    const precision = 5 // 소수점 3자리까지만 반올림해서 중복 판정
    const seen = new Set()
    const uniqueArr = []
    for (const [x, y] of arr) {
      const key = `${x.toFixed(precision)},${y.toFixed(precision)}` // 판정용 키
      if (!seen.has(key)) {
        seen.add(key)
        uniqueArr.push([x, y]) // 원래 값 그대로 보관
      }
    }
    return uniqueArr
  }
}

ObjectRegistry.register('answer', AnswerObject)
