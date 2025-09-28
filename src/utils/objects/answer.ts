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
  }
}

ObjectRegistry.register('answer', AnswerObject)
