<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import { useCanvasStore } from '@/stores'
import { Canvas } from '@/components/canvas'
import { Button } from '@/components/ui'
import { createObject, generateAnswerAreaPng, generateJsonBlob, getVertices } from '@/utils'

const canvasStore = useCanvasStore()
const { objects } = storeToRefs(canvasStore)

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
    const zip = new JSZip()
    // 1. JSON 추가
    const jsonBlob = generateJsonBlob(objects.value)
    zip.file('objects.json', jsonBlob)
    // 2. PNG 추가
    const pngBlob = await generateAnswerAreaPng()
    zip.file('thumbnail.png', pngBlob)
    // 3. zip 생성 및 다운로드
    const content = await zip.generateAsync({ type: 'blob' })
    saveAs(content, 'download.zip')
  } catch (e) {
    console.error(e)
    alert('다운로드에 실패 했습니다.')
  }
}
</script>

<template>
  <div class="w-full h-[calc(100dvh-3.5rem)] bg-indigo-100 flex flex-col">
    <main class="flex-1 flex flex-col justify-center p-4 w-full h-full items-center gap-2">
      <div class="w-full flex gap-2">
        <Button variant="btn-blue" @click="handleCreateTangram">칠교판생성</Button>
        <Button variant="btn-blue" @click="handleCreateBluePrint">도면생성</Button>
        <Button variant="btn-blue" @click="handleSubmit">정답만들기</Button>
      </div>
      <Canvas />
    </main>
  </div>
</template>
