<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import { useCanvasStore } from '@/stores'
import { Canvas } from '@/components/canvas'
import { Button } from '@/components/ui'
import { createObject, generateAnswerAreaPng, generateJsonBlob, getVertices } from '@/utils'
import { uploadViaSupabase } from '@/lib/r2/upload'

const canvasStore = useCanvasStore()
const { objects, tangramSize } = storeToRefs(canvasStore)

const handleCreateTangram = () => {
  canvasStore.init()
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
    // blob변환
    const jsonBlob = generateJsonBlob(objects.value)
    const pngBlob = await generateAnswerAreaPng()

    // json, 이미지 업로드
    const [jsonResponse, imgResponse] = await Promise.all([
      uploadViaSupabase(jsonBlob, `test/${Date.now()}.json`, 'application/json'),
      uploadViaSupabase(pngBlob, `test/${Date.now()}.png`, 'image/png'),
    ])

    console.log('R2 업로드 성공:', jsonResponse, imgResponse)

    alert('업로드 성공!')
  } catch (err) {
    console.error(err)
    alert('업로드 실패')
  }
}

const handleTangramResize = (size: number) => {
  tangramSize.value = size
}
</script>

<template>
  <div class="w-full h-[calc(100dvh-3.5rem)] bg-indigo-100 flex flex-col">
    <main class="flex-1 flex flex-col justify-center p-4 w-full h-full items-center gap-2">
      <div class="w-full flex gap-2">
        <Button variant="btn-blue" @click="handleCreateTangram">칠교판생성</Button>
        <Button variant="btn-blue" @click="handleCreateBluePrint">도면생성</Button>
        <Button variant="btn-blue" @click="handleSubmit">정답만들기</Button>

        <Button variant="btn-blue" @click="() => handleTangramResize(300)">더작게</Button>
        <Button variant="btn-blue" @click="() => handleTangramResize(400)">작게</Button>
        <Button variant="btn-blue" @click="() => handleTangramResize(500)">중간</Button>
      </div>
      <Canvas />
    </main>
  </div>
</template>
