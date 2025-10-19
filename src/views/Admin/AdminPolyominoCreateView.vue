<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCanvasStore } from '@/stores'
import { Canvas } from '@/components/canvas'
import { Button, Icon, Input, SelectBox } from '@/components/ui'
import { createObject, generateAnswerAreaPng, generateJsonBlob, getVertices } from '@/utils'
import { uploadViaSupabase } from '@/lib/r2/upload'
import type { PolyominoUpdate } from '@/types'
import type { PolyominoType } from '@/utils/objects/polyomino'
import { createPolyomino } from '@/api/polyomino'

const canvasStore = useCanvasStore()
const { objects, polyominoSize, width } = storeToRefs(canvasStore)
const type = ref('TETROMINO')
const key = ref('')

const handleCreatePolyomino = (key: PolyominoType) => {
  canvasStore.polyominoInit(key)
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
        `polyomino/data/${key.value}-${Date.now()}.json`,
        'application/json',
      ),
      uploadViaSupabase(pngBlob, `polyomino/thumbnail/${key.value}-${Date.now()}.png`, 'image/png'),
    ])

    if (!jsonResponse.fileName || !imgResponse.fileName) throw new Error()

    const [json_url, thumbnail_url] = [jsonResponse.fileName, imgResponse.fileName]
    const payload: PolyominoUpdate = {
      key: key.value,
      json_url,
      thumbnail_url,
      type:
        type.value === 'TETROMINO'
          ? 1
          : type.value === 'PENTOMINO'
            ? 2
            : type.value === 'HEXOMINO'
              ? 3
              : 4,
    }

    const response = await createPolyomino(payload)
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
    <main class="flex-1 flex flex-col justify-center p-4 w-full h-full items-center gap-2">
      <div class="w-full flex flex-col gap-2" :style="{ width: `${width}px` }">
        <div class="flex gap-2">
          <SelectBox
            v-model="type"
            label="퍼즐 유형"
            :options="[
              { label: '테트로미노', value: 'TETROMINO' },
              { label: '펜토미노', value: 'PENTOMINO' },
              { label: '헥소미노', value: 'HEXOMINO' },
              { label: '혼합형', value: 'MIXED' },
            ]"
            placeholder="유형을 선택하세요"
            required
          />
          <Input v-model="polyominoSize" label="폴리노미오 사이즈" />
          <Input v-model="key" label="key값" />
        </div>
        <div class="flex gap-2">
          <Button variant="btn-blue" @click="handleCreateBluePrint">도면생성</Button>
          <Button variant="btn-blue" @click="handleSubmit">정답만들기</Button>
        </div>
        <div>
          <div class="text-black flex gap-2 items-center" v-if="type === 'TETROMINO'">
            <div
              class="w-12 h-12 bg-neutral-200 p-4 cursor-pointer select-none"
              @click="() => handleCreatePolyomino('tetromino01')"
            >
              I
            </div>
            <div
              class="w-12 h-12 bg-neutral-200 p-4 cursor-pointer select-none"
              @click="() => handleCreatePolyomino('tetromino02')"
            >
              O
            </div>
            <div
              class="w-12 h-12 bg-neutral-200 p-4 cursor-pointer select-none"
              @click="() => handleCreatePolyomino('tetromino03')"
            >
              T
            </div>
            <div
              class="w-12 h-12 bg-neutral-200 p-4 cursor-pointer select-none"
              @click="() => handleCreatePolyomino('tetromino04')"
            >
              L
            </div>
            <div
              class="w-12 h-12 bg-neutral-200 p-4 cursor-pointer select-none"
              @click="() => handleCreatePolyomino('tetromino05')"
            >
              Z
            </div>
          </div>
          <div class="text-black flex gap-2 items-center" v-if="type === 'PENTOMINO'">
            <div
              class="w-12 h-12 bg-neutral-200 p-4 cursor-pointer select-none"
              @click="() => handleCreatePolyomino('pentomino01')"
            >
              F
            </div>
            <div
              class="w-12 h-12 bg-neutral-200 p-4 cursor-pointer select-none"
              @click="() => handleCreatePolyomino('pentomino02')"
            >
              I
            </div>
            <div
              class="w-12 h-12 bg-neutral-200 p-4 cursor-pointer select-none"
              @click="() => handleCreatePolyomino('pentomino03')"
            >
              L
            </div>
            <div
              class="w-12 h-12 bg-neutral-200 p-4 cursor-pointer select-none"
              @click="() => handleCreatePolyomino('pentomino04')"
            >
              N
            </div>
            <div
              class="w-12 h-12 bg-neutral-200 p-4 cursor-pointer select-none"
              @click="() => handleCreatePolyomino('pentomino05')"
            >
              P
            </div>
            <div
              class="w-12 h-12 bg-neutral-200 p-4 cursor-pointer select-none"
              @click="() => handleCreatePolyomino('pentomino06')"
            >
              T
            </div>
            <div
              class="w-12 h-12 bg-neutral-200 p-4 cursor-pointer select-none"
              @click="() => handleCreatePolyomino('pentomino07')"
            >
              U
            </div>
            <div
              class="w-12 h-12 bg-neutral-200 p-4 cursor-pointer select-none"
              @click="() => handleCreatePolyomino('pentomino08')"
            >
              V
            </div>
            <div
              class="w-12 h-12 bg-neutral-200 p-4 cursor-pointer select-none"
              @click="() => handleCreatePolyomino('pentomino09')"
            >
              W
            </div>
            <div
              class="w-12 h-12 bg-neutral-200 p-4 cursor-pointer select-none"
              @click="() => handleCreatePolyomino('pentomino10')"
            >
              X
            </div>
            <div
              class="w-12 h-12 bg-neutral-200 p-4 cursor-pointer select-none"
              @click="() => handleCreatePolyomino('pentomino11')"
            >
              Y
            </div>
            <div
              class="w-12 h-12 bg-neutral-200 p-4 cursor-pointer select-none"
              @click="() => handleCreatePolyomino('pentomino12')"
            >
              Z
            </div>
          </div>
        </div>
      </div>
      <Canvas :loaded="true" />
    </main>
  </div>
</template>
