<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCanvasStore } from '@/entities/canvas'
import { createTangram } from '@/entities/tangram/api/tangram'
import { Canvas } from '@/widgets/canvas'
import { Button, Input, SelectBox } from '@/shared/ui'
import { createObject, generateAnswerAreaPng, generateJsonBlob, getVertices } from '@/shared/lib'
import { uploadViaSupabase } from '@/shared/lib/r2/upload'
import type { TangramPayload } from '@/shared/types'

const canvasStore = useCanvasStore()
const { objects, tangramSize, width } = storeToRefs(canvasStore)
const key = ref('')
const difficulty = ref<number>(3)
const showAnswerPreview = ref<boolean>(true)

const difficultyOptions = [
  { label: '1 (매우 쉬움)', value: 1 },
  { label: '2 (쉬움)', value: 2 },
  { label: '3 (보통)', value: 3 },
  { label: '4 (어려움)', value: 4 },
  { label: '5 (매우 어려움)', value: 5 },
]

const handleCreateTangram = () => {
  canvasStore.tangramInit()
}

const handleCreateBluePrint = () => {
  const coordinatesArr: number[][][] = []
  for (const object of objects.value) {
    coordinatesArr.push(getVertices(object))
  }
  createObject('answer', { coordinatesArr })
}

const handleSubmit = async () => {
  try {
    if (!key.value) throw new Error('키를 입력해주세요')

    // blob변환
    const jsonBlob = generateJsonBlob(objects.value)
    const pngBlob = await generateAnswerAreaPng()

    // json, 이미지 업로드
    const [jsonResponse, imgResponse] = await Promise.all([
      uploadViaSupabase(
        jsonBlob,
        `tangram/data/${key.value}-${Date.now()}.json`,
        'application/json',
      ),
      uploadViaSupabase(pngBlob, `tangram/thumbnail/${key.value}-${Date.now()}.png`, 'image/png'),
    ])

    if (!jsonResponse.fileName || !imgResponse.fileName) throw new Error()

    const [json_url, thumbnail_url] = [jsonResponse.fileName, imgResponse.fileName]
    const payload: TangramPayload = {
      key: key.value,
      json_url,
      thumbnail_url,
      difficulty: Number(difficulty.value),
      show_answer_preview: showAnswerPreview.value,
    }

    const response = await createTangram(payload)
    if (!response) throw new Error('업로드 실패!')

    alert('업로드 성공!')
  } catch (err) {
    console.error(err)
    alert('업로드 실패')
  }
}
</script>

<template>
  <div class="w-full h-[calc(100dvh-3.5rem)] bg-indigo-100 flex flex-col">
    <div class="flex-1 flex flex-col justify-center p-4 w-full h-full items-center gap-2">
      <div class="w-full flex flex-col gap-2" :style="{ width: `${width}px` }">
        <div class="flex gap-2">
          <Button variant="btn-blue" @click="handleCreateTangram">칠교판생성</Button>
          <Button variant="btn-blue" @click="handleCreateBluePrint">도면생성</Button>
          <Button variant="btn-blue" @click="handleSubmit">정답만들기</Button>
        </div>
        <div class="flex gap-2">
          <Input v-model="tangramSize" label="칠교놀이 사이즈" />
          <Input v-model="key" label="key값" />
          <SelectBox v-model="difficulty" label="난이도" :options="difficultyOptions" />
          <label class="flex items-center gap-1 self-end pb-2">
            <input v-model="showAnswerPreview" type="checkbox" />
            <span class="text-sm">정답 미리보기 허용</span>
          </label>
        </div>
      </div>
      <Canvas :loaded="true" />
    </div>
  </div>
</template>
