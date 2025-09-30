<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCanvasStore, useTangramStore } from '@/stores'
import { Canvas } from '@/components/canvas'
import { createObject } from '@/utils'
import type { Tangram } from '@/types'

const route = useRoute()
const canvasStore = useCanvasStore()
const { objects } = storeToRefs(canvasStore)

const tangramStore = useTangramStore()
const { items } = storeToRefs(tangramStore)
const item = ref<Tangram | null>(null)

onMounted(async () => {
  try {
    item.value = items.value.find((item) => item?.key === route.params.id) ?? null
    if (item.value) {
      const key = item.value.key
      const res = await fetch(`https://cdn.playtangram.com/data/${key}.json`)
      const data = await res.json()
      const arr = []
      for (const obj of data) {
        const item = createObject(obj.type, { ...obj })
        arr.push(item)
      }
      objects.value = arr
    }
  } catch (e) {
    console.error(e)
  }
})
</script>

<template>
  <div class="w-full h-[calc(100dvh-3.5rem)] bg-indigo-100 flex flex-col">
    <!-- Canvas 영역 (제목 제외하고 꽉 채움) -->
    <main class="flex-1 flex justify-center py-4">
      <div class="w-5/6 h-5/6">
        <Canvas />
      </div>
    </main>
  </div>
</template>
