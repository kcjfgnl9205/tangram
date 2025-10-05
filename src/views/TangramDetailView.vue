<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCanvasStore } from '@/stores'
import { fetchTangramDetail } from '@/api/tangram'
import { Canvas } from '@/components/canvas'
import { createObject, getResourceUrl } from '@/utils'

const route = useRoute()
const canvasStore = useCanvasStore()
const { objects } = storeToRefs(canvasStore)

onMounted(async () => {
  try {
    if (!route.params.id) throw new Error('아이디가 없습니다.')

    const id = route.params.id
    const data = await fetchTangramDetail(Number(id))
    const res = await fetch(getResourceUrl(data.json_url))
    const response = await res.json()

    const arr = []
    for (const obj of response) {
      const item = createObject(obj.type, { ...obj })
      arr.push(item)
    }
    objects.value = arr
  } catch (e) {
    console.error(e)
  }
})
</script>

<template>
  <div class="w-full h-[calc(100dvh-3.5rem)]">
    <!-- Canvas 영역 (제목 제외하고 꽉 채움) -->
    <main class="flex-1 flex justify-center p-4 w-full h-full items-center gap-2">
      <Canvas />
    </main>
  </div>
</template>
