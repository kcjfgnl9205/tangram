import { storeToRefs } from 'pinia'
import { useCanvasStore } from '@/stores'
import { AnswerObject, type AnswerObjectProps } from './answer'
import { TangramObject, type TangramObjectProps } from './tangram'

// 1) 타입 매핑
export type ObjectPropsMap = {
  tangram: TangramObjectProps
  answer: AnswerObjectProps
}
type ObjectPropsMapWithoutType = {
  [K in keyof ObjectPropsMap]: Omit<ObjectPropsMap[K], 'type'>
}

// 2) ObjectType은 반드시 key들로 정의
export type ObjectType = keyof ObjectPropsMap

// 3) 생성자 매핑을 클래스 타입으로 정확히 명시
type CtorMap = {
  tangram: typeof TangramObject
  answer: typeof AnswerObject
}

const ObjectClassMap: CtorMap = {
  tangram: TangramObject,
  answer: AnswerObject,
}

// 4) 제네릭 팩토리 (type을 분리 인자로 받음)
export function createObject<T extends ObjectType>(type: T, props?: ObjectPropsMapWithoutType[T]) {
  const canvasStore = useCanvasStore()
  const { objects } = storeToRefs(canvasStore)
  const Ctor = ObjectClassMap[type]
  const object = new Ctor({ ...props, type } as any) as InstanceType<CtorMap[T]>
  objects.value.push(object)
  return object
}
