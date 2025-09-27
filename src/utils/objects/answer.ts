import { getPathDistanceAttribute } from '@/utils/common/utils'
import { CommonObject, type CommonObjectProps } from '@/utils/objects/common'

export interface AnswerObjectProps extends CommonObjectProps {}

export class AnswerObject extends CommonObject {
  constructor(props: AnswerObjectProps) {
    super(props)
    this.type = 'answer'
  }
}
