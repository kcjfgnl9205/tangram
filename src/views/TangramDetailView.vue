<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { getResourceUrl } from '@/apis/customAxios'
import { useCanvasStore } from '@/stores'
import { Canvas } from '@/components/canvas'

const route = useRoute()
const canvasStore = useCanvasStore()
const { objects } = storeToRefs(canvasStore)

onMounted(async () => {
  try {
    const key = route.params.id
    const res = await fetch(getResourceUrl(`data/${key}.json`))
    objects.value = await res.json()
  } catch (e) {
    console.error(e)
  }
})
</script>

<template>
  <div class="w-full h-dvh bg-indigo-100 flex flex-col">
    <!-- 제목 영역 (고정 높이) -->
    <header class="py-12 text-center">
      <h1 class="text-2xl font-bold">제목</h1>
    </header>

    <!-- Canvas 영역 (제목 제외하고 꽉 채움) -->
    <main class="flex-1 flex justify-center items-center">
      <div class="w-5/6 h-5/6">
        <Canvas />
      </div>
    </main>
  </div>
</template>
